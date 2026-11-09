const router = require("express").Router();
const v = require("../lib/validate");
const { ApiError } = require("../lib/errors");
const { QUOTAS } = require("../lib/classes");
const { findTrain, findRoute, runsOn, runningDays, stationInfo, pickClasses } = require("../lib/trainUtils");
const { computeFare } = require("../lib/fare");

// GET /api/fare?train=12951&from=NDLS&to=MMCT&date=2026-12-01&class=3ac&quota=general&passengerType=adult
router.get("/fare", (req, res) => {
  const trainNo = v.trainNumber(req.query.train);
  const from = v.station(req.query.from, "Source");
  const to = v.station(req.query.to, "Destination");
  const date = v.journeyDate(req.query.date);
  const cls = v.travelClass(req.query.class);
  const quota = v.quota(req.query.quota);
  const passengerType = v.passengerType(req.query.passengerType);

  const train = findTrain(trainNo);
  if (!train) throw new ApiError(404, `Train ${trainNo} was not found in the sample dataset`);
  const route = findRoute(train, from, to);
  if (!route) throw new ApiError(400, `Train ${trainNo} does not run from ${from} to ${to}`);
  if (!runsOn(train, date, route.fromStop)) {
    throw new ApiError(400, `Train ${trainNo} does not run on ${date}. Running days: ${runningDays(train)}`);
  }

  const fares = pickClasses(train, cls).map((c) => computeFare(train, c, route.distanceKm, quota, passengerType));

  res.json({
    trainNumber: train.number,
    trainName: train.name,
    from: stationInfo(from),
    to: stationInfo(to),
    date,
    distanceKm: route.distanceKm,
    quota: QUOTAS[quota].label,
    passengerType,
    fares,
  });
});

module.exports = router;
