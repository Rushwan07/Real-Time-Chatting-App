const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");

const userRouter = require("./src/routes/userRoutes");
const messageRouter = require("./src/routes/messageRoutes");
const friendshipRouter = require("./src/routes/friendRoutes");


const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://real-time-chatting-app-eta.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
// app.use(cookieParser());

cron.schedule("0 9 * * *", () => {
  sendGmail();
});


app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/friends", friendshipRouter);


app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
