// Sample (simulated) trains. NOT real railway data.
// stop = [stationCode, arrival, departure, distanceFromOriginKm, dayNumber]
// dayNumber = journey day on which the train arrives at that stop (1 = first day).
const ALL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

module.exports = [
  {
    number: "12951", name: "Mumbai Rajdhani Express", type: "Rajdhani",
    days: ALL, classes: ["3ac", "2ac", "1ac"], rateMultiplier: 1.35, superfast: true,
    stops: [
      ["NDLS", null, "16:55", 0, 1], ["KOTA", "21:35", "21:40", 465, 1],
      ["RTM", "00:25", "00:30", 655, 2], ["BRC", "04:05", "04:10", 992, 2],
      ["ST", "06:00", "06:05", 1121, 2], ["MMCT", "08:15", null, 1384, 2],
    ],
  },
  {
    number: "12952", name: "Mumbai Central Tejas Rajdhani", type: "Rajdhani",
    days: ["Mon", "Wed", "Fri", "Sat"], classes: ["3ac", "2ac", "1ac"], rateMultiplier: 1.4, superfast: true,
    stops: [
      ["NDLS", null, "17:30", 0, 1], ["KOTA", "22:50", "22:55", 465, 1],
      ["BRC", "05:10", "05:15", 992, 2], ["MMCT", "09:20", null, 1384, 2],
    ],
  },
  {
    number: "12302", name: "Howrah Rajdhani Express", type: "Rajdhani",
    days: ALL, classes: ["3ac", "2ac", "1ac"], rateMultiplier: 1.35, superfast: true,
    stops: [
      ["NDLS", null, "16:50", 0, 1], ["CNB", "21:40", "21:45", 440, 1],
      ["PRYJ", "23:35", "23:40", 627, 1], ["HWH", "10:05", null, 1447, 2],
    ],
  },
  {
    number: "12002", name: "Bhopal Shatabdi Express", type: "Shatabdi",
    days: ["Mon", "Tue", "Wed", "Thu", "Sat", "Sun"], classes: ["3ac", "2ac"], rateMultiplier: 1.1, superfast: true,
    stops: [
      ["NDLS", null, "06:00", 0, 1], ["AGC", "07:50", "07:52", 195, 1],
      ["JHS", "10:00", "10:05", 415, 1], ["BPL", "14:25", null, 701, 1],
    ],
  },
  {
    number: "12957", name: "Swarna Jayanti Rajdhani Express", type: "Rajdhani",
    days: ALL, classes: ["3ac", "2ac", "1ac"], rateMultiplier: 1.35, superfast: true,
    stops: [
      ["NDLS", null, "19:55", 0, 1], ["JP", "00:25", "00:30", 308, 2],
      ["ABR", "05:50", "05:52", 745, 2], ["ADI", "09:35", null, 934, 2],
    ],
  },
  {
    number: "12615", name: "Grand Trunk Express", type: "Express",
    days: ALL, classes: ["sleeper", "3ac", "2ac", "1ac"], rateMultiplier: 1.0, superfast: false,
    stops: [
      ["NDLS", null, "18:40", 0, 1], ["AGC", "21:00", "21:05", 195, 1],
      ["JHS", "00:05", "00:15", 415, 2], ["BPL", "03:45", "03:55", 701, 2],
      ["NGP", "09:50", "10:00", 1090, 2], ["BZA", "20:15", "20:25", 1775, 2],
      ["MAS", "04:40", null, 2182, 3],
    ],
  },
];
