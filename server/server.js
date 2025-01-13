const express = require("express");
const mongoose = require("mongoose");
const cros = require("cors");
const connectDB = require("./config/databaseConnect");
require("dotenv").config();


const app = express();
const port = process.env.PORT;

app.use(cros());
app.use(express.json());

connectDB(); //! Initialize MongoDB connection

//! Routes for declared endpoints
app.use("/", require("./routes/health")); //? Test route to check if the server is running
app.use("/floodData", require("./routes/floodDataRoute")); //? Route to fetch flood data dynamically based on collection name

  app.listen(port, () =>
    console.log(`Server is running on port  http://localhost:${port}`)
  );

