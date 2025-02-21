const express = require("express");
const mongoose = require("mongoose");
const NodeMetadata = require("../schema/NodeMetadataSchema");
const NodeDataSchema = require("../schema/NodeDataSchema");
const PredictedData = require("../schema/PredictionDataSchema"); // ✅ Added for predictions

const router = express.Router();

// API endpoint to get all node metadata with actual & predicted water levels
router.get("/", async (req, res) => {
  try {
    const nodeData = await NodeMetadata.find();

    // Add latest actual & predicted water levels + timestamps for each node
    const updatedNodeData = await Promise.all(
      nodeData.map(async (node) => {
        // Get latest actual water level
        const latestActualData = await NodeDataSchema.find({ nodeId: node.nodeId })
          .sort({ timestamp: -1 })
          .limit(1);

        const latestWaterLevel = latestActualData[0]?.waterLevel || null;
        const latestTimestamp = latestActualData[0]?.timestamp || null;

        // Get latest predicted water level
        const latestPredictedData = await PredictedData.find({ nodeId: node.nodeId })
          .sort({ timestamp: -1 })
          .limit(1);

        const predictedWaterLevel = latestPredictedData[0]?.predictedWaterLevel || null;
        const predictedTimestamp = latestPredictedData[0]?.timestamp || null;

        return {
          ...node.toObject(),
          latest_water_level: latestWaterLevel,
          latest_timestamp: latestTimestamp,
          predicted_water_level: predictedWaterLevel,
          predicted_timestamp: predictedTimestamp,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Node metadata retrieved successfully.",
      data: updatedNodeData,
    });
  } catch (err) {
    console.error("Error retrieving node data:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load node metadata.",
    });
  }
});

// API endpoint to get node metadata by nodeId with actual & predicted water levels
router.get("/:nodeId", async (req, res) => {
  const { nodeId } = req.params;

  try {
    const node = await NodeMetadata.findOne({ nodeId });

    if (!node) {
      return res.status(404).json({
        success: false,
        message: `Node with ID ${nodeId} not found.`,
      });
    }

    // Fetch latest actual water level
    const latestActualData = await NodeDataSchema.find({ nodeId })
      .sort({ timestamp: -1 })
      .limit(1);

    const latestWaterLevel = latestActualData[0]?.waterLevel || null;
    const latestTimestamp = latestActualData[0]?.timestamp || null;

    // Fetch latest predicted water level
    const latestPredictedData = await PredictedData.find({ nodeId })
      .sort({ timestamp: -1 })
      .limit(1);

    const predictedWaterLevel = latestPredictedData[0]?.predictedWaterLevel || null;
    const predictedTimestamp = latestPredictedData[0]?.timestamp || null;

    const nodeWithWaterLevels = {
      ...node.toObject(),
      latest_water_level: latestWaterLevel,
      latest_timestamp: latestTimestamp,
      predicted_water_level: predictedWaterLevel,
      predicted_timestamp: predictedTimestamp,
    };

    res.status(200).json({
      success: true,
      message: `Node metadata for ID ${nodeId} retrieved successfully.`,
      data: nodeWithWaterLevels,
    });
  } catch (err) {
    console.error("Error retrieving node data:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load node metadata.",
    });
  }
});

module.exports = router;
