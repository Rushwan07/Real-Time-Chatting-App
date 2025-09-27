import React, { useState, useRef, useLayoutEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import MoodIcon from "@mui/icons-material/Mood";

const MessegeArea = ({ Id, setId }) => {
  const [SenderM, setSenderM] = useState([
    { messege: "Hello", messenger: "sender" },
    { messege: "Hi!", messenger: "receiver" },
  ]);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
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
            src="https://images.pexels.com/photos/10412892/pexels-photo-10412892.jpeg"
            alt="profile"
          />
        </div>
        <h1 className="text-[1.4rem]">Jack</h1>
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
            }`}
          >
            <p
              className={`border p-2 rounded-lg max-w-[70%] ${
                messege.messenger === "sender"
                  ? "bg-gray-200"
                  : "bg-blue-500 text-white"
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
