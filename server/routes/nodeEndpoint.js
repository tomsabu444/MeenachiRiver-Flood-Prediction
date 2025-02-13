const express = require('express');
const IotNodeData = require('../schema/NodeDataSchema');

const router = express.Router();

// POST /api/v1/nodeData/add - Endpoint to receive data from IoT nodes
router.post('/', async (req, res) => {
  try {
    let { nodeId, waterLevel } = req.body;

    if (!nodeId || waterLevel == null) {
      return res.status(400).json({ error: 'Missing required fields: nodeId or waterLevel.' });
    }

    // Apply anomaly check only for "poonjar-001"
    if (nodeId === "poonjar-001") {
      // Fetch the last 5 records for this nodeId, sorted by timestamp (latest first)
      const previousData = await IotNodeData.find({ nodeId })
        .sort({ timestamp: -1 })
        .limit(5);

      if (previousData.length > 0) {
        // Get the water levels of the previous records
        const previousWaterLevels = previousData.map(record => record.waterLevel);

        // Calculate the average of the last 5 water levels
        const avgWaterLevel = previousWaterLevels.reduce((sum, value) => sum + value, 0) / previousWaterLevels.length;
        console.log("Average of last 5 water levels:", avgWaterLevel);

        // Define the threshold for anomaly detection
        const threshold = 0.3;

        // Check if the new value is anomalous
        const isAnomalous = previousWaterLevels.every(prev => Math.abs(waterLevel - prev) > threshold);
        console.log("Is the value anomalous?", isAnomalous);

        // If the value is anomalous or negative, replace it with the average water level
        if (isAnomalous || waterLevel < 0) {
          console.log(`Anomaly detected. Replacing ${waterLevel} with ${avgWaterLevel}`);
          waterLevel = avgWaterLevel;
        }
      }
    } else {
      console.log(`Skipping anomaly check for nodeId: ${nodeId}`);
    }

    // Format water level to 3 decimal places
    waterLevel = parseFloat(waterLevel.toFixed(3));

    // Create a new document with the (potentially modified) water level
    const newNodeData = new IotNodeData({
      nodeId,
      waterLevel,
    });

    // Save to database
    const savedData = await newNodeData.save();

    res.status(201).json({
      message: 'Data saved successfully',
      adjustedWaterLevel: waterLevel,
    });
  } catch (error) {
    console.error('Error saving node data:', error);
    res.status(500).json({ error: 'An error occurred while saving data.' });
  }
});

module.exports = router;
