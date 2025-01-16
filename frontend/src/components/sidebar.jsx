import React, { useEffect, useState } from "react";
import useApiCalls from "../hooks/useApiCalls";

const Sidebar = () => {
  const { fetchNodeMetaData, loading } = useApiCalls();
  const [nodeMetadata, setNodeMetadata] = useState([]);
  const [error, setError] = useState(null);

  const getBadgeStyle = (level, yellowAlert, orangeAlert, redAlert) => {
    if (level < yellowAlert) {
      return { backgroundColor: "green", color: "white" };
    } else if (level < orangeAlert) {
      return { backgroundColor: "yellow", color: "black" };
    } else if (level < redAlert) {
      return { backgroundColor: "orange", color: "white" };
    } else {
      return { backgroundColor: "red", color: "white" };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNodeMetaData();
        if (data.success) {
          const formattedData = data.data.map((node) => {
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
      }
    };

    fetchData();
  }, [fetchNodeMetaData]);

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
