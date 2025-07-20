// src/pages/Supplier/MaterialRequests.jsx
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaReply,
  FaChevronDown,
  FaUser,
  FaFileAlt,
  FaBoxOpen,
  FaClock,
  FaRegCheckCircle,
  FaFlag,
} from "react-icons/fa";
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
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // Fetch quotation requests from backend API
  useEffect(() => {
    fetch("http://localhost:8080/api/quotationrequest/all")
      .then((res) => res.json())
      .then((data) => {
        // If your API wraps data in { data: [...] }, adjust accordingly
        setRequests(data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch requests:", err);
      });
  }, []);

  // Filtering logic
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.quotationType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.quotationReqMaterials &&
        request.quotationReqMaterials
          .map((m) => m.material.materialName)
          .join(", ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "All Status" || request.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All Priorities" ||
      request.priorityLevel === priorityFilter;

    // Optionally add date range filter here

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination logic (adjust itemsPerPage as needed)
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
        return "bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full text-xs";
      case "Low":
        return "bg-green-100 text-green-600 font-medium px-3 py-1 rounded-full text-xs";
      default:
        return "bg-gray-100 text-gray-600 font-medium px-3 py-1 rounded-full text-xs";
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper to get material names as comma-separated string
  const getMaterialNames = (materials) => {
    if (!materials || !materials.length) return "No materials";
    return materials
      .map(
        (m) =>
          `${m.material?.materialName || ""} (${m.quantity} ${
            m.material?.unitOfMeasurement || ""
          })`
      )
      .join(", ");
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-16 py-8">
        {/* Header */}
        <div className="flex">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-main_dark mb-1">
              Material Requests
            </h1>
            <p className="text-gray-600 text-base">
              Manage and respond to material requests from managers
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-purewhite border border-gray-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-main_dark mb-2">
                Search
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-sm px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow appearance-none bg-white"
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
              <label className="block text-sm font-medium text-main_dark mb-2">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full text-sm px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow appearance-none bg-white"
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
              <label className="block text-sm font-medium text-main_dark mb-2">
                Date Range
              </label>
              <div className="relative">
                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  className="w-full text-sm px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-purewhite rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-light_brown/35">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    Request ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaUser className="inline mb-0.5" /> Requester
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaFileAlt className="inline mb-0.5" /> Type
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaBoxOpen className="inline mb-0.5" /> Materials
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaClock className="inline mb-0.5" /> Quotation Deadline
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaRegCheckCircle className="inline mb-0.5" /> Status
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaFlag className="inline mb-0.5" /> Priority
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light_gray">
                {paginatedRequests.map((request, index) => (
                  <tr key={request.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-main_dark">
                      {request.id ? `#${request.id}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-main_dark">
                      {request.requesterName || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-main_dark">
                      {request.quotationType || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-main_dark">
                      {getMaterialNames(request.quotationReqMaterials)}
                    </td>
                    <td className="px-6 py-4 text-sm text-main_dark font-semibold">
                      {formatDate(request.quotationDeadline)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(request.status)}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getPriorityBadge(request.priorityLevel)}>
                        {request.priorityLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-deep_green hover:bg-gray-100 rounded"
                          onClick={() => navigate(`/requests/${request.id}`)}
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
                {paginatedRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-light_gray bg-purewhite">
            <div className="text-sm text-slatebluegray">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of{" "}
              {filteredRequests.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {[
                ...Array(
                  Math.ceil(filteredRequests.length / itemsPerPage)
                ).keys(),
              ].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 text-sm ${
                    currentPage === page + 1
                      ? "bg-web_yellow text-main_dark font-medium"
                      : "text-slatebluegray hover:bg-gray-100 rounded"
                  }`}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded"
                disabled={
                  currentPage ===
                  Math.ceil(filteredRequests.length / itemsPerPage)
                }
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(
                      Math.ceil(filteredRequests.length / itemsPerPage),
                      p + 1
                    )
                  )
                }
              >
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
