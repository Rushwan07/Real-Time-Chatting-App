import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";

const MessegeArea = ({ Id, setId }) => {
  console.log("id", Id);
  return (
    <div>
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
      <div className=""></div>
    </div>
  );
};

export default MessegeArea;
