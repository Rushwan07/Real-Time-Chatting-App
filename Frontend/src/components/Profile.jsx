import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";

const Profile = ({ profileStatus, closeProfile }) => {
  const [isEditingImage, setIsEditingImage] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-3 p-3 border-b-2">
        <div className="cursor-pointer p-3 flex items-center">
          <ArrowBackIosIcon
            onClick={() => {
              closeProfile(false);
            }}
            sx={{ color: "#08CB00" }}
          />
          <div className="text-[1.5rem]">Profile</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto mt-10 transition-all duration-300">
        {/* Profile Image Section */}
        <div className="relative w-[50vw] max-w-[300px] h-[50vw] max-h-[300px] rounded-full overflow-hidden shadow-xl border-4 cursor-pointer group">
          {/* Profile Image */}
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src="https://images.pexels.com/photos/9604299/pexels-photo-9604299.jpeg?_gl=1*xfu4kg*_ga*NjM2NzQyODgxLjE2Njg2MDcxNjc.*_ga_8JE65Q40S6*czE3NTYxMzI1OTckbzU4JGcxJHQxNzU2MTMyNjM2JGoyMSRsMCRoMA.."
            alt="profile"
          />

          {/* Edit Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <EditIcon
              sx={{ color: "white", fontSize: 40, cursor: "pointer" }}
              onClick={() => document.getElementById("profileUpload").click()}
            />
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => console.log(e.target.files[0])}
            />
          </div>
        </div>

        {/* User Info Section */}
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-4xl font-bold text-[#08CB00] tracking-wide">
            xyz_03
          </h1>
          <h2 className="text-3xl text-gray-700 font-medium">xyz@gmail.com</h2>
          <p className="text-2xl text-gray-600 font-medium">
            Friends: <span className="text-[#08CB00] font-semibold">20</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
