import React from "react";
import { Link } from "react-router-dom";
import { Cat } from "lucide-react"; // lightweight cat icon from lucide-react
import { useSelector } from "react-redux";

const Chats = ({ friends }) => {
  const { user, token } = useSelector((state) => state?.user?.user || {});

  if (!friends || friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500">
        <Cat size={100} className="text-[#08CB00] mb-4" />
        <h2 className="text-2xl font-semibold">Let's search and be friends!</h2>
        <p className="text-sm mt-2">Start connecting with new people 🐾</p>
      </div>
    );
  }

  return (
    <div>
      {friends.map((friend, index) => {
        const isAlreadyFriend = user?.friends?.some((f) => f === friend._id);

        return (
          <div
            key={friend._id || index}
            className="chat w-full p-3 flex justify-between items-center cursor-pointer mt-2 hover:bg-gray-100 rounded-xl transition"
          >
            <div className="flex gap-2 w-[80%] items-center">
              <div className="w-[70px] h-[70px] rounded-[50px] overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={friend.image || "/default-avatar.png"}
                  alt="profile"
                />
              </div>

              <div className="flex flex-col">
                <h4 className="text-[1.4rem] font-semibold">
                  {friend.username}
                </h4>
                {isAlreadyFriend && (
                  <h5 className="truncate w-[170px] md:w-[65vw] lg:w-[170px] text-gray-600">
                    Lorem ipsum dolor sit amet.
                  </h5>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center w-[20%] gap-1">
              {isAlreadyFriend ? (
                <div className="text-center w-[20%] flex justify-center items-center flex-wrap">
                  {/* <h4 className="text-[#08CB00] w-full">8:13pm</h4>
                  <h4 className="text-[#08CB00] font-bold rounded-[50px] w-full">
                    6
                  </h4> */}
                </div>
              ) : (
                <button
                  onClick={() => console.log("Send Friend Request", friend)}
                  className="bg-[#08CB00] text-[1.2rem] font-bold text-white px-4 py-1 rounded text-sm hover:bg-green-600 transition"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
