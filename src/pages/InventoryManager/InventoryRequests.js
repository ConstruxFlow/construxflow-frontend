import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { FaSearch, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";
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
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
};

export default function InventoryRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // ✅ Load requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:8080/api/inventory/requests");
        console.log("🔍 RAW API RESPONSE:", response.data);
        
        // Check if response.data is an array
        if (!Array.isArray(response.data)) {
          console.error("❌ API response is not an array:", response.data);
          setRequests([]);
          return;
        }

        // Map the response data with proper field mapping
        const mappedRequests = response.data.map((request, index) => {
          console.log(`Request ${index}:`, request);
          
          // Extract data from the backend response
          // Based on your API response, it seems the data might be in different fields
          const projectName = request.projectName || 
                            request.siteName || 
                            `Project ${request.id}`;
          
          const siteManager = request.siteManagerId || 
                            request.requestedBy || 
                            'Unknown Manager';
          
          const equipmentName = request.itemName || 
                              (request.equipmentDetails && request.equipmentDetails[0]?.name) || 
                              'Equipment';
          
          const purpose = request.requestPurpose || 
                         request.additionalNotes || 
                         'No purpose specified';
          
          const location = request.expectedLocation || 
                          request.siteName || 
                          'No location specified';

          return {
            // Core identification
            id: request.id || index + 1,
            
            // Project information
            projectId: request.projectId,
            projectName: projectName,
            
            // Manager information
            siteManagerId: siteManager,
            
            // Date information
            requestDate: request.requestDate,
            requestedStartDate: request.requestedStartDate || request.needFrom,
            requestedEndDate: request.requestedEndDate || request.needTo,
            
            // Status and priority
            priority: request.priority,
            status: request.status,
            
            // Additional information
            additionalNotes: request.additionalNotes,
            rejectionReason: request.rejectionReason,
            approvalDate: request.approvalDate,
            approvedBy: request.approvedBy,
            requestPurpose: purpose,
            expectedLocation: location,
            
            // Equipment information
            equipmentDetails: request.equipmentDetails || [{
              name: equipmentName,
              category: request.itemCategory || 'General',
              quantity: request.quantity || 1
            }],
            
            // Legacy fields for compatibility
            siteName: projectName,
            requestedBy: siteManager,
            itemName: equipmentName,
            itemCategory: request.itemCategory || 'General',
            quantity: request.quantity || 1,
            needFrom: request.requestedStartDate || request.needFrom,
            needTo: request.requestedEndDate || request.needTo
          };
        });
        
        console.log("📝 MAPPED REQUESTS:", mappedRequests);
        setRequests(mappedRequests);
      } catch (err) {
        console.error("❌ Failed to load requests", err);
        setError("Failed to load requests. Please check if the backend server is running.");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // ✅ Approve request
  const handleApprove = async (id) => {
    try {
      const updateData = {
        approvedBy: "Inventory Manager",
      };
      
      await axios.post(`http://localhost:8080/api/inventory/requests/${id}/approve`, updateData);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
      );
    } catch (err) {
      console.error("Failed to approve request", err);
      alert("Failed to approve request. Please try again.");
    }
  };

  // ✅ Reject request
  const handleReject = async (id) => {
    const rejectionReason = prompt("Please enter reason for rejection:");
    if (rejectionReason === null) return; // User cancelled
    
    try {
      const updateData = {
        approvedBy: "Inventory Manager",
        rejectionReason: rejectionReason,
      };
      
      await axios.post(`http://localhost:8080/api/inventory/requests/${id}/reject`, updateData);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
      );
    } catch (err) {
      console.error("Failed to reject request", err);
      alert("Failed to reject request. Please try again.");
    }
  };

  // Filtering logic
  const filtered = requests.filter((r) => {
    if (!r) return false;

    // Search filter
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      !search || 
      (r.projectName && r.projectName.toLowerCase().includes(searchLower)) ||
      (r.siteManagerId && r.siteManagerId.toLowerCase().includes(searchLower)) ||
      (r.requestPurpose && r.requestPurpose.toLowerCase().includes(searchLower)) ||
      (r.expectedLocation && r.expectedLocation.toLowerCase().includes(searchLower)) ||
      (r.equipmentDetails && r.equipmentDetails.some(eq => 
        eq && eq.name && eq.name.toLowerCase().includes(searchLower)
      ));

    // Status filter
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === "All" || r.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  console.log("🎯 FILTERED RESULTS:", filtered);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(start, start + itemsPerPage);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      // Handle different date formats
      let date;
      if (typeof dateString === 'string' && dateString.includes('T')) {
        date = new Date(dateString);
      } else if (typeof dateString === 'string') {
        // Try to parse as local date
        date = new Date(dateString.replace(' ', 'T'));
      } else {
        date = new Date(dateString);
      }
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  // Get equipment names for display
  const getEquipmentNames = (equipmentDetails) => {
    if (!equipmentDetails || !Array.isArray(equipmentDetails) || equipmentDetails.length === 0) {
      return 'No equipment specified';
    }
    return equipmentDetails
      .filter(eq => eq && eq.name)
      .map(eq => eq.name)
      .join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar links={navLinks} logoSrc="/logo1.png" />
        <main className="py-4 sm:py-6">
          <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading requests...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                Review site requests and approve or reject equipment allocations.
              </p>
              {/* Debug info */}
              <div className="text-xs text-gray-500 mt-1">
                Loaded {requests.length} requests, showing {filtered.length} after filtering
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <div>
                <p className="text-red-800 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">
                  Make sure your backend server is running on http://localhost:8080
                </p>
              </div>
            </div>
          )}

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
                    placeholder="Search by project, manager, equipment, purpose..."
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
                <div className="flex gap-2 flex-wrap">
                  {["All", "PENDING", "APPROVED", "REJECTED"].map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
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
                <div className="flex gap-2 flex-wrap">
                  {["All", "HIGH", "MEDIUM", "LOW"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriorityFilter(p)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
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

          {/* Debug Info */}
          {requests.length > 0 && filtered.length === 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Debug:</strong> {requests.length} requests loaded but none match your filters. 
                Try clearing filters or check console for details.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setPriorityFilter("All");
                }}
                className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {pageData.length === 0 ? (
              <div className="text-center py-12">
                <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No requests found</h3>
                <p className="mt-2 text-gray-500">
                  {requests.length === 0 
                    ? "No equipment requests have been created yet."
                    : `No requests match your current filters. (${requests.length} requests loaded)`
                  }
                </p>
                {requests.length > 0 && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All");
                      setPriorityFilter("All");
                    }}
                    className="mt-4 px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/80 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-light_brown/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                          Req ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                          Project & Location
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                          Site Manager
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                          Equipment & Purpose
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                          Request Dates
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
                            <div className="font-semibold text-main_dark">
                              {r.projectName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {r.expectedLocation}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {r.siteManagerId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="font-semibold text-main_dark">
                              {getEquipmentNames(r.equipmentDetails)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {r.requestPurpose}
                            </div>
                            {r.additionalNotes && (
                              <div className="text-xs text-gray-400 mt-1">
                                Notes: {r.additionalNotes}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {formatDate(r.requestedStartDate)} → {formatDate(r.requestedEndDate)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              r.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                              r.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
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
                              {r.status === "PENDING" ? (
                                <>
                                  <button
                                    onClick={() => handleApprove(r.id)}
                                    className="px-3 py-2 rounded-lg text-sm font-medium bg-deep_green text-white hover:bg-deep_green/80 transition-colors flex items-center"
                                  >
                                    <FaCheck className="inline-block mr-2" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(r.id)}
                                    className="px-3 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center"
                                  >
                                    <FaTimes className="inline-block mr-2" />
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className="text-sm text-gray-500 italic">
                                  {r.status === "APPROVED" ? "Approved" : "Rejected"} 
                                  {r.approvalDate && ` on ${formatDate(r.approvalDate)}`}
                                  {r.approvedBy && ` by ${r.approvedBy}`}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden">
                  {pageData.map((r) => (
                    <div key={r.id} className="border-b border-gray-200 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-main_dark">#{r.id}</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${statusPill(r.status)}`}>
                            {r.status}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          r.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                          r.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {r.priority}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm font-medium text-main_dark">{r.projectName}</div>
                          <div className="text-xs text-gray-500">Location: {r.expectedLocation}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm">Manager: {r.siteManagerId}</div>
                          <div className="text-xs text-gray-500">Purpose: {r.requestPurpose}</div>
                        </div>
                        
                        <div className="text-sm">
                          Equipment: {getEquipmentNames(r.equipmentDetails)}
                        </div>

                        <div className="text-sm">
                          Dates: {formatDate(r.requestedStartDate)} → {formatDate(r.requestedEndDate)}
                        </div>

                        {r.additionalNotes && (
                          <div className="text-sm text-gray-600">
                            Notes: {r.additionalNotes}
                          </div>
                        )}

                        <div className="pt-2">
                          {r.status === "PENDING" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(r.id)}
                                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-deep_green text-white hover:bg-deep_green/80 transition-colors flex items-center justify-center"
                              >
                                <FaCheck className="mr-2" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(r.id)}
                                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center"
                              >
                                <FaTimes className="mr-2" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 italic text-center">
                              {r.status === "APPROVED" ? "Approved" : "Rejected"} 
                              {r.approvalDate && ` on ${formatDate(r.approvalDate)}`}
                              {r.approvedBy && ` by ${r.approvedBy}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
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
          )}
        </div>
      </main>
    </div>
  );
}