import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-yellow-50 to-gray-100 font-inter relative">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-11/12 transform transition-transform hover:-translate-y-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="96"
          height="96"
          fill="none"
          className="mx-auto mb-6"
        >
          <circle cx="12" cy="12" r="10" className="fill-red-100" />
          <path
            d="M12 8v4"
            stroke="#e53935"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1" className="fill-red-600" />
        </svg>

        <h1 className="text-3xl font-bold text-red-600 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          You don’t have permission to view this page. <br />
          If you think this is a mistake, please contact your administrator.
        </p>

        {/* 🟡 Construction-Themed Login Button */}
        <Link
          to="/login"
          className="inline-block px-8 py-3 rounded-lg font-semibold text-gray-900 shadow-lg transition-all duration-300 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 border-2 border-yellow-600 hover:scale-105"
        >
          Go to Login
        </Link>
      </div>

      <footer className="absolute bottom-5 text-gray-500 text-sm">
        © {new Date().getFullYear()} Construxflow. All rights reserved.
      </footer>
    </div>
  );
};

export default Unauthorized;
