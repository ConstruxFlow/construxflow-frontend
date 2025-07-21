import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import TechnicianCard from "../../components/MaintenanceHead/TechnicianCard";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function TechnicianAssignmentMain() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Team members state
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  const [selectedTechs, setSelectedTechs] = useState([]);
  const [duration, setDuration] = useState("1-2 hours");
  const [instructions, setInstructions] = useState("");
  const [showTeam, setShowTeam] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // New states for assignment
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch equipment details
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

  // Fetch team members
  useEffect(() => {
    setLoadingTeam(true);
    fetch("http://localhost:8080/api/team/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch team members");
        return res.json();
      })
      .then((data) => {
        setTeamMembers(data);
        setLoadingTeam(false);
      })
      .catch(() => setLoadingTeam(false));
  }, []);

  console.log(teamMembers);

  // Assignment submit handler
  const handleAssign = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg("");
    setIsLoading(true);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress((p) => (p >= 90 ? p : p + Math.random() * 5));
    }, 200);

    const reqBody = {
      equipmentSchedulingId: id,
      technicianIds: selectedTechs, // an array
      duration,
      notes: instructions,
      startDate: startDate || null,
      endDate: null,
      startTime: startTime || null,
      endTime: null,
      status: "ASSIGNED",
    };

    try {
      setLoadingProgress(10);

      const res = await fetch(
        "http://localhost:8080/api/equipmentassigntechnician/addassign",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody),
        }
      );

      setLoadingProgress(50);

      if (res.ok) {
        // Update scheduling status
        await updateSchedulingStatus(id, "ASSIGNED");
        setLoadingProgress(100); // Final progress
        toast.success("Technician assigned successfully!");
        navigation("/maintenance/update-equipment-maintenance");
      } else {
        const errText = await res.text();
        toast.error(`Failed to assign technician: ${errText}`);
      }
    } catch (err) {
      toast.error(`Error assigning technician: ${err.message}`);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
      clearInterval(progressInterval);
      setLoadingProgress(0);
    }
  };
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

  const updateSchedulingStatus = async (id, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/equipment-scheduling/status?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: newStatus, // Just the string "ASSIGNED"
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update scheduling status");
      }

      const result = await res.json();
      console.log("Status updated:", result);
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  return (
    <>
      <NavBar
        profileURL="/maintenance/profile"
        links={[
          {
            name: "Dashboard",
            href: "#",
            onClick: () => navigation("/maintenance/dashboard"),
          },
          {
            name: "Task",
            href: "#",
            onClick: () => navigation("/maintenance/scheduling"),
          },
          {
            name: "Schedule",
            href: "#",
            onClick: () =>
              navigation("/maintenance/update-equipment-maintenance"),
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
            onClick: () => navigation("/maintenance/equipment"),
          },
          {
            name: "Add Technician",
            href: "#",
            onClick: () => navigation("/maintenance/add-member"),
          },
        ]}

      />
      {isLoading && (
        <LoadingOverlay progress={loadingProgress} message="Processing..." />
      )}
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row items-start justify-center py-8 px-4 gap-8">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Technician Assignment
            </h1>
            <p className="text-gray-600">
              Assign maintenance requests to available technicians
            </p>
          </div>

          {/* Maintenance Request Details */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="text-[#236571] font-semibold mb-4 text-lg">
              Maintenance Request Details
            </div>
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : equipment ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Equipment ID
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.id}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full ${
                      equipment.status === "Pending"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    } text-xs font-semibold`}
                  >
                    {equipment.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Type
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.equipmentType}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.equipmentName}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Date
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.date ? equipment.date.slice(0, 10) : ""}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Time
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.time}
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Description
                  </label>
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
          <form
            className="bg-white rounded-xl shadow p-6"
            onSubmit={handleAssign}
          >
            <div className="text-[#236571] font-semibold mb-4 text-lg">
              Assignment Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Technicians <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                  value=""
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedName = e.target.selectedOptions[0]?.text;

                    if (!selectedTechs.includes(selectedId)) {
                      setSelectedTechs([...selectedTechs, selectedId]);
                    }
                  }}
                >
                  <option value="" disabled>
                    Select a technician...
                  </option>

                  {teamMembers
                    .filter(
                      (tech) =>
                        tech.availabilityStatus === "AVAILABLE" &&
                        !selectedTechs.includes(tech.empId)
                    )
                    .map((tech) => (
                      <option key={tech.empId} value={tech.empId}>
                        {tech.name} ({tech.specializations?.join(", ")})
                      </option>
                    ))}
                </select>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTechs.map((techId) => {
                  const tech = teamMembers.find((t) => t.empId === techId);
                  if (!tech) return null;
                  return (
                    <span
                      key={techId}
                      className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tech.name}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTechs(
                            selectedTechs.filter((id) => id !== techId)
                          )
                        }
                        className="text-blue-800 hover:text-red-500"
                      >
                        &times;
                      </button>
                    </span>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Expected Duration
                </label>
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
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Special Instructions
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                rows={2}
                placeholder="Any specific instructions for the technician..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
            {submitMsg && (
              <div
                className={`mt-3 text-sm ${
                  submitMsg.startsWith("Technician assigned")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {submitMsg}
              </div>
            )}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-md border border-[#236571] text-[#236571] font-semibold bg-white hover:bg-gray-50 transition"
                onClick={() => {
                  setSelectedTechs("");
                  setDuration("1-2 hours");
                  setInstructions("");
                  setStartDate("");
                  setStartTime("");
                  setSubmitMsg("");
                }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-md bg-[#EFC11A] hover:bg-yellow-400 text-yellow-900 font-semibold flex items-center gap-2 shadow transition"
                disabled={submitting}
              >
                <UserPlus className="w-5 h-5" />
                {submitting ? "Assigning..." : "Assign Technician"}
              </button>
            </div>
          </form>
        </div>

        {/* Technicians List */}
        <aside className="w-full md:w-80 bg-white rounded-xl shadow p-5">
          <div className="text-[#236571] font-semibold mb-4 text-lg">
            Available Technicians
          </div>
          <div>
            {loadingTeam ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              teamMembers
                .filter((member) => member.availabilityStatus === "AVAILABLE")
                .map((member) => (
                  <TechnicianCard
                    key={member.empId}
                    initials={member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                    name={member.name}
                    skills={member.specializations?.join(", ")}
                    status={
                      member.availabilityStatus === "AVAILABLE"
                        ? "Active"
                        : "Unavailable"
                    }
                  />
                ))
            )}
          </div>
        </aside>
      </div>

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
