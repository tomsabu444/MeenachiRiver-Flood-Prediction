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

    // Fetch the last 40 records for this nodeId, sorted by timestamp
    const previousData = await IotNodeData.find({ nodeId })
      .sort({ timestamp: -1 }) // Sorting by latest timestamp
      .limit(40);

    console.log("Fetched previous data:", previousData);

    if (previousData.length > 0) {
      // Get the water levels of the previous records
      const previousWaterLevels = previousData.map(record => record.waterLevel);
      console.log("Previous water levels:", previousWaterLevels);

      // Get the last recorded water level
      const lastValidWaterLevel = previousWaterLevels[0];
      console.log("Last valid water level:", lastValidWaterLevel);

      // Define the threshold for anomaly detection
      const threshold = 0.2;

      // Check if the new value is anomalous
      const isAnomalous = previousWaterLevels.every(prev => Math.abs(waterLevel - prev) > threshold);
      console.log("Is the value anomalous?", isAnomalous);

      // If the value is anomalous or negative, replace it with the last valid water level
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
    const savedData = await newNodeData.save();
    console.log("Saved data:", savedData);

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
