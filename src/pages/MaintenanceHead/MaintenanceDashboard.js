import React, { useEffect, useState } from "react";
import {
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  FileText,
} from "lucide-react";
import ScheduleOverview from "../../components/MaintenanceHead/ScheduleOverview";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

const navLinks = [
  { name: "Dashboard", href: "/maintenance/dashboard" },
  { name: "Task", href: "/maintenance/scheduling" },
  { name: "Schedule", href: "/maintenance/update-equipment-maintenance" },
  { name: "Team", href: "#" },
  { name: "Equipment", href: "/maintenance/equipment" },
  { name: "Add Technician", href: "/maintenance/add-member" },
];

function ActionTile({ onClick, icon, label, bgColor, hoverColor }) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${hoverColor} text-white px-6 py-3 rounded-lg font-medium transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

const MaintenanceDashboard = () => {
  const [showTeam, setShowTeam] = useState(false);
  const navigation = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [equipmentData, setEquipmentData] = useState([]);
  const [priorityTasks, setPriorityTasks] = useState([]);

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

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/team/all");
        if (!response.ok) {
          throw new Error("Failed to load team members");
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-deep_green/10 text-deep_green";
      case "ON_TASK":
        return "bg-web_yellow/10 text-main_dark";
      case "OFF_DUTY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-light_gray/40 text-slatebluegray";
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/equipment-scheduling")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (task) =>
            task.priority?.toLowerCase() === "high" &&
            (task.status === "Accept" || task.status === "ASSIGNED")
        );
        setPriorityTasks(filtered);
      })
      .catch((err) => {
        console.error("Error fetching priority tasks:", err);
      });
  }, []);

  return (
    <>
      <NavBar
        links={navLinks.map(link => ({
          ...link,
          onClick: link.name === "Team" ? () => setShowTeam(true) : () => navigation(link.href)
        }))}
        onButtonClick={isLoggedIn ? handleLogout : handleLogin}
        logoSrc="/logo1.png"
      />
      
      <div className="bg-purewhite min-h-screen">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-main_dark mb-2">
              Maintenance Dashboard
            </h1>
            <p className="text-slatebluegray text-base">
              Welcome back, John. Here's your maintenance overview.
            </p>
          </div>

          {/* Alert Banner */}
          <div className="bg-gradient-to-r from-web_yellow/15 via-web_yellow/8 to-transparent border-l-4 border-web_yellow rounded-lg p-4 mb-8 flex items-start gap-4 shadow-md">
            <div className="text-yellow-600 text-2xl mt-1">⚠</div>
            <div>
              <h3 className="font-semibold text-base text-gray-800 mb-1 tracking-wide">
                Maintenance Alert
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                3 new maintenance requests require your immediate attention. Please review them to prevent equipment downtime.
              </p>
            </div>
            <button className="ml-auto bg-main_dark text-white px-4 py-2 rounded-lg hover:bg-slatebluegray text-sm transition-colors">
              View All
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Total Tasks</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">142</h3>
                <span className="text-deep_green text-xs">+12% from last month</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-main_dark via-main_dark to-main_dark/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <FileText className="text-purewhite text-lg"/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Completed</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">89</h3>
                <span className="text-deep_green text-xs">+8% completion rate</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <CheckCircle className="text-purewhite text-lg"/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Upcoming</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">23</h3>
                <span className="text-slatebluegray text-xs">Next 7 days</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <Clock className="text-purewhite text-lg"/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Overdue</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">7</h3>
                <span className="text-red-600 text-xs">Needs attention</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-red-500 to-red-500/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <AlertTriangle className="text-purewhite text-lg"/>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Schedule Overview */}
            <div className="lg:col-span-2 bg-purewhite border border-gray-200 rounded-xl shadow-sm">
              <ScheduleOverview />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Priority Tasks */}
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-main_dark">
                    Priority Tasks
                  </h2>
                </div>
                <div className="p-5 space-y-3">
                  {priorityTasks.length === 0 ? (
                    <p className="text-sm text-slatebluegray italic">
                      No high-priority scheduled tasks.
                    </p>
                  ) : (
                    priorityTasks.map((task) => {
                      const date = parseISO(task.date);
                      let dueLabel = format(date, "MMM d");

                      if (isToday(date)) dueLabel = "Due Today";
                      else if (isTomorrow(date)) dueLabel = "Tomorrow";

                      return (
                        <div
                          key={task.id}
                          className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-main_dark">
                              {task.equipmentName}
                            </p>
                            <p className="text-xs text-slatebluegray">{dueLabel}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Team Status */}
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-main_dark">
                    Team Status
                  </h2>
                </div>
                <div className="p-5 space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-web_yellow"></div>
                      <p className="text-slatebluegray text-sm ml-2">
                        Loading team members...
                      </p>
                    </div>
                  ) : teamMembers.length === 0 ? (
                    <p className="text-slatebluegray text-sm">
                      No team data available.
                    </p>
                  ) : (
                    teamMembers.map((member) => (
                      <div
                        key={member.empId}
                        className="flex items-center justify-between p-2 hover:bg-light_gray/20 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-deep_green rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {member.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-sm font-medium text-main_dark">
                            {member.name}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                            member.availabilityStatus
                          )}`}
                        >
                          {member.availabilityStatus
                            ?.replaceAll("_", " ")
                            .toUpperCase()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-purewhite border border-gray-200 rounded-xl shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-main_dark">
                Quick Actions
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-4 justify-center">
                <ActionTile
                  onClick={() => navigation("/maintenance/scheduling")}
                  icon={<Calendar className="h-5 w-5" />}
                  label="Schedule Maintenance"
                  bgColor="bg-deep_green"
                  hoverColor="hover:bg-deep_green/80"
                />
                <ActionTile
                  onClick={() => {}} // Add your navigation here
                  icon={<Plus className="h-5 w-5" />}
                  label="Request Material"
                  bgColor="bg-web_yellow"
                  hoverColor="hover:bg-web_yellow/80"
                />
                <ActionTile
                  onClick={() => navigation("/maintenance/equipment")}
                  icon={<Eye className="h-5 w-5" />}
                  label="View Logs"
                  bgColor="bg-main_dark"
                  hoverColor="hover:bg-slatebluegray"
                />
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
};

export default MaintenanceDashboard;
