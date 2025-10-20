import React, { useState, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setUser } from "../features/Auth/userSlice";
import { persistor } from "../app/store";
import useFirebaseUpload from "../hooks/use-firebaseUploads";
import axios from "axios";

const Profile = ({ closeProfile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState(user?.image || "");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Firebase upload hook
  const { progress, error, downloadURL } = useFirebaseUpload(file);

  // When upload finishes, update preview + backend
  useEffect(() => {
    if (downloadURL) {
      setImageURL(downloadURL);
      updateUserImage(downloadURL);
    }
  }, [downloadURL]);

  const updateUserImage = async (newImageURL) => {
    console.log("newImageURL", newImageURL);
    try {
      const res = await axios.patch(BASE_URL + "/users/updateProfile", {
        image: newImageURL || "",
        email: user?.email,
      });

      // Update Redux store
      dispatch(setUser({ ...user, image: newImageURL }));

      toast.success("Profile picture updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleSignOut = () => {
    try {
      dispatch(setUser({}));
      localStorage.removeItem("user");
      persistor.purge();
      navigate("/login");
      toast.success("Logout successful", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while logging out");
    }
  };

  const handleOptionClick = (value) => {
    if (value === "logout") handleSignOut();
    else if (value === "about") alert("About Me clicked");
    setOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b-2 justify-between">
        <div className="cursor-pointer p-3 flex items-center">
          <ArrowBackIosIcon
            onClick={() => closeProfile(false)}
            sx={{ color: "#08CB00" }}
          />
          <div className="text-[1.5rem]">Profile</div>
        </div>

        {/* Settings Dropdown */}
        <div className="relative inline-block">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center p-2 rounded-full hover:bg-gray-100 transition"
          >
            <SettingsIcon sx={{ fontSize: 30 }} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
              <button
                onClick={() => handleOptionClick("about")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                About Me
              </button>
              <button
                onClick={() => handleOptionClick("logout")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto mt-10 transition-all duration-300">
        {/* Profile Image */}
        <div className="relative w-[50vw] max-w-[300px] h-[50vw] max-h-[300px] rounded-full overflow-hidden shadow-xl border-4 cursor-pointer group">
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={imageURL || "/default-avatar.png"}
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
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFile(e.target.files[0]);
                  toast.info("Uploading image...", { autoClose: 1500 });
                }
              }}
            />
          </div>
        </div>
        {file && progress > 0 && progress < 100 && (
          <p className="text-sm text-gray-500 mt-1">Uploading: {progress}%</p>
        )}
        {progress === 100 && (
          <p className="text-sm text-green-600 mt-1">Upload complete ✅</p>
        )}
        {/* User Info */}
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-4xl font-bold text-[#08CB00] tracking-wide">
            {user?.username}
          </h1>
          <h2 className="text-3xl text-gray-700 font-medium">{user?.email}</h2>
          <p className="text-2xl text-gray-600 font-medium">
            Friends:{" "}
            <span className="text-[#08CB00] font-semibold">
              {user?.friends?.length}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
