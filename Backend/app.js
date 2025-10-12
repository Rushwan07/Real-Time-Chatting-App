const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");

const app = express();
let weekCounter = 0;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
// app.use(cookieParser());

cron.schedule("0 9 * * *", () => {
  sendGmail();
});


app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
