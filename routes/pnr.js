const router = require("express").Router();
const bookings = require("../data/bookings");
const { ApiError } = require("../lib/errors");
const { CLASSES } = require("../lib/classes");
const { findTrain, stationInfo } = require("../lib/trainUtils");

// GET /api/pnr/K9XR2P
router.get("/pnr/:pnr", (req, res) => {
  const pnr = String(req.params.pnr || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{6}$/.test(pnr)) throw new ApiError(400, "PNR must be 6 letters/digits (e.g. K9XR2P)");

  const b = bookings[pnr];
  if (!b) throw new ApiError(404, `No booking found for PNR ${pnr}`);
  const train = findTrain(b.train);

  res.json({
    pnr,
    trainNumber: b.train,
    trainName: train ? train.name : "Unknown train",
    journeyDate: b.date,
    from: stationInfo(b.from),
    to: stationInfo(b.to),
    travelClass: CLASSES[b.travelClass].label,
    chartPrepared: b.chartPrepared,
    passengers: b.passengers,
  });
});

module.exports = router;
