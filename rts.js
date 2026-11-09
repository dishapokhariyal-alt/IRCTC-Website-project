const liveStatusForm = document.getElementById("live-status-form");
const trainNumberInput = document.getElementById("rts-train-number");
const resultBox = document.getElementById("live-status-result");

liveStatusForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const trainNumber = trainNumberInput.value.trim();

  resultBox.innerHTML = "<p>Fetching live train status...</p>";

  try {
    const response = await fetch(
      `http://localhost:3000/api/trains/${trainNumber}/live`,
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to fetch train status");
    }

    resultBox.innerHTML = `
      <h2>${result.trainName || "Train Details"}</h2>

      <p><strong>Train Number:</strong> ${result.trainNumber}</p>
      <p><strong>Status:</strong> ${result.status}</p>
      <p><strong>Current Location:</strong>
        ${result.currentLocation?.stationName || "Not available"}
      </p>
      <p><strong>Previous Station:</strong>
        ${result.previousHalt?.stationName || "Not available"}
      </p>
      <p><strong>Next Station:</strong>
        ${result.nextHalt?.stationName || "Not available"}
      </p>
      <p><strong>Delay:</strong>
        ${result.delayMinutes ?? "Not available"} minutes
      </p>
      <p><strong>Last Updated:</strong>
        ${result.lastUpdatedAt || "Not available"}
      </p>
    `;
  } catch (error) {
    resultBox.innerHTML = `<p>${error.message}</p>`;
  }
});
