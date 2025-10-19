import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import { FaSearch, FaFilter, FaEye, FaCalendarAlt, FaUser, FaTools, FaCog } from 'react-icons/fa';
import { useNavigate }  from 'react-router-dom';

const MaintenanceRequestsOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/schedule-maintenance-materials/overview");
      setData(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching maintenance requests:", err);
      setError("Failed to fetch maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in progress':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  // Get unique values for filters
  const statuses = ['All Status', ...new Set(data.map(r => r.status).filter(Boolean))];

  // Filter and sort data
  const filteredData = data.filter(request => {
    const matchesSearch = 
      (request.equipment && request.equipment.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.requestedBy && request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.maintenanceType && request.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.equipmentName && request.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'All Status' || request.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort filtered results
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'date' || sortBy === 'requestDate' || sortBy === 'scheduledDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate stats from actual data
  const totalRequests = data.length;
  const pendingRequests = data.filter(r => r.status === 'Pending').length;
  const approvedRequests = data.filter(r => r.status === 'Approved').length;
  const completedRequests = data.filter(r => r.status === 'Completed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          links={[
            {name: 'Dashboard', path: '/inventory-dashboard'},
            {name: 'Inventory Control', path: '/inventory-control'},
            {name: 'Inventory Monitoring', path: '/inventory-monitoring'},
            {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
            { name: 'Equipment Request', path: '/Inventory-requests' },
            {name: 'Equipment Scheduling', path: '/equipment-scheduling'},
          ]}
        />
        <div className="flex items-center justify-center min-h-96 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
            <p className="text-gray-600">Loading maintenance requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          links={[
            {name: 'Dashboard', path: '/inventory-dashboard'},
            {name: 'Inventory Control', path: '/inventory-control'},
            {name: 'Inventory Monitoring', path: '/inventory-monitoring'},
            {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
            { name: 'Equipment Request', path: '/Inventory-requests' },
            {name: 'Equipment Scheduling', path: '/equipment-scheduling'},
          ]}
        />
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10 pt-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
        links={[
          {name: 'Dashboard', path: '/inventory-dashboard'},
          {name: 'Inventory Control', path: '/inventory-control'},
          {name: 'Inventory Monitoring', path: '/inventory-monitoring'},
          {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
          { name: 'Equipment Request', path: '/Inventory-requests' },
          {name: 'Equipment Scheduling', path: '/equipment-scheduling'},
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Maintenance Requests Overview
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Monitor and manage equipment maintenance schedules
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{totalRequests}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{completedRequests}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Requests
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by equipment, requestor, or type..."
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
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} requests
            </p>
          </div>

          {/* Maintenance Requests Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {sortedData.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🔧</div>
                <h3 className="text-lg font-semibold text-main_dark mb-2">No Maintenance Requests Found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-light_brown/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">ID</th>
                        <th 
                          className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                          onClick={() => handleSort('equipment')}
                        >
                          <div className="flex items-center gap-2">
                            <FaTools className="w-4 h-4" />
                            Equipment
                            {sortBy === 'equipment' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="w-4 h-4" />
                            Request Date
                            {sortBy === 'date' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                          onClick={() => handleSort('requestedBy')}
                        >
                          <div className="flex items-center gap-2">
                            <FaUser className="w-4 h-4" />
                            Requested By
                            {sortBy === 'requestedBy' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Priority</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedData.map((request, index) => (
                        <tr key={request.id || index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-main_dark">
                            #{request.id || index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-main_dark text-sm">
                              {request.equipment || request.equipmentName || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(request.date || request.requestDate || request.scheduledDate)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {request.requestedBy || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {request.maintenanceType || request.type || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority || 'Medium')}`}>
                              {request.priority || 'Medium'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-deep_green hover:text-deep_green/80 transition-colors" onClick={() => navigate(`/maintenance-request-page/${request.id}`)}>
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
                  {paginatedData.map((request, index) => (
                    <div key={request.id || index} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-main_dark text-sm">#{request.id || index + 1}</h3>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="font-semibold text-main_dark text-sm">
                              {request.equipment || request.equipmentName || 'N/A'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            {request.maintenanceType || request.type || 'N/A'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FaCalendarAlt className="w-3 h-3" />
                            {formatDate(request.date || request.requestDate || request.scheduledDate)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status || 'N/A'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority || 'Medium')}`}>
                            {request.priority || 'Medium'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600 mb-3">
                        <p><span className="font-medium">Requested by:</span> {request.requestedBy || 'N/A'}</p>
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="text-deep_green hover:text-deep_green/80 transition-colors" onClick={() => navigate(`/maintenance-requests/${request.id}`)}>
                          <FaEye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
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
          )}
        </div>
      </main>
    </div>
  );
};

export default MaintenanceRequestsOverview;
