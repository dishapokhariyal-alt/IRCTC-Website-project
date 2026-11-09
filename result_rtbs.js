(async function () {
  const table = document.getElementById("rtbs-table");
  const body = table.tBodies[0] || table;
  const p = qs();

  const messageRow = (text) =>
    body.append(el("tr", {}, el("td", { colSpan: 6 }, text)));

  try {
    const data = await apiGet("/api/trains/between", {
      from: p.get("from"), to: p.get("to"), date: p.get("date"),
      class: p.get("class"), quota: p.get("quota"),
    });
    if (data.trains.length === 0) {
      messageRow("No trains found between these stations on this date.");
      return;
    }
    for (const t of data.trains) {
      const arrival = t.arrival + (t.arrivalDayOffset > 0 ? ` (+${t.arrivalDayOffset} day)` : "");
      body.append(el("tr", {},
        el("td", {}, t.trainNumber), el("td", {}, t.name), el("td", {}, t.departure),
        el("td", {}, arrival), el("td", {}, t.duration), el("td", {}, t.runningDays)));
    }
  } catch (e) {
    messageRow(e.message);
  }
})();
