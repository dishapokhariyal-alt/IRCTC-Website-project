const { CLASSES, QUOTAS } = require("./classes");

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simulated inventory: the same query always gives the same numbers.
function classAvailability(train, cls, from, to, date, quotaKey) {
  const info = CLASSES[cls];
  const q = QUOTAS[quotaKey];
  const rng = mulberry32(hash([train.number, cls, from, to, date, quotaKey].join("|")));
  const roll = rng();
  const max = Math.max(2, Math.round(info.capacity * q.scale));

  const out = {
    class: cls, classLabel: info.label, coachType: info.coach,
    availableSeats: 0, waitingList: null, rac: null, status: "",
    lastUpdated: new Date().toISOString(),
  };

  if (roll < 0.55) {
    out.availableSeats = 1 + Math.floor(rng() * max);
    out.status = `AVAILABLE-${String(out.availableSeats).padStart(4, "0")}`;
  } else if (roll < 0.75 && train.type !== "Rajdhani") {
    out.rac = 1 + Math.floor(rng() * Math.min(20, max));
    out.status = `RAC ${out.rac}`;
  } else {
    out.waitingList = 1 + Math.floor(rng() * 40);
    out.status = `${q.wl} ${out.waitingList}`;
  }
  return out;
}

module.exports = { classAvailability };
