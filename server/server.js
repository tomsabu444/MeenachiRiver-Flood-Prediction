const express = require("express");
const mongoose = require("mongoose");
const cros = require("cors");
require("dotenv").config();


const app = express();
const port = process.env.PORT;

app.use(cros());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1> MRRM || MainProject Final Year </h1>");
  });
  
  app.listen(port, () =>
    console.log(`Server is running on port  http://localhost:${port}`)
  );

//database connect
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log(err.message));
