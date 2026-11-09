// Shared helpers used by all pages. Load AFTER config.js.

function qs() {
  return new URLSearchParams(window.location.search);
}

function getVal(id) {
  const node = document.getElementById(id);
  return node ? node.value.trim() : "";
}

function getCode(id) {
  return getVal(id).toUpperCase();
}

function goTo(page, params) {
  window.location.href = page + "?" + new URLSearchParams(params).toString();
}

// Build DOM nodes safely (text is never parsed as HTML, so query-string input can't inject markup)
function el(tag, props, ...children) {
  const node = document.createElement(tag);
  Object.assign(node, props || {});
  node.append(...children);
  return node;
}

function makeTable(className, caption, rows) {
  const table = el("table", { className });
  table.append(el("caption", {}, caption));
  for (const [label, value] of rows) {
    table.append(el("tr", {}, el("th", {}, label), el("td", {}, String(value))));
  }
  return table;
}

function showMessage(container, text, isError) {
  container.replaceChildren(el("p", { className: isError ? "error-message" : "info-message", role: "status" }, text));
}

async function apiGet(path, params) {
  const url = new URL(API_BASE + path);
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== null && v !== undefined && v !== "") url.searchParams.set(k, v);
  }
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new Error("Cannot reach the server. Please make sure the backend is running.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed (" + res.status + ")");
  return data;
}

// Stop users picking past dates
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  document.querySelectorAll('input[type="date"]').forEach((d) => (d.min = today));
});

const formatDate = (iso) => iso.split("-").reverse().join("/"); // 2026-08-14 -> 14/08/2026
const rupees = (n) => "₹" + n.toLocaleString("en-IN");

// Used by both Seat Availability and Indian Railway Enquiry result pages
async function loadAvailability(containerId, tableClass = "seat-table") {
  const box = document.getElementById(containerId);
  const p = qs();
  showMessage(box, "Loading availability…");
  try {
    const data = await apiGet("/api/availability", {
      train: p.get("train"), from: p.get("from"), to: p.get("to"),
      date: p.get("date"), class: p.get("class"), quota: p.get("quota"),
    });
    const children = [
      el("p", {}, `${data.trainName} (${data.trainNumber}) · ${data.from.name} (${data.from.code}) → ` +
        `${data.to.name} (${data.to.code}) · ${formatDate(data.date)} · ${data.quota} quota`),
    ];
    for (const r of data.results) {
      children.push(makeTable(tableClass, `${r.classLabel} — ${r.status}`, [
        ["Available Seats : ", r.availableSeats],
        ["Waiting List Number : ", r.waitingList ?? "NA"],
        ["RAC Status : ", r.rac !== null ? "RAC " + r.rac : "NA"],
        ["Coach Type : ", r.coachType],
        ["Last Updated : ", new Date(r.lastUpdated).toLocaleString("en-IN")],
      ]));
    }
    box.replaceChildren(...children);
  } catch (e) {
    showMessage(box, e.message, true);
  }
}
