const { CLASSES } = require("./classes");

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Simulated fare rules (not the real IRCTC fare table)
function computeFare(train, cls, distanceKm, quota, passengerType) {
  const c = CLASSES[cls];
  let baseFare = Math.round(distanceKm * c.rate * train.rateMultiplier);
  if (passengerType === "child") baseFare = Math.round(baseFare / 2);

  const reservationCharge = c.reservation;
  const superfastCharge = train.superfast ? c.superfast : 0;

  let tatkalCharge = 0;
  if (quota === "tatkal") tatkalCharge = clamp(baseFare * 0.3, c.tatkal[0], c.tatkal[1]);
  if (quota === "prem-tatkal") tatkalCharge = clamp(baseFare * 0.5, c.tatkal[0] * 1.5, c.tatkal[1] * 2);
  tatkalCharge = Math.round(tatkalCharge);

  const gst = Math.round((baseFare + reservationCharge + superfastCharge + tatkalCharge) * c.gst);
  const totalFare = baseFare + reservationCharge + superfastCharge + tatkalCharge + gst;

  return { class: cls, classLabel: c.label, baseFare, reservationCharge, superfastCharge, tatkalCharge, gst, totalFare };
}

module.exports = { computeFare };
