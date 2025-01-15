import React from "react";

const Sidebar = () => {
  const dams = [
    { name: "Pala", percentage: "100.02%", alert: "ALERT", color: "red-badge" },
    { name: "Kidangoor", percentage: "90.65%", alert: "ALERT", color: "orange-badge" },
    { name: "Poonjar", percentage: "88.95%", alert: "ALERT", color: "orange-badge" },
    { name: "Erattupetta", percentage: "87.22%", alert: "ALERT", color: "blue-badge" },
  ];

  return (
    <div id="sidebar" className="w-full md:w-80 bg-gray-900 text-white p-4 md:max-h-screen">
      <h1 className="text-xl font-bold text-center text-gradient-to-r from-blue-400 to-purple-600 mb-4">
        Locations
      </h1>
      <button
        id="sortButton"
        className="w-full py-2 mb-4 text-black bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
      >
        Sort by Storage Percentage
      </button>
      <div id="damList" className="space-y-4">
        {dams.map((dam, index) => (
          <div key={index} className="dam-item bg-gray-800 rounded-lg p-4 shadow-md transition hover:shadow-lg">
            <div className="relative flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{dam.name}</h3>
                <p className="text-sm text-gray-400">{dam.percentage}</p>
              </div>
              <div className={`absolute top-0 right-0 ${dam.color}`}>
                <span className="text-xs font-bold py-1 px-3 rounded-full text-white">{dam.alert}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
