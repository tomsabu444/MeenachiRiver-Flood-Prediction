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

    // Fetch the last 60 records for this nodeId
    const previousData = await IotNodeData.find({ nodeId })
      .sort({ createdAt: -1 }) // Sorting by latest timestamp
      .limit(40);

    if (previousData.length > 0) {
      // Calculate the average water level
      const totalWaterLevel = previousData.reduce((sum, record) => sum + record.waterLevel, 0);
      const averageWaterLevel = totalWaterLevel / previousData.length;

      // Get the last recorded water level
      const lastValidWaterLevel = previousData[0].waterLevel;

      // Define a threshold for abnormal difference (e.g., 30%)
      const threshold = 0.3; // 30%

      // Check for anomaly (large deviation) or negative value
      if (
        Math.abs(waterLevel - averageWaterLevel) / averageWaterLevel > threshold || 
        waterLevel < 0
      ) {
        console.log(`Anomaly detected. Replacing ${waterLevel} with ${lastValidWaterLevel}`);
        waterLevel = lastValidWaterLevel;
      }
    }

    // Create a new document with the (potentially modified) water level
    const newNodeData = new IotNodeData({
      nodeId,
      waterLevel,
    });

    // Save to database
    await newNodeData.save();

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
