const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./src/models/messageModel");
const User = require("./src/models/userModel"); // optional
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

// 🧠 Track online users
const onlineUsers = new Map();

// -----------------------
// ⚡ 4️⃣ Socket.io Logic
// -----------------------
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // ✅ Register user when they come online
  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("userOnline", { userId });
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("userOffline", { userId });
        break;
      }
    }
  });

  socket.on("checkOnlineStatus", ({ userId }) => {
    const list = Array.from(onlineUsers.keys());
    socket.emit("onlineUsersList", list);
  });


  // ✅ Handle sending a message
  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      const receiverOnline = onlineUsers.has(receiverId);
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message,
        status: receiverOnline ? "seen" : "sent",
      });

      const receiverSocket = onlineUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", newMessage);
        io.to(socket.id).emit("messagesSeen", { receiverId });
      } else {
        io.to(socket.id).emit("messageSent", newMessage);
      }
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });


  // ✅ Mark messages as seen
  socket.on("markAsSeen", async ({ senderId, receiverId }) => {
    try {
      if (!senderId || !receiverId) return;

      await Message.updateMany(
        { sender: senderId, receiver: receiverId, status: { $ne: "seen" } },
        { $set: { status: "seen" } }
      );

      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", { receiverId });
      }

      console.log(`👁️ Seen: ${senderId} → ${receiverId}`);
    } catch (err) {
      console.error("❌ Error marking messages as seen:", err);
    }
  });

  // ✅ Typing Indicator Events
  socket.on("startTyping", ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("userTyping", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("userStoppedTyping", { senderId });
    }
  });

  // ✅ Handle user disconnect
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
  server.close(() => process.exit(1));
});
