const express = require("express");
const router = express.Router();
const PredictedData = require("../schema/PredictionDataSchema"); 

router.get("/:nodeId", async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { range } = req.query;

    let daysToFilter = 30; // Default to last 30 days
    if (range === "2") daysToFilter = 2;
    else if (range === "5") daysToFilter = 5;
    else if (range === "10") daysToFilter = 10;
    else if (range === "20") daysToFilter = 20;
    else if (range === "3") daysToFilter = 90;
    else if (range === "6") daysToFilter = 180;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysToFilter);

    // Aggregate to get predictions at 10-minute intervals
    let predictedData = await PredictedData.aggregate([
      {
        $match: {
          nodeId: nodeId,
          timestamp: { $gte: new Date(fromDate) } // Ensure correct Date format
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" },
            tenMinute: {
              $subtract: [
                { $minute: "$timestamp" },
                { $mod: [{ $minute: "$timestamp" }, 10] }
              ]
            }
          },
          timestamp: { $first: "$timestamp" },
          nodeId: { $first: "$nodeId" },
          predictedWaterLevel: { $first: "$predictedWaterLevel" }
        }
      },
      { $sort: { timestamp: -1 } },
      { $limit: 100 } // Prevent excessive data from being returned
    ]);

    // **Handling Case: If Not Enough Data Is Found**
    if (!predictedData || predictedData.length === 0) {
      // Fetch **latest available** prediction data instead
      predictedData = await PredictedData.find({ nodeId })
        .sort({ timestamp: -1 })
        .limit(10); // Return at least 10 latest records

      if (!predictedData.length) {
        return res.status(404).json({
          success: false,
          message: "No predicted data found for the given nodeId.",
        });
      }
    }

    res.json({ success: true, data: predictedData });
  } catch (error) {
    console.error("Error fetching predicted water level data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
