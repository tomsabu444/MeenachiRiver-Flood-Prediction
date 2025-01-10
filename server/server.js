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

app.get("/", (req, res) => {
    res.send("<h1> MRRM || MainProject Final Year </h1>");
  });
  
  app.listen(port, () =>
    console.log(`Server is running on port  http://localhost:${port}`)
  );

