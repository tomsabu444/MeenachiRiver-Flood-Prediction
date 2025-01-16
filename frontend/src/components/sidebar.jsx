import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_BASE_URL } from "../config/Backend_URL";

const Sidebar = () => {
  const [nodeMetadata, setNodeMetadata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to determine the badge color based on thresholds
  const getBadgeStyle = (level, yellowAlert, orangeAlert, redAlert) => {
    if (level < yellowAlert) {
      return { backgroundColor: "green", color: "white" }; // Safe level
    } else if (level < orangeAlert) {
      return { backgroundColor: "yellow", color: "black" }; // Yellow alert
    } else if (level < redAlert) {
      return { backgroundColor: "orange", color: "white" }; // Orange alert
    } else {
      return { backgroundColor: "red", color: "white" }; // Red alert
    }
  };

  useEffect(() => {
    const fetchNodeMetadata = async () => {
      try {
        const response = await axios.get(`${SERVER_BASE_URL}/v1/node-metadata`);
        if (response.data.success) {
          const formattedData = response.data.data.map((node) => {
            const badgeStyle = getBadgeStyle(
              node.latest_water_level,
              node.yellow_alert,
              node.orange_alert,
              node.red_alert
            );
            return {
              name: node.locationName,
              waterLevel: `${node.latest_water_level.toFixed(2)} ft`,
              badgeStyle,
            };
          });
          setNodeMetadata(formattedData);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchNodeMetadata();
  }, []);

  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div id="sidebar" className="w-full md:w-80 bg-gray-900 text-white p-4 md:max-h-screen font-roboto">
      <h1 className="text-xl font-bold text-center text-gradient-to-r from-blue-400 to-purple-600 mb-4">
        Locations
      </h1>
      <div id="nodeList" className="space-y-4">
        {nodeMetadata.map((node, index) => (
          <div key={index} className="node-item bg-gray-800 rounded-lg p-4 shadow-md transition hover:shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{node.name}</h3>
                <p className="text-sm text-gray-400">Water Level: {node.waterLevel}</p>
              </div>
              <div
                className="text-xs font-bold py-1 px-3 rounded-full"
                style={{
                  ...node.badgeStyle,
                  display: "inline-block",
                  textAlign: "center",
                  minWidth: "60px",
                }}
              >
                ALERT
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
