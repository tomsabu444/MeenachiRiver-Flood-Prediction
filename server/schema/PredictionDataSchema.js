const mongoose = require("mongoose");

const PredictedDataSchema = new mongoose.Schema(
  {
    nodeId: {
      type: String,
      required: true,
      index: true, // Index this field for efficient querying
    },
    predictedWaterLevel: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true, // Index for faster time-based queries
    },
  }
);

// Add a compound index for nodeId and timestamp for efficient queries
PredictedDataSchema.index({ nodeId: 1, timestamp: -1 });

// Export the model
module.exports = mongoose.model("predicted-data", PredictedDataSchema);
