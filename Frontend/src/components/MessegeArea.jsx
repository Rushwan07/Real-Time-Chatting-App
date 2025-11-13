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
  const [isOnline, setIsOnline] = useState(false); // ✅ new state for online status
  const chatRef = useRef(null);

  // 🔹 Register user & listen for messages
  useEffect(() => {
    if (user?._id) {
      socket.emit("registerUser", user._id);
    }

    // --- Listen for realtime events ---
    socket.on("receiveMessage", (msg) => {
      if (msg.sender === Id) setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageSent", (msg) => {
      if (msg.receiver === Id || msg.receiver?._id === Id)
        setMessages((prev) => [...prev, msg]);
    });

    socket.on("messagesSeen", ({ receiverId }) => {
      if (receiverId === Id)
        setMessages((prev) => prev.map((m) => ({ ...m, status: "seen" })));
    });

    // ✅ Online / Offline listeners
    socket.on("userOnline", ({ userId }) => {
      if (userId === Id) setIsOnline(true);
    });
    socket.on("userOffline", ({ userId }) => {
      if (userId === Id) setIsOnline(false);
    });

    // ✅ Check who’s online when entering chat
    socket.emit("checkOnlineStatus", { userId: Id });
    socket.on("onlineUsersList", (list) => {
      if (list.includes(Id)) setIsOnline(true);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSent");
      socket.off("messagesSeen");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("onlineUsersList");
    };
  }, [user, Id]);

  // 🔹 Scroll to bottom when new message
  useLayoutEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
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
      status: "sent",
    };

    setMessages((prev) => [...prev, { ...msg, sender: user._id }]);
    socket.emit("sendMessage", msg);
    setText("");
  };

  // 🔹 Mark as seen
  useEffect(() => {
    if (Id) socket.emit("markAsSeen", { senderId: Id, receiverId: user._id });
  }, [Id]);

  // 🔹 Emoji handler
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

        {/* ✅ Username + Online status */}
        <div>
          <h1 className="text-[1.2rem] font-semibold">{friend?.username}</h1>
          {isOnline && (
            <p className="text-[0.8rem] text-green-500 font-medium">Online</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
      >
        {messages.map((msg, i) => {
          const isSender =
            msg?.sender?._id === user._id || msg?.sender === user._id;
          const isSeen = msg.status === "seen";
          const isSent = msg.status === "sent" || msg.status === "delivered";

          return (
            <div
              key={i}
              className={`flex w-full ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col max-w-[85%] sm:max-w-[70%] md:max-w-[60%] ${
                  isSender ? "items-end" : "items-start"
                }`}
              >
                <p
                  className={`p-3 rounded-2xl text-sm shadow-md leading-relaxed whitespace-pre-wrap break-words 
              ${
                isSender
                  ? isSeen
                    ? "bg-white border border-blue-300 text-gray-800 rounded-br-none"
                    : "bg-blue-100 text-gray-800 rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {msg.message}
                </p>

                {/* ✅ Only show Sent/Delivered (not Seen) */}
                {isSender && isSent && (
                  <p className="text-[0.7rem] text-gray-500 mt-1">
                    {msg.status === "delivered" ? "📨 Delivered" : "🕓 Sent"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
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
