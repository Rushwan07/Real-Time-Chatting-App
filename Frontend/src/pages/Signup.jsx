import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
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
            placeholder="Username"
          />
          <input
            className="w-full border-2 border-gray-200 focus:border-[#08CB00] focus:ring-1 focus:ring-[#08CB00] p-3 rounded-lg outline-none transition-all"
            type="email"
            placeholder="Email"
          />
          <input
            className="w-full border-2 border-gray-200 focus:border-[#08CB00] focus:ring-1 focus:ring-[#08CB00] p-3 rounded-lg outline-none transition-all"
            type="password"
            placeholder="Password"
          />

          <div className="relative w-full">
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => console.log(e.target.files[0])}
            />
            <label
              htmlFor="profileUpload"
              className="block w-full text-center border-2 border-dashed border-gray-300 hover:border-[#08CB00] text-gray-500 hover:text-[#08CB00] py-3 rounded-lg cursor-pointer transition-all"
            >
              📸 Upload Profile Photo
            </label>
          </div>

          <button
            type="submit"
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
