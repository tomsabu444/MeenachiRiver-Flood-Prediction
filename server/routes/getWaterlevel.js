const express = require("express");
const router = express.Router();
const NodeDataSchema = require('../schema/NodeDataSchema');

router.get("/:nodeId", async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { range } = req.query;

    let daysToFilter = 30; // Default to 30 days
    if (range === "2") daysToFilter = 2;
    else if (range === "5") daysToFilter = 5;
    else if (range === "10") daysToFilter = 10;
    else if (range === "20") daysToFilter = 20;
    else if (range === "3") daysToFilter = 90;
    else if (range === "6") daysToFilter = 180;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysToFilter);

    // Aggregate to get data points at 10-minute intervals
    const nodeData = await NodeDataSchema.aggregate([
      {
        $match: {
          nodeId: nodeId,
          timestamp: { $gte: fromDate }
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
          waterLevel: { $first: "$waterLevel" }, // Get the first water level in the group
          timestamp: { $first: "$timestamp" }
        }
      },
      { $sort: { timestamp: -1 } }
    ]);

    if (!nodeData || nodeData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No data found for the given nodeId and range." });
    }

    // Transform response format
    const formattedData = nodeData.map(item => ({
      waterlevel: item.waterLevel,
      timestamp: item.timestamp
    }));

    res.json({ success: true, nodeid: nodeId, data: formattedData });
  } catch (error) {
    console.error("Error fetching water level data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
