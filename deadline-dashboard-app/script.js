const STORAGE_KEY = "deadline-hub-items-v1";
const DELETED_KEY = "deadline-hub-deleted-items-v1";

const seedItems = [
  {
    id: crypto.randomUUID(),
    title: "BIR Form 1600-WP",
    owner: "Julius",
    due: "2026-05-20",
    status: "Incomplete",
    source: "https://www.bir.gov.ph/tax-reminder",
    details: "Remittance return for percentage tax on winnings and prizes withheld by race track operators. Period: April 2026.",
    tags: ["BIR", "Payment", "April 2026"],
  },
  {
    id: crypto.randomUUID(),
    title: "VAT / Percentage Tax",
    owner: "Julius",
    due: "2026-05-25",
    status: "Working",
    source: "https://www.bir.gov.ph/tax-reminder",
    details: "BIR Forms 2550Q, 2551Q, 2550-DS and related quarterly submissions. Fiscal quarter ending April 30, 2026.",
    tags: ["BIR", "VAT", "Quarterly"],
  },
  {
    id: crypto.randomUUID(),
    title: "eAFS / 1702Q / ORUS",
    owner: "Julius",
    due: "2026-05-30",
    status: "Approval",
    source: "https://www.bir.gov.ph/tax-reminder",
    details: "AFS attachments, eAFS, inventory schedules, SAWT, 1702Q, and computerized books registration.",
    tags: ["BIR", "AFS", "ORUS"],
  },
  {
    id: crypto.randomUUID(),
    title: "HDMF Contribution",
    owner: "Julius",
    due: "2026-06-11",
    status: "Done",
    source: "https://www.pwc.com/ph/en/client-accounting-services/2026-tax-calendar/2026-june-tax-calendar.html",
    details: "Remittance of HDMF contributions for May 2026 by employers whose names begin with letters A to D.",
    tags: ["HDMF", "Monthly"],
  },
  {
    id: crypto.randomUUID(),
    title: "SEC AFS Filing",
    owner: "Julius",
    due: "2026-06-15",
    status: "Incomplete",
    source: "https://www.pwc.com/ph/en/client-accounting-services/2026-tax-calendar/2026-june-tax-calendar.html",
    details: "Filing with the SEC of AFS and annual report items for relevant year-end schedules.",
    tags: ["SEC", "AFS"],
  },
];

let calendarEvents = [
  ["BIR Tax Reminder - May 19, 2026", "2026-05-19T08:00:00+08:00", "PwC May calendar", "SUBMISSION: CETI application of RBEs to IPAs for YE 30 April 2026. HDMF REMITTANCE: April 2026 contributions for employers E to L.", "https://www.google.com/calendar/event?eid=N3V2a3RsNWNjYTF2bWZsNHRlcjFtZmd2YjgganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - May 20, 2026", "2026-05-20T08:00:00+08:00", "BIR official", "e-FILING & PAYMENT: BIR Form 1600 WP for April 2026.", "https://www.google.com/calendar/event?eid=cXQxODN0NGhhamd2MWY4Ymw5cWt0OGtpajAganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - May 22, 2026", "2026-05-22T08:00:00+08:00", "PwC May calendar", "HDMF REMITTANCE: April 2026 contributions for employers M to Q.", "https://www.google.com/calendar/event?eid=cjViNmxpMzhsZTZuNXU4NzZsM2txbzMyMmcganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - May 25, 2026", "2026-05-25T08:00:00+08:00", "BIR official", "SUBMISSION plus e-FILING & PAYMENT: quarterly VAT, percentage tax, and related April 30, 2026 fiscal quarter requirements.", "https://www.google.com/calendar/event?eid=MThodXY1Z3M3aGZ1Y3U4ZWM1YmRhdW0wcmMganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - May 29, 2026", "2026-05-29T08:00:00+08:00", "PwC May calendar", "SUBMISSION: forex-rate sworn statement. HDMF REMITTANCE: April 2026 contributions for employers R to Z or numeral.", "https://www.google.com/calendar/event?eid=NHAwOGpvY25oMnI1aGhlYW0xOGZvZm1uMWsganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - May 30, 2026", "2026-05-30T08:00:00+08:00", "BIR official", "SUBMISSION, e-SUBMISSION, e-FILING & PAYMENT, and ORUS registration items including AFS, 1702Q, SAWT, inventory schedules, and computerized books.", "https://www.google.com/calendar/event?eid=dWpnNmVhaHA3bXJtZTgxc2ZlMDA1czJ1ZzAganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - June 1, 2026", "2026-06-01T08:00:00+08:00", "PwC June calendar", "SEC filing, e-FILING & PAYMENT, submissions, SSS remittance, books, inventory, and related quarter/year-end requirements.", "https://www.google.com/calendar/event?eid=ZGJrZnF0bnVsN2NhdmF0MTFuanI4cXV1YW8ganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["Happy birthday!", "2026-06-03T00:00:00", "Google Calendar", "All-day calendar event.", "https://www.google.com/calendar/event?eid=cWppbmdjNWJmOXZvajYxbHU2azJncDU4aGNfMjAyNjA2MDMganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - June 5, 2026", "2026-06-05T08:00:00+08:00", "PwC June calendar", "e-FILING & PAYMENT: BIR Form 2000 DST for May 2026.", "https://www.google.com/calendar/event?eid=cWZvMmtudGYzZDNmbW42NDk5ZTVubWd0MDQganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - June 8, 2026", "2026-06-08T08:00:00+08:00", "PwC June calendar", "e-SUBMISSION: sales report using CRM/POS and similar sales machines, TIN ending even number, for May 2026.", "https://www.google.com/calendar/event?eid=OXZpYzluMmc5bHZlbW1kbGRlNjlncXZhODQganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - June 10, 2026", "2026-06-10T08:00:00+08:00", "PwC June calendar", "FILING & PAYMENT, e-FILING & PAYMENT, e-SUBMISSION, and issuance items for May 2026 withholding and sales reports.", "https://www.google.com/calendar/event?eid=Y2UzbGFhYWs0NzI0b3Fvb3BzNGZ2MW42dWcganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - June 11, 2026", "2026-06-11T08:00:00+08:00", "PwC June calendar", "e-FILING: WTC/EWT/FWT Group E. HDMF REMITTANCE: May 2026 contributions for employers A to D.", "https://www.google.com/calendar/event?eid=OGJqNTk2M3MwN2FzOTJjMms0NGhlcG9pMDAganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["BIR Tax Reminder - June 15, 2026", "2026-06-15T08:00:00+08:00", "PwC June calendar", "SEC filing, e-FILING, e-PAYMENT, e-FILING & PAYMENT, submissions, PHIC, and HDMF items.", "https://www.google.com/calendar/event?eid=M3FjY2xsb3Y2ZGc3M3NwOWRvcmtyNjM1cGMganVsaXVzYWxhczEwQG0&ctz=Asia/Manila"],
  ["My Love birthday day", "2026-07-09T00:00:00", "Google Calendar", "All-day calendar event.", "https://www.google.com/calendar/event?eid=YzhxNmNwYjQ2c3AzZ2JiNTcwczNhYjlrNjBzbTZiOXA2c3E2YWI5ZzZwaWplZHBpYzVobWFvcGo2b18yMDI2MDcwOSBqdWxpdXNhbGFzMTBAbQ&ctz=Asia/Manila"],
  ["Scout months", "2026-10-01T00:00:00", "Google Calendar", "All-day calendar event.", "https://www.google.com/calendar/event?eid=YzloM2FvaGpjaGk2NmI5aDY4c2oyYjlrNnBnajJiOXA2Z3AzMGJiNmM1aDY0b3BpYzhvajRkaGc2a18yMDI2MTAwMSBqdWxpdXNhbGFzMTBAbQ&ctz=Asia/Manila"],
].map(([title, start, source, details, url]) => ({ title, start, source, details, url }));

let items = loadItems();
let deletedIds = loadDeletedIds();
let activeCalendarMonth = "All";

const rows = document.querySelector("#deadlineRows");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const monthFilter = document.querySelector("#monthFilter");
const clearFilters = document.querySelector("#clearFilters");
const pageSize = document.querySelector("#pageSize");
const editor = document.querySelector("#editor");
const calendarRows = document.querySelector("#calendarRows");
const calendarMonthTabs = document.querySelector("#calendarMonthTabs");

function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedItems;
  try {
    return JSON.parse(raw);
  } catch {
    return seedItems;
  }
}

function loadDeletedIds() {
  const raw = localStorage.getItem(DELETED_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function mergeCalendarDeadlines(existingItems) {
  const replacedSeedTitles = new Set(["BIR Form 1600-WP", "VAT / Percentage Tax", "eAFS / 1702Q / ORUS", "HDMF Contribution", "SEC AFS Filing"]);
  const deleted = new Set(deletedIds);
  const retainedItems = existingItems.filter((item) => !deleted.has(item.id) && !String(item.id).startsWith("calendar-") && !replacedSeedTitles.has(item.title));
  const imported = calendarEvents
    .filter((event) => event.title.includes("Tax Reminder"))
    .map((event) => {
      const due = event.start.slice(0, 10);
      return {
        id: `calendar-${due}-${event.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
        title: event.title,
        owner: "Julius",
        due,
        status: "Incomplete",
        source: event.url,
        details: event.details,
        tags: ["Calendar", "BIR", monthLabel(monthKey(event.start))],
      };
    })
    .filter((item) => !deleted.has(item.id));

  const byId = new Map(retainedItems.map((item) => [item.id, item]));
  imported.forEach((item) => {
    if (!byId.has(item.id)) byId.set(item.id, item);
  });
  return [...byId.values()].sort((a, b) => a.due.localeCompare(b.due));
}

async function loadTaxCalendarData() {
  try {
    let taxRows = window.TAX_CALENDAR_DATA;
    if (!Array.isArray(taxRows)) {
      const response = await fetch("./tax-calendar-data.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Tax calendar data unavailable");
      taxRows = await response.json();
    }
    const personalEvents = calendarEvents.filter((event) => !event.title.includes("Tax Reminder"));
    const importedEvents = taxRows.map((row) => ({
      title: `Tax Reminder - ${dateLabel(row.date)}`,
      start: `${row.date}T08:00:00+08:00`,
      source: row.source,
      details: row.details,
      url: row.url,
    }));
    calendarEvents = [...importedEvents, ...personalEvents].sort((a, b) => new Date(a.start) - new Date(b.start));
    items = mergeCalendarDeadlines(items);
    saveItems();
  } catch {
    items = mergeCalendarDeadlines(items);
    saveItems();
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function saveDeletedIds() {
  localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIds));
}

function dateLabel(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function eventDateLabel(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function eventTimeLabel(value) {
  const date = new Date(value);
  if (date.getHours() === 0 && date.getMinutes() === 0) return "All day";
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);
}

function monthKey(value) {
  return value.slice(0, 7);
}

function monthLabel(value) {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(`${value}-01T00:00:00`));
}

function prepareLabel(value) {
  const due = new Date(`${value}T00:00:00`);
  due.setDate(due.getDate() - 7);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(due);
}

function daysLeft(value) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(`${value}T00:00:00`);
  return Math.ceil((due - today) / 86400000);
}

function filteredItems() {
  const q = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const month = monthFilter.value;
  return items
    .filter((item) => status === "All" || item.status === status)
    .filter((item) => month === "All" || item.due.startsWith(month))
    .filter((item) => {
      const haystack = `${item.title} ${item.owner} ${item.details} ${item.tags.join(" ")}`.toLowerCase();
      return !q || haystack.includes(q);
    })
    .sort((a, b) => a.due.localeCompare(b.due));
}

function renderStats(currentItems) {
  const week = currentItems.filter((item) => {
    const left = daysLeft(item.due);
    return left >= 0 && left <= 7 && item.status !== "Done";
  }).length;
  document.querySelector("#totalCount").textContent = currentItems.length;
  document.querySelector("#weekCount").textContent = week;
  document.querySelector("#approvalCount").textContent = currentItems.filter((item) => item.status === "Approval").length;
  document.querySelector("#doneCount").textContent = currentItems.filter((item) => item.status === "Done").length;
}

function render() {
  const current = filteredItems();
  const limit = Number(pageSize.value);
  renderStats(items);
  rows.innerHTML = current.slice(0, limit).map(rowTemplate).join("");
  renderCalendar();
}

function rowTemplate(item) {
  const left = daysLeft(item.due);
  const leftText = left < 0 ? `${Math.abs(left)} days late` : left === 0 ? "Today" : `${left} days left`;
  return `
    <tr>
      <td>
        <div class="deadline-name">
          <span class="row-icon">D</span>
          <span>
            ${escapeHtml(item.title)}
            <span class="subtext">${dateLabel(item.due)} - ${escapeHtml(item.details)}</span>
          </span>
        </div>
      </td>
      <td>${escapeHtml(item.owner)}</td>
      <td><span class="prepare-pill">W ${prepareLabel(item.due)}</span></td>
      <td>
        <select class="status-select status-${item.status}" data-id="${item.id}">
          ${["Done", "Working", "Incomplete", "Approval"].map((status) => `<option ${status === item.status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </td>
      <td><a class="source-link" href="${item.source}" target="_blank" rel="noopener noreferrer">Open</a></td>
      <td><div class="tag-list">${item.tags.slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}<span class="tag">${leftText}</span></div></td>
      <td>
        <div class="row-actions">
          <button class="action-button" data-menu="${item.id}" aria-label="Actions for ${escapeHtml(item.title)}"><span class="dot-fallback">...</span></button>
          <div class="action-menu" data-menu-panel="${item.id}">
            <button class="danger" data-remove="${item.id}">x Remove</button>
          </div>
        </div>
      </td>
    </tr>
  `;
}

function renderCalendar() {
  const months = ["All", ...new Set(calendarEvents.map((event) => monthKey(event.start)))];
  calendarMonthTabs.innerHTML = months
    .map((month) => `<button class="${month === activeCalendarMonth ? "active" : ""}" data-calendar-month="${month}">${month === "All" ? "All" : monthLabel(month)}</button>`)
    .join("");

  const visible = calendarEvents
    .filter((event) => activeCalendarMonth === "All" || monthKey(event.start) === activeCalendarMonth)
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  document.querySelector("#calendarCount").textContent = visible.length;
  calendarRows.innerHTML = visible.map(calendarTemplate).join("");
}

function calendarTemplate(event) {
  return `
    <article class="calendar-event">
      <div class="calendar-date">
        ${eventDateLabel(event.start)}
        <span>${eventTimeLabel(event.start)}</span>
      </div>
      <div class="calendar-main">
        <h3>${escapeHtml(event.title)}</h3>
        <p>${escapeHtml(event.details)}</p>
      </div>
      <a class="calendar-badge" href="${event.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(event.source)}</a>
    </article>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

rows.addEventListener("change", (event) => {
  const select = event.target.closest(".status-select");
  if (!select) return;
  const item = items.find((entry) => entry.id === select.dataset.id);
  item.status = select.value;
  saveItems();
  render();
});

rows.addEventListener("click", (event) => {
  const menu = event.target.closest("[data-menu]");
  if (menu) {
    const id = menu.dataset.menu;
    document.querySelectorAll(".action-menu.open").forEach((panel) => panel.classList.toggle("open", panel.dataset.menuPanel === id && !panel.classList.contains("open")));
    const panel = document.querySelector(`[data-menu-panel="${safeSelector(id)}"]`);
    panel?.classList.toggle("open");
    return;
  }

  const remove = event.target.closest("[data-remove]");
  if (remove) {
    removeItem(remove.dataset.remove);
    return;
  }

  const edit = event.target.closest("[data-edit]");
  if (!edit) return;
  openEditor(edit.dataset.edit);
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".row-actions")) return;
  document.querySelectorAll(".action-menu.open").forEach((panel) => panel.classList.remove("open"));
});

function openEditor(id) {
  const item = items.find((entry) => entry.id === id);
  document.querySelector("#editId").value = item.id;
  document.querySelector("#editTitle").value = item.title;
  document.querySelector("#editDate").value = item.due;
  document.querySelector("#editStatus").value = item.status;
  document.querySelector("#editDetails").value = item.details;
  editor.showModal();
}

function safeSelector(value) {
  if (window.CSS?.escape) return CSS.escape(value);
  return String(value).replaceAll('"', '\\"');
}

function removeItem(id) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  const ok = confirm(`Remove "${item.title}" from the tracker?`);
  if (!ok) return;
  items = items.filter((entry) => entry.id !== id);
  if (!deletedIds.includes(id)) deletedIds.push(id);
  saveDeletedIds();
  saveItems();
  render();
}

function updateItem(id, changes) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return null;
  Object.assign(item, changes);
  saveItems();
  render();
  return item;
}

function upsertGoogleCalendarEvents(events) {
  const existing = new Map(items.map((item) => [item.id, item]));
  events.forEach((event) => {
    const id = `gcal-${event.id}`;
    const start = event.start?.dateTime || event.start?.date;
    if (!start) return;
    const due = start.slice(0, 10);
    const current = existing.get(id);
    const next = {
      id,
      title: event.summary || "Google Calendar event",
      owner: "Google Calendar",
      due,
      status: current?.status || "Incomplete",
      source: event.htmlLink || "https://calendar.google.com/calendar/u/0/r",
      details: event.description || event.location || "Imported from Google Calendar.",
      tags: ["Google Calendar", monthLabel(monthKey(due))],
      googleCalendarEventId: event.id,
    };
    existing.set(id, current ? { ...current, ...next } : next);
  });
  items = [...existing.values()].sort((a, b) => a.due.localeCompare(b.due));
  saveItems();
  render();
}

document.querySelector("#saveEdit").addEventListener("click", (event) => {
  event.preventDefault();
  const id = document.querySelector("#editId").value;
  const item = items.find((entry) => entry.id === id);
  const wasNew = !item.googleCalendarEventId && item.tags.includes("New");
  item.title = document.querySelector("#editTitle").value;
  item.due = document.querySelector("#editDate").value;
  item.status = document.querySelector("#editStatus").value;
  item.details = document.querySelector("#editDetails").value;
  saveItems();
  editor.close();
  render();
  document.dispatchEvent(new CustomEvent("deadlinehub:item-saved", { detail: { item, wasNew } }));
});

document.querySelector("#addNew").addEventListener("click", () => {
  const item = {
    id: crypto.randomUUID(),
    title: "New deadline",
    owner: "Julius",
    due: new Date().toISOString().slice(0, 10),
    status: "Incomplete",
    source: "https://www.bir.gov.ph/tax-reminder",
    details: "Add details here.",
    tags: ["New"],
  };
  items.unshift(item);
  saveItems();
  render();
  openEditor(item.id);
});

[searchInput, statusFilter, monthFilter, pageSize].forEach((input) => input.addEventListener("input", render));

clearFilters.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "All";
  monthFilter.value = "All";
  render();
});

calendarMonthTabs.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-calendar-month]");
  if (!tab) return;
  activeCalendarMonth = tab.dataset.calendarMonth;
  render();
});

document.querySelectorAll("[data-panel-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-panel-tab]").forEach((tab) => tab.classList.toggle("active", tab === button));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.toggle("active", panel.id === `${button.dataset.panelTab}Panel`));
    document.querySelector(".filters").classList.toggle("hidden", button.dataset.panelTab === "calendar");
    document.querySelector(".pager").classList.toggle("hidden", button.dataset.panelTab === "calendar");
  });
});

document.querySelectorAll(".nav-button[data-icon]").forEach((button) => {
  const labels = {
    "circle-help": "?",
    users: "U",
    "clipboard-list": "R",
    braces: "{}",
    bell: "!",
    settings: "*",
  };
  button.textContent = labels[button.dataset.icon] || "D";
});

window.DeadlineHub = {
  getItems: () => items,
  updateItem,
  upsertGoogleCalendarEvents,
  render,
};

loadTaxCalendarData().then(render);
