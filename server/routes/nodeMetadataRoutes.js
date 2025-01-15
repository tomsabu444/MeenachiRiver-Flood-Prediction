const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Define the path to the JSON file
const nodeDataFilePath = path.join(__dirname, "../data/node_Metadata.json");

// API endpoint to get node metadata
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

module.exports = router;
