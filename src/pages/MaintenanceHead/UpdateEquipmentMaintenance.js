import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Bell,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Eye,
  Play,
  CheckSquare,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import {
  isThisWeek,
  isThisMonth,
  isBefore,
  startOfMonth,
  endOfMonth,
  parseISO,
  isSameMonth,
  addMonths,
} from "date-fns";

const navLinks = [
  { name: "Dashboard", href: "/maintenance/dashboard" },
  { name: "Task", href: "/maintenance/scheduling" },
  { name: "Schedule", href: "/maintenance/update-equipment-maintenance" },
  { name: "Team", href: "#" },
  { name: "Equipment", href: "/maintenance/equipment" },
  { name: "Add Technician", href: "/maintenance/add-member" },
];

// Modal component for equipment details
function EquipmentDetailsModal({ open, onClose, equipment }) {
  if (!open || !equipment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-main_dark">
              Equipment Details
            </h3>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-slatebluegray" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-slatebluegray">
                  Equipment ID:
                </span>
                <p className="text-main_dark font-medium">{equipment.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">
                  Type:
                </span>
                <p className="text-main_dark font-medium">
                  {equipment.equipmentType}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">
                  Name:
                </span>
                <p className="text-main_dark font-medium">
                  {equipment.equipmentName}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">
                  Date:
                </span>
                <p className="text-main_dark font-medium">
                  {equipment.date?.slice(0, 10)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">
                  Time:
                </span>
                <p className="text-main_dark font-medium">{equipment.time}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">
                  Status:
                </span>
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
              <span className="text-sm font-medium text-slatebluegray">
                Description:
              </span>
              <p className="text-main_dark font-medium mt-1">
                {equipment.description}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-slatebluegray">
                Maintenance Requests:
              </span>
              <div className="mt-2 space-y-2">
                {equipment.maintenanceRequests &&
                equipment.maintenanceRequests.length > 0 ? (
                  equipment.maintenanceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-gray-50 p-3 rounded-lg border"
                    >
                      <div className="font-semibold text-main_dark">
                        {req.itemName}
                      </div>
                      <div className="text-sm text-slatebluegray">
                        Quantity: {req.quantity} {req.measurement}
                      </div>
                      <div className="text-sm text-slatebluegray">
                        Justification: {req.justification}
                      </div>
                      <div className="text-sm text-slatebluegray">
                        Urgency: {req.urgency}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slatebluegray text-sm">
                    No maintenance requests
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal component for task completion details
function TaskCompleteModal({ open, onClose, equipment }) {
  const [assignments, setAssignments] = useState([]);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [completionTime, setCompletionTime] = useState(null);

  useEffect(() => {
    if (!open || !equipment) return;

    // Fetch assignments data
    fetch(
      `http://localhost:8080/api/equipmentassigntechnician/getbyassignId?scheduleId=${encodeURIComponent(
        equipment.id
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return res.json();
      })
      .then((data) => {
        const formatted = Array.isArray(data) ? data : [data];
        setAssignments(formatted);

        console.log("Assignment data for completion:", formatted);

        // Try to get completion time from the assignment data
        if (formatted.length > 0) {
          const assignment = formatted[0];
          console.log("Assignment fields:", Object.keys(assignment));

          // Check various possible completion time fields
          if (assignment.completionTime) {
            setCompletionTime(assignment.completionTime);
            console.log("Using completionTime:", assignment.completionTime);
          } else if (assignment.endDate) {
            setCompletionTime(assignment.endDate);
            console.log("Using endDate:", assignment.endDate);
          } else if (assignment.actualEndTime) {
            setCompletionTime(assignment.actualEndTime);
            console.log("Using actualEndTime:", assignment.actualEndTime);
          } else if (assignment.finishedAt) {
            setCompletionTime(assignment.finishedAt);
            console.log("Using finishedAt:", assignment.finishedAt);
          } else {
            // If no completion time available, use current time as fallback
            const currentTime = new Date().toISOString();
            setCompletionTime(currentTime);
            console.log(
              "No completion time found, using current time:",
              currentTime
            );
          }
        } else {
          setCompletionTime(new Date().toISOString());
        }
      })
      .catch((err) => {
        console.error("Error fetching assignment details:", err);
        setAssignments([]);
        setCompletionTime(new Date().toISOString());
      });

    // Fetch team members
    fetch("http://localhost:8080/api/team/all")
      .then((res) => res.json())
      .then(setTeamMembers)
      .catch((err) => {
        console.error("Error fetching team members:", err);
      });
  }, [open, equipment]);

  // Fetch next schedule when assignments are loaded
  useEffect(() => {
    if (!assignments.length || !equipment) return;

    const assignId = assignments[0]?.assignId;
    if (!assignId) return;

    fetch(
      `http://localhost:8080/api/nextschedule?assignId=${encodeURIComponent(
        assignId
      )}`
    )
      .then((res) => {
        if (res.status === 404) throw new Error("Schedule not found");
        if (!res.ok) throw new Error("Failed to fetch next schedule");
        return res.json();
      })
      .then((data) => {
        const scheduleArray = Array.isArray(data) ? data : [data];
        const uniqueSchedule =
          scheduleArray.length > 0
            ? {
                nextDate: scheduleArray[0].nextDate,
                nextMaintenanceType: scheduleArray[0].nextMaintenanceType,
                priority: scheduleArray[0].priority,
                estimateDuration: scheduleArray[0].estimateDuration,
                technicians: scheduleArray.map((item) => ({
                  technicianId: item.technicianId,
                  nextScheduleId: item.nextScheduleId,
                })),
              }
            : null;
        setNextSchedule(uniqueSchedule);
      })
      .catch((err) => {
        setNextSchedule(null);
        console.error("Error fetching next schedule:", err);
      });
  }, [assignments, equipment]);

  if (!open || !equipment) return null;

  const getHoursDifference = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return null;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(start) || isNaN(end)) return null;
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours.toFixed(1);
  };

  const getFormattedCompletionTime = () => {
    if (!completionTime) return "Completion time not available";

    const date = new Date(completionTime);
    if (isNaN(date.getTime())) return "Invalid completion time";

    return `Completed on ${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    })} at ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const formatted = getFormattedCompletionTime();

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-main_dark">
              Task Completion Details
            </h3>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-slatebluegray" />
            </button>
          </div>

          {/* Success Banner */}
          <div className="bg-[#EFC11A] rounded-lg flex flex-col items-center justify-center py-8 mb-8">
            <CheckCircle className="w-10 h-10 text-[#236571] mb-2" />
            <h2 className="text-xl font-semibold text-[#236571] mb-1">
              Task Completed Successfully
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Request Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="font-semibold text-[#236571] mb-3">
                  Request Summary
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Request ID:</div>
                    <div className="font-medium text-gray-900">
                      {equipment.id}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Equipment Name:</div>
                    <div className="font-medium text-gray-900">
                      {equipment.equipmentName}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Category:</div>
                    <div className="font-medium text-gray-900">
                      {equipment.equipmentType}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="font-semibold text-[#236571] mb-3">
                  Status Update
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Previous Status:</div>
                    <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium mt-1">
                      {equipment.priority} Priority -{" "}
                      {equipment.maintenanceType}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Current Status:</div>
                    <div className="inline-block px-3 py-1 rounded-full bg-[#EFC11A] text-yellow-900 text-xs font-medium mt-1">
                      Operational - Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-[#236571] mb-4">
                  Completion Details
                </h3>

                {/* Completion Time */}
                <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Completion Time:
                  </div>
                  <div className="text-sm font-semibold text-[#236571]">
                    {formatted}
                  </div>
                </div>

                {assignments.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-500">Start Date:</div>
                      <div className="font-medium text-gray-900">
                        {assignments[0]?.startDate || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Expected Duration:</div>
                      <div className="font-medium text-gray-900">
                        {assignments[0]?.duration || "N/A"}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-gray-500">Notes:</div>
                      <div className="font-medium text-gray-900">
                        {assignments[0]?.notes || "No notes provided"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Technicians List */}
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Technicians:
                  </div>
                  <div className="space-y-3">
                    {assignments.map((assign, index) => {
                      const tech = teamMembers.find(
                        (t) => t.empId === assign.technicianId
                      );
                      const initials =
                        tech?.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")
                          ?.toUpperCase() || "T";

                      return (
                        <div
                          key={assign.assignId}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-[#236571] text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {tech?.name ?? assign.technicianId}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Duration difference */}
                {nextSchedule && assignments.length > 0 && (
                  <div className="mt-6 text-sm">
                    <div className="text-gray-500">Actual Duration:</div>
                    <div className="font-medium text-gray-900">
                      {getHoursDifference(
                        assignments[0]?.startDate,
                        nextSchedule?.nextDate
                      ) || "N/A"}{" "}
                      hours ({assignments[0]?.duration || "Expected unknown"})
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Equipment Status Updated */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-[#236571]">
                    Equipment Status Updated
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#236571] text-white text-xs font-medium">
                    Operational
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <div className="flex justify-between">
                    <span>Next Maintenance:</span>
                    <span className="font-medium">
                      {nextSchedule?.nextDate || "Not scheduled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection Due:</span>
                    <span className="font-medium">
                      {assignments[0]?.startDate || "N/A"}
                    </span>
                  </div>
                  {nextSchedule?.technicians && (
                    <div className="flex justify-between mt-1">
                      <span>Assigned Technicians:</span>
                      <span className="font-medium">
                        {nextSchedule.technicians.length} technician(s)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="font-semibold text-gray-600 mb-2">
                  Recommended Actions
                </div>
                <div className="bg-white rounded mb-2 p-3 shadow-sm">
                  <div className="font-semibold text-gray-800 text-sm">
                    {nextSchedule?.nextMaintenanceType ||
                      "No upcoming maintenance"}
                  </div>
                  {nextSchedule?.nextDate && (
                    <div className="text-xs text-gray-600 mt-1">
                      Scheduled for: {nextSchedule.nextDate}
                    </div>
                  )}
                  {nextSchedule?.estimateDuration && (
                    <div className="text-xs text-gray-600">
                      Duration: {nextSchedule.estimateDuration}
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications Sent */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-600 mb-2">
                  Notifications Sent
                </div>
                <div className="flex flex-col gap-1 text-sm text-gray-800">
                  <div className="flex items-center gap-2">
                    <span>Inventory Manager</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Admin</span>
                    <span className="text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpcomingEquipmentMaintenance() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskCompleteModalOpen, setTaskCompleteModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Stats state
  const [dueThisWeekCount, setDueThisWeekCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [nextMonthCount, setNextMonthCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("All");
  const navigation = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/equipment-scheduling")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch equipment data");
        return res.json();
      })
      .then((data) => {
        setEquipmentData(data);
        setLoading(false);
        calculateScheduleStats(data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const calculateScheduleStats = (data) => {
    const now = new Date();

    const currentWeekCount = data.filter((item) => {
      if (!item.date) return false;
      return isThisWeek(parseISO(item.date), { weekStartsOn: 1 });
    }).length;

    const overdue = data.filter((item) => {
      if (!item.date) return false;
      const date = new Date(item.date);
      return isBefore(date, now) && item.status !== "Completed";
    }).length;

    const nextMonth = data.filter((item) => {
      if (!item.date) return false;
      const target = parseISO(item.date);
      const nextMonthStart = startOfMonth(addMonths(now, 1));
      const nextMonthEnd = endOfMonth(addMonths(now, 1));
      return target >= nextMonthStart && target <= nextMonthEnd;
    }).length;

    setDueThisWeekCount(currentWeekCount);
    setOverdueCount(overdue);
    setNextMonthCount(nextMonth);
  };

  // Check login state on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleViewDetails = (equipment) => {
    setSelectedEquipment(equipment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleViewTaskComplete = (equipment) => {
    setSelectedEquipment(equipment);
    setTaskCompleteModalOpen(true);
  };

  const closeTaskCompleteModal = () => {
    setTaskCompleteModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleStartMaintenance = (id) => {
    navigate(`/maintenance/technician-assignment/${id}`);
  };

  const handleGotoComplete = () => {
    navigate("/maintenance/upcoming-maintenance");
  };

  // Filter data
  const filteredData = equipmentData.filter((equipment) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      equipment.id?.toString().toLowerCase().includes(term) ||
      equipment.equipmentName?.toLowerCase().includes(term) ||
      equipment.equipmentType?.toLowerCase().includes(term);

    const matchesStatus =
      selectedStatus === "All" || equipment.status === selectedStatus;
    const matchesType =
      selectedEquipmentType === "All" ||
      equipment.equipmentType === selectedEquipmentType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const equipmentTypes = Array.from(
    new Set(equipmentData.map((item) => item.equipmentType))
  );

  const getActionButton = (equipment) => {
    if (equipment.status === "Pending") {
      return (
        <button
          className="text-deep_green hover:text-deep_green/80 transition-colors"
          onClick={() => handleViewDetails(equipment)}
        >
          <Eye className="w-4 h-4" />
        </button>
      );
    } else if (equipment.status === "Accept") {
      return (
        <button
          className="text-deep_green hover:text-deep_green/80 transition-colors"
          onClick={() => handleStartMaintenance(equipment.id)}
        >
          <Play className="w-4 h-4" />
        </button>
      );
    } else if (equipment.status === "Completed") {
      return (
        <button
          className="text-deep_green hover:text-deep_green/80 transition-colors"
          onClick={() => handleViewTaskComplete(equipment)}
        >
          <CheckSquare className="w-4 h-4" />
        </button>
      );
    } else {
      return (
        <button
          className="text-deep_green hover:text-deep_green/80 transition-colors"
          onClick={() => handleGotoComplete(equipment.id)}
        >
          <CheckSquare className="w-4 h-4" />
        </button>
      );
    }
  };

  return (
    <>
      <NavBar
        profileURL="/maintenance/profile"
        links={navLinks.map((link) => ({
          ...link,
          onClick:
            link.name === "Team"
              ? () => setShowTeam(true)
              : () => navigate(link.href),
        }))}
      />

      <div className="bg-purewhite min-h-screen">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Upcoming Equipment Maintenance
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage and schedule maintenance tasks for construction equipment
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="bg-web_yellow hover:bg-web_yellow/80 text-main_dark px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                onClick={() => navigate("/maintenance/scheduling")}
              >
                <Plus className="w-4 h-4" />
                Schedule Maintenance
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slatebluegray" onClick={()=>navigation("/maintenance/inventory-request")}/>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Due This Week
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {dueThisWeekCount}
                </h3>
                <span className="text-web_yellow text-xs">
                  {dueThisWeekCount === 1
                    ? "1 Task"
                    : `${dueThisWeekCount} Tasks`}
                </span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <AlertTriangle className="text-purewhite text-lg" />
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Overdue
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {overdueCount}
                </h3>
                <span className="text-red-600 text-xs">
                  {overdueCount === 1 ? "1 Task" : `${overdueCount} Tasks`}
                </span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-red-500 to-red-500/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <AlertTriangle className="text-purewhite text-lg" />
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Next Month
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {nextMonthCount}
                </h3>
                <span className="text-deep_green text-xs">
                  {nextMonthCount === 1 ? "1 Task" : `${nextMonthCount} Tasks`}
                </span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <Calendar className="text-purewhite text-lg" />
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Total Equipment
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {equipmentData.length}
                </h3>
                <span className="text-deep_green text-xs">
                  {equipmentData.length === 1
                    ? "1 Item"
                    : `${equipmentData.length} Items`}
                </span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <CheckCircle className="text-purewhite text-lg" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Equipment
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Type
                </label>
                <select
                  value={selectedEquipmentType}
                  onChange={(e) => setSelectedEquipmentType(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  <option value="All">All Types</option>
                  {equipmentTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accept">Accepted</option>
                  <option value="Completed">Completed</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} equipment
            </p>
          </div>

          {/* Equipment Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Equipment Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Next Scheduled
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow mx-auto mb-4"></div>
                        Loading equipment...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No equipment found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((equipment) => (
                      <tr
                        key={equipment.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-main_dark">
                          {equipment.equipmentName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {equipment.maintenanceRequests &&
                          equipment.maintenanceRequests.length > 0
                            ? equipment.maintenanceRequests[0].justification
                            : equipment.description || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {equipment.date ? equipment.date.slice(0, 10) : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              equipment.status === "Pending"
                                ? "bg-web_yellow/10 text-web_yellow"
                                : equipment.status === "Accept"
                                ? "bg-deep_green/10 text-deep_green"
                                : equipment.status === "Completed"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-deep_green/10 text-deep_green"
                            }`}
                          >
                            {equipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getActionButton(equipment)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading equipment...</p>
                </div>
              ) : paginatedData.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No equipment found matching your criteria.
                </div>
              ) : (
                paginatedData.map((equipment) => (
                  <div key={equipment.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-main_dark text-sm mb-1">
                          {equipment.equipmentName}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {equipment.maintenanceRequests &&
                          equipment.maintenanceRequests.length > 0
                            ? equipment.maintenanceRequests[0].justification
                            : equipment.description || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Next:{" "}
                          {equipment.date ? equipment.date.slice(0, 10) : "-"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            equipment.status === "Pending"
                              ? "bg-web_yellow/10 text-web_yellow"
                              : equipment.status === "Accept"
                              ? "bg-deep_green/10 text-deep_green"
                              : equipment.status === "Completed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-deep_green/10 text-deep_green"
                          }`}
                        >
                          {equipment.status}
                        </span>
                        {getActionButton(equipment)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                    currentPage === index + 1
                      ? "bg-web_yellow text-main_dark"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Details Modal */}
      <EquipmentDetailsModal
        open={modalOpen}
        onClose={closeModal}
        equipment={selectedEquipment}
      />

      {/* Task Complete Modal */}
      <TaskCompleteModal
        open={taskCompleteModalOpen}
        onClose={closeTaskCompleteModal}
        equipment={selectedEquipment}
      />

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
