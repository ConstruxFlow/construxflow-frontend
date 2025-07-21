// TeamSection.jsx
import React, { useEffect, useState } from "react";

export default function TeamSection({ onClose }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/team/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch team members");
        return res.json();
      })
      .then((data) => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setTeamMembers([]);
        setLoading(false);
      });
  }, []);

  function getInitials(name = "") {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join("")
      .slice(0, 2); // Limit to 2 letters max
  }

  function getSkills(member) {
    // If your API field is `specializations`
    return Array.isArray(member.specializations)
      ? member.specializations.join(", ")
      : "";
  }

  function getBadgeClass(status) {
    // Style badge color based on status (customize as needed)
    switch ((status || "").toUpperCase()) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";
      case "ON_LEAVE":
        return "bg-yellow-100 text-yellow-700";
      case "UNAVAILABLE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <aside
      className="w-full max-w-xs bg-white rounded-xl shadow-xl border border-gray-200 p-6 fixed top-8 right-8 z-50"
      role="complementary"
      aria-label="Team Sidebar"
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-[#236571]">Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold focus:outline-none"
            aria-label="Close team sidebar"
          >
            &times;
          </button>
        </div>
        <div className="text-xs text-gray-500 mb-4">
          Maintenance Technicians
        </div>
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No technicians found.
            </div>
          ) : (
            teamMembers.map((member) => (
              <div
                key={member.empId}
                className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-[#236571] text-white mr-3">
                  {getInitials(member.name)}
                </div>
                {/* Name and badge side by side */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">
                      {member.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getBadgeClass(
                        member.availabilityStatus
                      )}`}
                    >
                      {member.availabilityStatus}
                    </span>
                  </div>
                  {/* Optional: skills row below */}
                  {getSkills(member) && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {getSkills(member)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
