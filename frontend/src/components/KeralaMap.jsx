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

    const dams = [
      // { name: "Dam 1", latitude: 9.85, longitude: 77.05, storagePercentage: 60 },
      // { name: "Dam 2", latitude: 10.15, longitude: 76.95, storagePercentage: 80 },
    ];

    const markers = L.layerGroup().addTo(map);

    dams.forEach((dam) => {
      const marker = L.marker([dam.latitude, dam.longitude], {
        icon: L.divIcon({
          className: "water-level-icon",
          html: `
            <div class="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-end justify-center">
              <div class="w-full bg-blue-500 rounded-b-md" style="height: ${dam.storagePercentage}%;"></div>
            </div>
          `,
        }),
      }).on("click", () => alert(`Clicked on ${dam.name}`));

      markers.addLayer(marker);
    });

    const getWaterLevelColor = (percentage) => {
      if (percentage < 20) return "bg-green-200";
      if (percentage < 40) return "bg-green-400";
      if (percentage < 60) return "bg-yellow-400";
      if (percentage < 80) return "bg-orange-400";
      return "bg-red-500";
    };

    const legend = L.control({ position: "topright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend p-4 bg-white shadow-md rounded-md text-sm");
      div.innerHTML = `
        <h4 class="font-bold text-gray-700 mb-2">Water Level Scale</h4>
        <div class="space-y-1">
          <div class="flex items-center"><span class="block w-4 h-4 bg-green-200 border border-gray-300 mr-2"></span> 0-20%</div>
          <div class="flex items-center"><span class="block w-4 h-4 bg-green-400 border border-gray-300 mr-2"></span> 21-40%</div>
          <div class="flex items-center"><span class="block w-4 h-4 bg-yellow-400 border border-gray-300 mr-2"></span> 41-60%</div>
          <div class="flex items-center"><span class="block w-4 h-4 bg-orange-400 border border-gray-300 mr-2"></span> 61-80%</div>
          <div class="flex items-center"><span class="block w-4 h-4 bg-red-500 border border-gray-300 mr-2"></span> 81-100%</div>
        </div>
      `;
      return div;
    };
    legend.addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" className="h-full w-full shadow-md"></div>;
};

export default KeralaMap;
