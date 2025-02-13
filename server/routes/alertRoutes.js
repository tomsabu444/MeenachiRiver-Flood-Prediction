const express = require('express');
const router = express.Router();
const Alert = require('../schema/AlertSchema');

// POST request to save or update form data
router.post('/', async (req, res) => {
  const { email, phone, locations } = req.body;

  try {
    // Check if email already exists
    const existingAlert = await Alert.findOne({ email });

    if (existingAlert) {
      // If the email exists, update the location preferences
      existingAlert.locations = locations;  // Update the locations array
      await existingAlert.save();  // Save the updated data

      return res.status(200).json({
        message: 'Alert preferences updated successfully'
      });
    }

    // If the email does not exist, create a new alert preference
    const newAlert = new Alert({
      email,
      phone,
      locations
    });

    // Save to the database
    await newAlert.save();

    res.status(201).json({ message: 'Alert preferences saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
