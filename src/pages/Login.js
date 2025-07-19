import React, { use, useContext, useEffect, useRef, useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { PiSignIn } from "react-icons/pi";
import { BiSupport } from "react-icons/bi";
import { LuBookCopy } from "react-icons/lu";
import { FaPhoneAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import GlassCard from "../components/LoginPage/GlassCard";
import DayWidgets from "../components/LoginPage/DayWidgets";
import DiagonalLines from "../components/LoginPage/DigonalLines";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const {login}=useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const location = useLocation();
  const emailVerified = location.state && location.state.emailVerified;
  console.log("Email Verified:", emailVerified);

  const toastShown = useRef(false);

  useEffect(() => {
    if (!toastShown.current && emailVerified !== null) {
      if (emailVerified) {
        toast.success("Email verified successfully!");
        toastShown.current = true;
      } else {
        toast.error("Email not verified. Please check your inbox.");
        toastShown.current = true;
      }
    }
  }, [emailVerified]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Sign in with Firebase Auth
      const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const idToken = await userCred.user.getIdToken();
      console.log("ID Token:", idToken);
      
      document.cookie = `idToken=${idToken}; path=/; max-age=3600; secure; samesite=strict`;

      // 2. Call backend with ID token in Authorization header
      const res = await fetch("http://localhost:8080/api/user/login", {
        method: "GET",
        headers: { Authorization: "Bearer " + idToken },
      });
      console.log(res);

      if (!res.ok) {
        const error = await res.text();
        console.error("Login failed: " + error);
        toast.error("Login failed: " + error);
        return;
      }

      // Parse response as JSON
      const data = await res.json();
      console.log("Backend response:", data);

      // Defensive checks for user and userRole
      const user = data.user;
      console.log("User data:", user);
      if (!user || !user.userRole) {
        console.error("User data or userRole is missing from the response.");
        toast.error("Invalid user data received from the server.");
        return;
      }

      // Store user data in localStorage
      login(idToken, user);
      // localStorage.setItem("user", JSON.stringify(user));
      // localStorage.setItem("role", user.userRole);

      // Role-based navigation
      const role = user.userRole.toUpperCase();
      const roleRoutes = {
        ADMIN: "/admin/dashboard",
        SITE_MANAGER: "/site-manager",
        INVENTORY_MANAGER: "/inventory/dashboard",
        FINANCE_OFFICER: "/finance/dashboard",
        MAINTENANCE_HEAD: "/maintenance/dashboard",
        SUPPLIER: "/supplier/dashboard",
        PURCHASING_MANAGER: "/purchasing/dashboard",
      };

      if (roleRoutes[role]) {
        navigation(roleRoutes[role]);
      } else {
        console.error("Unknown user role. Please contact support.");
        toast.error("Unknown user role. Please contact support.");
        navigation("/"); // fallback
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed: " + err.message);
    }
  };

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
    <>
      <div className="min-h-screen bg-purewhite flex flex-col lg:flex-row font-poppins">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="lg:w-full w-full flex mb-3 lg:mb-5 justify-center items-center lg:items-center lg:justify-center">
              <div className="w-16 h-12 sm:w-28 sm:h-20 flex items-center justify-center">
                <img
                  src="/logo2.png"
                  alt="ConstruxFlow Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="mb-6 lg:mb-8 text-center lg:text-center">
              <h2 className="text-main_dark text-2xl sm:text-3xl font-semibold">
                Welcome Back
              </h2>
              <p className="text-slatebluegray text-sm">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              {/* Username Field */}
              <div>
                <label className="text-main_dark text-sm mb-2 block font-medium">
                  Username
                </label>
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  placeholder="Enter your username"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-light_gray/20 text-main_dark rounded-full placeholder-slatebluegray border border-light_gray/40 focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-all text-sm sm:text-base"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="text-main_dark text-sm mb-2 block font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-light_gray/20 text-main_dark rounded-full placeholder-slatebluegray border border-light_gray/40 focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-all pr-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slatebluegray hover:text-main_dark transition-colors"
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
                    className="w-4 h-4 text-web_yellow bg-purewhite border-2 border-light_gray rounded focus:ring-web_yellow focus:ring-2"
                  />
                  <span className="ml-2 text-main_dark text-sm">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-deep_green text-sm hover:text-web_yellow transition-colors text-center sm:text-right font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-web_yellow text-main_dark py-3 rounded-full font-semibold hover:bg-web_yellow/90 hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base"
              >
                <span className="mr-2">
                  <PiSignIn className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                Sign In
              </button>
            </form>

            {/* Help Section */}
            <div className="mt-8 lg:mt-12 text-center border-t border-light_gray/40 pt-6">
              <p className="text-slatebluegray text-sm mb-4">Need help?</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
                <a
                  href="#"
                  className="text-deep_green text-sm hover:text-web_yellow transition-colors flex items-center justify-center font-medium"
                >
                  <span className="mr-1">
                    <BiSupport />
                  </span>
                  Support
                </a>
                <a
                  href="#"
                  className="text-deep_green text-sm hover:text-web_yellow transition-colors flex items-center justify-center font-medium"
                >
                  <span className="mr-1">
                    <LuBookCopy />
                  </span>
                  Guide
                </a>
                <a
                  href="#"
                  className="text-deep_green text-sm hover:text-web_yellow transition-colors flex items-center justify-center font-medium"
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
              <p className="text-slatebluegray text-xs">
                © 2024 ConstruxFlow. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden lg:w-1/2 p-4 lg:flex relative overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-screen order-1 lg:order-2">
          {/* Construction Scene Container */}
          <div className="w-full h-full relative rounded-xl overflow-hidden">
            <div
              onClick={handleclose}
              className="absolute top-0 right-0 w-[50px] h-[50px] rounded-bl-[20px] text-purewhite bg-main_dark/80 backdrop-blur-sm flex items-center justify-center text-3xl hover:text-web_yellow hover:bg-main_dark transition-all cursor-pointer z-20"
            >
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
            <div className="absolute left-64 top-[280px] w-[320px] h-[170px] bg-purewhite/90 rounded-[16px] border border-light_gray/30 shadow-[0_4px_32px_0_rgba(0,0,0,0.15)] backdrop-blur-sm backdrop-saturate-150 overflow-hidden">
              <div className="absolute inset-0 flex flex-col gap-1 justify-center text-main_dark pointer-events-none">
                <div className="w-full h-full flex justify-between px-3 py-6">
                  <DayWidgets day="MON" date="12" dateBg="bg-light_gray/30" />
                  <DayWidgets day="TUE" date="13" dateBg="bg-light_gray/30" />
                  <DayWidgets day="WED" date="14" dateBg="bg-web_yellow" />
                  <DayWidgets day="THU" date="15" dateBg="bg-light_gray/30" />
                  <DayWidgets day="FRI" date="16" dateBg="bg-light_gray/30" />
                  <DayWidgets day="SAT" date="17" dateBg="bg-light_gray/30" />
                  <DayWidgets day="SUN" date="18" dateBg="bg-light_gray/30" />
                </div>
                <div className="absolute top-28 right-4">
                  <DiagonalLines />
                </div>
                <div className="absolute top-2 left-2 w-2/3 h-1/4 bg-web_yellow/20 rounded-full blur-lg"></div>
                <div className="absolute bottom-2 right-2 w-1/3 h-1/6 bg-deep_green/10 rounded-full blur"></div>
              </div>
            </div>
            <div className="absolute flex flex-col gap-2 px-4 py-3 left-[230px] top-[390px] w-[190px] h-[100px] bg-purewhite/95 rounded-[16px] border border-light_gray/30 shadow-[0_4px_32px_0_rgba(0,0,0,0.15)] backdrop-blur-sm backdrop-saturate-150 overflow-hidden">
              <p className="text-main_dark text-sm font-medium">
                Daily Meeting
              </p>
              <div className="flex items-center -space-x-2">
                {profiles.map((profile, index) => (
                  <img
                    key={profile.id}
                    src={profile.src}
                    alt={profile.alt}
                    className="w-10 h-10 rounded-full border-2 border-purewhite object-cover z-10"
                    style={{ zIndex: profiles.length - index }}
                  />
                ))}

                {additionalCount > 0 && (
                  <div className="w-10 h-10 rounded-full bg-light_gray border-2 border-purewhite flex items-center justify-center text-sm font-medium text-main_dark z-0">
                    +{additionalCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
