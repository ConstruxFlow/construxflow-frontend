import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { FaSearch, FaFilter, FaCalendarAlt, FaEye, FaCog } from 'react-icons/fa';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

const EquipmentScheduling = () => {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 10;

  const originalList = [
    {
      id: 1,
      name: 'Excavator CAT 320',
      status: 'Available',
      utilization: '0%',
      buttonText: 'Schedule',
      color: 'bg-web_yellow hover:bg-web_yellow/80 text-main_dark',
      location: 'Main Warehouse',
      lastMaintenance: '2024-01-15'
    },
    {
      id: 2,
      name: 'Tower Crane TC–400',
      status: 'In Use',
      utilization: '85%',
      buttonText: 'View Schedule',
      color: 'bg-deep_green hover:bg-deep_green/80 text-white',
      location: 'Site A - Block 2',
      lastMaintenance: '2024-01-10'
    },
    {
      id: 3,
      name: 'Generator Set 500KW',
      status: 'Under Maintenance',
      utilization: 'N/A',
      buttonText: 'View Details',
      color: 'bg-light_gray hover:bg-light_gray/80 text-main_dark',
      location: 'Maintenance Bay',
      lastMaintenance: '2024-01-20'
    },
    {
      id: 4,
      name: 'Hydraulic Pump HP-200',
      status: 'Available',
      utilization: '0%',
      buttonText: 'Schedule',
      color: 'bg-web_yellow hover:bg-web_yellow/80 text-main_dark',
      location: 'Storage Area B',
      lastMaintenance: '2024-01-05'
    },
    {
      id: 5,
      name: 'Concrete Mixer CM-350',
      status: 'In Use',
      utilization: '60%',
      buttonText: 'View Schedule',
      color: 'bg-deep_green hover:bg-deep_green/80 text-white',
      location: 'Site B - Foundation',
      lastMaintenance: '2024-01-12'
    }
  ];

  const statusOptions = ['All', 'Available', 'In Use', 'Under Maintenance'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-deep_green/10 text-deep_green';
      case 'In Use':
        return 'bg-web_yellow/10 text-web_yellow';
      case 'Under Maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-light_gray/40 text-slatebluegray';
    }
  };

  // Filter and search logic
  const filteredEquipment = originalList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort filtered results
  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEquipment = sortedEquipment.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleButtonClick = (item) => {
    if (item.buttonText === 'Schedule') {
      navigate(`/shedule-form`);
    } else if (item.buttonText === 'View Schedule') {
      navigate(`/view-schedule-page`);
    } else if (item.buttonText === 'View Details') {
      navigate(`/equipment-details/${item.id}`);
    }
  };

  // Get stats
  const totalEquipment = originalList.length;
  const availableCount = originalList.filter(item => item.status === 'Available').length;
  const inUseCount = originalList.filter(item => item.status === 'In Use').length;
  const maintenanceCount = originalList.filter(item => item.status === 'Under Maintenance').length;

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Equipment Scheduling
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Schedule and manage equipment allocation across your construction sites
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{totalEquipment}</div>
              <div className="text-sm text-gray-600">Total Equipment</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{inUseCount}</div>
              <div className="text-sm text-gray-600">In Use</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{maintenanceCount}</div>
              <div className="text-sm text-gray-600">Under Maintenance</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Equipment
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search equipment by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        filterStatus === status
                          ? "bg-web_yellow text-main_dark shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedEquipment.length)} of {sortedEquipment.length} equipment
            </p>
          </div>

          {/* Equipment Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">ID</th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Equipment Name
                        {sortBy === 'name' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
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
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center gap-2">
                        Location
                        {sortBy === 'location' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Utilization</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedEquipment.length > 0 ? (
                    paginatedEquipment.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-main_dark">
                          #{item.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-main_dark text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">Last Maintenance: {item.lastMaintenance}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.location}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-main_dark">{item.utilization}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleButtonClick(item)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 shadow-sm hover:shadow-md ${item.color}`}
                          >
                            {item.buttonText}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <div className="text-6xl mb-4">🔧</div>
                        <h3 className="text-lg font-semibold text-main_dark mb-2">No Equipment Found</h3>
                        <p className="text-slatebluegray">Try adjusting your search terms or filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {paginatedEquipment.length > 0 ? (
                paginatedEquipment.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-main_dark text-sm">#{item.id}</h3>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="font-semibold text-main_dark text-sm">{item.name}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{item.location}</p>
                        <p className="text-xs text-gray-500">Last Maintenance: {item.lastMaintenance}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <p><span className="font-medium">Utilization:</span> <span className="font-medium text-main_dark">{item.utilization}</span></p>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleButtonClick(item)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-150 shadow-sm hover:shadow-md ${item.color}`}
                      >
                        {item.buttonText}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🔧</div>
                  <h3 className="text-lg font-semibold text-main_dark mb-2">No Equipment Found</h3>
                  <p className="text-slatebluegray">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedEquipment.length)} of {sortedEquipment.length} results
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

export default EquipmentScheduling;
