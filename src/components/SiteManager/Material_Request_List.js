import React, { useState } from 'react';
import { Search, ChevronDown, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Material_Request_List() {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('Last 30 days');
  const [searchTerm, setSearchTerm] = useState('');

  const requests = [
    {
      id: '#REQ-001',
      material: 'Portland Cement - 50kg bags',
      quantity: '200 bags',
      status: 'Pending',
      date: 'Dec 15, 2024'
    },
    {
      id: '#REQ-002',
      material: 'Steel Rebar - 12mm diameter',
      quantity: '500 meters',
      status: 'Approved',
      date: 'Dec 14, 2024'
    },
    {
      id: '#REQ-003',
      material: 'Concrete Blocks - 8x8x16',
      quantity: '1,500 units',
      status: 'Pending',
      date: 'Dec 13, 2024'
    },
    {
      id: '#REQ-004',
      material: 'Plywood Sheets - 4x8 ft',
      quantity: '75 sheets',
      status: 'Approved',
      date: 'Dec 12, 2024'
    },
    {
      id: '#REQ-005',
      material: 'Sand - Fine Grade',
      quantity: '10 cubic yards',
      status: 'Rejected',
      date: 'Dec 11, 2024'
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: '#F3F4F6' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Material Request List</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and track all material requests for your projects</p>
            </div>
            <button 
              className="flex items-center px-4 py-2 text-white font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#236571' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent appearance-none bg-white pr-10"
                  style={{ focusRingColor: '#236571' }}
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="relative">
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent appearance-none bg-white pr-10"
                  style={{ focusRingColor: '#236571' }}
                >
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Last 90 days</option>
                  <option>This month</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by material name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ focusRingColor: '#236571' }}
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#236571' }}
              >
                Apply Filters
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4" style={{ backgroundColor: '#EFC11A' }}>
            <div className="grid grid-cols-5 gap-4">
              <div className="font-semibold text-gray-900">Request ID</div>
              <div className="font-semibold text-gray-900">Material Name</div>
              <div className="font-semibold text-gray-900">Quantity</div>
              <div className="font-semibold text-gray-900">Status</div>
              <div className="font-semibold text-gray-900">Request Date</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {requests.map((request, index) => (
              <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="font-medium text-gray-900">{request.id}</div>
                  <div className="text-gray-900">{request.material}</div>
                  <div className="text-gray-900">{request.quantity}</div>
                  <div>
                    <span className={getStatusBadge(request.status)}>
                      {request.status}
                    </span>
                  </div>
                  <div className="text-gray-600">{request.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing 1 to 5 of 23 requests
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className="px-3 py-1 text-white font-medium rounded-lg"
              style={{ backgroundColor: '#236571' }}
            >
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              5
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
