import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import { User, Phone, Mail, Calendar, Briefcase, Settings, UserPlus, Users } from 'lucide-react';

const specializations = [
  { label: "Plumbing", icon: "🛠️" },
  { label: "HVAC", icon: "❄️" },
  { label: "Electrical", icon: "⚡" },
  { label: "Water Systems", icon: "💧" },
  { label: "Carpentry", icon: "🔨" },
];

export default function TeamMemberDetailsForm() {
  const [status, setStatus] = useState("Available");
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    nic: "",
    phone: "",
    email: "",
    department: "",
    joinDate: "",
    experience: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  const [showTeam, setShowTeam] = useState(false);
  const navigation = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check login state on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigation("/login");
  };

  const handleLogin = () => {
    navigation("/login");
  };

  const handleSpecClick = (label) => {
    setSelectedSpecs((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    const data = {
      ...form,
      specializations: selectedSpecs,
      availabilityStatus: status.toUpperCase(),
    };

    try {
      const res = await fetch("http://localhost:8080/api/team/addteam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setResponseMsg("Team member added successfully!");
        setForm({
          name: "",
          nic: "",
          phone: "",
          email: "",
          department: "",
          joinDate: "",
          experience: "",
          gender: "",
        });
        setSelectedSpecs([]);
        setStatus("Available");
      } else {
        const errorText = await res.text();
        setResponseMsg("Error: " + errorText);
      }
    } catch (error) {
      setResponseMsg("Network error: " + error.message);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setForm({
      name: "",
      nic: "",
      phone: "",
      email: "",
      department: "",
      joinDate: "",
      experience: "",
      gender: "",
    });
    setSelectedSpecs([]);
    setStatus("Available");
    setResponseMsg(null);
  };

  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "#", onClick: () => navigation("/maintenance/dashboard") },
          { name: "Task", href: "#", onClick: () => navigation("/maintenance/scheduling") },
          {
            name: "Schedule",
            href: "#",
            onClick: () => navigation("/maintenance/update-equipment-maintenance"),
          },
          { name: "Team", href: "#",
            onClick: () => {
              console.log("Team link clicked");
              setShowTeam(true);
            },
          },
          { name: "Equipment", href: "#", onClick: () => navigation("/maintenance/equipment")},
          { name: "Add Technician", href: "#", onClick: () => navigation("/maintenance/add-member") },
        ]}
        showButton={true}
        buttonLabel={isLoggedIn ? "Logout" : "Get Started"}
        onButtonClick={isLoggedIn ? handleLogout : handleLogin}
      />

      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-main_dark mb-2">Add Team Member</h1>
          <p className="text-slatebluegray text-base">Register a new maintenance technician to your team</p>
        </div>

        {/* Form */}
        <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-web_yellow" />
                <h2 className="text-lg font-semibold text-main_dark">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    NIC Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nic"
                    value={form.nic}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                    placeholder="Enter NIC number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      placeholder="Enter phone number"
                      required
                    />
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      placeholder="Enter email address"
                      required
                    />
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-5 h-5 text-web_yellow" />
                <h2 className="text-lg font-semibold text-main_dark">Professional Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Join Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="joinDate"
                      value={form.joinDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      required
                    />
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                    placeholder="Enter years of experience"
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-web_yellow" />
                <h2 className="text-lg font-semibold text-main_dark">Specializations</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specializations.map((spec) => (
                  <button
                    key={spec.label}
                    type="button"
                    className={`flex items-center justify-center gap-2 border rounded-lg px-4 py-3 text-sm font-medium transition-all duration-150 ${
                      selectedSpecs.includes(spec.label)
                        ? "bg-deep_green text-white border-deep_green shadow-md"
                        : "bg-purewhite text-main_dark border-gray-300 hover:bg-web_yellow/10 hover:border-web_yellow"
                    }`}
                    onClick={() => handleSpecClick(spec.label)}
                  >
                    <span>{spec.icon}</span>
                    {spec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-5 h-5 text-web_yellow" />
                <h2 className="text-lg font-semibold text-main_dark">Availability Status</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-slatebluegray text-sm font-medium">Current Status:</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all duration-150 ${
                      status === "Available"
                        ? "bg-green-100 text-green-700 border-green-300 ring-2 ring-green-500"
                        : "bg-purewhite text-slatebluegray border-gray-300 hover:bg-green-50"
                    }`}
                    onClick={() => setStatus("Available")}
                  >
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block"></span>
                    Available
                  </button>
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border transition-all duration-150 ${
                      status === "Unavailable"
                        ? "bg-red-100 text-red-700 border-red-300 ring-2 ring-red-500"
                        : "bg-purewhite text-slatebluegray border-gray-300 hover:bg-red-50"
                    }`}
                    onClick={() => setStatus("Unavailable")}
                  >
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"></span>
                    Unavailable
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 sm:p-8">
              {responseMsg && (
                <div className={`mb-4 p-4 rounded-lg ${
                  responseMsg.startsWith("Team member added")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {responseMsg}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button 
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-slatebluegray hover:text-main_dark font-semibold hover:bg-gray-50 transition-all duration-150"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Save Details
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-main_dark">Team Integration</h3>
            </div>
            <p className="text-sm text-slatebluegray">
              New team members are automatically integrated into the scheduling and task management system.
            </p>
          </div>

          <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Settings className="w-5 h-5 text-main_dark" />
              </div>
              <h3 className="font-semibold text-main_dark">Skills Tracking</h3>
            </div>
            <p className="text-sm text-slatebluegray">
              Specializations are tracked for optimal task assignment and workload distribution.
            </p>
          </div>

          <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-light_brown via-light_brown to-light_brown/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-main_dark">Availability Management</h3>
            </div>
            <p className="text-sm text-slatebluegray">
              Real-time availability status helps in efficient resource planning and task scheduling.
            </p>
          </div>
        </div>
      </div>

      {/* Overlay and Team Sidebar */}
      {showTeam && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-all"
            onClick={() => setShowTeam(false)}
            aria-label="Close team sidebar"
          />
          <TeamSection onClose={() => setShowTeam(false)} />
        </>
      )}
    </>
  );
}
