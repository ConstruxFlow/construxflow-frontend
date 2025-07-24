import React, { useState } from 'react';
import { FaSearch, FaFilter, FaPlus, FaEdit, FaBox } from 'react-icons/fa';
import { Building, Wrench, Palette, TreePine, Package, CheckCircle, Settings, AlertCircle, Search, ChevronDown, ChevronRight } from 'lucide-react';
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
      icon: Building,
      iconBg: 'bg-gradient-to-br from-deep_green to-deep_green/80'
    },
    {
      id: 2,
      name: 'Steel Rebar',
      type: 'Structural',
      currentStock: '45 tons',
      reorderLevel: '100 tons',
      stockStatus: 'low',
      icon: Wrench,
      iconBg: 'bg-gradient-to-br from-light_brown to-light_brown/80'
    },
    {
      id: 3,
      name: 'Ceramic Tiles',
      type: 'Finishing',
      currentStock: '2,540 sqft',
      reorderLevel: '500 sqft',
      stockStatus: 'normal',
      icon: Package,
      iconBg: 'bg-gradient-to-br from-deep_green to-deep_green/80'
    },
    {
      id: 4,
      name: 'Exterior Paint',
      type: 'Coating',
      currentStock: '125 gallons',
      reorderLevel: '50 gallons',
      stockStatus: 'normal',
      icon: Palette,
      iconBg: 'bg-gradient-to-br from-web_yellow to-web_yellow/80'
    },
    {
      id: 5,
      name: 'Lumber 2x4',
      type: 'Wood',
      currentStock: '15 pieces',
      reorderLevel: '100 pieces',
      stockStatus: 'critical',
      icon: TreePine,
      iconBg: 'bg-gradient-to-br from-light_brown to-light_brown/80'
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

  // Equipment Section State and Data
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const statusOptions = ['All Status', 'In Use', 'Overdue', 'Returned'];
  const locationOptions = ['All Locations', 'Zone A - Foundation', 'Zone B - Structure', 'Zone C - Finishing', 'Warehouse A'];

  const equipmentData = [
    {
      id: 1,
      name: 'Hydraulic Excavator CAT 320',
      category: 'Heavy Machinery',
      status: 'In Use',
      statusColor: 'bg-deep_green/10 text-deep_green',
      date: 'Assigned: Nov 15, 2024',
      location: 'Zone A - Foundation',
      assignee: 'John Martinez'
    },
    {
      id: 2,
      name: 'Concrete Mixer Truck',
      category: 'Transport Vehicle',
      status: 'Overdue',
      statusColor: 'bg-red-100 text-red-800',
      date: 'Due: Nov 18, 2024',
      location: 'Zone B - Structure',
      assignee: 'Sarah Chen'
    },
    {
      id: 3,
      name: 'Pneumatic Drill Set',
      category: 'Hand Tools',
      status: 'Returned',
      statusColor: 'bg-light_gray/40 text-slatebluegray',
      date: 'Returned: Nov 20, 2024',
      location: 'Warehouse A',
      assignee: 'Mike Johnson'
    },
    {
      id: 4,
      name: 'Tower Crane TC-5216',
      category: 'Heavy Machinery',
      status: 'In Use',
      statusColor: 'bg-deep_green/10 text-deep_green',
      date: 'Assigned: Nov 10, 2024',
      location: 'Zone C - Finishing',
      assignee: 'Tom Smith'
    },
    {
      id: 5,
      name: 'Generator 50KW Diesel',
      category: 'Power Equipment',
      status: 'In Use',
      statusColor: 'bg-deep_green/10 text-deep_green',
      date: 'Assigned: Nov 12, 2024',
      location: 'Zone A - Foundation',
      assignee: 'David Wilson'
    }
  ];

  const equipmentStats = [
    {
      value: '247',
      label: 'Total Equipment',
      icon: Package,
      bgColor: 'bg-gradient-to-br from-deep_green to-deep_green/80'
    },
    {
      value: '189',
      label: 'In Use',
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-br from-deep_green to-deep_green/80'
    },
    {
      value: '52',
      label: 'Returned',
      icon: Settings,
      bgColor: 'bg-gradient-to-br from-light_brown to-light_brown/80'
    },
    {
      value: '6',
      label: 'Overdue',
      icon: AlertCircle,
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600'
    }
  ];

  const filteredEquipment = equipmentData.filter(item => {
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    const matchesLocation = locationFilter === 'All Locations' || item.location === locationFilter;
    const matchesSearch = item.name.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(equipmentSearchTerm.toLowerCase());
    return matchesStatus && matchesLocation && matchesSearch;
  });

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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
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
                      <td className="px-6 py-4">
                        <button className="text-deep_green hover:text-deep_green/80 transition-colors">
                          <FaEdit className="w-4 h-4" />
                        </button>
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
                  
                  <div className="flex justify-end">
                    <button className="text-deep_green hover:text-deep_green/80 transition-colors">
                      <FaEdit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <br/><br/><br/>

          {/* --- Equipment Inventory Section --- */}
          <div className="mt-12 border-t border-gray-200 pt-10">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-7 h-7 text-deep_green" />
              <h2 className="text-2xl font-bold text-main_dark">Equipment Inventory</h2>
            </div>
            <p className="text-slatebluegray text-base mb-6">Track and manage all site equipment and their current status</p>

            {/* Equipment Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
              {equipmentStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">{stat.value}</h3>
                      <p className="text-slatebluegray font-medium text-sm truncate">{stat.label}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-lg transition-all duration-300`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Equipment Filters and Search */}
            <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slatebluegray" />
                <h2 className="text-lg font-semibold text-main_dark">Search & Filter Equipment</h2>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Status Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setIsStatusOpen(!isStatusOpen)}
                      className="flex items-center justify-between w-full sm:w-40 px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                    >
                      <span className="text-main_dark font-medium">{statusFilter}</span>
                      <ChevronDown className={`w-4 h-4 text-slatebluegray transform transition-transform duration-150 ${isStatusOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isStatusOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {statusOptions.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setStatusFilter(option);
                              setIsStatusOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Location Filter */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLocationOpen(!isLocationOpen)}
                      className="flex items-center justify-between w-full sm:w-48 px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                    >
                      <span className="text-main_dark font-medium">{locationFilter}</span>
                      <ChevronDown className={`w-4 h-4 text-slatebluegray transform transition-transform duration-150 ${isLocationOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isLocationOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {locationOptions.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setLocationFilter(option);
                              setIsLocationOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Equipment Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slatebluegray" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={equipmentSearchTerm}
                    onChange={(e) => setEquipmentSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Equipment List */}
            <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="divide-y divide-gray-200">
                {filteredEquipment.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-main_dark mb-2">No Equipment Found</h3>
                    <p className="text-slatebluegray">Try adjusting your search terms or filters.</p>
                  </div>
                ) : (
                  filteredEquipment.map((equipment) => (
                    <div key={equipment.id} className="p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-main_dark">{equipment.name}</h3>
                            <p className="text-sm text-slatebluegray">{equipment.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${equipment.statusColor}`}>
                              {equipment.status}
                            </div>
                            <div className="text-xs text-slatebluegray mt-1">{equipment.date}</div>
                          </div>
                          <div className="text-right min-w-0">
                            <div className="font-medium text-main_dark truncate">{equipment.location}</div>
                            <div className="text-sm text-slatebluegray">{equipment.assignee}</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slatebluegray flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
