const express = require("express");
const cros = require("cors");
const connectDB = require("./config/databaseConnect");
const NodeAuthenticate = require("./middleware/NodeAuthenticate");
require("dotenv").config();
const fetchAndStoreData = require(".//utils/hourlyfetch_kidangoorData");
const cron = require("node-cron");

const app = express();
const port = process.env.PORT;

app.use(cros());
app.use(express.json());

connectDB(); //! Initialize MongoDB connection

//! Routes for declared endpoints
app.use("/", require("./routes/health")); //? Test route to check if the server is running
app.use("/v1/node-data/add",NodeAuthenticate, require("./routes/nodeEndpoint")); //? Route to receive data from IoT nodes
app.use("/v1/node-metadata", require("./routes/nodeMetadataRoutes")); //? Route to get node metadata
app.use("/v1/water-level", require("./routes/getWaterlevel")); //? Route to get water level data

// Schedule the hourly task
cron.schedule("0 * * * *", async () => {
  console.log(`[${new Date().toISOString()}] Running hourly data fetch cycle...`);
  await fetchAndStoreData();
});
// Run immediately on start
fetchAndStoreData();

app.listen(port, () =>
    console.log(`Server is running on port  http://localhost:${port}`)
  );

