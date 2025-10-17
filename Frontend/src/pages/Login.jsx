import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../features/Auth/userSlice";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSignin = async () => {
    try {
      if (email.trim().length === 0 || password.trim().length === 0) {
        toast.error("Enter valid credentials", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            backgroundColor: "#FF4C4C", // red color for error
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },
          icon: "⚠️", // warning emoji
        });
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
            backgroundColor: "#FF4C4C", // red color for error
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },
          icon: "⚠️", // warning emoji
        });
        return;
      }

      const res = await axios.post(BASE_URL + "/users/signin", {
        email: email.trim(),
        password,
      });
      toast.success("Signin successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      if (res) {
        dispatch(setUser(res.data.data.user));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.log(error);
    }
  };

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
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
          />
          <input
            className="w-full border-2 border-gray-200 focus:border-[#08CB00] focus:ring-1 focus:ring-[#08CB00] p-3 rounded-lg outline-none transition-all"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
          />

          <button
            type="submit"
            onClick={handleSignin}
            className="w-full bg-[#08CB00] text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to={"/signup"}>
            <span className="text-[#08CB00] cursor-pointer hover:underline">
              Create Account
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
