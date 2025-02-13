const mongoose = require("mongoose");

const NodeMetadataSchema = new mongoose.Schema({
  nodeId: { type: String, required: true, unique: true },
  locationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  yellow_alert: { type: Number, required: true },
  orange_alert: { type: Number, required: true },
  red_alert: { type: Number, required: true },
  otherMetadata: {
    type: { type: String, default: null },
    description: { type: String, default: null },
  },
});

module.exports = mongoose.model("NodeMetadata", NodeMetadataSchema);
