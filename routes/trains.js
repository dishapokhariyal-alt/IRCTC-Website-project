const router = require("express").Router();
const v = require("../lib/validate");
const { ApiError } = require("../lib/errors");
const stations = require("../data/stations");
const {
  trains, findTrain, findRoute, runsOn, runningDays, formatDuration, stationInfo,
} = require("../lib/trainUtils");

// GET /api/stations  (handy for autocomplete later)
router.get("/stations", (req, res) => {
  res.json(Object.entries(stations).map(([code, name]) => ({ code, name })));
});

// GET /api/trains/between?from=NDLS&to=BPL&date=2026-12-01&class=all-classes&quota=general
// (must be declared before /trains/:trainNo/...)
router.get("/trains/between", (req, res) => {
  const from = v.station(req.query.from, "Source");
  const to = v.station(req.query.to, "Destination");
  if (from === to) throw new ApiError(400, "Source and destination stations must be different");
  const date = v.journeyDate(req.query.date);
  const cls = v.travelClass(req.query.class);
  v.quota(req.query.quota); // validated only; quota does not change the train list

  const found = [];
  for (const train of trains) {
    const route = findRoute(train, from, to);
    if (!route || !runsOn(train, date, route.fromStop)) continue;
    if (cls !== "all-classes" && !train.classes.includes(cls)) continue;
    found.push({
      trainNumber: train.number,
      name: train.name,
      departure: route.fromStop.departure,
      arrival: route.toStop.arrival,
      arrivalDayOffset: Math.floor(route.toStop.arrAbs / 1440) - Math.floor(route.fromStop.depAbs / 1440),
      duration: formatDuration(route.durationMin),
      runningDays: runningDays(train),
      distanceKm: route.distanceKm,
    });
  }
  found.sort((a, b) => a.departure.localeCompare(b.departure));

  res.json({ from: stationInfo(from), to: stationInfo(to), date, trains: found });
});

// GET /api/trains/12951/schedule
router.get("/trains/:trainNo/schedule", (req, res) => {
  const trainNo = v.trainNumber(req.params.trainNo);
  const train = findTrain(trainNo);
  if (!train) throw new ApiError(404, `Train ${trainNo} was not found in the sample dataset`);

  const first = train.stops[0];
  const last = train.stops[train.stops.length - 1];
  const totalMin = last.arrAbs - first.depAbs;
  const totalKm = last.distanceKm - first.distanceKm;

  res.json({
    trainNumber: train.number,
    name: train.name,
    source: stationInfo(first.code),
    destination: stationInfo(last.code),
    runningDays: runningDays(train),
    totalDistanceKm: totalKm,
    totalTravelTime: formatDuration(totalMin),
    averageSpeedKmph: Math.round((totalKm / (totalMin / 60)) * 10) / 10,
    stops: train.stops.map((s) => ({
      code: s.code,
      name: s.name,
      arrival: s.arrival,
      departure: s.departure,
      haltMinutes: s.depAbs - s.arrAbs,
      distanceKm: s.distanceKm,
      day: Math.floor(s.arrAbs / 1440) + 1,
    })),
  });
});

module.exports = router;
