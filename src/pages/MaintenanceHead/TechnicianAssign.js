import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserPlus, Calendar, Clock, Settings, User, FileText, AlertCircle } from "lucide-react";
import TechnicianCard from "../../components/MaintenanceHead/TechnicianCard";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";

const navLinks = [
  { name: "Dashboard", href: "/maintenance/dashboard" },
  { name: "Task", href: "/maintenance/scheduling" },
  { name: "Schedule", href: "/maintenance/update-equipment-maintenance" },
  { name: "Team", href: "#" },
  { name: "Equipment", href: "/maintenance/equipment" },
  { name: "Add Technician", href: "/maintenance/add-member" },
];

export default function TechnicianAssignmentMain() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Team members state
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  const [selectedTech, setSelectedTech] = useState("");
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
      technicianId: selectedTech,
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
        setLoadingProgress(100);
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
          body: newStatus,
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

  const handleReset = () => {
    setSelectedTech("");
    setDuration("1-2 hours");
    setInstructions("");
    setStartDate("");
    setStartTime("");
    setSubmitMsg("");
  };

  return (
    <>
      <NavBar
        links={navLinks.map(link => ({
          ...link,
          onClick: link.name === "Team" ? () => setShowTeam(true) : () => navigation(link.href)
        }))}
        showButton={true}
        buttonLabel={isLoggedIn ? "Logout" : "Get Started"}
        onButtonClick={isLoggedIn ? handleLogout : handleLogin}
        logoSrc="/logo1.png"
      />

      {isLoading && (
        <LoadingOverlay
          progress={loadingProgress}
          message="Processing..."
        />
      )}

      <div className="bg-purewhite min-h-screen">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-main_dark mb-2">Technician Assignment</h1>
            <p className="text-slatebluegray text-base">
              Assign maintenance requests to available technicians
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Maintenance Request Details */}
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-5 h-5 text-web_yellow" />
                  <h2 className="text-lg font-semibold text-main_dark">Maintenance Request Details</h2>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow mx-auto mb-4"></div>
                    <p className="text-slatebluegray ml-3">Loading equipment details...</p>
                  </div>
                ) : equipment ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-2">
                        Equipment ID
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-main_dark"
                        value={equipment.id}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-2">
                        Status
                      </label>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            equipment.status === "Pending"
                              ? "bg-web_yellow/10 text-web_yellow"
                              : "bg-deep_green/10 text-deep_green"
                          }`}
                        >
                          {equipment.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-2">
                        Equipment Type
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-main_dark"
                        value={equipment.equipmentType}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-2">
                        Equipment Name
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-main_dark"
                        value={equipment.equipmentName}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-2">
                        Scheduled Date
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg bg-gray-50 text-main_dark"
                          value={equipment.date ? equipment.date.slice(0, 10) : ""}
                          readOnly
                        />
                        <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-2">
                        Scheduled Time
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg bg-gray-50 text-main_dark"
                          value={equipment.time}
                          readOnly
                        />
                        <Clock className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slatebluegray mb-2">
                        Description
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-main_dark resize-none"
                        rows={3}
                        value={equipment.description}
                        readOnly
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">No equipment data found.</p>
                  </div>
                )}
              </div>

              {/* Assignment Details Form */}
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <form onSubmit={handleAssign}>
                  <div className="p-6 sm:p-8 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="w-5 h-5 text-web_yellow" />
                      <h2 className="text-lg font-semibold text-main_dark">Assignment Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-2">
                          Select Technician <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150 text-main_dark"
                          value={selectedTech}
                          onChange={(e) => setSelectedTech(e.target.value)}
                          required
                        >
                          <option value="">Choose a technician...</option>
                          {loadingTeam ? (
                            <option>Loading technicians...</option>
                          ) : (
                            teamMembers
                              .filter(
                                (member) => member.availabilityStatus === "AVAILABLE"
                              )
                              .map((member) => (
                                <option key={member.empId} value={member.empId}>
                                  {member.name} ({member.specializations?.join(", ") || "General"})
                                </option>
                              ))
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-2">
                          Expected Duration
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150 text-main_dark"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                        >
                          <option value="1-2 hours">1-2 hours</option>
                          <option value="2-4 hours">2-4 hours</option>
                          <option value="Same Day">Same Day</option>
                          <option value="Next Day">Next Day</option>
                          <option value="2-3 Days">2-3 Days</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-2">
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150 text-main_dark"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                          />
                          <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-2">
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150 text-main_dark"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                          />
                          <Clock className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-5 h-5 text-web_yellow" />
                      <h2 className="text-lg font-semibold text-main_dark">Special Instructions</h2>
                    </div>
                    
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150 text-main_dark resize-none"
                      rows={4}
                      placeholder="Enter any specific instructions for the technician..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    />
                  </div>

                  {submitMsg && (
                    <div className={`px-6 sm:px-8 py-4 border-b border-gray-200`}>
                      <div
                        className={`p-4 rounded-lg ${
                          submitMsg.startsWith("Technician assigned")
                            ? "bg-deep_green/10 text-deep_green border border-deep_green/20"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {submitMsg}
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={submitting}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-slatebluegray hover:text-main_dark font-semibold hover:bg-gray-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || !selectedTech}
                        className="px-8 py-3 bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark"></div>
                            Assigning...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Assign Technician
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Available Technicians Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-main_dark">Available Technicians</h3>
                  <span className="bg-deep_green/10 text-deep_green px-3 py-1 rounded-full text-xs font-medium">
                    {teamMembers.filter(member => member.availabilityStatus === "AVAILABLE").length} Available
                  </span>
                </div>
                
                <div className="space-y-3">
                  {loadingTeam ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-web_yellow mx-auto mb-2"></div>
                      <p className="text-slatebluegray text-sm">Loading technicians...</p>
                    </div>
                  ) : teamMembers.filter(member => member.availabilityStatus === "AVAILABLE").length > 0 ? (
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
                          skills={member.specializations?.join(", ") || "General Maintenance"}
                          status="Available"
                        />
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-slatebluegray text-sm">No available technicians</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Sidebar Overlay */}
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
