// Indian Railway Enquiry form -> result_ire.html
const ireForm = document.querySelector(".train-details");

function submitIre() {
  if (!ireForm.reportValidity()) return;
  goTo("result_ire.html", {
    train: getVal("train-number"),
    from: getCode("source-station"),
    to: getCode("destination-station"),
    date: getVal("journey-date"),
    class: getVal("train-class"),
    quota: getVal("train-quota"),
  });
}

ireForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitIre();
});
document.getElementById("check-avail").addEventListener("click", submitIre);
