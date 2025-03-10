const express = require("express");
const router = express.Router();
const IotNodeData = require("../schema/NodeDataSchema");

router.get("/:nodeId/:date", async (req, res) => {
  try {
    const { nodeId, date } = req.params;

    // Validate the date parameter (should be in YYYY-MM-DD format)
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date in YYYY-MM-DD format.",
      });
    }

    // Set the date range from midnight to end of day
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(date);
    toDate.setHours(23, 59, 59, 999);

    // Aggregate data from MongoDB to calculate hourly averages
    const hourlyAverages = await IotNodeData.aggregate([
      {
        $match: {
          nodeId: nodeId,
          timestamp: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: { hour: { $hour: "$timestamp" } }, // Group by hour (UTC by default)
          avgWaterLevel: { $avg: "$waterLevel" },
        },
      },
      { $sort: { "_id.hour": 1 } },
    ]);

    // Create an array for all 24 hours (0-23) and fill with the average data (or null if no data)
    const hourlyData = [];
    for (let hour = 0; hour < 24; hour++) {
      const found = hourlyAverages.find(item => item._id.hour === hour);
      hourlyData.push({
        hour,
        avgWaterLevel: found ? found.avgWaterLevel : null
      });
    }

    return res.json({ success: true, nodeId, date, data: hourlyData });
  } catch (error) {
    console.error("Error fetching hourly data:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;