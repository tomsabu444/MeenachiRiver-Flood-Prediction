import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useApiCalls from "../hooks/useApiCalls";

const Sidebar = () => {
  const { fetchNodeMetaData, loading } = useApiCalls();
  const [nodeMetadata, setNodeMetadata] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();

  const getBadgeStyle = (level, yellowAlert, orangeAlert, redAlert) => {
    if (level < yellowAlert) {
      return "bg-green-500 text-white";
    } else if (level < orangeAlert) {
      return "bg-yellow-400 text-black";
    } else if (level < redAlert) {
      return "bg-orange-500 text-white";
    }
    return "bg-red-500 text-white";
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await fetchNodeMetaData();
        if (!isMounted) return;

        if (data.success) {
          const formattedData = data.data.map((node) => ({
            name: node.locationName,
            waterLevel: `${node.latest_water_level.toFixed(2)} ft`,
            badgeClass: getBadgeStyle(
              node.latest_water_level,
              node.yellow_alert,
              node.orange_alert,
              node.red_alert
            ),
            nodeId: node.nodeId, 
          }));
          setNodeMetadata(formattedData);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (err) {
        if (isMounted) {
          setError("An error occurred while fetching data.");
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchNodeMetaData]);

  if (loading) {
    return (
      <div className="w-full md:w-80 bg-gray-900 p-4">
        <div className="text-white animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-80 bg-gray-900 p-4">
        <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <aside className="w-full md:w-80 bg-gray-900 text-white p-4 md:max-h-screen font-roboto overflow-y-auto">
      <h1 className="text-xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
        Locations
      </h1>
      <nav className="space-y-4">
        {nodeMetadata.map((node) => {
          const path = `/${node.nodeId}`;
          const isActive = location.pathname === path;
          
          return (
            <Link
              to={path}
              key={node.nodeId}
              className={`block transition duration-200 ${
                isActive ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="node-item bg-gray-800 rounded-lg p-4 shadow-md hover:bg-gray-700 transition-all duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {node.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Water Level: {node.waterLevel}
                    </p>
                  </div>
                  <div
                    className={`text-xs font-bold py-1 px-2 rounded-full min-w-[60px] text-center ${node.badgeClass}`}
                  >
                    {/* ALERT */}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;