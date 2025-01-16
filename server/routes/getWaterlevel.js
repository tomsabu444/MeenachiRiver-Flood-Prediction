const express = require("express");
const router = express.Router();
const NodeDataSchema = require('../schema/NodeDataSchema');

router.get("/:nodeId", async (req, res) => {
  try {
    const { nodeId } = req.params;

    // Query the database for data by nodeId (limit results or filter as needed)
    const nodeData = await NodeDataSchema.find({ nodeId })
      .sort({ timestamp: -1 }).limit(100); // Limit to 10 records, adjust as needed

    if (!nodeData || nodeData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the given nodeId." });
    }

    res.json({ success: true, data: nodeData });
  } catch (error) {
    console.error("Error fetching water level data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
