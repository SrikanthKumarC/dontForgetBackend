const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to db"));

app.use(cors());
app.use(express.json());

const subscriberRouter = require("./routes/subscribers.js");
app.use("/subscribers", subscriberRouter);

app.listen(3000, () => {
  console.log("server started " + new Date().toString());
});
