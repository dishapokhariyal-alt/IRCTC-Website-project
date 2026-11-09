(async function () {
  const table = document.getElementById("rts-table");
  const body = table.tBodies[0] || table;

  try {
    const d = await apiGet("/api/trains/" + encodeURIComponent(qs().get("train") || "") + "/schedule");
    const n = d.stops.length;
    // Train-level cells span every stop row; stop-level cells repeat per row
    const span = (text) => el("td", { rowSpan: n }, text);

    d.stops.forEach((s, i) => {
      const tr = el("tr");
      if (i === 0) {
        tr.append(span(d.name), span(d.trainNumber),
          span(`${d.source.name} (${d.source.code})`),
          span(`${d.destination.name} (${d.destination.code})`),
          span(d.runningDays));
      }
      tr.append(
        el("td", {}, `${s.name} (${s.code})`),
        el("td", {}, s.arrival || "—"),
        el("td", {}, s.departure || "—"),
        el("td", {}, s.haltMinutes ? s.haltMinutes + " min" : "—"));
      if (i === 0) {
        tr.append(span(d.totalDistanceKm + " km"), span(d.totalTravelTime), span(d.averageSpeedKmph + " km/h"));
      }
      body.append(tr);
    });
  } catch (e) {
    body.append(el("tr", {}, el("td", { colSpan: 12 }, e.message)));
  }
})();
