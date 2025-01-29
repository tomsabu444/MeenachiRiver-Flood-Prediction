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

    // Fetch the last 40 records for this nodeId
    const previousData = await IotNodeData.find({ nodeId })
      .sort({ createdAt: -1 }) // Sorting by latest timestamp
      .limit(40);

    if (previousData.length > 0) {
      // Get all previous water levels
      const previousWaterLevels = previousData.map(record => record.waterLevel);
      
      // Get the last recorded water level
      const lastValidWaterLevel = previousWaterLevels[0];

      // Define a fixed threshold for anomaly detection
      const threshold = 0.2;

      // Check for anomaly (large deviation) or negative value
      const isAnomalous = previousWaterLevels.every(prev => Math.abs(waterLevel - prev) > threshold);
      
      if (isAnomalous || waterLevel < 0) {
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
