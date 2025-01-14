const mongoose = require('mongoose');

const IotNodeDataSchema = new mongoose.Schema(
  {
    nodeId: {
      type: String,
      required: true,
      index: true, // Index this field for efficient querying
    },
    waterLevel: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false, // Disable `updatedAt`
    },
  }
);

// Add a compound index for nodeId and timestamp for time-series queries
IotNodeDataSchema.index({ nodeId: 1, timestamp: -1 });

// Export the model
module.exports = mongoose.model('IotNodeData', IotNodeDataSchema);
