import MailOutlineIcon from "@mui/icons-material/MailOutline";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../features/Auth/userSlice";
import axios from "axios";

const Messege = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const verifyAndLogin = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/verify/${token}`);

        // Update Redux store
        dispatch(
          setUser({
            user: res?.data?.data?.user,
            token: res?.data?.token,
          })
        ); // Store JWT in localStorage
        localStorage.setItem("token", res.data?.token);

        toast.success("Email verified successfully!");
        setLoading(false);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        toast.error(err.response?.data?.message || "Verification failed!");
        setLoading(false);
      }
    };
    verifyAndLogin();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
        {/* Mail Icon */}
        <div className="flex justify-center mb-4">
          <MailOutlineIcon sx={{ fontSize: 60, color: "#08CB00" }} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {loading ? "Verifying Your Email..." : "Email Verified Successfully!"}
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg">
          {loading
            ? "Please wait while we verify your email. You will be redirected automatically."
            : "Your email has been successfully verified. You can now continue to use your account."}
        </p>

        {/* Optional Note */}
        {loading && (
          <p className="text-gray-400 mt-4 text-sm">
            Thank you for your patience.
          </p>
        )}
      </div>
    </div>
  );
};

export default Messege;
