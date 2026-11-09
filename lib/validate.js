const stations = require("../data/stations");
const { CLASSES, QUOTAS } = require("./classes");
const { ApiError } = require("./errors");

const MAX_DAYS_AHEAD = 60;

function todayIST() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function station(value, label) {
  const code = String(value || "").trim().toUpperCase();
  if (!code) throw new ApiError(400, `${label} station is required`);
  if (!stations[code]) throw new ApiError(404, `Station code "${code}" was not found in the sample dataset`);
  return code;
}

function trainNumber(value) {
  const n = String(value || "").trim();
  if (!/^\d{5}$/.test(n)) throw new ApiError(400, "Train number must be 5 digits (e.g. 12951)");
  return n;
}

function journeyDate(value) {
  const s = String(value || "").trim();
  if (!s) throw new ApiError(400, "Journey date is required");
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z")) &&
    new Date(s + "T00:00:00Z").toISOString().slice(0, 10) === s;
  if (!valid) throw new ApiError(400, "Journey date must be a valid date (YYYY-MM-DD)");
  const today = todayIST();
  if (s < today) throw new ApiError(400, "Journey date cannot be in the past");
  if (s > addDays(today, MAX_DAYS_AHEAD)) throw new ApiError(400, `Journey date must be within ${MAX_DAYS_AHEAD} days from today`);
  return s;
}

function travelClass(value) {
  const c = String(value || "all-classes").trim().toLowerCase();
  if (c !== "all-classes" && !CLASSES[c]) throw new ApiError(400, `Unknown class "${c}"`);
  return c;
}

function quota(value) {
  const q = String(value || "general").trim().toLowerCase();
  if (!QUOTAS[q]) throw new ApiError(400, `Unknown quota "${q}"`);
  return q;
}

function passengerType(value) {
  const t = String(value || "adult").trim().toLowerCase();
  if (t !== "adult" && t !== "child") throw new ApiError(400, 'Passenger type must be "adult" or "child"');
  return t;
}

module.exports = { station, trainNumber, journeyDate, travelClass, quota, passengerType };
