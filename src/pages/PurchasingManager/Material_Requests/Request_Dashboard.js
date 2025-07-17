import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEye, 
  FaDownload,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaFileAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MaterialRequestsOverview = () => {
  const [activeView, setActiveView] = useState("project-wise");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPriority, setSelectedPriority] = useState("All Priority");
  const [selectedPhase, setSelectedPhase] = useState("All Phases");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('projectName');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const [materialRequests, setMaterialRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    getRequest();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [materialRequests, searchTerm, selectedStatus, selectedPriority, selectedPhase]);

  const getRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/material-requests/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        setMaterialRequests(
          data && data.length > 0
            ? data.map((item) => ({
                id: item.requestId,
                projectName: item.projectName,
                projectId: item.projectId,
                phase: item.phaseName,
                materials: item.requestedMaterials
                  .map((material) => material.materialName)
                  .join(", "),
                quantity: item.requestedMaterials
                  .map(
                    (material) =>
                      `${material.quantity} ${material.unitOfMeasurement}`
                  )
                  .join(", "),
                status: item.status,
                priority: item.priority || "Medium",
                requestDate: item.requestDate,
                requestor: item.requestor || "N/A",
                statusColor: getStatusColor(item.status),
                priorityColor: getPriorityColor(item.priority || "Medium"),
                additionalInfo: item.additionalInfo || "",
                requestedMaterials: item.requestedMaterials
              }))
            : []
        );
      } else {
        setLoading(false);
        toast.error("Failed to fetch material requests");
      }
    } catch (error) {
      toast.error("Network error: Failed to fetch material requests");
      console.error("Error fetching material requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = materialRequests.filter(request => {
      const matchesSearch = 
        request.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.materials.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.additionalInfo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All Status' || request.status === selectedStatus;
      const matchesPriority = selectedPriority === 'All Priority' || request.priority === selectedPriority;
      const matchesPhase = selectedPhase === 'All Phases' || request.phase === selectedPhase;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesPhase;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'requestDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get unique values for filters
  const statuses = ['All Status', ...new Set(materialRequests.map(r => r.status))];
  const priorities = ['All Priority', 'Urgent', 'High', 'Medium', 'Low'];
  const phases = ['All Phases', ...new Set(materialRequests.map(r => r.phase))];

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Material requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
        links={[
          { name: "Dashboard", path: "/purchasing/dashboard" },
          {
            name: "Material Requests",
            path: "/purchasing/materialrequests/overview",
          },
          { name: "Suppliers", path: "/purchasing/supplier/dashboard" },
          {
            name: "Quotation Requests",
            path: "/purchasing/quotationrequest/overview",
          },
          { name: "Purchasing Orders", path: "/purchasing/orders/overview" },
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Material Requests Overview
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                View and manage all material requests across projects
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{materialRequests.length}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {materialRequests.filter(r => r.status === 'PENDING').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {materialRequests.filter(r => r.status === 'Approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {materialRequests.filter(r => r.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Requests</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by project, phase, materials, or requestor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveView("project-wise")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeView === "project-wise"
                      ? "bg-web_yellow text-main_dark shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Project-wise
                </button>
                <button
                  onClick={() => setActiveView("material-wise")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeView === "material-wise"
                      ? "bg-web_yellow text-main_dark shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Material-wise
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
            </p>
          </div>

          {/* Conditional Table Rendering */}
          {activeView === "project-wise" ? (
            <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-light_brown/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        ID
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                        onClick={() => handleSort('projectName')}
                      >
                        <div className="flex items-center gap-2">
                          <FaFileAlt className="w-4 h-4" />
                          Project Name
                          {sortBy === 'projectName' && (
                            <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                        onClick={() => handleSort('phase')}
                      >
                        <div className="flex items-center gap-2">
                          Phase
                          {sortBy === 'phase' && (
                            <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Materials
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                        onClick={() => handleSort('requestDate')}
                      >
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4" />
                          Request Date
                          {sortBy === 'requestDate' && (
                            <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Priority</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                        onClick={() => handleSort('requestor')}
                      >
                        <div className="flex items-center gap-2">
                          <FaUser className="w-4 h-4" />
                          Requestor
                          {sortBy === 'requestor' && (
                            <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-main_dark">
                          #{request.id}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-main_dark text-sm">{request.projectName}</div>
                            <div className="text-xs text-gray-500">{request.projectId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.phase}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {request.materials}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(request.requestDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.priorityColor}`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.statusColor}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.requestor}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/purchasing/materialrequests/details/pwise/${request.id}`)}
                            className="text-deep_green hover:text-deep_green/80 transition-colors"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {paginatedRequests.map((request) => (
                  <div key={request.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-main_dark text-sm">#{request.id}</h3>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="font-semibold text-main_dark text-sm">{request.projectName}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{request.phase}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <FaCalendarAlt className="w-3 h-3" />
                          {formatDate(request.requestDate)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.statusColor}`}>
                          {request.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.priorityColor}`}>
                          {request.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <p><span className="font-medium">Materials:</span> {request.materials}</p>
                      <p><span className="font-medium">Quantity:</span> {request.quantity}</p>
                      <p><span className="font-medium">Requestor:</span> {request.requestor}</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => navigate(`/purchasing/materialrequests/details/${request.id}`)}
                        className="text-deep_green hover:text-deep_green/80 transition-colors"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Material-wise view would go here - similar structure
            <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Material-wise Material Requests
                </h2>
              </div>
              {/* Add material-wise table implementation here */}
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} results
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
      </main>
    </div>
  );
};

export default MaterialRequestsOverview;
