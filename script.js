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
