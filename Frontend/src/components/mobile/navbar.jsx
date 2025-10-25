import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useSelector } from "react-redux";

const Navbar = ({ closeProfile, searchInput, setSearchInput }) => {
  const { user } = useSelector((state) => state.user?.user);

  return (
    <div className="p-3">
      <div className="nav flex justify-between items-center p-1">
        <div className="">
          <h4 className="text-[2rem] font-bold text-[#08CB00]">ChitChat</h4>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white transition-shadow duration-300">
          <div className="cursor-pointer relative w-fit">
            <FavoriteBorderIcon fontSize="large" sx={{ color: "#334443" }} />
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-[#DD0303] border-2 border-white"></span>
          </div>

          <div
            className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-[#08CB00] cursor-pointer"
            onClick={() => closeProfile(true)}
          >
            <img
              className="w-full h-full object-cover"
              src={user?.image}
              alt="profile"
            />
          </div>
        </div>
      </div>
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <SearchOutlinedIcon />
        </span>
        <input
          type="text"
          value={searchInput}
          placeholder="Search Friend"
          onChange={(e) => setSearchInput(e.target.value)}
          className="border bg-[#D3DAD9] focus:outline-none w-full h-[50px] rounded pl-10 pr-3 placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};

export default Navbar;
