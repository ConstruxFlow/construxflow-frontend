import React, { useState } from 'react';
import NavBar from '../../../components/NavBar';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const MaterialRequestsOverview = () => {
  const [activeView, setActiveView] = useState('project-wise');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();


  const materialRequests = [
    {
      projectName: 'Tower A Construction',
      phase: 'Foundation',
      materials: 'Cement, Steel Bars, Sand',
      quantity: '150 tons',
      status: 'Pending',
      requestor: 'John Smith',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      projectName: 'Bridge Project',
      phase: 'Structural',
      materials: 'Steel Beams, Concrete',
      quantity: '200 units',
      status: 'Approved',
      requestor: 'Sarah Wilson',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      projectName: 'Office Complex',
      phase: 'Interior',
      materials: 'Tiles, Paint, Fixtures',
      quantity: '500 sq ft',
      status: 'Rejected',
      requestor: 'Mike Johnson',
      statusColor: 'bg-red-100 text-red-800'
    },
    {
      projectName: 'Office Complex',
      phase: 'Interior',
      materials: 'Tiles, Paint, Fixtures',
      quantity: '500 sq ft',
      status: 'Rejected',
      requestor: 'Mike Johnson',
      statusColor: 'bg-red-100 text-red-800'
    }
  ];

  // Material-wise data
  const materialWiseRequests = [
    {
      material: 'Cement',
      quantity: '150 tons',
      deadline: '2024-12-25',
      status: 'Pending',
      priority: 'High',
      statusColor: 'bg-yellow-100 text-yellow-800',
      priorityColor: 'bg-red-100 text-red-800'
    },
    {
      material: 'Steel Bars',
      quantity: '50 tons',
      deadline: '2024-12-20',
      status: 'Approved',
      priority: 'Medium',
      statusColor: 'bg-green-100 text-green-800',
      priorityColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      material: 'Steel Beams',
      quantity: '200 units',
      deadline: '2024-12-30',
      status: 'In Progress',
      priority: 'High',
      statusColor: 'bg-blue-100 text-blue-800',
      priorityColor: 'bg-red-100 text-red-800'
    },
    {
      material: 'Concrete',
      quantity: '100 cubic meters',
      deadline: '2024-12-28',
      status: 'Approved',
      priority: 'Low',
      statusColor: 'bg-green-100 text-green-800',
      priorityColor: 'bg-gray-100 text-gray-800'
    },
    {
      material: 'Tiles',
      quantity: '500 sq ft',
      deadline: '2025-01-05',
      status: 'Rejected',
      priority: 'Medium',
      statusColor: 'bg-red-100 text-red-800',
      priorityColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      material: 'Paint',
      quantity: '200 gallons',
      deadline: '2025-01-10',
      status: 'Pending',
      priority: 'Low',
      statusColor: 'bg-yellow-100 text-yellow-800',
      priorityColor: 'bg-gray-100 text-gray-800'
    }
  ];

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/*  Navigation */}
      <NavBar links={
        [
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
        ]
     } />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-main_dark mb-1 tracking-tight">
              Material Requests Overview
            </h1>
            <p className="text-gray-600 text-sm">
              View and manage all material requests across projects
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <FaMagnifyingGlass className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                />
              </div>

              {/* View Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('project-wise')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeView === 'project-wise'
                      ? 'bg-web_yellow text-main_dark shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Project-wise
                  </span>
                </button>
                <button
                  onClick={() => setActiveView('material-wise')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeView === 'material-wise'
                      ? 'bg-web_yellow text-main_dark shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Material-wise
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Table Rendering */}
          {activeView === 'project-wise' ? (
            /* Project-wise Material Requests Table */
            <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Project-wise Material Requests</h2>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-web_yellow">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Project Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Phase
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Materials
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Requestor
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {materialRequests.map((request, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {request.projectName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {request.phase}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {request.materials}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {request.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.statusColor}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {request.requestor}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button onClick={() => navigate(`/purchasing/materialrequests`)} className="text-main_dark  hover:text-deep_green/80 transition-colors">
                            <FaEye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {materialRequests.map((request, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{request.projectName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.statusColor}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Phase:</span> {request.phase}</p>
                      <p><span className="font-medium">Materials:</span> {request.materials}</p>
                      <p><span className="font-medium">Quantity:</span> {request.quantity}</p>
                      <p><span className="font-medium">Requestor:</span> {request.requestor}</p>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button onClick={() => navigate(`/purchasing/materialrequests`)} className="text-deep_green hover:text-deep_green/80 transition-colors">
                        <FaEye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing 1 to 10 of 47 results
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button 
                    className="px-3 py-1 text-sm bg-web_yellow text-main_dark rounded font-medium"
                  >
                    1
                  </button>
                  <button 
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setCurrentPage(2)}
                  >
                    2
                  </button>
                  <button 
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setCurrentPage(3)}
                  >
                    3
                  </button>
                  <button 
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Material-wise Material Requests Table */
            <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Material-wise Material Requests</h2>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-web_yellow">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Material
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Deadline
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {materialWiseRequests.map((request, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {request.material}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {request.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(request.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.statusColor}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.priorityColor}`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button onClick={() => navigate(`/purchasing/materialrequests/mwise`)} className="text-main_dark hover:text-deep_green/80 transition-colors">
                            <FaEye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {materialWiseRequests.map((request, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{request.material}</h3>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.statusColor}`}>
                          {request.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.priorityColor}`}>
                          {request.priority}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Quantity:</span> {request.quantity}</p>
                      <p><span className="font-medium">Deadline:</span> {new Date(request.deadline).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button onClick={() => navigate(`/purchasing/materialrequests/mwise`)} className="text-deep_green hover:text-deep_green/80 transition-colors">
                        <FaEye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing 1 to 6 of 24 results
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button 
                    className="px-3 py-1 text-sm bg-web_yellow text-main_dark rounded font-medium"
                  >
                    1
                  </button>
                  <button 
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setCurrentPage(2)}
                  >
                    2
                  </button>
                  <button 
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setCurrentPage(3)}
                  >
                    3
                  </button>
                  <button 
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MaterialRequestsOverview;
