import React, { useEffect, useState } from 'react';
import { FaSearch, FaFilter, FaPlus, FaEye, FaEdit, FaTrash, FaDownload, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import NavBar from '../../../components/NavBar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SupplierList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const itemsPerPage = 10;
    const navigate = useNavigate();

  const [suppliers, setsuppliers] = useState([]);

  const getallSuppliers = async () => {
    const response = await fetch("http://localhost:8080/api/supplier/all", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
    });
    const results=await response.json();
    // console.log(results);
    if(response.ok){
        setsuppliers(results.data);
    }else{
        toast.error("Failed to fetch suppliers. Please try again later.");
    }
    
  }
  console.log(suppliers);
  
   useEffect(() => {
      getallSuppliers();
    }, []);

  // Filter suppliers based on search and filters
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || supplier.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || supplier.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const categories = ['All Categories', 'Electronics & Components', 'Construction Materials', 'Transportation & Logistics', 'Steel & Metal', 'Food & Beverages', 'Technology Services'];
  const statuses = ['All Status', 'Active', 'Pending', 'Inactive'];

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar
        links={[
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Orders', path: '/orders' },
        ]}
      />

      {/* Main Content */}
      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Supplier Directory
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage and view all registered suppliers in your network
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-4 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center justify-center gap-2 text-sm">
                <FaDownload className="w-4 h-4" />
                Export List
              </button>
              <button onClick={() => navigate('/purchasing/supplier/register')} className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors flex items-center justify-center gap-2 text-sm font-semibold">
                <FaPlus className="w-4 h-4" />
                Add Supplier
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{suppliers.length}</div>
              <div className="text-sm text-gray-600">Total Suppliers</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-deep_green">{suppliers.filter(s => s.status === 'Active').length}</div>
              <div className="text-sm text-gray-600">Active Suppliers</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-web_yellow">{suppliers.filter(s => s.status === 'Pending').length}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">4.3</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Suppliers</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, category, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full lg:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
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

              {/* View Mode Toggle */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'table'
                        ? 'bg-web_yellow text-main_dark'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'grid'
                        ? 'bg-web_yellow text-main_dark'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
            </p>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-light_gray/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Supplier</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Rating</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Orders</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                      <th className="px-6 py-4  text-sm font-semibold text-main_dark">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-main_dark text-sm">{supplier.company_name}</div>
                            
                          </div>
                        </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-main_dark text-sm">{supplier.name}</div>
                              
                            </div>
                          </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{supplier.category}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <FaEnvelope className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 text-xs">{supplier.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaPhone className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 text-xs">{supplier.phone_number1}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaPhone className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 text-xs">{supplier.phone_number2}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <FaStar className="w-4 h-4 text-web_yellow" />
                            <span className="font-semibold text-main_dark text-sm">{supplier.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{supplier.totalOrders}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${supplier.statusColor}`}>
                            {supplier.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={()=>navigate('/purchasing/supplier/details',{ state: { supplierId: supplier.supplier_id }})} className="text-deep_green hover:text-deep_green/80 transition-colors">
                              <FaEye className="w-4 h-4" />
                            </button>
                            {/* <button className="text-gray-600 hover:text-gray-800 transition-colors">
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button className="text-red-500 hover:text-red-700 transition-colors">
                              <FaTrash className="w-4 h-4" />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {paginatedSuppliers.map((supplier) => (
                  <div key={supplier.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-main_dark text-sm mb-1">{supplier.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">{supplier.category}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          {supplier.location}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.statusColor}`}>
                        {supplier.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                      <div>
                        <span className="text-gray-500">Rating:</span>
                        <div className="flex items-center gap-1">
                          <FaStar className="w-3 h-3 text-web_yellow" />
                          <span className="font-semibold">{supplier.rating}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Orders:</span>
                        <span className="font-semibold ml-1">{supplier.totalOrders}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-600">
                        <div>{supplier.email}</div>
                        <div>{supplier.phone_number1}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-deep_green hover:text-deep_green/80 transition-colors">
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button className="text-red-500 hover:text-red-700 transition-colors">
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {paginatedSuppliers.map((supplier) => (
                <div key={supplier.id} className="bg-purewhite border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-main_dark text-lg mb-1">{supplier.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{supplier.category}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        {supplier.location}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${supplier.statusColor}`}>
                      {supplier.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-light_gray/30 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FaStar className="w-4 h-4 text-web_yellow" />
                        <span className="font-bold text-main_dark">{supplier.rating}</span>
                      </div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                    <div className="text-center p-3 bg-light_gray/30 rounded-lg">
                      <div className="font-bold text-main_dark mb-1">{supplier.totalOrders}</div>
                      <div className="text-xs text-gray-600">Orders</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600 text-xs">{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600 text-xs">{supplier.phone_number1}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Last order: {supplier.lastOrder}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-deep_green hover:text-deep_green/80 transition-colors">
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 transition-colors">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSuppliers.length)} of {filteredSuppliers.length} results
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

export default SupplierList;
