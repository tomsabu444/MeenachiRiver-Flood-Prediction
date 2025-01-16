import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const KeralaMap = () => {
  useEffect(() => {
    const keralaBounds = L.latLngBounds([8.2878, 74.8559], [12.8183, 80.4122]);
    const map = L.map("map", {
      center: [9.708965, 76.690926],
      zoom: 12,
      minZoom: 7,
      maxBounds: keralaBounds,
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Water Level Monitoring Points
    const waterLevelPoints = [
      { name: "Station 1", latitude: 9.85, longitude: 77.05, waterLevel: 15 },
      { name: "Station 2", latitude: 9.675, longitude: 76.60278, waterLevel: 10 },
      { name: "Station 3", latitude: 9.672320, longitude:  76.800154, waterLevel: 90 },
    ];

    const markers = L.layerGroup().addTo(map);

    // Helper function to get color based on water level
    const getWarningColor = (level) => {
      if (level <= 20) return "green";
      if (level <= 40) return "darkgreen";
      if (level <= 60) return "yellow";
      if (level <= 80) return "orange";
      return "red";
    };

    // Add circular markers with water level displayed
    waterLevelPoints.forEach((point) => {
      const marker = L.circleMarker([point.latitude, point.longitude], {
        radius: 15,
        color: "black",
        weight: 1,
        fillColor: getWarningColor(point.waterLevel),
        fillOpacity: 0.8,
      }).addTo(map);

      // Add text inside the circle
      const iconHtml = `
        <div style="position: relative; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; background-color: ${getWarningColor(
          point.waterLevel
        )}; border-radius: 50%; font-size: 12px; color: white; font-weight: bold;">
          ${point.waterLevel}%
        </div>
      `;
      const textIcon = L.divIcon({
        className: "",
        html: iconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([point.latitude, point.longitude], { icon: textIcon }).addTo(markers);

      // Add a click event to display more information
      marker.on("click", () => {
        alert(`Station: ${point.name}\nWater Level: ${point.waterLevel}%`);
      });
    });

    // Add legend for water level warnings
    const legend = L.control({ position: "topright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend p-4 bg-white shadow-md rounded-md text-sm");
      div.innerHTML = `
        <h4 class="font-bold text-gray-700 mb-2">Water Level Warning</h4>
        <div class="space-y-1">
          <div class="flex items-center"><span class="block w-4 h-4 bg-green-600 border border-gray-300 mr-2"></span> Safe</div>
          <div class="flex items-center"><span class="block w-4 h-4 bg-yellow-400 border border-gray-300 mr-2"></span> Moderate Warning</div>
          <div class="flex items-center"><span class="block w-4 h-4 bg-orange-500 border border-gray-300 mr-2"></span> High Warning</div>
          <div class="flex items-center"><span class="block w-4 h-4 bg-red-500 border border-gray-300 mr-2"></span> Critical HFL</div>
        </div>
      `;
      return div;
    };
    legend.addTo(map);

    // Cleanup map on component unmount
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" className="h-full w-full shadow-md"></div>;
};

export default KeralaMap;
