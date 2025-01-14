const express = require('express');
const IotNodeData = require('../schema/NodeDataSchema');

const router = express.Router();

// POST /api/v1/nodeData/add - Endpoint to receive data from IoT nodes
router.post('/', async (req, res) => {
  try {
    // Validate incoming request body
    const { nodeId, waterLevel } = req.body;

    if (!nodeId || waterLevel == null) {
      return res.status(400).json({ error: 'Missing required fields: nodeId, location, or waterLevel.' });
    }

    // Create a new document using the IotNodeData model
    const newNodeData = new IotNodeData({
      nodeId,
      waterLevel,
    });

    // Save the data to MongoDB
    await newNodeData.save();

    // Respond with success and the saved data
    res.status(201).json({
      message: 'Data saved successfully',
    //   data: savedData,
    });
  } catch (error) {
    console.error('Error saving node data:', error);
    res.status(500).json({ error: 'An error occurred while saving data.' });
  }
});

module.exports = router;
