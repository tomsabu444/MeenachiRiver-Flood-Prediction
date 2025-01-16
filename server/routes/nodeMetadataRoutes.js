const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Define the path to the JSON file
const nodeDataFilePath = path.join(__dirname, "../data/node_Metadata.json");

// API endpoint to get all node metadata
router.get("/", (req, res) => {
  fs.readFile(nodeDataFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading node data:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to load node metadata.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Node metadata retrieved successfully.",
      data: JSON.parse(data),
    });
  });
});

// API endpoint to get node metadata by nodeId
router.get("/:nodeId", (req, res) => {
  const { nodeId } = req.params;

  fs.readFile(nodeDataFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading node data:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to load node metadata.",
      });
    }

    // Parse the JSON data
    const nodeData = JSON.parse(data);

    // Find the node with the specified nodeId
    const node = nodeData.find((item) => item.nodeId === nodeId);

    if (!node) {
      return res.status(404).json({
        success: false,
        message: `Node with ID ${nodeId} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Node metadata for ID ${nodeId} retrieved successfully.`,
      data: node,
    });
  });
});

module.exports = router;
