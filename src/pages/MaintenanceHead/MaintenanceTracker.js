import React, { useState } from 'react';
import { Filter, Calendar, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import TeamSection from '../../components/MaintenanceHead/TeamSection';
import { FaEye } from 'react-icons/fa';

const MaintenanceRequestTracker = () => {
  const [filters, setFilters] = useState({
    status: 'All Statuses',
    equipment: 'All Equipment',
    dateFrom: '',
    dateTo: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const totalPages = 6;
  const [showTeam, setShowTeam] = useState(false);
  const itemsPerPage = 5;

  const requests = [
    {
      id: 'REQ-2023-1001',
      dateSubmitted: 'Oct 15, 2023',
      materialPart: 'Hydraulic Pump Assembly',
      status: 'Delivered',
      etaDelivery: 'Oct 18, 2023',
      equipment: 'Hydraulic Systems'
    },
    {
      id: 'REQ-2023-1002',
      dateSubmitted: 'Oct 16, 2023',
      materialPart: 'Excavator Bucket Teeth',
      status: 'Approved',
      etaDelivery: 'Oct 22, 2023',
      equipment: 'Excavator'
    },
    {
      id: 'REQ-2023-1003',
      dateSubmitted: 'Oct 17, 2023',
      materialPart: 'Hydraulic Fluid (5 Gal)',
      status: 'Pending',
      etaDelivery: 'TBD',
      equipment: 'Hydraulic Systems'
    },
    {
      id: 'REQ-2023-1004',
      dateSubmitted: 'Oct 18, 2023',
      materialPart: 'Bulldozer Track Links',
      status: 'Rejected',
      etaDelivery: 'N/A',
      equipment: 'Bulldozer'
    },
    {
      id: 'REQ-2023-1005',
      dateSubmitted: 'Oct 19, 2023',
      materialPart: 'Crane Cable Assembly',
      status: 'Approved',
      etaDelivery: 'Oct 25, 2023',
      equipment: 'Crane'
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Delivered': 'bg-deep_green/10 text-deep_green',
      'Approved': 'bg-web_yellow/10 text-web_yellow',
      'Pending': 'bg-light_gray/40 text-slatebluegray',
      'Rejected': 'bg-red-100 text-red-800'
    };
    
    return statusStyles[status] || 'bg-light_gray/40 text-slatebluegray';
  };

  // Filter and search logic
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.materialPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'All Statuses' || request.status === filters.status;
    const matchesEquipment = filters.equipment === 'All Equipment' || request.equipment === filters.equipment;
    
    return matchesSearch && matchesStatus && matchesEquipment;
  });

  // Sort filtered results
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'dateSubmitted') {
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
  const totalFilteredPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get unique values for filters
  const statuses = ['All Statuses', ...new Set(requests.map(r => r.status))];
  const equipmentTypes = ['All Equipment', ...new Set(requests.map(r => r.equipment))];

  const navigation = useNavigate();
  
  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
        links={[
          { name: "Dashboard", href: "#", onClick: () => navigation("/maintenance/dashboard") },
          { name: "Task", href: "#", onClick: () => navigation("/maintenance/scheduling") },
          {
            name: "Schedule",
            href: "#",
            onClick: () => navigation("/maintenance/update-equipment-maintenance"),
          },
          { name: "Team", href: "#",
            onClick: () => {
              console.log("Team link clicked");
              setShowTeam(true);
            },
          },
          { name: "Equipment", href: "#", onClick: () => navigation("/maintenance/equipment")},
          { name: "Add Technician", href: "#", onClick: () => navigation("/maintenance/add-member") },
        ]}
        showButton={true}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Maintenance Request Tracker
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Track and manage material requests for maintenance projects
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{requests.length}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'Delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === 'Approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
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
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, material, or status..."
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
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Equipment Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                <select
                  value={filters.equipment}
                  onChange={(e) => handleFilterChange('equipment', e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {equipmentTypes.map(equipment => (
                    <option key={equipment} value={equipment}>{equipment}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedRequests.length)} of {sortedRequests.length} requests
            </p>
          </div>

          {/* Data Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-2">
                        Request ID
                        {sortBy === 'id' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('dateSubmitted')}
                    >
                      <div className="flex items-center gap-2">
                        Date Submitted
                        {sortBy === 'dateSubmitted' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Material / Part Name
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortBy === 'status' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      ETA / Delivery Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-main_dark">
                        {request.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-slatebluegray">
                        {request.dateSubmitted}
                      </td>
                      <td className="px-6 py-4 text-sm text-main_dark font-medium">
                        {request.materialPart}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slatebluegray">
                        {request.etaDelivery}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-deep_green hover:text-deep_green/80 transition-colors">
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
                        <h3 className="font-semibold text-main_dark text-sm">{request.id}</h3>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-slatebluegray">{request.dateSubmitted}</span>
                      </div>
                      <p className="text-sm text-main_dark font-medium mb-2">{request.materialPart}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <p><span className="font-medium">ETA:</span> {request.etaDelivery}</p>
                    <p><span className="font-medium">Equipment:</span> {request.equipment}</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className="text-deep_green hover:text-deep_green/80 transition-colors">
                      <FaEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedRequests.length)} of {sortedRequests.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {[...Array(Math.min(totalFilteredPages, 5))].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-web_yellow text-main_dark'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(Math.min(totalFilteredPages, currentPage + 1))}
                disabled={currentPage === totalFilteredPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

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
    </div>
  );
};

export default MaintenanceRequestTracker;
