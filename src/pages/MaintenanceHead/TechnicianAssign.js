import { useState } from "react";
import { UserPlus } from "lucide-react";
import TechnicianCard from "../../components/MaintenanceHead/TechnicianCard";
import NavBar from "../../components/NavBar";


const technicians = [
  { initials: "JS", name: "John Smith", skills: "Plumbing, HVAC", status: "Active" },
  { initials: "SW", name: "Sarah Wilson", skills: "Electrical, Lighting", status: "On Task" },
  { initials: "MJ", name: "Mike Johnson", skills: "General Maintenance", status: "Unavailable" },
  { initials: "LC", name: "Lisa Chen", skills: "Plumbing, Water System", status: "Active" },
];

export default function TechnicianAssignmentMain() {
  const [selectedTech, setSelectedTech] = useState("");
  const [duration, setDuration] = useState("1-2 hours");
  const [instructions, setInstructions] = useState("");
  const [showTeam, setShowTeam] = useState(false);

  return (
    <>
    <NavBar
      links={[
          { name: "Dashboard", href: "#" },
          { name: "Task", href: "#" },
          { name: "Team", href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");
              
              setShowTeam(true);
            },
           },
          { name: "Equipment", href: "#" },
          { name: "Request Tracker", href: "#" },
        ]}
        showButton={true}
    />

    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row items-start justify-center py-8 px-4 gap-8">
      {/* Main Content */}
      <div className="flex-1 max-w-3xl">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Technician Assignment</h1>
          <p className="text-gray-600">Assign maintenance requests to available technicians</p>
        </div>

        {/* Maintenance Request Details */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="text-[#236571] font-semibold mb-4 text-lg">Maintenance Request Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Request ID</label>
              <input
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                value="MR-2024-001"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
              <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">High</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
              <input
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                value="Building A - Floor 3 - Room 301"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <input
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                value="Plumbing"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
              rows={2}
              value="Water leak in the bathroom ceiling. Urgent repair needed to prevent further damage."
              readOnly
            />
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-[#236571] font-semibold mb-4 text-lg">Assignment Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Select Technician</label>
              <select
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
              >
                <option value="">Choose a technician...</option>
                {technicians.map((tech) => (
                  <option key={tech.initials} value={tech.name}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Expected Duration</label>
              <select
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option>1-2 hours</option>
                <option>2-4 hours</option>
                <option>Same Day</option>
                <option>Next Day</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Special Instructions</label>
            <textarea
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
              rows={2}
              placeholder="Any specific instructions for the technician..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button className="px-6 py-2 rounded-md border border-[#236571] text-[#236571] font-semibold bg-white hover:bg-gray-50 transition">
              Cancel
            </button>
            <button className="px-6 py-2 rounded-md bg-[#EFC11A] hover:bg-yellow-400 text-yellow-900 font-semibold flex items-center gap-2 shadow transition">
              <UserPlus className="w-5 h-5" />
              Assign Technician
            </button>
          </div>
        </div>
      </div>

      {/* Technicians List */}
      <aside className="w-full md:w-80 bg-white rounded-xl shadow p-5">
        <div className="text-[#236571] font-semibold mb-4 text-lg">Available Technicians</div>
        <div>
          {technicians.map((tech) => (
            <TechnicianCard key={tech.initials} {...tech} />
          ))}
        </div>
      </aside>
    </div>
    </>
  );
}
