const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

const app = require("./app");

// -----------------------
// 🧠 1️⃣ Connect to MongoDB
// -----------------------
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB)
  .then(() => console.log("✅ DB connection successful!"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// -----------------------
// ⚙️ 2️⃣ Create HTTP server
// -----------------------
const server = http.createServer(app);

// -----------------------
// 💬 3️⃣ Initialize Socket.io
// -----------------------
const io = new Server(server, {
  cors: {
    origin: "*", // you can later restrict this to your frontend origin
    methods: ["GET", "POST"],
  },
});

// -----------------------
// ⚡ 4️⃣ Socket.io Logic
// -----------------------
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Listen for user registration (when frontend connects)
  socket.on("registerUser", (userId) => {
    console.log(`👤 User ${userId} connected with socket ${socket.id}`);
    // Later: Save socketId in DB to send messages directly to this user
  });

  // Listen for chat messages
  socket.on("sendMessage", (data) => {
    console.log("📩 Message received:", data);
    // Example data: { senderId, receiverId, message }

    // Send message to receiver
    io.to(data.receiverId).emit("receiveMessage", data);
  });

  // When user disconnects
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// -----------------------
// 🚀 5️⃣ Start the Server
// -----------------------
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`);
});

// -----------------------
// 💣 6️⃣ Handle Unhandled Rejections
// -----------------------
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
