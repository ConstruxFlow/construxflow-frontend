import React, { useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Site_RawMaterial_Info() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 10;

  const materials = [
    {
      id: 1,
      name: 'Concrete Mix',
      type: 'Building Material',
      currentStock: '850 bags',
      reorderLevel: '200 bags',
      stockStatus: 'normal',
    },
    {
      id: 2,
      name: 'Steel Rebar',
      type: 'Structural',
      currentStock: '45 tons',
      reorderLevel: '100 tons',
      stockStatus: 'low',
    },
    {
      id: 3,
      name: 'Ceramic Tiles',
      type: 'Finishing',
      currentStock: '2,540 sqft',
      reorderLevel: '500 sqft',
      stockStatus: 'normal',
    },
    {
      id: 4,
      name: 'Exterior Paint',
      type: 'Coating',
      currentStock: '125 gallons',
      reorderLevel: '50 gallons',
      stockStatus: 'normal',
    },
    {
      id: 5,
      name: 'Lumber 2x4',
      type: 'Wood',
      currentStock: '15 pieces',
      reorderLevel: '100 pieces',
      stockStatus: 'critical',
    }
  ];

  const getTypeColor = (type) => {
    const colors = {
      'Building Material': 'bg-deep_green/10 text-deep_green',
      'Structural': 'bg-light_gray/40 text-slatebluegray',
      'Finishing': 'bg-deep_green/10 text-deep_green',
      'Coating': 'bg-web_yellow/10 text-web_yellow',
      'Wood': 'bg-light_brown/10 text-light_brown'
    };
    return colors[type] || 'bg-light_gray/40 text-slatebluegray';
  };

  const getStockColor = (status) => {
    if (status === 'critical') return 'text-red-600 font-semibold';
    if (status === 'low') return 'text-orange-600 font-semibold';
    return 'text-main_dark font-medium';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'low':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-deep_green/10 text-deep_green';
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
  const types = ['All Types', ...new Set(materials.map(m => m.type))];
  const statuses = ['All Status', 'Normal', 'Low', 'Critical'];

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = 
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All Types' || material.type === selectedType;
    
    let statusMatch = true;
    if (selectedStatus !== 'All Status') {
      const statusLower = selectedStatus.toLowerCase();
      statusMatch = material.stockStatus === statusLower;
    }
    
    return matchesSearch && matchesType && statusMatch;
  });

  // Sort filtered results
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedMaterials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMaterials = sortedMaterials.slice(startIndex, startIndex + itemsPerPage);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Raw Materials Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Track and manage all raw materials inventory for your construction site
              </p>
            </div>
            <button className="bg-web_yellow hover:bg-web_yellow/80 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center gap-2"
              onClick={() => navigate('/site-manager/site-material-add')}
            >
              <FaPlus className="w-4 h-4" />
              Add Material
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{materials.length}</div>
              <div className="text-sm text-gray-600">Total Materials</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {materials.filter(m => m.stockStatus === 'low').length}
              </div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">
                {materials.filter(m => m.stockStatus === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical Stock</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {materials.filter(m => m.stockStatus === 'normal').length}
              </div>
              <div className="text-sm text-gray-600">Normal Stock</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Materials
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by material name or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedMaterials.length)} of {sortedMaterials.length} materials
            </p>
          </div>

          {/* Materials Table */}
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
                        Material Name
                        {sortBy === 'name' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center gap-2">
                        Type
                        {sortBy === 'type' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Current Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Reorder Level</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-main_dark">
                        #{material.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-main_dark text-sm">{material.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                          {material.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${getStockColor(material.stockStatus)}`}>
                          {material.currentStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {material.reorderLevel}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(material.stockStatus)}`}>
                          {material.stockStatus === 'critical' ? 'Critical' : 
                           material.stockStatus === 'low' ? 'Low Stock' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {paginatedMaterials.map((material) => (
                <div key={material.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-main_dark text-sm">#{material.id}</h3>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="font-semibold text-main_dark text-sm">{material.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                          {material.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(material.stockStatus)}`}>
                        {material.stockStatus === 'critical' ? 'Critical' : 
                         material.stockStatus === 'low' ? 'Low Stock' : 'Normal'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <p><span className="font-medium">Current Stock:</span> 
                      <span className={getStockColor(material.stockStatus)}> {material.currentStock}</span>
                    </p>
                    <p><span className="font-medium">Reorder Level:</span> {material.reorderLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedMaterials.length)} of {sortedMaterials.length} results
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
}
