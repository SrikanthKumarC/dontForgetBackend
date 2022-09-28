const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to db"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
});

app.use(
  cors({
    origin: "http://localhost:4000",
  })
);
app.use(express.json());

const subscriberRouter = require("./routes/subscribers.js");
app.use("/subscribers", subscriberRouter);

app.listen(3000, () => {
  console.log("server started " + new Date().toString());
});
