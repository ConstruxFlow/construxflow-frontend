import { useEffect, useState } from "react";
import { Plus, FileText, Phone } from "lucide-react";
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
    priorityColor: "bg-[#EFC11A] text-yellow-900",
    status: "In Progress",
    statusColor: "bg-[#236571] text-white",
  },
  {
    id: "MT-2025-015",
    title: "Plumbing Maintenance - Floor 3",
    location: "Building B, Floor 3",
    due: "Jun 22",
    priority: "Normal Priority",
    priorityColor: "bg-[#236571] text-white",
    status: "Pending",
    statusColor: "bg-[#236571] text-white",
  },
  {
    id: "MT-2025-008",
    title: "Preventive Maintenance Check",
    location: "Building C, Basement",
    due: "Jun 25",
    priority: "Low Priority",
    priorityColor: "bg-gray-200 text-gray-700",
    status: "Pending",
    statusColor: "bg-[#236571] text-white",
  },
  {
    id: "MT-2025-022",
    title: "Water System Inspection",
    location: "Building A, Rooftop",
    due: "Jun 28",
    priority: "Normal Priority",
    priorityColor: "bg-[#236571] text-white",
    status: "Pending",
    statusColor: "bg-[#236571] text-white",
  },
];

const specializations = [
  { name: "Plumbing", color: "bg-[#236571] text-white" },
  { name: "HVAC", color: "bg-[#236571] text-white" },
  { name: "Electrical", color: "bg-gray-200 text-gray-700" },
  { name: "Water Systems", color: "bg-[#236571] text-white" },
  { name: "Carpentry", color: "bg-gray-200 text-gray-700" },
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
          { name: "Task", href: "#",onClick: () => navigation("/maintenance/scheduling") },
          { name: "Team", href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");
              
              setShowTeam(true);
            },
           },
          { name: "Equipment", href: "#" ,onClick: () => navigation("/maintenance/log")},
          { name: "Add Technician", href: "#",onClick: () => navigation("/maintenance/add-member") },
        ]}
        showButton={true}
        buttonLabel={isLoggedIn ? "Logout" : "Get Started"}
        onButtonClick={isLoggedIn ? handleLogout : handleLogin}
    />

    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left: Profile & Details */}
        <div className="flex-1 max-w-md">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm px-6 py-6 flex flex-col items-center mb-6">
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex flex-col items-center mb-2">
                <div className="w-full flex justify-center">
                  <div className="w-full">
                    <div className="w-full flex justify-center">
                      <div className="w-32 h-12 bg-[#236571] rounded-t-lg flex items-end justify-center relative">
                        <span className="text-white text-3xl font-bold tracking-widest absolute top-3 left-1/2 -translate-x-1/2">
                          JS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900 mt-4">John Smith</div>
                <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full mt-2 text-[#236571] text-sm font-semibold">
                  <span className="w-2 h-2 bg-[#14c381] rounded-full"></span>
                  Available
                </span>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-lg shadow-sm px-6 py-5 mb-6">
            <div className="font-semibold text-[#236571] mb-2">Personal Details</div>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Employee ID:</span>
                <span className="font-medium text-gray-900">MT-001</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900">(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Email:</span>
                <span className="font-medium text-gray-900 break-all">john.smith@company.com</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Department:</span>
                <span className="font-medium text-gray-900">Maintenance</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Join Date:</span>
                <span className="font-medium text-gray-900">Jan 15, 2020</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500">Experience:</span>
                <span className="font-medium text-gray-900">5 Years</span>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-white rounded-lg shadow-sm px-6 py-5">
            <div className="font-semibold text-[#236571] mb-2">Specializations</div>
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec) => (
                <span
                  key={spec.name}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${spec.color}`}
                >
                  {spec.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Assigned Tasks */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-[#236571]">Assigned Tasks</span>
              <span className="bg-[#EFC11A] text-[#236571] text-xs font-bold px-2 py-0.5 rounded-full">4</span>
            </div>
            <button className="flex items-center gap-2 bg-[#EFC11A] hover:bg-yellow-400 text-[#236571] font-semibold px-4 py-2 rounded transition text-sm">
              <Plus className="w-4 h-4" />
              Assign New Task
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1 rounded-full text-sm font-semibold border transition ${
                  activeFilter === filter
                    ? "bg-[#236571] text-white border-[#236571]"
                    : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Task Cards */}
          <div>
            {tasks
              .filter((task) => activeFilter === "All" || task.status === activeFilter)
              .map((task) => (
                <TaskCard key={task.id} {...task} />
              ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#236571] hover:bg-[#17484b] text-white font-semibold py-2 rounded transition">
              <FileText className="w-4 h-4" />
              Export Report
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded transition">
              <Phone className="w-4 h-4" />
              Contact Technician
            </button>
          </div>
        </div>
      </div>
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
