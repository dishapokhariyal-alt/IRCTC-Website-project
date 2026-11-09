const router = require("express").Router();

router.get("/trains/:trainNo/live", async (req, res) => {
  try {
    const trainNo = req.params.trainNo;

    if (!/^\d{5}$/.test(trainNo)) {
      return res.status(400).json({
        error: "Enter a valid 5-digit train number",
      });
    }

    const apiKey = process.env.RAILRADAR_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Railway API key is not configured",
      });
    }

    const response = await fetch(
      `https://api.railradar.in/v1/trains/${trainNo}/live`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Unable to fetch train status",
      });
    }

    res.json(data.data);
  } catch (error) {
    console.error("Live status error:", error);

    res.status(500).json({
      error: "Unable to retrieve live train status",
    });
  }
});

module.exports = router;
