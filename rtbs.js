// Reserved Train Between Stations form -> result_rtbs.html
const rtbsForm = document.querySelector(".rtbs-train-details");

rtbsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  goTo("result_rtbs.html", {
    from: getCode("rtbs-source-station"),
    to: getCode("rtbs-destination-station"),
    date: getVal("rtbs-journey-date"),
    class: getVal("rtbs-train-class"),
    quota: getVal("rtbs-train-quota"),
  });
});
