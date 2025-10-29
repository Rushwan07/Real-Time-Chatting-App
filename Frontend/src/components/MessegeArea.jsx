import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import MoodIcon from "@mui/icons-material/Mood";
import axios from "axios";
import { useSelector } from "react-redux";

const MessegeArea = ({ Id, setId }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { user, token } = useSelector((state) => {
    const user = state?.user?.user;
    return user;
  });
  const [SenderM, setSenderM] = useState([
    {
      messege: "Hello??",
      messenger: "sender",
    },
    {
      messege:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores eum perspiciatis commodi sint aliquid dicta magnam pariatur et ipsa voluptate ea, qui sit consectetur explicabo nam tempora esse reiciendis blanditiis?",
      messenger: "receiver",
    },
  ]);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [friend, setFriend] = useState([]);
  const [error, setError] = useState(null);

  const chatRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  useLayoutEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [SenderM]);

  const handleSubmit = () => {
    if (text.trim().length > 0) {
      setSenderM((prev) => [...prev, { messege: text, messenger: "receiver" }]);
      setText("");
    }
  };

  useEffect(
    () => {
      const fetchFriends = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/users/getuser/${Id}`, {
            headers: { token },
          });
          setFriend(res.data?.data?.user || []);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
        } finally {
        }
      };

      fetchFriends();
    },
    { Id }
  );

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b-2">
        <Link to={"/"}>
          <div
            className="cursor-pointer"
            onClick={() => {
              setId(null);
            }}
          >
            <ArrowBackIosIcon sx={{ color: "#08CB00" }} />
          </div>
        </Link>
        <div className="w-[70px] h-[70px] rounded-[50px] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={friend?.image}
            alt="profile"
          />
        </div>
        <h1 className="text-[1.4rem]">{friend?.username}</h1>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="Messeges p-3 h-[75vh] overflow-y-auto flex flex-col gap-2"
      >
        {SenderM.map((messege, index) => (
          <div
            key={index}
            className={`flex ${
              messege.messenger === "sender" ? "justify-start" : "justify-end"
            } mb-2`}
          >
            <p
              className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[70%] break-words 
             shadow-md transition-all duration-200
             ${
               messege.messenger === "sender"
                 ? "bg-gray-100 text-gray-900" // sender bubble (light gray)
                 : "bg-white text-gray-900 border border-gray-200" // receiver bubble (white)
             }`}
            >
              {messege.messege}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="footer border-2 p-2 flex items-center fixed bottom-0 w-screen lg:w-[70%] bg-white">
        <div className="border-2 rounded-full p-2 flex items-center w-full relative">
          <button
            type="button"
            className="ml-2 text-2xl"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <MoodIcon fontSize="large" />
          </button>

          {showPicker && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <textarea
            className="focus:outline-none w-[90%] px-2 py-1 rounded-lg resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="1"
            placeholder="Type a message..."
          ></textarea>

          <div className="">
            <SendIcon
              className="cursor-pointer"
              onClick={handleSubmit}
              sx={{ color: "#08CB00" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessegeArea;
