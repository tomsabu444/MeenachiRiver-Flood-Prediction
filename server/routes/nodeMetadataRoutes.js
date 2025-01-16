const express = require("express");
const fs = require("fs");
const path = require("path");
const NodeDataSchema = require("../schema/NodeDataSchema"); // Import the schema

const router = express.Router();

// Define the path to the JSON file
const nodeDataFilePath = path.join(__dirname, "../data/node_Metadata.json");

// API endpoint to get all node metadata
router.get("/", async (req, res) => {
  try {
    const data = fs.readFileSync(nodeDataFilePath, "utf-8");
    const nodeData = JSON.parse(data);

    // Add latest_water_level for each node
    const updatedNodeData = await Promise.all(
      nodeData.map(async (node) => {
        const latestWaterLevelData = await NodeDataSchema.find({ nodeId: node.nodeId })
          .sort({ timestamp: -1 })
          .limit(1);
        const latestWaterLevel = latestWaterLevelData[0]?.waterLevel || null;

        return {
          ...node,
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
    console.error("Error reading or processing node data:", err);
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
    const data = fs.readFileSync(nodeDataFilePath, "utf-8");
    const nodeData = JSON.parse(data);

    // Find the node with the specified nodeId
    const node = nodeData.find((item) => item.nodeId === nodeId);

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

    // Add the latest_water_level to the response
    const nodeWithWaterLevel = {
      ...node,
      latest_water_level: latestWaterLevel,
    };

    res.status(200).json({
      success: true,
      message: `Node metadata for ID ${nodeId} retrieved successfully.`,
      data: nodeWithWaterLevel,
    });
  } catch (err) {
    console.error("Error reading or processing node data:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load node metadata.",
    });
  }
});

module.exports = router;
