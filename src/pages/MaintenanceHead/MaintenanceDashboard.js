import React, { use, useEffect, useState } from "react";
import {
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Plus,
  FileText,
} from "lucide-react";
import ScheduleOverview from "../../components/MaintenanceHead/ScheduleOverview";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

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
        setTeamMembers(data); // Set the team data into state
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  console.log("Team Members:", teamMembers);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "ON_TASK":
        return "bg-yellow-100 text-yellow-800";
      case "OFF_DUTY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-200 text-gray-600";
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
  console.log(priorityTasks);

  const getUrgencyColor = (urgency = "HIGH") => {
    switch (urgency.toUpperCase()) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };
  // run once when component mounts

  return (
    <>
      <NavBar
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
        showButton={true}
        buttonLabel={isLoggedIn ? "Logout" : "Get Started"}
        onButtonClick={isLoggedIn ? handleLogout : handleLogin}
      />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Maintenance Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, John. Here's your Maintenance overview.
            </p>
          </div>

          {/* Alert Banner */}
          <div className="bg-yellow-400 border border-yellow-500 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-800 mr-2" />
              <span className="text-yellow-800 font-medium">
                3 new maintenance requests require your attention
              </span>
            </div>
            <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-900 transition-colors">
              View All
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-gray-900">142</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">89</p>
                </div>
                <div className="bg-green-600 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-green-600">+8% completion rate</p>
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900">23</p>
                </div>
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Next 7 days</p>
            </div>

            {/* Overdue */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-3xl font-bold text-gray-900">7</p>
                </div>
                <div className="bg-red-500 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-red-600">Needs attention</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Schedule Overview */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <ScheduleOverview />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Priority Tasks */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Priority Tasks
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {priorityTasks.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
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
                          className="flex items-center space-x-3"
                        >
                          {/* Red dot (for high-priority) */}
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {task.equipmentName}
                            </p>
                            <p className="text-xs text-gray-500">{dueLabel}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Team Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Team Status
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {loading ? (
                    <p className="text-gray-500 text-sm">
                      Loading team members...
                    </p>
                  ) : teamMembers.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No team data available.
                    </p>
                  ) : (
                    teamMembers.map((member) => (
                      <div
                        key={member.empId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          {/* Placeholder avatar */}
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                            {member.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
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
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  onClick={() => navigation("/maintenance/scheduling")}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Maintenance</span>
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Request Material</span>
                </button>
                <button
                  className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  onClick={() => navigation("/maintenance/equipment")}
                >
                  <Eye className="h-5 w-5" />
                  <span>View Logs</span>
                </button>
              </div>
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
};

export default MaintenanceDashboard;
