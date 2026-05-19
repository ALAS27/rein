const statusEl = document.querySelector("#syncStatus");
const connectButton = document.querySelector("#connectGoogle");
const syncButton = document.querySelector("#syncCalendar");
const autoSyncInput = document.querySelector("#autoSync");

let accessToken = "";
let autoSyncTimer = null;
let firebaseRuntime = null;

function setStatus(message) {
  if (statusEl) statusEl.textContent = message;
  const note = statusEl?.closest(".sync-note");
  if (!note) return;
  const shouldCompact = /^(Synced|Added task|Connected after|Connected:)/.test(message);
  note.classList.toggle("is-compact", shouldCompact);
}

function hasFirebaseConfig() {
  return Boolean(window.FIREBASE_CONFIG?.apiKey && window.FIREBASE_CONFIG?.authDomain && window.FIREBASE_CONFIG?.projectId);
}

async function loadFirebase() {
  if (firebaseRuntime) return firebaseRuntime;
  const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  const authModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
  const app = appModule.getApps().length ? appModule.getApp() : appModule.initializeApp(window.FIREBASE_CONFIG);
  const auth = authModule.getAuth(app);
  const provider = new authModule.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/calendar.events");
  firebaseRuntime = {
    auth,
    provider,
    signInWithPopup: authModule.signInWithPopup,
    signInWithRedirect: authModule.signInWithRedirect,
    getRedirectResult: authModule.getRedirectResult,
    GoogleAuthProvider: authModule.GoogleAuthProvider,
  };
  return firebaseRuntime;
}

async function finishGoogleConnection(result, source = "Connected") {
  if (!result?.user) return false;
  const { GoogleAuthProvider } = await loadFirebase();
  const credential = GoogleAuthProvider.credentialFromResult(result);
  accessToken = credential?.accessToken || "";
  setStatus(accessToken ? `${source}: ${result.user.email}` : `${source}, but Calendar token was not returned.`);
  if (accessToken) await syncCalendarFromGoogle();
  return true;
}

function isPopupBlocked(error) {
  return error?.code === "auth/popup-blocked" || error?.code === "auth/cancelled-popup-request";
}

async function connectGoogle() {
  if (!hasFirebaseConfig()) {
    setStatus("Firebase config missing. Add your project values to firebase-config.js.");
    return;
  }
  try {
    setStatus("Opening Google sign-in...");
    const { auth, provider, signInWithPopup, signInWithRedirect } = await loadFirebase();
    const result = await signInWithPopup(auth, provider);
    await finishGoogleConnection(result);
  } catch (error) {
    if (isPopupBlocked(error)) {
      try {
        setStatus("Popup was blocked. Redirecting to Google sign-in...");
        const { auth, provider, signInWithRedirect } = await loadFirebase();
        await signInWithRedirect(auth, provider);
        return;
      } catch (redirectError) {
        setStatus(`Google redirect failed: ${redirectError.message}`);
        return;
      }
    }
    setStatus(`Google connect failed: ${error.message}`);
  }
}

async function checkRedirectSignIn() {
  if (!hasFirebaseConfig()) return;
  try {
    const { auth, getRedirectResult } = await loadFirebase();
    const result = await getRedirectResult(auth);
    if (result) await finishGoogleConnection(result, "Connected after Google sign-in");
  } catch (error) {
    setStatus(`Google sign-in return failed: ${error.message}`);
  }
}

async function googleFetch(path, options = {}) {
  if (!accessToken) throw new Error("Connect Google first.");
  const response = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(await response.text());
  return response.status === 204 ? null : response.json();
}

async function syncCalendarFromGoogle() {
  try {
    setStatus("Syncing Google Calendar...");
    const data = await googleFetch(
      "/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=2026-05-01T00:00:00%2B08:00&timeMax=2026-12-31T23:59:59%2B08:00&maxResults=250"
    );
    window.DeadlineHub?.upsertGoogleCalendarEvents(data.items || []);
    setStatus(`Synced ${data.items?.length || 0} Google Calendar events.`);
  } catch (error) {
    setStatus(`Calendar sync failed: ${error.message}`);
  }
}

async function createGoogleCalendarEvent(item) {
  if (item.googleCalendarEventId) return;
  if (!accessToken) {
    setStatus("Task saved in dashboard. Connect Google to add it to Calendar.");
    return;
  }
  try {
    setStatus(`Adding "${item.title}" to Google Calendar...`);
    const event = await googleFetch("/calendars/primary/events", {
      method: "POST",
      body: JSON.stringify({
        summary: item.title,
        description: item.details,
        start: { dateTime: `${item.due}T08:00:00+08:00`, timeZone: "Asia/Manila" },
        end: { dateTime: `${item.due}T08:30:00+08:00`, timeZone: "Asia/Manila" },
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 10080 }],
        },
      }),
    });
    window.DeadlineHub?.updateItem(item.id, {
      googleCalendarEventId: event.id,
      source: event.htmlLink || item.source,
      tags: [...new Set([...(item.tags || []), "Google Calendar"])],
    });
    setStatus("Added task to Google Calendar.");
  } catch (error) {
    setStatus(`Calendar create failed: ${error.message}`);
  }
}

connectButton?.addEventListener("click", connectGoogle);
syncButton?.addEventListener("click", syncCalendarFromGoogle);
autoSyncInput?.addEventListener("change", () => {
  clearInterval(autoSyncTimer);
  autoSyncTimer = null;
  if (autoSyncInput.checked) {
    syncCalendarFromGoogle();
    autoSyncTimer = setInterval(syncCalendarFromGoogle, 5 * 60 * 1000);
    setStatus("Auto sync is on while this page is open.");
  } else {
    setStatus("Auto sync is off.");
  }
});

document.addEventListener("deadlinehub:item-saved", (event) => {
  if (event.detail?.wasNew) createGoogleCalendarEvent(event.detail.item);
});

setStatus(hasFirebaseConfig() ? "Firebase ready. Connect Google to sync Calendar." : "Firebase config missing. Add your project values to firebase-config.js.");
checkRedirectSignIn();
