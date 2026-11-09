// Sample (simulated) PNR records. Try: K9XR2P, M4TQ7A, Z8LW3C, P2NH6D
module.exports = {
  K9XR2P: {
    train: "12952", date: "2026-08-14", from: "NDLS", to: "MMCT", travelClass: "3ac", chartPrepared: true,
    passengers: [
      { name: "Ramesh Kumar", coach: "B5", berth: "36", bookingStatus: "Confirmed", currentStatus: "Reaching Kota Jn" },
    ],
  },
  M4TQ7A: {
    train: "12951", date: "2026-12-01", from: "NDLS", to: "ST", travelClass: "3ac", chartPrepared: false,
    passengers: [
      { name: "Anita Sharma", coach: "B2", berth: "14", bookingStatus: "Confirmed", currentStatus: "Confirmed" },
      { name: "Rohit Sharma", coach: "B2", berth: "15", bookingStatus: "Confirmed", currentStatus: "Confirmed" },
    ],
  },
  Z8LW3C: {
    train: "12615", date: "2026-12-10", from: "NDLS", to: "BZA", travelClass: "sleeper", chartPrepared: false,
    passengers: [
      { name: "Suresh Rao", coach: "-", berth: "-", bookingStatus: "WL 5", currentStatus: "WL 3" },
    ],
  },
  P2NH6D: {
    train: "12002", date: "2026-11-20", from: "NDLS", to: "BPL", travelClass: "2ac", chartPrepared: false,
    passengers: [
      { name: "Meena Joshi", coach: "-", berth: "-", bookingStatus: "Cancelled", currentStatus: "Cancelled" },
    ],
  },
};
