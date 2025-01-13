const express = require('express');
const router = express.Router();
const createFloodDataModel = require('../schema/FloodData'); // Import the function

// Route to fetch flood data dynamically based on collection name
router.get('/:collectionName', async (req, res) => {
    const { collectionName } = req.params;

    try {
        // Create a model for the specified collection
        const FloodData = createFloodDataModel(collectionName);

        // Fetch data from the specified collection
        const floodData = await FloodData.find().sort({ timestamp: -1 }); // Sort by latest timestamp
        res.status(200).json(floodData);
    } catch (error) {
        console.error(`Error fetching data from collection ${collectionName}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
