import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Request', href: '/Inventory-requests' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];
const statusPill = (status) => {
  const map = {
    PENDING: "bg-web_yellow/10 text-web_yellow",
    APPROVED: "bg-deep_green/10 text-deep_green",
    REJECTED: "bg-red-100 text-red-800",
    PARTIAL: "bg-light_brown/30 text-main_dark",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
};

export default function InventoryRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Load requests from backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/inventory/requests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Failed to load requests", err));
  }, []);

  // ✅ Approve request
  const handleApprove = (id) => {
    axios
      .post(`http://localhost:8080/api/inventory/requests/${id}/approve`)
      .then(() => {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
        );
      })
      .catch((err) => console.error("Failed to approve request", err));
  };

  // ✅ Reject request
  const handleReject = (id) => {
    axios
      .post(`http://localhost:8080/api/inventory/requests/${id}/reject`)
      .then(() => {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
        );
      })
      .catch((err) => console.error("Failed to reject request", err));
  };

  // ✅ Navigate to equipment scheduling
  const handleSchedule = (req) => {
    navigate("/equipment-scheduling", {
      state: {
        fromRequestId: req.id,
        suggestedEquipmentName: req.itemName,
        equipmentId: req.equipmentId,
        siteName: req.siteName,
        needFrom: req.needFrom,
        needTo: req.needTo,
      },
    });
  };

  // Filtering logic
  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.itemName.toLowerCase().includes(search.toLowerCase()) ||
      r.siteName.toLowerCase().includes(search.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(search.toLowerCase()) ||
      r.itemCategory.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || r.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Inventory Requests (by Site Managers)
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Review site requests, approve/reject, and schedule equipment
                when needed.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Requests
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by site, item, requester..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex gap-2">
                  {["All", "PENDING", "APPROVED", "REJECTED", "PARTIAL"].map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          statusFilter === s
                            ? "bg-web_yellow text-main_dark shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Priority filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {["All", "HIGH", "MEDIUM", "LOW"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriorityFilter(p)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        priorityFilter === p
                          ? "bg-web_yellow text-main_dark shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Req ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Site
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Requested By
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Item
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Qty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Need Dates
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pageData.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-main_dark">
                        #{r.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {r.siteName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {r.requestedBy}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="font-semibold text-main_dark">
                          {r.itemName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {r.itemCategory}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-main_dark font-semibold">
                        {r.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {r.needFrom} → {r.needTo}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-light_brown/30 text-main_dark">
                          {r.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusPill(
                            r.status
                          )}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleSchedule(r)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-web_yellow text-main_dark hover:bg-web_yellow/80 transition-colors"
                          >
                            Schedule
                          </button>
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-deep_green text-white hover:bg-deep_green/80 transition-colors"
                          >
                            <FaCheck className="inline-block mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(r.id)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            <FaTimes className="inline-block mr-2" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {start + 1} to{" "}
              {Math.min(start + itemsPerPage, filtered.length)} of{" "}
              {filtered.length} requests
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-sm rounded font-medium ${
                    currentPage === i + 1
                      ? "bg-web_yellow text-main_dark"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
