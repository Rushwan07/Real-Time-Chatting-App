import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import MoodIcon from "@mui/icons-material/Mood";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { motion } from "motion/react";
import { setUser } from "../features/Auth/userSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";

const socket = io("https://real-time-chatting-app-backend.onrender.com");
const MessegeArea = ({ Id, setId, setFriends }) => {
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Typing states
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState(null);
  const typingTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const senderId = user?._id; // logged in user
  const receiverId = Id;

  console.log("token", token);
  // 🔹 Register user & listen for messages
  useEffect(() => {
    if (user?._id) {
      socket.emit("registerUser", user._id);
    }

    // --- Listen for realtime events ---
    socket.on("receiveMessage", (msg) => {
      console.log("msg", msg);
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
      setLoading(true);
      try {
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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (Id) fetchData();
  }, [Id]);

  const handleTyping = () => {
    socket.emit("startTyping", { senderId, receiverId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { senderId, receiverId });
    }, 700);
  };

  // 🔹 Receive typing events
  useEffect(() => {
    socket.on("userTyping", ({ senderId: typingId }) => {
      setTypingUserId(typingId);
      setIsTyping(true);
    });

    socket.on("userStoppedTyping", ({ senderId: typingId }) => {
      if (typingUserId === typingId) setIsTyping(false);
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [typingUserId]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!text.trim()) return;

    const msg = {
      senderId: user._id,
      receiverId: Id,
      message: text,
      status: "sent",
    };

    if (isOnline) {
      setMessages((prev) => [...prev, { ...msg, sender: user._id }]);
      socket.emit("sendMessage", msg);
    } else {
      socket.emit("sendMessage", msg);
    }

    setText("");
  };

  // 🔹 Mark as seen
  useEffect(() => {
    if (Id) socket.emit("markAsSeen", { senderId: Id, receiverId: user._id });
  }, [Id]);

  // 🔹 Emoji handler
  const handleEmojiClick = (emojiData) =>
    setText((prev) => prev + emojiData.emoji);

  const HandleRemove = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/friends/remove/${Id}`, {
        headers: { token },
      });
      console.log(res?.data);
      dispatch(
        setUser({
          user: {
            ...user,
            friends: user.friends.filter((f) => f._id !== Id),
          },
          token,
        })
      );

      setId(null);
      setFriends((prev) => prev.filter((f) => f._id !== friend._id));
    } catch (err) {
      console.log(err?.response?.data || err?.message);
    }
  };

  // useEffect(() => {
  //   if (showPicker) {
  //     setTimeout(() => {
  //       document.activeElement?.blur();
  //     }, 0);
  //   }
  // }, [showPicker]);

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <Loader s={3} />
      </div>
    );
  } else if (friend.length == 0) {
    return (
      <div>
        <div className="flex justify-between items-center gap-3 p-3 border-b-2 shadow-sm">
          <div className="flex items-center gap-3">
            <Link to={"/"}>
              <div className="cursor-pointer" onClick={() => setId(null)}>
                <ArrowBackIosIcon sx={{ color: "#08CB00" }} />
              </div>
            </Link>
          </div>
        </div>
        <div className="">
          <h1 className="h-[100vh] flex items-center justify-center text-[2rem] font-bold text-[#08CB00]">
            No longer firends!!
          </h1>{" "}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-white">
      {/* Header */}
      <div
        onClick={() => {
          setShowPicker(false);
        }}
        className="flex fixed top-0 w-full lg:w-[69%] bg-white justify-between items-center gap-3 p-3 border-b-2 shadow-sm"
      >
        <div className="flex items-center gap-3">
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
            {isTyping && typingUserId === Id ? (
              <motion.div
                className="flex items-center gap-1 ml-1 h-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Dot 1 */}
                <motion.span
                  className="w-2 h-2 bg-gray-500 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0,
                  }}
                />

                {/* Dot 2 */}
                <motion.span
                  className="w-2 h-2 bg-gray-500 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.15,
                  }}
                />

                {/* Dot 3 */}
                <motion.span
                  className="w-2 h-2 bg-gray-500 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
              </motion.div>
            ) : (
              isOnline && (
                <p className="text-[0.8rem] text-green-500 font-medium">
                  Online
                </p>
              )
            )}
          </div>
        </div>
        <Link to={"/"}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-[#FF0000] text-white p-1 py-1 font-bold rounded"
            onClick={() => HandleRemove()}
          >
            Remove
          </motion.button>
        </Link>
      </div>
      {/* Messege area */}
      <div
        onClick={() => {
          setShowPicker(false);
        }}
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 mb-[70px] mt-[70px]"
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
                className={`flex flex-col cursor-pointer max-w-[85%] sm:max-w-[70%] md:max-w-[60%] ${
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
      {/* <div className="fixed bottom-0 left-0 right-0 border-t-2 p-3 flex items-center gap-2 bg-white"> */}

      <div className="fixed bottom-0 w-full lg:w-[69%] bg-white border-t-2 p-3 flex items-center gap-2">
        <button
          type="button"
          className="text-2xl"
          onClick={() => {
            setShowPicker((prev) => !prev);
          }}
        >
          <MoodIcon fontSize="large" />
        </button>

        {showPicker && (
          <div
            onClick={document.activeElement?.blur()}
            className="absolute bottom-16 left-2 z-50"
          >
            <EmojiPicker searchDisabled onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <textarea
          className="flex-1 border rounded-xl px-3 py-2 focus:outline-none resize-none"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
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
