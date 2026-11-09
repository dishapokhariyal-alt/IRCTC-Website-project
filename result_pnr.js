document.addEventListener("DOMContentLoaded", async function () {
  const box = document.getElementById("pnr-results");

  // Your backend address


  // Read PNR number from the URL
  const params = new URLSearchParams(window.location.search);
  const pnr = (params.get("pnr-number") || "").trim();

  // Display messages
  function showMessage(container, message, isError = false) {
    container.textContent = message;
    container.style.color = isError ? "red" : "black";
  }

  // Fetch data from your backend
  async function apiGet(endpoint) {
    const response = await fetch(API_BASE + endpoint);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  }

  // Create a table
  function makeTable(title, rows) {
    const table = document.createElement("table");
    table.className = "pnr-table";

    const heading = document.createElement("caption");
    heading.textContent = title;
    table.appendChild(heading);

    rows.forEach(function (row) {
      const tr = document.createElement("tr");

      row.forEach(function (value) {
        const td = document.createElement("td");
        td.textContent = value ?? "Not available";
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });

    return table;
  }

  // Format journey date
  function formatDate(date) {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN");
  }

  // Check whether a PNR was supplied
  if (!pnr) {
    showMessage(
      box,
      "No PNR number found. Please submit your PNR again.",
      true,
    );
    return;
  }

  showMessage(box, "Loading PNR status...");

  try {
    // STEP 1: Fetch PNR details
    const d = await apiGet("/api/pnr/" + encodeURIComponent(pnr));

    // STEP 2: Display passenger details
    const tables = d.passengers.map(function (p, i) {
      return makeTable(`Passenger ${i + 1} — PNR ${d.pnr}`, [
        ["Passenger Name:", p.name],
        ["Train Number:", d.trainNumber],
        ["Train Name:", d.trainName],
        ["Journey Date:", formatDate(d.journeyDate)],
        ["Boarding Station:", `${d.from.name} (${d.from.code})`],
        ["Destination Station:", `${d.to.name} (${d.to.code})`],
        ["Coach:", p.coach],
        ["Berth Number:", p.berth],
        ["Booking Status:", p.bookingStatus],
        ["Current Status:", p.currentStatus],
        ["Chart Prepared:", d.chartPrepared ? "Yes" : "No"],
      ]);
    });

    box.replaceChildren(...tables);

    // STEP 3: Create Live Train Status button
    const liveButton = document.createElement("button");
    liveButton.type = "button";
    liveButton.textContent = "Check Live Train Status";
    liveButton.style.margin = "20px 0";
    liveButton.style.padding = "12px 20px";
    liveButton.style.cursor = "pointer";

    const liveResult = document.createElement("div");
    liveResult.id = "live-train-result";

    box.appendChild(liveButton);
    box.appendChild(liveResult);

    // STEP 4: Fetch live status when button is clicked
    liveButton.addEventListener("click", async function () {
      liveButton.disabled = true;
      showMessage(liveResult, "Fetching live train status...");

      try {
        const liveData = await apiGet(
          "/api/trains/" + encodeURIComponent(d.trainNumber) + "/live",
        );

        // Display live train information
        const liveTable = makeTable("Live Train Status", [
          ["Train Number:", liveData.trainNumber],
          ["Train Name:", liveData.trainName],
          ["Running Status:", liveData.status],
          [
            "Current Location:",
            liveData.currentLocation?.stationName || "Not available",
          ],
          [
            "Previous Station:",
            liveData.previousHalt?.stationName || "Not available",
          ],
          ["Next Station:", liveData.nextHalt?.stationName || "Not available"],
          [
            "Delay:",
            liveData.delayMinutes != null
              ? liveData.delayMinutes + " minutes"
              : "Not available",
          ],
          ["Last Updated:", liveData.lastUpdatedAt || "Not available"],
        ]);

        liveResult.replaceChildren(liveTable);
      } catch (error) {
        showMessage(liveResult, error.message, true);
      } finally {
        liveButton.disabled = false;
      }
    });
  } catch (error) {
    showMessage(box, error.message, true);
    console.error("PNR enquiry error:", error);
  }
});
