import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

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
      availabilityStatus: status.toUpperCase(), // API expects "AVAILABLE" or "UNAVAILABLE"
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
        // Optionally reset form here
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

  return (
    <>

    <NavBar
      links={[
          { name: "Dashboard", href: "#", onClick: () => navigation("/maintenance/dashboard") },
          { name: "Task", href: "#",onClick: () => navigation("/maintenance/scheduling") },
          {
            name: "Schedule",
            href: "#",
            onClick: () =>
              navigation("/maintenance/update-equipment-maintenance"),
          },
          { name: "Team", href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");
              
              setShowTeam(true);
            },
           },
          { name: "Equipment", href: "#" ,onClick: () => navigation("/maintenance/equipment")},
          { name: "Add Technician", href: "#",onClick: () => navigation("/maintenance/add-member") },
        ]}
        showButton={true}
        buttonLabel={isLoggedIn ? "Logout" : "Get Started"}
        onButtonClick={isLoggedIn ? handleLogout : handleLogin}
    />
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto mt-10"
    >
      {/* Header */}
      <h2 className="text-2xl font-semibold text-[#236571] text-center mb-1">
        Team Member Details Form
      </h2>
      <p className="text-gray-500 text-center mb-8 text-sm">
        Please fill in all required information
      </p>

      {/* Personal Details */}
      <div>
        <h3 className="text-[#236571] font-semibold mb-4">Personal Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-[#236571]"
            placeholder="Enter full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-[#236571]"
            placeholder="Enter NIC number"
            name="nic"
            value={form.nic}
            onChange={handleChange}
            required
          />
          <input
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-[#236571]"
            placeholder="Enter phone number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <input
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-[#236571]"
            placeholder="Enter email address"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <select
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-[#236571]"
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select department</option>
            <option>Maintenance</option>
            <option>Operations</option>
            <option>HR</option>
          </select>
          <input
            type="date"
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-[#236571]"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            required
          />
          <input
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-[#236571]"
            placeholder="Enter years of experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            required
          />
          {/* Gender Field */}
          <select
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-[#236571]"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {/* Specializations */}
      <div className="mt-6">
        <h3 className="text-[#236571] font-semibold mb-3">Specializations</h3>
        <div className="grid grid-cols-3 gap-3 mb-2">
          {specializations.map((spec) => (
            <button
              key={spec.label}
              type="button"
              className={`flex items-center justify-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedSpecs.includes(spec.label)
                  ? "bg-[#236571] text-white border-[#236571]"
                  : "bg-white text-[#236571] border-gray-200 hover:bg-[#EFC11A] hover:text-[#236571] hover:border-[#EFC11A]"
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
      <div className="mt-6">
        <h3 className="text-[#236571] font-semibold mb-3">Availability Status</h3>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Current Status:</span>
          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border ${
              status === "Available"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-white text-gray-500 border-gray-200"
            }`}
            onClick={() => setStatus("Available")}
          >
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block"></span>
            Available
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border ${
              status === "Unavailable"
                ? "bg-red-100 text-red-700 border-red-200"
                : "bg-white text-gray-500 border-gray-200"
            }`}
            onClick={() => setStatus("Unavailable")}
          >
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"></span>
            Unavailable
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2 mt-8">
        {responseMsg && (
          <div
            className={`mb-2 text-sm ${
              responseMsg.startsWith("Team member added")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {responseMsg}
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            className="px-5 py-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
            onClick={() => {
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
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-md bg-[#236571] text-white font-semibold hover:bg-[#17414a] transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Details"}
          </button>
        </div>
      </div>
    </form>

    {/* Overlay and Team Sidebar */}
          {showTeam && (
            <>
              {/* BLUR OVERLAY */}
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-all"
                onClick={() => setShowTeam(false)}
                aria-label="Close team sidebar"
              />
              {/* TEAM SIDEBAR */}
              <TeamSection onClose={() => setShowTeam(false)} />
            </>
          )}
    </>
  );
}
