import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // <-- Import this!
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
  const { id } = useParams(); // <-- Get the equipment ID from the URL
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState("");
  const [duration, setDuration] = useState("1-2 hours");
  const [instructions, setInstructions] = useState("");
  const [showTeam, setShowTeam] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/equipment-scheduling/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch equipment data");
        return res.json();
      })
      .then((data) => {
        setEquipment(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "#" },
          { name: "Task", href: "#" },
          { name: "Team", href: "#", onClick: () => setShowTeam(true) },
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
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : equipment ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Equipment ID</label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.id}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full ${
                    equipment.status === "Pending"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  } text-xs font-semibold`}>
                    {equipment.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.equipmentType}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.equipmentName}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.date ? equipment.date.slice(0, 10) : ""}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.time}
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    rows={2}
                    value={equipment.description}
                    readOnly
                  />
                </div>
              </div>
            ) : (
              <div className="text-red-500">No equipment data found.</div>
            )}
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
