import React from "react";
import Navbar from "../../components/mobile/navbar";
import Chats from "../../components/mobile/Chats";
const Mobile = () => {
  return (
    <div>
      <div>
        <div className="bg-white fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        <div className="mt-[120px]">
          <Chats />
        </div>
      </div>
    </div>
  );
};

export default Mobile;
