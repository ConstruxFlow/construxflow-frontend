import { useState } from "react";
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
    statusColor: "bg-[#236571]",
    id: "EX-2023-0042",
    location: "North Site - Zone A",
    lastMaintenance: "May 15, 2025",
    nextService: "July 15, 2025",
    nextServiceColor: "text-[#EFC11A] font-semibold",
    breakdowns: 3,
    actions: ["View Logs", "Schedule Service"],
  },
  {
    name: "Forklift FL-100",
    type: "Transport Equipment",
    status: "Needs Service",
    statusColor: "bg-gray-700",
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
    statusColor: "bg-gray-700",
    id: "GEN-2024-0013",
    location: "Power Station",
    lastMaintenance: "April 30, 2025",
    nextService: "After repair",
    nextServiceColor: "text-gray-700",
    breakdowns: 2,
    actions: ["View Logs"],
  },
];

export default function EquipmentLogContainer() {
  const [showTeam, setShowTeam] = useState(false);
  const navigation = useNavigate();
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
      />

      <div className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Equipment Log & Maintenance History
              </h1>
              <p className="text-gray-600 mt-1">
                Track, manage and analyze maintenance records
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
                <span className="font-medium text-sm">June 19, 2025</span>
              </div>
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
                  <option>Operational</option>
                  <option>Needs Service</option>
                  <option>Out of Service</option>
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
            {/* Total Equipment */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="bg-[#236571]/10 p-2 rounded">
                  <ClipboardCheck className="w-5 h-5 text-[#236571]" />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  Total Equipment
                </span>
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">132</div>
              <div className="mt-1 text-xs text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" /> 5% from last month
              </div>
            </div>
            {/* Pending Maintenance */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="bg-[#EFC11A]/10 p-2 rounded">
                  <Wrench className="w-5 h-5 text-[#EFC11A]" />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  Pending Maintenance
                </span>
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">17</div>
              <div className="mt-1 text-xs text-gray-600 flex items-center">
                <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full mr-1">
                  3 urgent
                </span>
              </div>
            </div>
            {/* Recent Breakdowns */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="bg-red-100 p-2 rounded">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  Recent Breakdowns
                </span>
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">8</div>
              <div className="mt-1 text-xs text-red-500 flex items-center">
                <span className="mr-1">↑2</span> in last 24h
              </div>
            </div>
            {/* Maintenance Completed */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-2 rounded">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  Maintenance Completed
                </span>
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">42</div>
              <div className="mt-1 text-xs text-green-600 flex items-center">
                <span className="mr-1">↑12%</span> this month
              </div>
            </div>
          </div>

          {/* Equipment Logs Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Equipment Logs
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
            {/* Equipment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              {equipmentData.map((eq) => (
                <EquipmentLogCard key={eq.id} {...eq} />
              ))}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Showing 1-3 of 132 equipment
            </div>
            {/* Pagination */}
            <div className="flex items-center space-x-1">
              <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-semibold">
                &lt;
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-[#236571] text-white rounded font-semibold">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-700 font-semibold">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-700 font-semibold">
                3
              </button>
              <span className="px-2 text-gray-400">...</span>
              <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded text-gray-700 font-semibold">
                44
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-semibold">
                &gt;
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
