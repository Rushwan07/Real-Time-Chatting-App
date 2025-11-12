const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./src/models/messageModel"); // ✅ import Message model
const User = require("./src/models/userModel"); // optional if you want to validate users
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
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🧠 Optional: Keep a map of online users
const onlineUsers = new Map();

// -----------------------
// ⚡ 4️⃣ Socket.io Logic
// -----------------------
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Register connected user
  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`👤 User ${userId} is online`);
  });

  // Handle sending a message
  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;
      console.log("📩 Message received:", data);

      // ✅ Save message in MongoDB
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message,
      });

      console.log("💾 Message saved:", newMessage);

      // ✅ Emit to receiver if online
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", newMessage);
      }
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
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
