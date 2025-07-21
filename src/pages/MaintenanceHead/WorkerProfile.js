import { useEffect, useState } from "react";
import { Plus, FileText, Phone, User, Mail, Calendar, Badge } from "lucide-react";
import TaskCard from "../../components/MaintenanceHead/TaskCard";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

const tasks = [
  {
    id: "MT-2025-001",
    title: "HVAC System Repair - Building A",
    location: "Building A, Floor 2",
    due: "Today",
    priority: "High Priority",
    priorityColor: "bg-red-100 text-red-800",
    status: "In Progress",
    statusColor: "bg-web_yellow/20 text-web_yellow",
  },
  {
    id: "MT-2025-015",
    title: "Plumbing Maintenance - Floor 3",
    location: "Building B, Floor 3",
    due: "Jun 22",
    priority: "Normal Priority",
    priorityColor: "bg-deep_green/10 text-deep_green",
    status: "Pending",
    statusColor: "bg-light_gray/40 text-slatebluegray",
  },
  {
    id: "MT-2025-008",
    title: "Preventive Maintenance Check",
    location: "Building C, Basement",
    due: "Jun 25",
    priority: "Low Priority",
    priorityColor: "bg-gray-100 text-gray-600",
    status: "Pending",
    statusColor: "bg-light_gray/40 text-slatebluegray",
  },
  {
    id: "MT-2025-022",
    title: "Water System Inspection",
    location: "Building A, Rooftop",
    due: "Jun 28",
    priority: "Normal Priority",
    priorityColor: "bg-deep_green/10 text-deep_green",
    status: "Pending",
    statusColor: "bg-light_gray/40 text-slatebluegray",
  },
];

const specializations = [
  { name: "Plumbing", color: "bg-deep_green/10 text-deep_green" },
  { name: "HVAC", color: "bg-web_yellow/20 text-web_yellow" },
  { name: "Electrical", color: "bg-light_brown/20 text-light_brown" },
  { name: "Water Systems", color: "bg-deep_green/10 text-deep_green" },
  { name: "Carpentry", color: "bg-light_gray/40 text-slatebluegray" },
];

const filters = ["All", "In Progress", "Pending", "Completed"];

export default function WorkerProfile() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showTeam, setShowTeam] = useState(false);  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigate();

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

      <div className="bg-purewhite min-h-screen">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-main_dark mb-2">Worker Profile</h1>
            <p className="text-slatebluegray text-base">View and manage technician profile and task assignments</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Profile & Details */}
            <div className="flex-1 max-w-md">
              {/* Profile Card */}
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col items-center">
                  {/* Profile Avatar */}
                  <div className="w-24 h-24 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white text-2xl font-bold">JS</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-main_dark mb-2">John Smith</h2>
                  
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 text-sm font-medium">Available</span>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-deep_green" />
                  <h3 className="font-semibold text-main_dark">Personal Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-slatebluegray text-sm">Employee ID:</span>
                    <span className="font-medium text-main_dark text-sm">MT-001</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-slatebluegray text-sm">Phone:</span>
                    <span className="font-medium text-main_dark text-sm">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-slatebluegray text-sm">Email:</span>
                    <span className="font-medium text-main_dark text-sm">john.smith@company.com</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-slatebluegray text-sm">Department:</span>
                    <span className="font-medium text-main_dark text-sm">Maintenance</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-slatebluegray text-sm">Join Date:</span>
                    <span className="font-medium text-main_dark text-sm">Jan 15, 2020</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slatebluegray text-sm">Experience:</span>
                    <span className="font-medium text-main_dark text-sm">5 Years</span>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="w-5 h-5 text-deep_green" />
                  <h3 className="font-semibold text-main_dark">Specializations</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <span
                      key={spec.name}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${spec.color}`}
                    >
                      {spec.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Assigned Tasks */}
            <div className="flex-1 flex flex-col">
              {/* Tasks Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-main_dark">Assigned Tasks</h2>
                  <span className="bg-web_yellow text-main_dark text-xs font-bold px-3 py-1 rounded-full">
                    {tasks.length}
                  </span>
                </div>
                <button className="flex items-center gap-2 bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold px-4 py-3 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md">
                  <Plus className="w-4 h-4" />
                  Assign New Task
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      activeFilter === filter
                        ? "bg-deep_green text-white shadow-md"
                        : "bg-gray-100 text-slatebluegray hover:bg-gray-200 hover:text-main_dark"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Task Cards Container */}
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6 flex-1">
                <div className="space-y-4">
                  {tasks
                    .filter((task) => activeFilter === "All" || task.status === activeFilter)
                    .map((task) => (
                      <TaskCard key={task.id} {...task} />
                    ))}
                </div>
                
                {tasks.filter((task) => activeFilter === "All" || task.status === activeFilter).length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-main_dark mb-2">No Tasks Found</h3>
                    <p className="text-slatebluegray">No tasks match the selected filter.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-deep_green hover:bg-deep_green/80 text-white font-semibold py-3 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md">
                  <FileText className="w-4 h-4" />
                  Export Report
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-light_gray/40 hover:bg-light_gray/60 text-main_dark font-semibold py-3 rounded-lg transition-all duration-150">
                  <Phone className="w-4 h-4" />
                  Contact Technician
                </button>
              </div>
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
}
