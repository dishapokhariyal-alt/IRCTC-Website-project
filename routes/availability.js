const router = require("express").Router();
const v = require("../lib/validate");
const { ApiError } = require("../lib/errors");
const { QUOTAS } = require("../lib/classes");
const { findTrain, findRoute, runsOn, runningDays, stationInfo, pickClasses } = require("../lib/trainUtils");
const { classAvailability } = require("../lib/availability");

// GET /api/availability?train=12951&from=NDLS&to=MMCT&date=2026-12-01&class=3ac&quota=general
router.get("/availability", (req, res) => {
  const trainNo = v.trainNumber(req.query.train);
  const from = v.station(req.query.from, "Source");
  const to = v.station(req.query.to, "Destination");
  const date = v.journeyDate(req.query.date);
  const cls = v.travelClass(req.query.class);
  const quota = v.quota(req.query.quota);

  const train = findTrain(trainNo);
  if (!train) throw new ApiError(404, `Train ${trainNo} was not found in the sample dataset`);
  const route = findRoute(train, from, to);
  if (!route) throw new ApiError(400, `Train ${trainNo} does not run from ${from} to ${to}`);
  if (!runsOn(train, date, route.fromStop)) {
    throw new ApiError(400, `Train ${trainNo} does not run on ${date}. Running days: ${runningDays(train)}`);
  }

  const results = pickClasses(train, cls).map((c) => classAvailability(train, c, from, to, date, quota));

  res.json({
    trainNumber: train.number,
    trainName: train.name,
    from: stationInfo(from),
    to: stationInfo(to),
    date,
    quota: QUOTAS[quota].label,
    results,
  });
});

module.exports = router;
