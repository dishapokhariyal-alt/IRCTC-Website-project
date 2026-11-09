const train = document.getElementById("fa-train-number");
const source = document.getElementById("fa-source-station");
const destination = document.getElementById("fa-destination-station");
const date = document.getElementById("fa-journey-date");
const button = document.getElementById("fa-check-avail");

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

train.addEventListener("input", validateForm);
source.addEventListener("input", validateForm);
destination.addEventListener("input", validateForm);
date.addEventListener("input", validateForm);

const form = document.querySelector(".fa-train-details");
const resetButton = document.getElementById("fa-reset");

resetButton.addEventListener("click", function () {
  form.reset();

  // Disable Check Fare again
  button.disabled = true;
});

// NEW: send the form values to the result page
button.addEventListener("click", function () {
  goTo("result_fare_enquiry.html", {
    train: getVal("fa-train-number"),
    from: getCode("fa-source-station"),
    to: getCode("fa-destination-station"),
    date: getVal("fa-journey-date"),
    class: getVal("fa-train-class"),
    quota: getVal("fa-train-quota"),
    passengerType: getVal("fa-passenger-type"),
  });
});
