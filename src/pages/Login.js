import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { PiSignIn } from "react-icons/pi";
import { BiSupport } from "react-icons/bi";
import { LuBookCopy } from "react-icons/lu";
import { FaPhoneAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import GlassCard from "../components/LoginPage/GlassCard";
import DayWidgets from "../components/LoginPage/DayWidgets";
import DiagonalLines from "../components/LoginPage/DigonalLines";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigate();

  const handleclose = () => {
    navigation("/");
  };

  const profiles = [
    { id: 1, src: "/assets/login_page/pro1.jpg", alt: "Profile 1" },
    { id: 2, src: "/assets/login_page/pro2.jpg", alt: "Profile 2" },
    { id: 3, src: "/assets/login_page/pro3.jpg", alt: "Profile 3" },
  ];
  const additionalCount = 2;

  return (
    <div className="min-h-screen bg-main_dark flex flex-col lg:flex-row font-poppins">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
        <div className=" w-full max-w-md">
          {/* Logo */}
          <div className="lg:w-full w-full flex mb-3 lg:mb-5 justify-center items-center lg:items-center lg:justify-center">
            <div className="w-16 h-12 sm:w-28 sm:h-20 flex items-center justify-center">
              <img
                src="/logo1.png" // Replace with your logo path
                alt="ConstruxFlow Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-6 lg:mb-8 text-center lg:text-center">
            <h2 className="text-purewhite text-2xl sm:text-3xl font-semibold ">
              Welcome Back
            </h2>
            <p className="text-[#9798A0] text-sm">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-4 sm:space-y-6">
            {/* Username Field */}
            <div>
              <label className="text-[#9798A0] text-sm mb-2 block">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-purewhite text-main_dark rounded-full placeholder-[#ADAEBC] focus:outline-none focus:ring-2 focus:ring-web_yellow transition-all text-sm sm:text-base"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-[#9798A0] text-sm mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-purewhite text-main_dark rounded-full placeholder-[#ADAEBC] focus:outline-none focus:ring-2 focus:ring-web_yellow transition-all pr-12 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#ADAEBC] hover:text-deep_green transition-colors"
                >
                  {showPassword ? (
                    <FaRegEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <FaRegEye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <label className="flex items-center justify-center sm:justify-start">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-web_yellow bg-transparent border-2 border-light_gray rounded focus:ring-web_yellow focus:ring-2"
                />
                <span className="ml-2 text-[#9798A0] text-sm">Remember me</span>
              </label>
              <a
                href="#"
                className="text-deep_green text-sm hover:text-web_yellow transition-colors text-center sm:text-right"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#FFD85F] text-main_dark py-3 rounded-full font-semibold hover:bg-web_yellow transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <span className="mr-2">
                <PiSignIn className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              Sign In
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 lg:mt-12 text-center border-t border-[#A6A8B6]/40  pt-6">
            <p className="text-[#9798A0] text-sm mb-4">Need help?</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a
                href="#"
                className="text-deep_green text-sm hover:text-web_yellow transition-colors flex items-center justify-center"
              >
                <span className="mr-1">
                  <BiSupport />
                </span>
                Support
              </a>
              <a
                href="#"
                className="text-deep_green text-sm hover:text-web_yellow transition-colors flex items-center justify-center"
              >
                <span className="mr-1">
                  <LuBookCopy />
                </span>
                Guide
              </a>
              <a
                href="#"
                className="text-deep_green text-sm hover:text-web_yellow transition-colors flex items-center justify-center"
              >
                <span className="mr-1">
                  <FaPhoneAlt />
                </span>
                Contact
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 lg:mt-8 text-center">
            <p className="text-[#A6A8B6]/40 text-xs">
              © 2024 ConstruxFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:w-1/2 p-4 lg:flex  relative overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-screen order-1 lg:order-2">
        {/* Construction Scene Container */}
        <div className="w-full h-full relative rounded-xl overflow-hidden">
          <div onClick={handleclose} className="absolute top-0 right-0 w-[50px] h-[50px] rounded-bl-[20px] text-white bg-main_dark flex items-center justify-center text-3xl hover:text-web_yellow transition-colors cursor-pointer">
            <IoCloseSharp />
          </div>
          <img
            src="/assets/login_page/bgimage.png"
            className="object-cover w-full h-full rounded-xl"
          />
          <GlassCard
            title="Task Review With Team"
            timeSlot="Today, 2:00 PM - 3:30 PM"
            statusColor="bg-web_yellow"
            className="left-6 top-6 z-10"
          />
          <GlassCard
            title="Task Review With Team"
            timeSlot="Today, 1:00 PM - 2:00 PM"
            statusColor="bg-main_dark"
            className="left-16 top-16 z-0"
          />
          <div className="absolute left-64 top-[280px] w-[320px] h-[170px]  bg-[#1A1A1A]/5 rounded-[16px] border border-white/20 shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150  overflow-hidden">
            <div className="absolute inset-0 flex flex-col gap-1 justify-center text-white pointer-events-none">
              <div className="w-full h-full flex justify-between px-3 py-6">
                <DayWidgets day="MON" date="12" dateBg="bg-[#1A1A1A]/5" />
                <DayWidgets day="TUE" date="13" dateBg="bg-[#1A1A1A]/5" />
                <DayWidgets day="WED" date="14" dateBg="bg-web_yellow" />
                <DayWidgets day="THU" date="15" dateBg="bg-[#1A1A1A]/5" />
                <DayWidgets day="FRI" date="16" dateBg="bg-[#1A1A1A]/5" />
                <DayWidgets day="SAT" date="17" dateBg="bg-[#1A1A1A]/5" />
                <DayWidgets day="SUN" date="18" dateBg="bg-[#1A1A1A]/5" />
              </div>
              <div className="absolute top-28 right-4">
                <DiagonalLines />
              </div>
              <div className="absolute top-2 left-2 w-2/3 h-1/4 bg-white/20 rounded-full blur-lg"></div>
              <div className="absolute bottom-2 right-2 w-1/3 h-1/6 bg-white/10 rounded-full blur"></div>
            </div>
          </div>
          <div className="absolute flex flex-col gap-2 px-4 py-3 left-[230px] top-[390px] w-[190px] h-[100px]  bg-purewhite rounded-[16px] border border-white/20 shadow-[0_4px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-sm backdrop-saturate-150  overflow-hidden">
            <p className="text-[#1F2937] text-sm">Daily Meeting</p>
            <div className="flex items-center -space-x-2">
              {profiles.map((profile, index) => (
                <img
                  key={profile.id}
                  src={profile.src}
                  alt={profile.alt}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover z-10"
                  style={{ zIndex: profiles.length - index }}
                />
              ))}

              {additionalCount > 0 && (
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600 z-0">
                  +{additionalCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
