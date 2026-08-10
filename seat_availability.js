const train = document.getElementById("sa-train-number");
const source = document.getElementById("sa-source-station");
const destination = document.getElementById("sa-destination-station");
const date = document.getElementById("sa-journey-date");
const button = document.getElementById("check_seat_avail");
const reset = document.getElementById("reset_seat");

function validateForm() {
  if (
    train.value !== "" &&
    source.value !== "" &&
    destination.value !== "" &&
    date.value !== ""
  ) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}
