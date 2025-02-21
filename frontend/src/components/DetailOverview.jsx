import React from "react";

const DetailOverview = ({ nodeData, formatDateTime }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Current Status Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Current Status</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">Water Level:</span>
            <span>{nodeData.latest_water_level || "N/A"} ft</span>
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
            <span>{formatDateTime(nodeData.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Warning Specifications Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Warning Specifications</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">Yellow Alert Level:</span>
            <span>{nodeData.yellow_alert || "N/A"} ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Orange Alert Level:</span>
            <span>{nodeData.orange_alert || "N/A"} ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Red Alert Level:</span>
            <span>{nodeData.red_alert || "N/A"} ft</span>
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
              {nodeData.latestPrediction?.predictedWaterLevel !== undefined
                ? `${nodeData.latestPrediction.predictedWaterLevel.toFixed(3)} ft`
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Prediction Timestamp:</span>
            <span>
              {nodeData.latestPrediction
                ? formatDateTime(nodeData.latestPrediction.timestamp)
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOverview;
