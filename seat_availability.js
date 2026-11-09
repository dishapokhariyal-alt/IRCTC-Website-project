// Seat Availability form -> result page
const seatForm = document.querySelector(".seat-avail-details");

seatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  goTo("result_seat_availability.html", {
    train: getVal("sa-train-number"),
    from: getCode("sa-source-station"),
    to: getCode("sa-destination-station"),
    date: getVal("sa-journey-date"),
    class: getVal("sa-train-class"),
    quota: getVal("sa-train-quota"),
  });
});
