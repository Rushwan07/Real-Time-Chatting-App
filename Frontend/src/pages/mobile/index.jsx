import React from "react";
import Navbar from "../../components/mobile/navbar";
import Chats from "../../components/mobile/Chats";
import Profile from "../../components/Profile";
const Mobile = ({ closeProfile, profileStatus }) => {
  return (
    <div>
      <div>
        <div className="bg-white fixed top-0 left-0 w-full z-50">
          <Navbar closeProfile={closeProfile} />
        </div>

        <div className="mt-[125px]">
          {profileStatus ? (
            <Profile
              closeProfile={closeProfile}
              profileStatus={profileStatus}
            />
          ) : (
            <Chats />
          )}
        </div>
      </div>
    </div>
  );
};

export default Mobile;
