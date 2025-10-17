import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setUser } from "../features/Auth/userSlice";
import { persistor } from "../app/store";
import SettingsIcon from "@mui/icons-material/Settings";

const Profile = ({ profileStatus, closeProfile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const handleOptionClick = (value) => {
    if (value === "logout") {
      console.log("Logout clicked");
    } else if (value === "about") {
      alert("About Me clicked");
    }
    setOpen(false); // close dropdown after click
  };

  const handleSignOut = () => {
    try {
      // Clear redux state
      dispatch(setUser({}));

      // Clear localStorage
      localStorage.removeItem("user");

      // Clear persisted state (if using redux-persist)
      persistor.purge();

      // Redirect to login page
      navigate("/login");

      // Show toast
      toast.success("Logout successful", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while logging out");
    }
  };

  const [isEditingImage, setIsEditingImage] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-3 p-3 border-b-2 justify-between">
        <div className="cursor-pointer p-3 flex items-center">
          <ArrowBackIosIcon
            onClick={() => {
              closeProfile(false);
            }}
            sx={{ color: "#08CB00" }}
          />
          <div className="text-[1.5rem]">Profile</div>
        </div>
        <div className="relative inline-block">
          {/* Icon Trigger */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center p-2 rounded-full hover:bg-gray-100 transition"
          >
            <SettingsIcon sx={{ fontSize: 30 }} />
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
              <button
                onClick={() => handleOptionClick("about")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                About Me
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto mt-10 transition-all duration-300">
        {/* Profile Image Section */}
        <div className="relative w-[50vw] max-w-[300px] h-[50vw] max-h-[300px] rounded-full overflow-hidden shadow-xl border-4 cursor-pointer group">
          {/* Profile Image */}
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={user?.image}
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
            {user?.username}
          </h1>
          <h2 className="text-3xl text-gray-700 font-medium">{user?.email}</h2>
          <p className="text-2xl text-gray-600 font-medium">
            Friends: <span className="text-[#08CB00] font-semibold">20</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
