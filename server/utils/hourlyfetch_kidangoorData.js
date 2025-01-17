const axios = require("axios");
const IotNodeData = require("../schema/NodeDataSchema");

// Function to get current and previous dates in YYYY-MM-DD format
const getDates = () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return {
    startDate: yesterday.toISOString().split("T")[0], // Format as YYYY-MM-DD
    endDate: today.toISOString().split("T")[0], // Format as YYYY-MM-DD
  };
};

// Function to fetch data and store it in MongoDB
const fetchAndStoreData = async () => {
  try {
    console.log(`[${new Date().toISOString()}] Fetching data from API...`);

    // Prepare request body
    const { startDate, endDate } = getDates();
    const requestBody = {
      stationCode: "015-SWRDKOCHI", // No change
      startDate,
      endDate,
    };

    // Fetch data from the API
    const response = await axios.post(
      "https://ffs.india-water.gov.in/web-api/getHGStationAllDetailsForFFS",
      requestBody
    );

    console.log(response.data);

    const stations = response.data; // Array of station objects
    const nodeId = "kidangoor-001";

    for (const station of stations) {
      if (station.hhs && Array.isArray(station.hhs)) {
        for (const entry of station.hhs) {
          const utcTime = new Date(entry.actualTime).toISOString();

          // Check if the record already exists
          const exists = await IotNodeData.findOne({ nodeId, timestamp: utcTime });

          if (!exists) {
            // Insert new document if it doesn't exist
            const newDocument = new IotNodeData({
              nodeId,
              waterLevel: entry.value,
              timestamp: utcTime,
            });

            await newDocument.save();
            console.log(`[${new Date().toISOString()}] Added new entry for timestamp: ${utcTime}`);
          } else {
            console.log(`[${new Date().toISOString()}] Entry for timestamp ${utcTime} already exists.`);
          }
        }
      } else {
        console.log(`[${new Date().toISOString()}] No HHS data found for station: ${station.stationCode}`);
      }
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching or processing data:`, error.message);
  }
};

module.exports = fetchAndStoreData;
