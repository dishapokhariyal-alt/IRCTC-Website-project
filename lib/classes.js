// Travel classes, quotas and fare rules (simulated values)
const CLASSES = {
  sleeper: { label: "Sleeper (SL)", coach: "S (Sleeper)", capacity: 72, rate: 0.65, reservation: 20, superfast: 30, gst: 0, tatkal: [100, 200] },
  "3ac": { label: "AC 3 Tier (3A)", coach: "B (AC 3 Tier)", capacity: 64, rate: 1.65, reservation: 40, superfast: 45, gst: 0.05, tatkal: [300, 400] },
  "2ac": { label: "AC 2 Tier (2A)", coach: "A (AC 2 Tier)", capacity: 48, rate: 2.4, reservation: 50, superfast: 45, gst: 0.05, tatkal: [400, 500] },
  "1ac": { label: "AC First Class (1A)", coach: "H (AC First Class)", capacity: 24, rate: 4.1, reservation: 60, superfast: 75, gst: 0.05, tatkal: [400, 500] },
};

const QUOTAS = {
  general: { label: "General", scale: 1, wl: "GNWL" },
  ladies: { label: "Ladies", scale: 0.3, wl: "LDWL" },
  "sr-citizen": { label: "Lower Berth/Sr. Citizen", scale: 0.25, wl: "SSWL" },
  "duty-pass": { label: "Duty Pass", scale: 0.1, wl: "WL" },
  tatkal: { label: "Tatkal", scale: 0.35, wl: "TQWL" },
  "prem-tatkal": { label: "Premium Tatkal", scale: 0.2, wl: "PQWL" },
};

module.exports = { CLASSES, QUOTAS };
