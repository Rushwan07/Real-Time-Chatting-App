import React from "react";
import Navbar from "../../components/mobile/navbar";
import Chats from "../../components/mobile/Chats";
import Profile from "../../components/Profile";
const Mobile = ({
  closeProfile,
  profileStatus,
  friends,
  setSearchInput,
  searchInput,
  setOpenFavModal,
}) => {
  return (
    <div>
      <div>
        <div className="bg-white fixed top-0 left-0 w-full z-50">
          <Navbar
            closeProfile={closeProfile}
            setSearchInput={setSearchInput}
            searchInput={searchInput}
            setOpenFavModal={setOpenFavModal}
          />
        </div>

        <div className="mt-[135px]">
          {profileStatus ? (
            <Profile
              closeProfile={closeProfile}
              profileStatus={profileStatus}
            />
          ) : (
            <Chats friends={friends} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Mobile;
