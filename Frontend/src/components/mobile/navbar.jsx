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
        <div className="flex items-center gap-3 p-2 bg-white transition-shadow duration-300 cursor-pointer">
          <h1 className="text-[1.3rem] font-semibold text-gray-800">David</h1>
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-[#08CB00]">
            <img
              className="w-full h-full object-cover"
              src="https://images.pexels.com/photos/9604299/pexels-photo-9604299.jpeg?_gl=1*xfu4kg*_ga*NjM2NzQyODgxLjE2Njg2MDcxNjc.*_ga_8JE65Q40S6*czE3NTYxMzI1OTckbzU4JGcxJHQxNzU2MTMyNjM2JGoyMSRsMCRoMA.."
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
          placeholder="Search Friend"
          className="border bg-[#D3DAD9] focus:outline-none w-full h-[50px] rounded pl-10 pr-3 placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};

export default Navbar;
