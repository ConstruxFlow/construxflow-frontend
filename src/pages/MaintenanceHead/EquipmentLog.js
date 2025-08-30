import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Bell,
  Calendar,
  List,
  Grid,
  Download,
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
  Wrench,
} from "lucide-react";
import EquipmentLogCard from "../../components/MaintenanceHead/EquipmentLogCard";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

const equipmentData = [
  {
    name: "Excavator XC-240",
    type: "Heavy Machinery",
    status: "Operational",
    statusColor: "bg-light_gray",
    id: "EX-2023-0042",
    location: "North Site - Zone A",
    lastMaintenance: "May 15, 2025",
    nextService: "July 15, 2025",
    nextServiceColor: "text-web_yellow font-semibold",
    breakdowns: 3,
    actions: ["View Logs", "Schedule Service"],
  },
  {
    name: "Forklift FL-100",
    type: "Transport Equipment",
    status: "Needs Service",
    statusColor: "bg-light_gray",
    id: "FL-2022-0078",
    location: "Warehouse B",
    lastMaintenance: "March 10, 2025",
    nextService: "Overdue (7 days)",
    nextServiceColor: "text-red-500 font-semibold",
    breakdowns: 7,
    actions: ["View Logs", "Schedule Service"],
  },
  {
    name: "Generator G-500",
    type: "Electrical Equipment",
    status: "Out of Service",
    statusColor: "bg-light_gray",
    id: "GEN-2024-0013",
    location: "Power Station",
    lastMaintenance: "April 30, 2025",
    nextService: "After repair",
    nextServiceColor: "text-slatebluegray",
    breakdowns: 2,
    actions: ["View Logs"],
  },
];

export default function EquipmentLogContainer() {
  const [showTeam, setShowTeam] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Equipment Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipmentDetails, setEquipmentDetails] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/nextschedule/all")
      .then((response) => {
        if (response.status === 404) {
          throw new Error("No schedules found");
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSchedules(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log("Fetched Schedules:", schedules);

  // Function to merge equipment with schedule data
  const getEquipmentWithSchedule = () => {
    console.log("Equipment Details:", equipmentDetails);
    console.log("Schedules:", schedules);

    return equipmentDetails.map((equipment) => {
      // Find matching schedule for this equipment - fix the matching logic
      const matchingSchedule = schedules.find((schedule) => {
        const equipmentIdMatch =
          String(schedule.equipmentId) === String(equipment.id) ||
          String(schedule.equipmentId) === String(equipment.equipmentId);
        console.log(
          `Checking equipment ${equipment.id} vs schedule equipmentId ${schedule.equipmentId}:`,
          equipmentIdMatch
        );
        return equipmentIdMatch;
      });

      console.log(
        `Equipment ${equipment.id} matched with schedule:`,
        matchingSchedule
      );

      // Merge equipment data with schedule data
      return {
        ...equipment,
        // Schedule-related fields - updated to match API response
        nextService:
          matchingSchedule?.nextDate ||
          equipment.nextService ||
          "Not scheduled",
        lastMaintenance:
          matchingSchedule?.lastMaintenanceDate ||
          equipment.lastMaintenance ||
          "Not available",
        maintenanceType:
          matchingSchedule?.nextMaintenanceType ||
          equipment.maintenanceType ||
          "General",
        priority: matchingSchedule?.priority || equipment.priority || "Normal",
        technician:
          matchingSchedule?.technicianName ||
          matchingSchedule?.technicianId ||
          equipment.technician ||
          "Not assigned",
        scheduledBy:
          matchingSchedule?.scheduledBy || equipment.scheduledBy || "System",
        estimateDuration:
          matchingSchedule?.estimateDuration ||
          equipment.estimateDuration ||
          "Not specified",
        assignId: matchingSchedule?.assignId || equipment.assignId,
        nextScheduleId:
          matchingSchedule?.nextScheduleId || equipment.nextScheduleId,
        // Determine next service color based on schedule status
        nextServiceColor: matchingSchedule
          ? new Date(matchingSchedule.nextDate) < new Date()
            ? "text-red-500 font-semibold"
            : "text-web_yellow font-semibold"
          : "text-slatebluegray",
        // Add schedule status
        scheduleStatus: matchingSchedule?.status || "No Schedule",
        hasSchedule: !!matchingSchedule,
      };
    });
  };

  const mergedEquipmentData = getEquipmentWithSchedule();

  useEffect(() => {
    fetch("http://localhost:8080/api/equipment/all")
      .then((response) => {
        if (response.status === 404) {
          throw new Error("No equipment found");
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEquipmentDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log("Fetched Equipment Details:", equipmentDetails);

  // Handle View Logs navigation
  const handleViewLogs = (equipmentId) => {
    navigation(`/maintenance/log?equipmentId=${equipmentId}`);
  };

  // Handle Schedule Service navigation
  const handleScheduleService = (equipmentId) => {
    navigation(`/maintenance/scheduling/${equipmentId}`);
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-main_dark mb-2">
                Equipment Log & Maintenance History
              </h1>
              <p className="text-slatebluegray text-base">
                Track, manage and analyze maintenance records
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-slatebluegray" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-2 text-slatebluegray bg-purewhite border border-gray-200 rounded-lg px-3 py-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Total Equipment
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {mergedEquipmentData.length}
                </h3>
                <span className="text-deep_green text-xs">
                  {mergedEquipmentData.filter((eq) => eq.hasSchedule).length}{" "}
                  with schedules
                </span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <ClipboardCheck className="text-purewhite text-lg" />
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Pending Maintenance
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {
                    mergedEquipmentData.filter(
                      (eq) =>
                        eq.status?.toLowerCase() === "pending" ||
                        eq.status?.toLowerCase() === "needs service" ||
                        eq.scheduleStatus?.toLowerCase() === "pending"
                    ).length
                  }
                </h3>
                <span className="text-web_yellow text-xs">
                  {
                    mergedEquipmentData.filter(
                      (eq) => eq.priority?.toLowerCase() === "high"
                    ).length
                  }{" "}
                  urgent
                </span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <Wrench className="text-main_dark text-lg" />
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Recent Breakdowns
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {mergedEquipmentData.reduce(
                    (total, eq) => total + (eq.breakdowns || 0),
                    0
                  )}
                </h3>
                <span className="text-red-600 text-xs">↑2 in last 24h</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <AlertTriangle className="text-purewhite text-lg" />
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Maintenance Completed
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {
                    mergedEquipmentData.filter(
                      (eq) =>
                        eq.status?.toLowerCase() === "completed" ||
                        eq.status?.toLowerCase() === "operational" ||
                        eq.scheduleStatus?.toLowerCase() === "completed"
                    ).length
                  }
                </h3>
                <span className="text-deep_green text-xs">↑12% this month</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <CheckCircle className="text-purewhite text-lg" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-slatebluegray" />
              <h2 className="text-lg font-semibold text-main_dark">
                Search & Filter Equipment
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Search Equipment
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Equipment Type Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Equipment Type
                </label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full lg:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm appearance-none"
                  >
                    <option>All Equipment Types</option>
                    <option>Heavy Machinery</option>
                    <option>Transport Equipment</option>
                    <option>Electrical Equipment</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full lg:w-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm appearance-none"
                  >
                    <option>All Statuses</option>
                    <option>Operational</option>
                    <option>Needs Service</option>
                    <option>Out of Service</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                </div>
              </div>

              {/* Advanced Filters Button */}
              <div>
                <button className="bg-deep_green hover:bg-deep_green/80 text-white px-6 py-3 rounded-lg font-medium transition-all duration-150 shadow-sm hover:shadow-md">
                  Advanced Filters
                </button>
              </div>
            </div>
          </div>

          {/* Equipment Logs Section */}
          <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-lg font-semibold text-main_dark">
                Equipment Logs
              </h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center px-3 py-2 bg-light_gray/40 text-slatebluegray rounded-lg text-sm font-medium hover:bg-light_gray/60 transition-colors">
                  <List className="w-4 h-4 mr-1" /> Table View
                </button>
                <button className="flex items-center px-3 py-2 bg-web_yellow text-main_dark rounded-lg text-sm font-medium shadow-sm">
                  <Grid className="w-4 h-4 mr-1" /> Card View
                </button>
                <div className="relative">
                  <button className="flex items-center px-3 py-2 bg-light_gray/40 text-slatebluegray rounded-lg text-sm font-medium hover:bg-light_gray/60 transition-colors">
                    <Download className="w-4 h-4 mr-1" /> Export
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Equipment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow"></div>
                  <p className="text-slatebluegray text-sm ml-3">
                    Loading equipment details...
                  </p>
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-red-600 text-sm">Error: {error}</p>
                </div>
              ) : mergedEquipmentData.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-slatebluegray text-sm">
                    No equipment found.
                  </p>
                </div>
              ) : (
                mergedEquipmentData.map((eq) => (
                  <EquipmentLogCard
                    key={eq.equipmentId || eq.id}
                    name={eq.equipmentName || eq.name}
                    type={eq.equipmentType || eq.type || "Equipment"}
                    status={eq.status || "Unknown"}
                    statusColor="bg-light_gray"
                    id={eq.equipmentId || eq.id}
                    location={eq.location || "Location not specified"}
                    lastMaintenance={eq.lastMaintenance}
                    nextService={eq.nextService}
                    nextServiceColor={eq.nextServiceColor}
                    breakdowns={eq.breakdowns || 0}
                    actions={["View Logs", "Schedule Service"]}
                    onViewLogs={handleViewLogs}
                    onScheduleService={handleScheduleService}
                    // Additional schedule-related props
                    maintenanceType={eq.maintenanceType}
                    priority={eq.priority}
                    technician={eq.technician}
                    scheduleStatus={eq.scheduleStatus}
                    hasSchedule={eq.hasSchedule}
                    {...eq}
                  />
                ))
              )}
            </div>

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <p className="text-sm text-slatebluegray">
                Showing 1-{mergedEquipmentData.length} of{" "}
                {mergedEquipmentData.length} equipment (
                {mergedEquipmentData.filter((eq) => eq.hasSchedule).length} with
                scheduled maintenance)
              </p>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center bg-light_gray/40 rounded text-slatebluegray font-semibold hover:bg-light_gray/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-deep_green text-white rounded font-semibold shadow-md">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-purewhite border border-gray-300 rounded text-slatebluegray font-semibold hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-purewhite border border-gray-300 rounded text-slatebluegray font-semibold hover:bg-gray-50 transition-colors">
                3
              </button>
              <span className="px-2 text-slatebluegray">...</span>
              <button className="w-8 h-8 flex items-center justify-center bg-purewhite border border-gray-300 rounded text-slatebluegray font-semibold hover:bg-gray-50 transition-colors">
                44
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(44, currentPage + 1))}
                disabled={currentPage === 44}
                className="w-8 h-8 flex items-center justify-center bg-light_gray/40 rounded text-slatebluegray font-semibold hover:bg-light_gray/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
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
