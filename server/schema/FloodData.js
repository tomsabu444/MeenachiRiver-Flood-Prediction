const mongoose = require('mongoose');

// Define the schema for flood data
const FloodDataSchema = new mongoose.Schema({
    distance_feet: { type: Number, required: true },
    timestamp: { type: Date, required: true }
});

// Export a function to create a model for a specific collection
module.exports = (collectionName) => {
    return mongoose.model(collectionName, FloodDataSchema, collectionName);
};
