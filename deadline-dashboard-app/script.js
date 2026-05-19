const STORAGE_KEY = "deadline-hub-items-v1";
const DELETED_KEY = "deadline-hub-deleted-items-v1";
const BIR_TAX_REMINDER_URL = "https://www.bir.gov.ph/tax-reminder";

const seedItems = [];

let calendarEvents = [];

let items = loadItems();
let deletedIds = loadDeletedIds();
let activeCalendarMonth = "All";
let currentPage = 1;
let pendingRemoveId = "";

const rows = document.querySelector("#deadlineRows");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const monthFilter = document.querySelector("#monthFilter");
const clearFilters = document.querySelector("#clearFilters");
const pageSize = document.querySelector("#pageSize");
const editor = document.querySelector("#editor");
const confirmDialog = document.querySelector("#confirmDialog");
const confirmMessage = document.querySelector("#confirmMessage");
const confirmRemove = document.querySelector("#confirmRemove");
const calendarRows = document.querySelector("#calendarRows");
const calendarMonthTabs = document.querySelector("#calendarMonthTabs");
const pageInfo = document.querySelector("#pageInfo");
const prevPage = document.querySelector("#prevPage");
const nextPage = document.querySelector("#nextPage");

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
        source: primarySourceUrl(event),
        details: event.details,
        tags: ["Calendar", "BIR", "Official priority", monthLabel(monthKey(event.start))],
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
      source: sourceLabel(row.source, `Tax Reminder - ${dateLabel(row.date)}`),
      details: row.details,
      url: BIR_TAX_REMINDER_URL,
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

function isTaxReminder(value) {
  return String(value || "").includes("Tax Reminder");
}

function primarySourceUrl(entry) {
  return isTaxReminder(entry?.title) ? BIR_TAX_REMINDER_URL : entry?.url || entry?.source || "#";
}

function sourceLabel(source, title) {
  if (isTaxReminder(title)) return "BIR official priority";
  return source || "Source";
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

function isIncomingDate(value) {
  return daysLeft(value) >= 0;
}

function filteredItems() {
  const q = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const month = monthFilter.value;
  return items
    .filter((item) => isIncomingDate(item.due))
    .filter((item) => status === "All" || item.status === status)
    .filter((item) => month === "All" || item.due.startsWith(month))
    .filter((item) => {
      const haystack = `${item.title} ${item.owner} ${item.details} ${item.tags.join(" ")}`.toLowerCase();
      return !q || haystack.includes(q);
    })
    .sort((a, b) => a.due.localeCompare(b.due));
}

function renderStats(currentItems) {
  const incomingItems = currentItems.filter((item) => isIncomingDate(item.due));
  const week = incomingItems.filter((item) => {
    const left = daysLeft(item.due);
    return left >= 0 && left <= 7 && item.status !== "Done";
  }).length;
  document.querySelector("#totalCount").textContent = incomingItems.length;
  document.querySelector("#weekCount").textContent = week;
  document.querySelector("#approvalCount").textContent = incomingItems.filter((item) => item.status === "Approval").length;
  document.querySelector("#doneCount").textContent = incomingItems.filter((item) => item.status === "Done").length;
}

function render() {
  const current = filteredItems();
  const limit = Number(pageSize.value);
  const totalPages = Math.max(1, Math.ceil(current.length / limit));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * limit;
  renderStats(items);
  rows.innerHTML = current.slice(start, start + limit).map(rowTemplate).join("");
  pageInfo.textContent = `${currentPage} / ${totalPages}`;
  prevPage.disabled = currentPage <= 1;
  nextPage.disabled = currentPage >= totalPages;
  renderCalendar();
}

function rowTemplate(item) {
  const left = daysLeft(item.due);
  const leftText = left < 0 ? `${Math.abs(left)} days late` : left === 0 ? "Today" : `${left} days left`;
  return `
    <tr data-edit="${item.id}" title="Open task details">
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
  const incomingEvents = calendarEvents.filter((event) => isIncomingDate(event.start.slice(0, 10)));
  const months = ["All", ...new Set(incomingEvents.map((event) => monthKey(event.start)))];
  calendarMonthTabs.innerHTML = months
    .map((month) => `<button class="${month === activeCalendarMonth ? "active" : ""}" data-calendar-month="${month}">${month === "All" ? "All" : monthLabel(month)}</button>`)
    .join("");

  if (activeCalendarMonth !== "All" && !months.includes(activeCalendarMonth)) activeCalendarMonth = "All";

  const visible = incomingEvents
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
      <a class="calendar-badge" href="${primarySourceUrl(event)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceLabel(event.source, event.title))}</a>
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
  if (event.target.closest("a, select")) return;
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

  const edit = event.target.closest("tr[data-edit]");
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
  pendingRemoveId = id;
  confirmMessage.textContent = `"${item.title}" will be removed from your tracker. You can add it again later if needed.`;
  confirmDialog.showModal();
}

function confirmRemoveItem() {
  const id = pendingRemoveId;
  const item = items.find((entry) => entry.id === id);
  pendingRemoveId = "";
  if (!item) return;
  items = items.filter((entry) => entry.id !== id);
  if (!deletedIds.includes(id)) deletedIds.push(id);
  saveDeletedIds();
  saveItems();
  render();
}

confirmRemove.addEventListener("click", (event) => {
  event.preventDefault();
  confirmDialog.close();
  confirmRemoveItem();
});

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

[searchInput, statusFilter, monthFilter, pageSize].forEach((input) => {
  input.addEventListener("input", () => {
    currentPage = 1;
    render();
  });
});

clearFilters.addEventListener("click", () => {
  searchInput.value = "";
  statusFilter.value = "All";
  monthFilter.value = "All";
  currentPage = 1;
  render();
});

prevPage.addEventListener("click", () => {
  currentPage = Math.max(1, currentPage - 1);
  render();
});

nextPage.addEventListener("click", () => {
  currentPage += 1;
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

window.DeadlineHub = {
  getItems: () => items,
  updateItem,
  upsertGoogleCalendarEvents,
  render,
};

loadTaxCalendarData().then(render);
