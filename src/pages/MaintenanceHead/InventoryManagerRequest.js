import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

// Status badge component
const StatusBadge = ({ status }) => {
  let base = "px-3 py-1 rounded-full font-semibold text-xs";
  switch (status) {
    case "Pending":
      return (
        <span className={`${base} bg-[#EFC11A] text-black`}>
          Pending
        </span>
      );
    case "Approved":
      return (
        <span className={`${base} bg-[#236571] text-white`}>
          Approved
        </span>
      );
    case "Completed":
      return (
        <span className={`${base} bg-emerald-400 text-white`}>
          Completed
        </span>
      );
    default:
      return null;
  }
};

// Icon component for demo
const EquipmentIcon = ({ type }) => {
  switch (type) {
    case "excavator":
      return <span className="mr-2 text-[#236571]">🚜</span>;
    case "mixer":
      return <span className="mr-2 text-[#236571]">⚙️</span>;
    case "crane":
      return <span className="mr-2 text-[#236571]">🏗️</span>;
    case "jackhammer":
      return <span className="mr-2 text-[#236571]">🔨</span>;
    default:
      return null;
  }
};

const rows = [
  {
    type: "excavator",
    equipment: "Excavator CAT-320",
    date: "Jan 15, 2024",
    requester: "John Mitchell",
    status: "Pending",
  },
  {
    type: "mixer",
    equipment: "Concrete Mixer CM-500",
    date: "Jan 18, 2024",
    requester: "Sarah Johnson",
    status: "Approved",
  },
  {
    type: "crane",
    equipment: "Tower Crane TC-1000",
    date: "Jan 22, 2024",
    requester: "Mike Rodriguez",
    status: "Completed",
  },
  {
    type: "jackhammer",
    equipment: "Jackhammer JH-250",
    date: "Jan 25, 2024",
    requester: "David Chen",
    status: "Pending",
  },
];

// Main component
const MaintenanceRequestDashboard = () => {
  const [showTeam, setShowTeam] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <NavBar
        profileURL="/maintenance/profile"
        links={[
          {
            name: "Dashboard",
            href: "#",
            onClick: () => navigate("/maintenance/dashboard"),
          },
          {
            name: "Task",
            href: "#",
            onClick: () => navigate("/maintenance/scheduling"),
          },
          {
            name: "Schedule",
            href: "#",
            onClick: () =>
              navigate("/maintenance/update-equipment-maintenance"),
          },
          {
            name: "Team",
            href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");

              setShowTeam(true);
            },
          },
          {
            name: "Equipment",
            href: "#",
            onClick: () => navigate("/maintenance/equipment"),
          },
          {
            name: "Add Technician",
            href: "#",
            onClick: () => navigate("/maintenance/add-member"),
          },
        ]}
      />

      <div className="bg-[#f7fafd] min-h-screen py-10">
        <div className="max-w-4xl mx-auto">
          {/* Outer container */}
          <div className="bg-white rounded-xl shadow-md p-8">
            {/* Title and subtitle */}
            <h1 className="text-2xl font-bold mb-2 text-black">
              Maintenance Requests Overview
            </h1>
            <p className="text-gray-600 mb-6">
              Monitor and manage equipment maintenance schedules
            </p>
            {/* Table container */}
            <div className="bg-white rounded-lg">
              <h2 className="text-lg font-semibold mb-3">
                Upcoming Maintenance Schedule
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#236571] text-white">
                    <th className="text-left py-3 px-4 font-semibold">Equipment</th>
                    <th className="text-left py-3 px-4 font-semibold">Scheduled Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Requested By</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.equipment}
                      className="border-b last:border-none hover:bg-slate-50"
                    >
                      <td className="py-4 px-4 flex items-center">
                        <EquipmentIcon type={row.type} />
                        <span className="font-semibold text-gray-800">{row.equipment}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{row.date}</td>
                      <td className="py-4 px-4 text-gray-700">{row.requester}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="py-4 px-4">
                        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm shadow hover:bg-gray-700 transition">
                          View Material Requests
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
};

export default MaintenanceRequestDashboard;
