const express = require("express");
const mongoose = require("mongoose");
const NodeMetadata = require("../schema/NodeMetadataSchema"); 
const NodeDataSchema = require("../schema/NodeDataSchema"); 

const router = express.Router();

// API endpoint to get all node metadata
router.get("/", async (req, res) => {
  try {
    const nodeData = await NodeMetadata.find();

    // Add latest_water_level for each node
    const updatedNodeData = await Promise.all(
      nodeData.map(async (node) => {
        const latestWaterLevelData = await NodeDataSchema.find({ nodeId: node.nodeId })
          .sort({ timestamp: -1 })
          .limit(1);
        const latestWaterLevel = latestWaterLevelData[0]?.waterLevel || null;

        return {
          ...node.toObject(),
          latest_water_level: latestWaterLevel,
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

// API endpoint to get node metadata by nodeId
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

    // Fetch the latest water level from the database
    const latestWaterLevelData = await NodeDataSchema.find({ nodeId })
      .sort({ timestamp: -1 })
      .limit(1);
    const latestWaterLevel = latestWaterLevelData[0]?.waterLevel || null;

    const nodeWithWaterLevel = {
      ...node.toObject(),
      latest_water_level: latestWaterLevel,
    };

    res.status(200).json({
      success: true,
      message: `Node metadata for ID ${nodeId} retrieved successfully.`,
      data: nodeWithWaterLevel,
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
