// src/pages/Supplier/MaterialRequests.jsx
import React, { useState } from "react";
import { FaSearch, FaEye, FaReply, FaChevronDown } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests", active: true },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
];

const MaterialRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // Sample data - replace with actual API data
  const requests = [
    {
      id: "#REQ-001",
      item: "Industrial Sensors, cement, steel pipes",
      quantity: "—",
      deadline: "Dec 25, 2024",
      status: "Pending",
      priority: "High",
    },
    {
      id: "#REQ-002",
      item: "Power Cables",
      quantity: "—",
      deadline: "Dec 30, 2024",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: "#REQ-003",
      item: "Hydraulic Pumps",
      quantity: "—",
      deadline: "Jan 15, 2025",
      status: "Completed",
      priority: "Low"
    },
    {
      id: "#REQ-004",
      item: "Steel Brackets",
      quantity: "—",
      deadline: "Dec 28, 2024",
      status: "Rejected",
      priority: "Medium"
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "In Progress":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "Completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600 font-medium px-3 py-1 rounded-full text-xs";
      case "Medium":
        return "bg-blue-100 text-blue-600 font-medium px-3 py-1 rounded-full text-xs";
      case "Low":
        return "bg-green-100 text-green-600 font-medium px-3 py-1 rounded-full text-xs";
      default:
        return "bg-gray-100 text-gray-600 font-medium px-3 py-1 rounded-full text-xs";
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-16 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-main_dark mb-1">Material Requests</h1>
          <p className="text-gray-500">Manage and respond to material requests from managers</p>
        </div>

        {/* Filters */}
        <div className="bg-purewhite border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-main_dark mb-2">Search</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow appearance-none bg-white"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Rejected</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">Priority</label>
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow appearance-none bg-white"
                >
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">Date Range</label>
              <div className="relative">
                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  className="w-full px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
                />
                {/* <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-purewhite rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-web_yellow">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Request ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Item</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Quotation Deadline</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light_gray">
                {requests.map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-main_dark">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 text-main_dark">{request.item}</td>
                    <td className="px-6 py-4 text-sm text-main_dark">
                      {request.deadline}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(request.status)}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getPriorityBadge(request.priority)}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-deep_green hover:bg-gray-100 rounded"
                          onClick={() => navigate(`/requests/${request.id.replace('#', '')}`)}
                        >
                          <FaEye />
                        </button>
                        <button className="p-2 text-web_yellow hover:bg-gray-100 rounded">
                          <FaReply />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-light_gray bg-purewhite">
            <div className="text-sm text-slatebluegray">
              Showing 1 to 4 of 24 results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-web_yellow text-main_dark rounded font-medium">
                1
              </button>
              <button className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded">
                2
              </button>
              <button className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded">
                3
              </button>
              <button className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialRequests;
