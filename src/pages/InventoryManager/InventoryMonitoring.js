import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { FaSearch, FaFilter, FaEye, FaShoppingCart } from 'react-icons/fa';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

const InventoryMonitoring = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Items');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 10;

  const inventoryData = [
    {
      id: 1,
      name: 'Hydraulic Pump – CAT 320',
      serial: 'HP-CAT320-001',
      category: 'Excavator Parts',
      stock: 3,
      minLevel: 5,
      status: 'Low Stock',
      statusColor: 'bg-red-100 text-red-800',
      type: 'Machinery'
    },
    {
      id: 2,
      name: 'Steel Reinforcement Bars',
      serial: 'Grade: 60, Size: 16mm',
      category: 'Construction Materials',
      stock: 150,
      minLevel: 50,
      status: 'Good',
      statusColor: 'bg-deep_green/10 text-deep_green',
      type: 'Materials'
    },
    {
      id: 3,
      name: 'Concrete Mixer Blades',
      serial: 'Model: CMB-500',
      category: 'Mixer Parts',
      stock: 8,
      minLevel: 10,
      status: 'Medium',
      statusColor: 'bg-web_yellow/10 text-web_yellow',
      type: 'Spare Parts'
    },
    {
      id: 4,
      name: 'Engine Oil Filter',
      serial: 'OF-HD450-002',
      category: 'Engine Parts',
      stock: 2,
      minLevel: 8,
      status: 'Critical',
      statusColor: 'bg-red-100 text-red-800',
      type: 'Spare Parts'
    },
    {
      id: 5,
      name: 'Hydraulic Hoses',
      serial: 'HH-CAT320-005',
      category: 'Hydraulic Parts',
      stock: 12,
      minLevel: 6,
      status: 'Good',
      statusColor: 'bg-deep_green/10 text-deep_green',
      type: 'Spare Parts'
    }
  ];

  const filterOptions = ['All Items', 'Machinery', 'Spare Parts', 'Materials', 'Low Stock', 'Critical'];

  // Filter and search logic
  const filteredData = inventoryData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter !== 'All Items') {
      if (selectedFilter === 'Low Stock') {
        matchesFilter = item.status === 'Low Stock';
      } else if (selectedFilter === 'Critical') {
        matchesFilter = item.status === 'Critical';
      } else {
        matchesFilter = item.type === selectedFilter;
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  // Sort filtered results
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'stock' || sortBy === 'minLevel') {
      aValue = Number(aValue);
      bValue = Number(bValue);
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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Get stats
  const totalItems = inventoryData.length;
  const lowStockItems = inventoryData.filter(item => item.status === 'Low Stock').length;
  const criticalItems = inventoryData.filter(item => item.status === 'Critical').length;
  const goodStockItems = inventoryData.filter(item => item.status === 'Good').length;

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Inventory Monitoring
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Track and manage your construction equipment and materials
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{totalItems}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{goodStockItems}</div>
              <div className="text-sm text-gray-600">Good Stock</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Inventory
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search equipment, parts, or serial numbers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filters</label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedFilter === filter
                          ? "bg-web_yellow text-main_dark shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} items
            </p>
          </div>

          {/* Inventory Table */}
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
                        Item Name
                        {sortBy === 'name' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-2">
                        Category
                        {sortBy === 'category' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('stock')}
                    >
                      <div className="flex items-center gap-2">
                        Current Stock
                        {sortBy === 'stock' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('minLevel')}
                    >
                      <div className="flex items-center gap-2">
                        Minimum Level
                        {sortBy === 'minLevel' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-main_dark">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-main_dark text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.serial}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-main_dark">{item.stock}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.minLevel}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate('/reorder-material-page')}
                            className="flex items-center gap-3 text-deep_green hover:text-deep_green/80 transition-colors"
                          >
                            <FaShoppingCart className="w-4 h-4" />
                            Reorder
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-main_dark text-sm">#{item.id}</h3>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="font-semibold text-main_dark text-sm">{item.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{item.serial}</p>
                      <p className="text-xs text-gray-600 mb-2">{item.category}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <p><span className="font-medium">Current Stock:</span> <span className="font-bold text-main_dark">{item.stock}</span></p>
                    <p><span className="font-medium">Minimum Level:</span> {item.minLevel}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/reorder-material-page')}
                      className="flex items-center gap-3 text-deep_green hover:text-deep_green/80 transition-colors"
                    >
                      <FaShoppingCart className="w-4 h-4" />
                      Reorder
                    </button>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
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
        </div>
      </main>
    </div>
  );
};

export default InventoryMonitoring;
