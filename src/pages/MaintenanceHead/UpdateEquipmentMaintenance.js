import { useState, useEffect } from "react";
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
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

// Modal component for equipment details
function EquipmentDetailsModal({ open, onClose, equipment }) {
  if (!open || !equipment) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-xl font-bold mb-2 text-[#236571]">Equipment Details</h3>
        <div className="mb-2">
          <span className="font-medium">ID:</span> {equipment.id}
        </div>
        <div className="mb-2">
          <span className="font-medium">Type:</span> {equipment.equipmentType}
        </div>
        <div className="mb-2">
          <span className="font-medium">Name:</span> {equipment.equipmentName}
        </div>
        <div className="mb-2">
          <span className="font-medium">Date:</span> {equipment.date?.slice(0, 10)}
        </div>
        <div className="mb-2">
          <span className="font-medium">Time:</span> {equipment.time}
        </div>
        <div className="mb-2">
          <span className="font-medium">Status:</span>{" "}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              equipment.status === "Pending"
                ? "bg-[#EFC11A] text-yellow-900"
                : "bg-[#236571] text-white"
            }`}
          >
            {equipment.status}
          </span>
        </div>
        <div className="mb-2">
          <span className="font-medium">Description:</span> {equipment.description}
        </div>
        <div className="mb-2">
          <span className="font-medium">Maintenance Requests:</span>
          <ul className="list-disc ml-6 mt-1">
            {equipment.maintenanceRequests && equipment.maintenanceRequests.length > 0 ? (
              equipment.maintenanceRequests.map((req) => (
                <li key={req.id} className="mb-1">
                  <span className="font-semibold">{req.itemName}</span> ({req.quantity} {req.measurement})<br />
                  <span className="text-xs text-gray-500">
                    Justification: {req.justification} | Urgency: {req.urgency}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">No requests</li>
            )}
          </ul>
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

  // Fetch data
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
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Helper to get status color
  const getStatusClass = (status) =>
    status === "Pending"
      ? "bg-[#EFC11A] text-yellow-900"
      : "bg-[#236571] text-white";

  // Modal open handler
  const handleViewDetails = (equipment) => {
    setSelectedEquipment(equipment);
    setModalOpen(true);
  };

  // Modal close handler
  const closeModal = () => {
    setModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleStartMaintenance = (id) => {
    navigate(`/maintenance/technician-assignment/${id}`);
  };

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
          navigate("/login");
        };
  
        const handleLogin = () => {
      navigate("/login");
      };

  return (
    <>
    <NavBar
      links={[
          { name: "Dashboard", href: "#", onClick: () => navigate("/maintenance/dashboard") },
          { name: "Task", href: "#",onClick: () => navigate("/maintenance/scheduling") },
          { name: "Team", href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");
              
              setShowTeam(true);
            },
           },
          { name: "Equipment", href: "#" ,onClick: () => navigate("/maintenance/log")},
          { name: "Add Technician", href: "#",onClick: () => navigate("/maintenance/add-member") },
        ]}
        showButton={true}
        buttonLabel={isLoggedIn ? "Logout" : "Get Started"}
        onButtonClick={isLoggedIn ? handleLogout : handleLogin}
    />
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Upcoming Equipment Maintenance
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and schedule maintenance tasks for construction equipment
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="w-5 h-5" />
              <span className="font-medium text-sm">July 10 - Jul 16, 2025</span>
            </div>
            <button className="bg-[#EFC11A] hover:bg-yellow-400 text-[#236571] px-4 py-2 rounded-md font-medium transition-colors">
              + Schedule Maintenance
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <div className="flex-1 flex items-center bg-gray-100 rounded-md px-3 py-2">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search equipment by ID, name, or type..."
              className="bg-transparent outline-none w-full text-gray-700"
              disabled
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select className="appearance-none bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#236571]">
                <option>All Equipment Types</option>
                <option>Heavy Machinery</option>
                <option>Transport Equipment</option>
                <option>Electrical Equipment</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#236571]">
                <option>All Statuses</option>
                <option>Due Soon</option>
                <option>Scheduled</option>
                <option>Overdue</option>
                <option>Pending</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <button className="bg-[#236571] hover:bg-[#1b4c4a] text-white px-4 py-2 rounded-md font-medium transition-colors">
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Due This Week */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-col border border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="bg-[#EFC11A]/10 p-2 rounded">
                <AlertTriangle className="w-5 h-5 text-[#EFC11A]" />
              </div>
              <span className="text-gray-600 text-sm font-medium">
                Due This Week
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">8</div>
            <div className="mt-1 text-xs text-[#EFC11A] flex items-center">
              3 Tasks
            </div>
          </div>
          {/* Overdue */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-col border border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="bg-red-100 p-2 rounded">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-gray-600 text-sm font-medium">
                Overdue
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">3</div>
            <div className="mt-1 text-xs text-red-500 flex items-center">
              1 Task
            </div>
          </div>
          {/* Next Month */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-col border border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="bg-[#236571]/10 p-2 rounded">
                <Calendar className="w-5 h-5 text-[#236571]" />
              </div>
              <span className="text-gray-600 text-sm font-medium">
                Next Month
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">15</div>
            <div className="mt-1 text-xs text-[#236571] flex items-center">
              4 Tasks
            </div>
          </div>
          {/* Total Equipment */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-col border border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 p-2 rounded">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-600 text-sm font-medium">
                Total Equipment
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{equipmentData.length}</div>
            <div className="mt-1 text-xs text-green-600 flex items-center">
              {equipmentData.length === 1 ? "1 Task" : `${equipmentData.length} Tasks`}
            </div>
          </div>
        </div>

        {/* Equipment Maintenance Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Maintenance Schedule
            </h2>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                <List className="w-4 h-4 mr-1" /> Table View
              </button>
              <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                <Grid className="w-4 h-4 mr-1" /> Card View
              </button>
              <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                <Download className="w-4 h-4 mr-1" /> Export
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Equipment Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#EFC11A] px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-yellow-900">
                <div className="col-span-3 flex items-center space-x-1">
                  <span>Equipment Name</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="col-span-2 flex items-center space-x-1">
                  <span>Last Maintenance</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="col-span-2 flex items-center space-x-1">
                  <span>Next Scheduled</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="col-span-2 flex items-center space-x-1">
                  <span>Status</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="col-span-3">Action</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="px-6 py-8 text-center text-gray-500">Loading...</div>
              ) : error ? (
                <div className="px-6 py-8 text-center text-red-500">{error}</div>
              ) : equipmentData.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">No equipment scheduled.</div>
              ) : (
                equipmentData.map((equipment) => (
                  <div key={equipment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center text-sm">
                      <div className="col-span-3 font-medium text-gray-900">
                        {equipment.equipmentName}
                      </div>
                      <div className="col-span-2 text-gray-700">
                        {/* Show last maintenance from first maintenance request if available */}
                        {equipment.maintenanceRequests && equipment.maintenanceRequests.length > 0
                          ? equipment.maintenanceRequests[0].justification
                          : "-"}
                      </div>
                      <div className="col-span-2 text-gray-700">
                        {equipment.date ? equipment.date.slice(0, 10) : "-"}
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            equipment.status
                          )}`}
                        >
                          {equipment.status}
                        </span>
                      </div>
                      <div className="col-span-3 flex space-x-2">
                        {equipment.status === "Pending" ? (
                          <button
                            className="bg-[#236571] hover:bg-[#17484b] text-white px-3 py-1 rounded text-xs font-medium"
                            onClick={() => handleViewDetails(equipment)}
                          >
                            View Details
                          </button>
                        ) : (
                          <button className="bg-[#236571] hover:bg-[#17484b] text-white px-3 py-1 rounded text-xs font-medium"
                          onClick={() => handleStartMaintenance(equipment.id)}
                          >
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
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
