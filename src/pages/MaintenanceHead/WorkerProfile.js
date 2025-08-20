import { useEffect, useState } from "react";
import { Plus, FileText, Phone, User, Badge } from "lucide-react";
import NavBar from "../../components/NavBar";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

export default function WorkerProfile() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showTeam, setShowTeam] = useState(false);
  const [technicianData, setTechnicianData] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const navigation = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Get technician data from navigation state or fetch from API
  useEffect(() => {
    const fetchTechnicianData = async () => {
      try {
        setLoading(true);

        // Check if data was passed via navigation state
        if (location.state?.technicianData) {
          setTechnicianData(location.state.technicianData);
          setLoading(false);
          return;
        }

        // If no empId in URL, show error
        if (!id) {
          setError("No technician ID provided");
          setLoading(false);
          return;
        }

        // Fetch from API
        const response = await fetch(
          `http://localhost:8080/api/team?id=${encodeURIComponent(id)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch technician data");
        }

        const data = await response.json();
        setTechnicianData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicianData();
  }, [id, location.state]);

  // Fetch assigned tasks for the technician
  useEffect(() => {
    // Function to update technician status
    const updateTechnicianStatus = async (newStatus) => {
      if (!technicianData?.empId) return;

      try {
        const response = await fetch(
          `http://localhost:8080/api/team/updateStatus?empId=${encodeURIComponent(
            technicianData.empId
          )}&status=${encodeURIComponent(newStatus)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Update local state
          setTechnicianData((prev) => ({
            ...prev,
            availabilityStatus: newStatus,
          }));
          console.log(`Technician status updated to: ${newStatus}`);
          setStatusUpdateMessage(
            `Status automatically updated to ${newStatus} based on active tasks`
          );
          setTimeout(() => setStatusUpdateMessage(""), 5000); // Clear message after 5 seconds
        } else {
          console.error("Failed to update technician status");
        }
      } catch (error) {
        console.error("Error updating technician status:", error);
      }
    };

    const fetchAssignedTasks = async () => {
      if (!technicianData?.empId) return;

      try {
        setTasksLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/equipmentassigntechnician/getbytechnicianId?id=${encodeURIComponent(
            technicianData.empId
          )}`
        );

        if (response.ok) {
          const tasksData = await response.json();
          setAssignedTasks(tasksData);

          // Check if technician should be automatically set to ON_DUTY
          await checkAndUpdateTechnicianStatus(tasksData);
        } else {
          console.log("No tasks found for this technician");
          setAssignedTasks([]);
        }
      } catch (err) {
        console.error("Error fetching assigned tasks:", err);
        setAssignedTasks([]);
      } finally {
        setTasksLoading(false);
      }
    };

    // Function to check if technician should be ON_DUTY and update status
    const checkAndUpdateTechnicianStatus = async (tasks) => {
      if (!technicianData?.empId || !tasks) return;

      const activeTasks = tasks.filter(
        (task) => task.status === "IN_PROGRESS" || task.status === "ASSIGNED"
      );

      const hasTasksToday = tasks.some((task) => {
        if (!task.startDate) return false;
        const taskDate = new Date(task.startDate);
        const today = new Date();
        return (
          taskDate.toDateString() === today.toDateString() &&
          (task.status === "IN_PROGRESS" || task.status === "ASSIGNED")
        );
      });

      // If technician has active tasks and is not already ONTASK, update status
      if (
        (activeTasks.length > 0 || hasTasksToday) &&
        technicianData.availabilityStatus !== "ONTASK"
      ) {
        await updateTechnicianStatus("ONTASK");
      }
    };

    fetchAssignedTasks();
  }, [technicianData?.empId, technicianData?.availabilityStatus]);

  // Function to map assigned tasks to display format
  const mapAssignedTasksToDisplay = (tasks) => {
    return tasks.map((task) => ({
      id: task.assignId,
      title: `Equipment Maintenance - ${task.equipmentSchedulingId}`,
      location: "Equipment Location", // You might want to fetch equipment details separately
      due: task.startDate || "Not scheduled",
      priority: getTaskPriority(task.status),
      priorityColor: getPriorityColor(task.status),
      status: task.status || "Unknown",
      statusColor: getStatusColor(task.status),
      duration: task.duration,
      notes: task.notes,
      startTime: task.startTime,
      endTime: task.endTime,
      equipmentId: task.equipmentSchedulingId,
    }));
  };

  // Helper functions for styling
  const getTaskPriority = (status) => {
    switch (status?.toUpperCase()) {
      case "ASSIGNED":
      case "IN_PROGRESS":
        return "High Priority";
      case "PENDING":
        return "Normal Priority";
      case "COMPLETED":
        return "Low Priority";
      default:
        return "Normal Priority";
    }
  };

  const getPriorityColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ASSIGNED":
      case "IN_PROGRESS":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-deep_green/10 text-deep_green";
      case "COMPLETED":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-deep_green/10 text-deep_green";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-web_yellow/20 text-web_yellow";
      case "PENDING":
        return "bg-light_gray/40 text-slatebluegray";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-light_gray/40 text-slatebluegray";
    }
  };

  // Manual status change function
  const handleManualStatusChange = async (newStatus) => {
    if (!technicianData?.empId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/team/updateStatus?empId=${encodeURIComponent(
          technicianData.empId
        )}&status=${encodeURIComponent(newStatus)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update local state
        setTechnicianData((prev) => ({
          ...prev,
          availabilityStatus: newStatus,
        }));
        console.log(`Technician status manually updated to: ${newStatus}`);
        setStatusUpdateMessage(`Status manually updated to ${newStatus}`);
        setTimeout(() => setStatusUpdateMessage(""), 3000); // Clear message after 3 seconds
      } else {
        console.error("Failed to update technician status");
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating technician status:", error);
      alert("Error updating status. Please check your connection.");
    }
  };

  // Get filtered tasks
  const displayTasks = mapAssignedTasksToDisplay(assignedTasks);
  const filteredTasks = displayTasks.filter(
    (task) => activeFilter === "All" || task.status === activeFilter
  );

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

      <div className="bg-purewhite min-h-screen">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-main_dark mb-2">
              Worker Profile
            </h1>
            <p className="text-slatebluegray text-base">
              View and manage technician profile and task assignments
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep_green mx-auto mb-4"></div>
                <p className="text-slatebluegray">Loading technician data...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center min-h-96">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-main_dark mb-2">
                  Error Loading Profile
                </h3>
                <p className="text-slatebluegray mb-4">{error}</p>
                <button
                  onClick={() => navigation("/maintenance/dashboard")}
                  className="bg-deep_green text-white px-4 py-2 rounded-lg hover:bg-deep_green/80"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Profile Content */}
          {!loading && !error && technicianData && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Profile & Details */}
              <div className="flex-1 max-w-md">
                {/* Profile Card */}
                <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex flex-col items-center">
                    {/* Profile Avatar */}
                    <div className="w-24 h-24 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-white text-2xl font-bold">
                        {technicianData.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")
                          ?.toUpperCase()
                          ?.slice(0, 2) || "T"}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-main_dark mb-2">
                      {technicianData.name || "Unknown"}
                    </h2>

                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                          technicianData.availabilityStatus === "AVAILABLE"
                            ? "bg-green-50 border-green-200"
                            : technicianData.availabilityStatus ===
                              "UNAVAILABLE"
                            ? "bg-red-50 border-red-200"
                            : technicianData.availabilityStatus === "ONTASK"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            technicianData.availabilityStatus === "AVAILABLE"
                              ? "bg-green-500"
                              : technicianData.availabilityStatus ===
                                "UNAVAILABLE"
                              ? "bg-red-500"
                              : technicianData.availabilityStatus === "ONTASK"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${
                            technicianData.availabilityStatus === "AVAILABLE"
                              ? "text-green-700"
                              : technicianData.availabilityStatus ===
                                "UNAVAILABLE"
                              ? "text-red-700"
                              : technicianData.availabilityStatus === "ONTASK"
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {technicianData.availabilityStatus === "ONTASK"
                            ? "On Task"
                            : technicianData.availabilityStatus || "Unknown"}
                        </span>
                      </div>

                      {/* Manual Status Change */}
                      <div className="flex gap-2">
                        <select
                          value={
                            selectedStatus ||
                            technicianData.availabilityStatus ||
                            "AVAILABLE"
                          }
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="text-xs px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-deep_green"
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="ONTASK">On Task</option>
                          <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                        <button
                          onClick={() =>
                            handleManualStatusChange(
                              selectedStatus ||
                                technicianData.availabilityStatus
                            )
                          }
                          className="text-xs px-3 py-1 bg-deep_green text-white rounded hover:bg-deep_green/80 transition-colors"
                          title="Update Status"
                        >
                          Update
                        </button>
                      </div>

                      {/* Status Update Message */}
                      {statusUpdateMessage && (
                        <div className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 mt-2">
                          {statusUpdateMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-deep_green" />
                    <h3 className="font-semibold text-main_dark">
                      Personal Details
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">
                        Employee ID:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.empId || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">Phone:</span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">Email:</span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">
                        Department:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.department || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">
                        Join Date:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.joinDate || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">
                        Gender:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.gender || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">NIC:</span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.nic || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slatebluegray text-sm">
                        Experience:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.experience || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="w-5 h-5 text-deep_green" />
                    <h3 className="font-semibold text-main_dark">
                      Specializations
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {technicianData.specializations &&
                    technicianData.specializations.length > 0 ? (
                      technicianData.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-deep_green/10 text-deep_green"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No specializations listed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Assigned Tasks */}
              <div className="flex-1 flex flex-col">
                {/* Tasks Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-main_dark">
                      Assigned Tasks
                    </h2>
                    <span className="bg-web_yellow text-main_dark text-xs font-bold px-3 py-1 rounded-full">
                      {tasksLoading ? "..." : assignedTasks.length}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold px-4 py-3 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md">
                    <Plus className="w-4 h-4" />
                    Assign New Task
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    "All",
                    "ASSIGNED",
                    "IN_PROGRESS",
                    "PENDING",
                    "COMPLETED",
                  ].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        activeFilter === filter
                          ? "bg-deep_green text-white shadow-md"
                          : "bg-gray-100 text-slatebluegray hover:bg-gray-200 hover:text-main_dark"
                      }`}
                    >
                      {filter === "All" ? filter : filter.replace("_", " ")}
                    </button>
                  ))}
                </div>

                {/* Task Cards Container */}
                <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6 flex-1">
                  {tasksLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep_green"></div>
                      <span className="ml-2 text-slatebluegray">
                        Loading tasks...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                          <div
                            key={task.id}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-main_dark">
                                {task.title}
                              </h3>
                              <div className="flex gap-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${task.priorityColor}`}
                                >
                                  {task.priority}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${task.statusColor}`}
                                >
                                  {task.status?.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-slatebluegray">
                              <div>
                                <span className="font-medium">
                                  Equipment ID:
                                </span>{" "}
                                {task.equipmentId}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span>{" "}
                                {task.duration || "Not specified"}
                              </div>
                              <div>
                                <span className="font-medium">Start Date:</span>{" "}
                                {task.due}
                              </div>
                              <div>
                                <span className="font-medium">Time:</span>{" "}
                                {task.startTime
                                  ? `${task.startTime} - ${
                                      task.endTime || "TBD"
                                    }`
                                  : "Not specified"}
                              </div>
                            </div>
                            {task.notes && (
                              <div className="mt-2 text-sm text-slatebluegray">
                                <span className="font-medium">Notes:</span>{" "}
                                {task.notes}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4">📋</div>
                          <h3 className="text-lg font-semibold text-main_dark mb-2">
                            No Tasks Found
                          </h3>
                          <p className="text-slatebluegray">
                            {assignedTasks.length === 0
                              ? "This technician has no assigned tasks."
                              : "No tasks match the selected filter."}
                          </p>
                        </div>
                      )}
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
          )}
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
