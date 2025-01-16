import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { SERVER_BASE_URL } from "../config/Backend_URL";

const KeralaMap = () => {
  const [waterLevelPoints, setWaterLevelPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_BASE_URL}/v1/node-metadata`);
        if (response.data.success) {
          const points = response.data.data.map((node) => ({
            name: node.locationName,
            latitude: node.latitude,
            longitude: node.longitude,
            waterLevel: node.latest_water_level,
            yellow_alert: node.yellow_alert,
            orange_alert: node.orange_alert,
            red_alert: node.red_alert,
          }));
          setWaterLevelPoints(points);
        } else {
          setError("Failed to fetch water level data.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading || error) return;

    // Map bounds for Kerala
    const keralaBounds = L.latLngBounds([8.2878, 74.8559], [12.8183, 80.4122]);

    // Initialize the map
    const map = L.map("map", {
      center: [9.708965, 76.690926],
      zoom: 12,
      minZoom: 8,
      maxBounds: keralaBounds,
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markers = L.layerGroup().addTo(map);

    // Helper function to get warning color dynamically
    const getWarningColor = (level, yellowAlert, orangeAlert, redAlert) => {
      if (level < yellowAlert) return "green";
      if (level < orangeAlert) return "yellow";
      if (level < redAlert) return "orange";
      return "red";
    };

    // Add circular markers with data points
    waterLevelPoints.forEach((point) => {
      const color = getWarningColor(
        point.waterLevel,
        point.yellow_alert,
        point.orange_alert,
        point.red_alert
      );

      const marker = L.circleMarker([point.latitude, point.longitude], {
        radius: 15,
        color: "black",
        weight: 1,
        fillColor: color,
        fillOpacity: 0.8,
      }).addTo(map);

      // Add text inside the circle marker
      const iconHtml = `
        <div style="position: relative; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; background-color: ${color}; border-radius: 50%; font-size: 12px; color: white; font-weight: bold;">
          ${point.waterLevel}
        </div>
      `;
      const textIcon = L.divIcon({
        className: "",
        html: iconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([point.latitude, point.longitude], { icon: textIcon }).addTo(markers);

      // Add a click event to display more details about the location
      marker.on("click", () => {
        alert(`Station: ${point.name}\nWater Level: ${point.waterLevel} ft`);
      });
    });

    // Add a legend for water level warnings
    const legend = L.control({ position: "topright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend p-4 bg-white shadow-md rounded-md text-sm");
      div.innerHTML = `
        <h4 class="font-bold text-gray-700 mb-2">Water Level Warnings</h4>
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
  }, [loading, error, waterLevelPoints]);

  if (loading) return <div className="text-center p-4">Loading map...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return <div id="map" className="h-full w-full shadow-md"></div>;
};

export default KeralaMap;
