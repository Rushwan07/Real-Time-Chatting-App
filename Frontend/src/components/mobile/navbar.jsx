import React from "react";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
const Navbar = () => {
  return (
    <div className="p-3">
      <div className="nav flex justify-between items-center p-1">
        <div className="">
          <h4 className="text-[2rem] font-bold text-[#08CB00]">ChitChat</h4>
        </div>
        <div className="">
          <MoreVertOutlinedIcon />
        </div>
      </div>
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <SearchOutlinedIcon />
        </span>
        <input
          type="text"
          placeholder="Search Friend"
          className="border bg-[#D3DAD9] focus:outline-none w-full h-[50px] rounded-[30px] pl-10 pr-3 placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};

export default Navbar;
