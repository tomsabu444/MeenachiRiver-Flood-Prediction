const express = require('express');
const router = express.Router();
const Alert = require('../schema/AlertSchema');
const NodeMetadata = require('../schema/NodeMetadataSchema');

// POST request to save or update form data
router.post('/', async (req, res) => {
  const { email, phone, locations } = req.body;

  try {
    // Ensure that locations is a non-empty array
    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ message: 'Locations array must be provided and cannot be empty.' });
    }

    // Fetch valid nodeIds from NodeMetadata based on the provided locations
    const validNodes = await NodeMetadata.find({ nodeId: { $in: locations } }).select('nodeId').lean();
    const validNodeIds = validNodes.map(node => node.nodeId);

    // Check if any provided nodeId is invalid
    const invalidLocations = locations.filter(loc => !validNodeIds.includes(loc));
    if (invalidLocations.length > 0) {
      return res.status(400).json({ message: `Invalid nodeId(s) provided` });
    }

    // Check if an alert with the given email already exists
    const existingAlert = await Alert.findOne({ email });

    if (existingAlert) {
      // Update the locations array if the email already exists
      existingAlert.locations = locations;
      await existingAlert.save();
      return res.status(200).json({ message: 'Alert preferences updated successfully' });
    }

    // Create a new alert preference if the email does not exist
    const newAlert = new Alert({
      email,
      phone,
      locations
    });

    // Save the new alert to the database
    await newAlert.save();
    res.status(201).json({ message: 'Alert preferences saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
