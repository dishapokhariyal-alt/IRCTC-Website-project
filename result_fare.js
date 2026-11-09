(async function () {
  const box = document.getElementById("fare-results");
  const p = qs();
  showMessage(box, "Calculating fare…");

  try {
    const d = await apiGet("/api/fare", {
      train: p.get("train"), from: p.get("from"), to: p.get("to"), date: p.get("date"),
      class: p.get("class"), quota: p.get("quota"), passengerType: p.get("passengerType"),
    });

    const children = [
      el("p", {}, `${d.trainName} (${d.trainNumber}) · ${d.from.name} (${d.from.code}) → ` +
        `${d.to.name} (${d.to.code}) · ${d.distanceKm} km · ${formatDate(d.date)} · ` +
        `${d.quota} quota · ${d.passengerType === "child" ? "Child" : "Adult"}`),
    ];
    for (const f of d.fares) {
      const rows = [
        ["Base Fare", rupees(f.baseFare)],
        ["Reservation Charges", rupees(f.reservationCharge)],
        ["Superfast Charges", rupees(f.superfastCharge)],
      ];
      if (f.tatkalCharge > 0) rows.push(["Tatkal Charges", rupees(f.tatkalCharge)]);
      rows.push(["GST (if applicable)", rupees(f.gst)], ["Total Fare", rupees(f.totalFare)]);
      children.push(makeTable("fare-table", `${f.classLabel} — Fare Breakdown`, rows));
    }
    box.replaceChildren(...children);
  } catch (e) {
    showMessage(box, e.message, true);
  }
})();
