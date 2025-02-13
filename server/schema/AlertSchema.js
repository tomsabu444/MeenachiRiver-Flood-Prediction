const mongoose = require('mongoose');

// Define the Alert Schema
const alertSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
  },
  locations: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

// Create and export the model
const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
