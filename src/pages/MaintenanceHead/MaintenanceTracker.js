import React, { useState } from 'react';
import { Filter, Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import TeamSection from '../../components/MaintenanceHead/TeamSection';

const MaintenanceRequestTracker = () => {
  const [filters, setFilters] = useState({
    status: 'All Statuses',
    equipment: 'All Equipment',
    dateFrom: '',
    dateTo: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;
  const [showTeam, setShowTeam] = useState(false);

  const requests = [
    {
      id: 'REQ-2023-1001',
      dateSubmitted: 'Oct 15, 2023',
      materialPart: 'Hydraulic Pump Assembly',
      status: 'Delivered',
      etaDelivery: 'Oct 18, 2023'
    },
    {
      id: 'REQ-2023-1002',
      dateSubmitted: 'Oct 16, 2023',
      materialPart: 'Excavator Bucket Teeth',
      status: 'Approved',
      etaDelivery: 'Oct 22, 2023'
    },
    {
      id: 'REQ-2023-1003',
      dateSubmitted: 'Oct 17, 2023',
      materialPart: 'Hydraulic Fluid (5 Gal)',
      status: 'Pending',
      etaDelivery: 'TBD'
    },
    {
      id: 'REQ-2023-1004',
      dateSubmitted: 'Oct 18, 2023',
      materialPart: 'Bulldozer Track Links',
      status: 'Rejected',
      etaDelivery: 'N/A'
    },
    {
      id: 'REQ-2023-1005',
      dateSubmitted: 'Oct 19, 2023',
      materialPart: 'Crane Cable Assembly',
      status: 'Approved',
      etaDelivery: 'Oct 25, 2023'
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Delivered': 'bg-green-500 text-white',
      'Approved': 'bg-yellow-400 text-yellow-900',
      'Pending': 'bg-gray-400 text-white',
      'Rejected': 'bg-red-500 text-white'
    };
    
    return statusStyles[status] || 'bg-gray-400 text-white';
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigation = useNavigate();
  return (

    <>
      <NavBar
      links={[
          { name: "Dashboard", href: "#", onClick: () => navigation("/maintenance/dashboard") },
          { name: "Task", href: "#",onClick: () => navigation("/maintenance/scheduling") },
          {
            name: "Schedule",
            href: "#",
            onClick: () =>
              navigation("/maintenance/update-equipment-maintenance"),
          },
          { name: "Team", href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");
              
              setShowTeam(true);
            },
           },
          { name: "Equipment", href: "#" ,onClick: () => navigation("/maintenance/equipment")},
          { name: "Add Technician", href: "#",onClick: () => navigation("/maintenance/add-member") },
        ]}
        showButton={true}
    />

    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Request Tracker</h1>
          <p className="text-gray-600">Track and manage material requests for maintenance projects</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent appearance-none"
                >
                  <option>All Statuses</option>
                  <option>Delivered</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Equipment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
              <div className="relative">
                <select
                  value={filters.equipment}
                  onChange={(e) => handleFilterChange('equipment', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent appearance-none"
                >
                  <option>All Equipment</option>
                  <option>Hydraulic Systems</option>
                  <option>Excavator</option>
                  <option>Bulldozer</option>
                  <option>Crane</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Range */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div>
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-6 py-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-yellow-400 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-yellow-900">
              <div className="col-span-2 flex items-center space-x-1">
                <span>Request ID</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center space-x-1">
                <span>Date Submitted</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="col-span-3">Material / Part Name</div>
              <div className="col-span-2 flex items-center space-x-1">
                <span>Status</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="col-span-2 flex items-center space-x-1">
                <span>ETA / Delivery Date</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="col-span-1">Action</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {requests.map((request, index) => (
              <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center text-sm">
                  <div className="col-span-2 font-medium text-gray-900">
                    {request.id}
                  </div>
                  <div className="col-span-2 text-gray-700">
                    {request.dateSubmitted}
                  </div>
                  <div className="col-span-3 text-gray-700">
                    {request.materialPart}
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-700">
                    {request.etaDelivery}
                  </div>
                  <div className="col-span-1">
                    <button className="text-teal-700 hover:text-teal-800 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing 1 to 5 of 28 results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {[1, 2, 3, '...', 6].map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  page === currentPage
                    ? 'bg-teal-700 text-white'
                    : page === '...'
                    ? 'cursor-default text-gray-500'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
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
};

export default MaintenanceRequestTracker;
