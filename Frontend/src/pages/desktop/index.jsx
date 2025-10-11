import React, { useState } from "react";
import Navbar from "../../components/mobile/navbar";
import MessegeArea from "../../components/MessegeArea";
import DesktopChats from "../../components/desktop/DesktopChats";
import Profile from "../../components/Profile";

const Desktop = ({ Id, setId, profileStatus, closeProfile }) => {
  console.log("idState", Id);
  return (
    <div className="flex gap-2 ">
      <div className="w-[30%] h-[100vh] overflow-hidden border-r-2">
        <div className="bg-white fixed top-0 left-0 w-[30%]  z-50 border-r-2">
          {" "}
          <Navbar closeProfile={closeProfile} />
        </div>

        <div className="mt-[125px] ">
          <DesktopChats
            setId={setId}
            profileStatus={profileStatus}
            closeProfile={closeProfile}
          />
        </div>
      </div>
      <div className="fixed top-0 left-[30%] z-50 w-[70%] ">
        {profileStatus ? (
          <Profile profileStatus={profileStatus} closeProfile={closeProfile} />
        ) : Id !== null && Id !== undefined ? (
          <MessegeArea Id={Id} setId={setId} />
        ) : (
          <h1 className="h-[100vh] flex items-center justify-center text-[2rem] font-bold text-[#08CB00]">
            Let's Chat
          </h1>
        )}
      </div>
    </div>
  );
};

export default Desktop;
