const stations = require("../data/stations");
const rawTrains = require("../data/trains");
const { CLASSES } = require("./classes");
const { ApiError } = require("./errors");

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Convert raw stop arrays to objects with absolute minutes from the start of day 1
const trains = rawTrains.map((t) => ({
  ...t,
  stops: t.stops.map(([code, arrival, departure, distanceKm, day]) => {
    const arrAbs = (day - 1) * 1440 + toMin(arrival ?? departure);
    let depAbs = (day - 1) * 1440 + toMin(departure ?? arrival);
    while (depAbs < arrAbs) depAbs += 1440; // departure after midnight
    return { code, name: stations[code], arrival, departure, distanceKm, arrAbs, depAbs };
  }),
}));

const findTrain = (number) => trains.find((t) => t.number === number);

function findRoute(train, from, to) {
  const i = train.stops.findIndex((s) => s.code === from);
  const j = train.stops.findIndex((s) => s.code === to);
  if (i === -1 || j === -1 || i >= j) return null;
  return {
    fromStop: train.stops[i],
    toStop: train.stops[j],
    distanceKm: train.stops[j].distanceKm - train.stops[i].distanceKm,
    durationMin: train.stops[j].arrAbs - train.stops[i].depAbs,
  };
}

// Does the train run on the day it leaves the boarding station?
function runsOn(train, dateStr, fromStop) {
  const depDay = Math.floor(fromStop.depAbs / 1440); // 0-based day offset from train's start
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - depDay);
  return train.days.includes(DAY_NAMES[d.getUTCDay()]);
}

const runningDays = (train) => (train.days.length === 7 ? "Daily" : train.days.join(", "));

const formatDuration = (min) => `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m`;

const stationInfo = (code) => ({ code, name: stations[code] });

function pickClasses(train, cls) {
  if (cls === "all-classes") return train.classes;
  if (!train.classes.includes(cls)) {
    const have = train.classes.map((c) => CLASSES[c].label).join(", ");
    throw new ApiError(400, `Train ${train.number} has no ${CLASSES[cls].label} coach. Available: ${have}`);
  }
  return [cls];
}

module.exports = { trains, findTrain, findRoute, runsOn, runningDays, formatDuration, stationInfo, pickClasses };
