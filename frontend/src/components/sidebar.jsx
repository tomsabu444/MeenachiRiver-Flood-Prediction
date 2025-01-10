import React from "react";
import { List, ListItem } from "@mui/material";

const Sidebar = () => {
  const dams = [
    { name: "Pala", percentage: "100.02%", alert: "ALERT", color: "bg-red-500" },
    { name: "Kidangoor", percentage: "90.65%", alert: "ALERT", color: "bg-orange-500" },
    { name: "Poonjar", percentage: "88.95%", alert: "ALERT", color: "bg-orange-500" },
    { name: "Erattupetta", percentage: "87.22%", alert: "ALERT", color: "bg-blue-500" },
  ];

  return (
    <div className="w-72 h-screen bg-black text-white flex flex-col p-4">
      <h1 className="text-2xl font-extrabold text-center mb-6 text-gradient-to-r from-blue-400 to-purple-600">
        Locations
      </h1>

      <List>
        {dams.map((dam, index) => (
          <div key={index} className="mb-4">
            <ListItem
              className="bg-white rounded-lg shadow-md flex justify-between items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              style={{ padding: "10px 16px" }}
            >
              <div className="flex-1">
                <h2 className="font-semibold text-black">{dam.name}</h2>
                <p className="text-gray-500 text-sm">{dam.percentage}</p>
              </div>
              <div className="ml-auto">
                <span
                  className={`text-xs text-white font-bold py-1 px-3 rounded-full ${dam.color}`}
                >
                  {dam.alert}
                </span>
              </div>
            </ListItem>
          </div>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
