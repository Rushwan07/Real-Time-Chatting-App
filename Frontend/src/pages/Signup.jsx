import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { setUser } from "../features/Auth/userSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useFirebaseUpload from "../hooks/use-firebaseUploads";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null); // stores File object
  const [imageURL, setImageURL] = useState(""); // stores uploaded Firebase URL

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Firebase upload hook

  const handleSignup = async () => {
    try {
      if (!name.trim() || !email.trim() || !password.trim()) {
        toast.error("Enter valid credentials");
        return;
      }

      if (password.trim().length < 8) {
        toast.error("Password length must be greater than 8", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            backgroundColor: "#FF4C4C",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },
          icon: "⚠️",
        });
        return;
      }

      // Ensure image is uploaded before sending signup
      if (file && !imageURL) {
        toast.info("Please wait for image upload to complete!");
        return;
      }

      const res = await axios.post(BASE_URL + "/users/signup", {
        username: name,
        email: email.trim(),
        password: password,
        image: imageURL || "", // send Firebase URL
      });

      toast.success(
        "Please check your email, We have sended you a mail to verify your email",
        {
          position: "top-right",
          autoClose: 20000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );

      // Update Redux
      // dispatch(setUser(res.data.data.user));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.log(error);
    }
  };
  const { progress, error, downloadURL } = useFirebaseUpload(file);

  useEffect(() => {
    if (downloadURL) {
      setImageURL(downloadURL); // save Firebase URL separately
    }
  }, [downloadURL]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to <span className="text-[#08CB00]">ChitChat</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Connect, chat & enjoy seamless conversations!
          </p>
          <hr className="border-[#08CB00] border-2 mt-4 w-1/2 mx-auto" />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 mt-6">
          <input
            className="w-full border-2 border-gray-200 focus:border-[#08CB00] focus:ring-1 focus:ring-[#08CB00] p-3 rounded-lg outline-none transition-all"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
          />
          <input
            className="w-full border-2 border-gray-200 focus:border-[#08CB00] focus:ring-1 focus:ring-[#08CB00] p-3 rounded-lg outline-none transition-all"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full border-2 border-gray-200 focus:border-[#08CB00] focus:ring-1 focus:ring-[#08CB00] p-3 rounded-lg outline-none transition-all"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <div className="relative w-full">
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <label
              htmlFor="profileUpload"
              className="block w-full text-center border-2 border-dashed border-gray-300 hover:border-[#08CB00] text-gray-500 hover:text-[#08CB00] py-3 rounded-lg cursor-pointer transition-all"
            >
              📸 Upload Profile Photo
            </label>
            {file && progress > 0 && progress < 100 && (
              <p className="text-sm text-gray-500 mt-1">
                Uploading: {progress}%
              </p>
            )}
            {progress === 100 && (
              <p className="text-sm text-green-600 mt-1">Upload complete ✅</p>
            )}
          </div>

          <button
            type="submit"
            onClick={handleSignup}
            className="w-full bg-[#08CB00] text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all"
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to={"/login"}>
            <span className="text-[#08CB00] cursor-pointer hover:underline">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
