import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Settings, CheckCircle, AlertCircle, Clock, Package, Truck, Wrench, Zap, Building } from 'lucide-react';

const Site_Equipment_Info = () => {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [searchTerm, setSearchTerm] = useState('');
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

  const stats = [
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
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesLocation && matchesSearch;
  });

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-main_dark">Equipment Information</h1>
        </div>
        <p className="text-slatebluegray text-base">Track and manage all site equipment and their current status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((stat, index) => {
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

      {/* Filters and Search */}
      <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-slatebluegray" />
          <h2 className="text-lg font-semibold text-main_dark">Search & Filter</h2>
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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slatebluegray" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slatebluegray">
          Showing 1-{filteredEquipment.length} of 247 equipment items
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-150">
            <ChevronDown className="w-4 h-4 rotate-90 text-slatebluegray" />
          </button>
          <button className="px-4 py-2 rounded-lg bg-deep_green text-white font-medium shadow-sm hover:shadow-md transition-all duration-150">
            1
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-slatebluegray transition-colors duration-150">
            2
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-slatebluegray transition-colors duration-150">
            3
          </button>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-150">
            <ChevronRight className="w-4 h-4 text-slatebluegray" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Site_Equipment_Info;
