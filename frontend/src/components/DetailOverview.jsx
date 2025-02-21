import React from "react";

// Function to format timestamp to IST time
const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata", // Converts to IST
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // 12-hour format
    }).format(date);
};

const DetailOverview = ({ nodeData }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Current Status Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Current Status</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">Water Level:</span>
            <span>{nodeData.latest_water_level !== null ? `${nodeData.latest_water_level} ft` : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Latitude:</span>
            <span>{nodeData.latitude || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Longitude:</span>
            <span>{nodeData.longitude || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Last Updated:</span>
            <span>{nodeData.latest_timestamp ? formatDateTime(nodeData.latest_timestamp) : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Warning Specifications Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Warning Specifications</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">Yellow Alert Level:</span>
            <span>{nodeData.yellow_alert !== null ? `${nodeData.yellow_alert} ft` : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Orange Alert Level:</span>
            <span>{nodeData.orange_alert !== null ? `${nodeData.orange_alert} ft` : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Red Alert Level:</span>
            <span>{nodeData.red_alert !== null ? `${nodeData.red_alert} ft` : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Predicted Water Level Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Latest Predicted Data</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">Predicted Water Level:</span>
            <span>
              {nodeData.predicted_water_level !== null
                ? `${nodeData.predicted_water_level.toFixed(3)} ft`
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Prediction Timestamp:</span>
            <span>
              {nodeData.predicted_timestamp
                ? formatDateTime(nodeData.predicted_timestamp)
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOverview;
