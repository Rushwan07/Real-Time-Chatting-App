import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import MoodIcon from "@mui/icons-material/Mood";
import axios from "axios";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URL2);

const MessegeArea = ({ Id, setId }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { user, token } = useSelector(
    (state) => state?.user?.user || { user: null, token: null }
  );
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [friend, setFriend] = useState([]);
  const chatRef = useRef(null);

  // 🔹 Register user and listen for incoming messages
  useEffect(() => {
    if (user?._id) {
      socket.emit("registerUser", user._id);
    }

    // When message is received in real-time
    socket.on("receiveMessage", (msg) => {
      if (msg.sender === Id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Confirmation for sender
    socket.on("messageSent", (msg) => {
      if (msg.receiver === Id || msg.receiver?._id === Id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Update seen messages
    socket.on("messagesSeen", ({ receiverId }) => {
      if (receiverId === Id) {
        setMessages((prev) => prev.map((m) => ({ ...m, status: "seen" })));
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSent");
      socket.off("messagesSeen");
    };
  }, [user, Id]);

  // 🔹 Scroll to bottom when new message
  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // 🔹 Fetch messages + friend data
  useEffect(() => {
    const fetchData = async () => {
      const [friendRes, msgRes] = await Promise.all([
        axios.get(`${BASE_URL}/users/getuser/${Id}`, {
          headers: { token },
        }),
        axios.get(`${BASE_URL}/messages/${user._id}/${Id}`, {
          headers: { token },
        }),
      ]);

      setFriend(friendRes.data?.data?.user);
      setMessages(msgRes.data?.data?.messages || []);
    };
    if (Id) fetchData();
  }, [Id]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!text.trim()) return;

    const msg = {
      senderId: user._id,
      receiverId: Id,
      message: text,
    };

    socket.emit("sendMessage", msg);
    setText("");
  };

  // 🔹 Mark as seen
  useEffect(() => {
    if (Id) {
      socket.emit("markAsSeen", { senderId: Id, receiverId: user._id });
    }
  }, [Id]);

  // 🔹 Handle emoji picker
  const handleEmojiClick = (emojiData) =>
    setText((prev) => prev + emojiData.emoji);

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b-2 shadow-sm">
        <Link to={"/"}>
          <div className="cursor-pointer" onClick={() => setId(null)}>
            <ArrowBackIosIcon sx={{ color: "#08CB00" }} />
          </div>
        </Link>
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={friend?.image}
            alt="profile"
          />
        </div>
        <h1 className="text-[1.2rem] font-semibold">{friend?.username}</h1>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg?.sender?._id === user._id || msg?.sender === user._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div>
              <p
                className={`p-3 rounded-2xl text-sm max-w-[70%] shadow-md ${
                  msg?.sender === user._id || msg?.sender?._id === user._id
                    ? "bg-green-100"
                    : "bg-gray-100"
                }`}
              >
                {msg.message}
              </p>
              {msg.sender === user._id && (
                <p className="text-xs text-gray-500 text-right mt-1">
                  {msg.status === "seen"
                    ? "✅ Seen"
                    : msg.status === "delivered"
                    ? "📨 Delivered"
                    : "🕓 Sent"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t-2 p-3 flex items-center gap-2">
        <button
          type="button"
          className="text-2xl"
          onClick={() => setShowPicker((prev) => !prev)}
        >
          <MoodIcon fontSize="large" />
        </button>

        {showPicker && (
          <div className="absolute bottom-16 left-2 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <textarea
          className="flex-1 border rounded-xl px-3 py-2 focus:outline-none resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="1"
          placeholder="Type a message..."
        ></textarea>

        <SendIcon
          className="cursor-pointer"
          onClick={handleSend}
          sx={{ color: "#08CB00" }}
        />
      </div>
    </div>
  );
};

export default MessegeArea;
