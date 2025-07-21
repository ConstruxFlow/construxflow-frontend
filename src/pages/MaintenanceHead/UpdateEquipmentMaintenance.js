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
  CheckSquare
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
            <h3 className="text-xl font-bold text-main_dark">Equipment Details</h3>
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
                <span className="text-sm font-medium text-slatebluegray">Equipment ID:</span>
                <p className="text-main_dark font-medium">{equipment.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">Type:</span>
                <p className="text-main_dark font-medium">{equipment.equipmentType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">Name:</span>
                <p className="text-main_dark font-medium">{equipment.equipmentName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">Date:</span>
                <p className="text-main_dark font-medium">{equipment.date?.slice(0, 10)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">Time:</span>
                <p className="text-main_dark font-medium">{equipment.time}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slatebluegray">Status:</span>
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
              <span className="text-sm font-medium text-slatebluegray">Description:</span>
              <p className="text-main_dark font-medium mt-1">{equipment.description}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-slatebluegray">Maintenance Requests:</span>
              <div className="mt-2 space-y-2">
                {equipment.maintenanceRequests && equipment.maintenanceRequests.length > 0 ? (
                  equipment.maintenanceRequests.map((req) => (
                    <div key={req.id} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="font-semibold text-main_dark">{req.itemName}</div>
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
                  <p className="text-slatebluegray text-sm">No maintenance requests</p>
                )}
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

    const matchesStatus = selectedStatus === "All" || equipment.status === selectedStatus;
    const matchesType = selectedEquipmentType === "All" || equipment.equipmentType === selectedEquipmentType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const equipmentTypes = Array.from(new Set(equipmentData.map((item) => item.equipmentType)));

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
        <button className="text-gray-400 cursor-not-allowed" disabled>
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
        links={navLinks.map(link => ({
          ...link,
          onClick: link.name === "Team" ? () => setShowTeam(true) : () => navigate(link.href)
        }))}
        showButton={true}
        buttonLabel={isLoggedIn ? "Logout" : "Get Started"}
        onButtonClick={isLoggedIn ? handleLogout : handleLogin}
        logoSrc="/logo1.png"
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
                <Bell className="w-5 h-5 text-slatebluegray" />
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
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Due This Week</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">{dueThisWeekCount}</h3>
                <span className="text-web_yellow text-xs">{dueThisWeekCount === 1 ? "1 Task" : `${dueThisWeekCount} Tasks`}</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <AlertTriangle className="text-purewhite text-lg"/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Overdue</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">{overdueCount}</h3>
                <span className="text-red-600 text-xs">{overdueCount === 1 ? "1 Task" : `${overdueCount} Tasks`}</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-red-500 to-red-500/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <AlertTriangle className="text-purewhite text-lg"/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Next Month</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">{nextMonthCount}</h3>
                <span className="text-deep_green text-xs">{nextMonthCount === 1 ? "1 Task" : `${nextMonthCount} Tasks`}</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <Calendar className="text-purewhite text-lg"/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Total Equipment</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">{equipmentData.length}</h3>
                <span className="text-deep_green text-xs">{equipmentData.length === 1 ? "1 Item" : `${equipmentData.length} Items`}</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <CheckCircle className="text-purewhite text-lg"/>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Type</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} equipment
            </p>
          </div>

          {/* Equipment Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Equipment Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Next Scheduled</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow mx-auto mb-4"></div>
                        Loading equipment...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No equipment found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((equipment) => (
                      <tr key={equipment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-main_dark">
                          {equipment.equipmentName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {equipment.maintenanceRequests && equipment.maintenanceRequests.length > 0
                            ? equipment.maintenanceRequests[0].justification
                            : equipment.description || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {equipment.date ? equipment.date.slice(0, 10) : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            equipment.status === "Pending" ? "bg-web_yellow/10 text-web_yellow" :
                            equipment.status === "Accept" ? "bg-deep_green/10 text-deep_green" :
                            equipment.status === "Completed" ? "bg-gray-100 text-gray-800" :
                            "bg-deep_green/10 text-deep_green"
                          }`}>
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
                          {equipment.maintenanceRequests && equipment.maintenanceRequests.length > 0
                            ? equipment.maintenanceRequests[0].justification
                            : equipment.description || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Next: {equipment.date ? equipment.date.slice(0, 10) : "-"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          equipment.status === "Pending" ? "bg-web_yellow/10 text-web_yellow" :
                          equipment.status === "Accept" ? "bg-deep_green/10 text-deep_green" :
                          equipment.status === "Completed" ? "bg-gray-100 text-gray-800" :
                          "bg-deep_green/10 text-deep_green"
                        }`}>
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
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
                      ? 'bg-web_yellow text-main_dark'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
