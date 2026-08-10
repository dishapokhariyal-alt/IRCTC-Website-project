const tips = [
  "Carry a valid ID proof while travelling.",
  "Reach the station at least 30 minutes before departure.",
  "Always check your PNR status before leaving home.",
  "Keep your ticket and ID easily accessible.",
  "Label your luggage with your name and phone number.",
  "Use the IRCTC food service for hygienic meals.",
  "Keep your mobile phone charged during the journey.",
  "Double-check your coach and seat number before boarding.",
];

const randomIndex = Math.floor(Math.random() * tips.length);

document.getElementById("tip").innerText = tips[randomIndex];
