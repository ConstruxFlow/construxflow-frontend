import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';

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
      statusColor: 'bg-green-100 text-green-800',
      date: 'Assigned: Nov 15, 2024',
      location: 'Zone A - Foundation',
      assignee: 'John Martinez',
      icon: '🚜',
      iconBg: 'bg-teal-600'
    },
    {
      id: 2,
      name: 'Concrete Mixer Truck',
      category: 'Transport Vehicle',
      status: 'Overdue',
      statusColor: 'bg-red-100 text-red-800',
      date: 'Due: Nov 18, 2024',
      location: 'Zone B - Structure',
      assignee: 'Sarah Chen',
      icon: '🚛',
      iconBg: 'bg-yellow-500'
    },
    {
      id: 3,
      name: 'Pneumatic Drill Set',
      category: 'Hand Tools',
      status: 'Returned',
      statusColor: 'bg-gray-100 text-gray-800',
      date: 'Returned: Nov 20, 2024',
      location: 'Warehouse A',
      assignee: 'Mike Johnson',
      icon: '🔧',
      iconBg: 'bg-gray-500'
    },
    {
      id: 4,
      name: 'Tower Crane TC-5216',
      category: 'Heavy Machinery',
      status: 'In Use',
      statusColor: 'bg-green-100 text-green-800',
      date: 'Assigned: Nov 10, 2024',
      location: 'Zone C - Finishing',
      assignee: 'Tom Smith',
      icon: '🏗️',
      iconBg: 'bg-teal-600'
    },
    {
      id: 5,
      name: 'Generator 50KW Diesel',
      category: 'Power Equipment',
      status: 'In Use',
      statusColor: 'bg-green-100 text-green-800',
      date: 'Assigned: Nov 12, 2024',
      location: 'Zone A - Foundation',
      assignee: 'David Wilson',
      icon: '⚡',
      iconBg: 'bg-yellow-500'
    }
  ];

  const stats = [
    {
      value: '247',
      label: 'Total Equipment',
      icon: X,
      bgColor: 'bg-teal-600',
      textColor: 'text-white'
    },
    {
      value: '189',
      label: 'In Use',
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-white'
    },
    {
      value: '52',
      label: 'Returned',
      icon: ChevronRight,
      bgColor: 'bg-gray-500',
      textColor: 'text-white'
    },
    {
      value: '6',
      label: 'Overdue',
      icon: AlertCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-white'
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
    <div className="min-h-screen pt-12" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} ${stat.textColor} flex items-center justify-center mr-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className="flex items-center justify-between w-full sm:w-40 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRingColor: '#236571' }}
                >
                  <span className="text-gray-700">{statusFilter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {isStatusOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {statusOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setStatusFilter(option);
                          setIsStatusOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
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
                  className="flex items-center justify-between w-full sm:w-48 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRingColor: '#236571' }}
                >
                  <span className="text-gray-700">{locationFilter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {isLocationOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {locationOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setLocationFilter(option);
                          setIsLocationOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search equipment"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ focusRingColor: '#236571' }}
              />
            </div>
          </div>
        </div>

        {/* Equipment List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredEquipment.map((equipment) => (
              <div key={equipment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg ${equipment.iconBg} flex items-center justify-center text-white text-xl`}>
                      {equipment.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{equipment.name}</h3>
                      <p className="text-sm text-gray-600">{equipment.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${equipment.statusColor}`}>
                        {equipment.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{equipment.date}</div>
                    </div>

                    <div className="text-right min-w-0">
                      <div className="font-medium text-gray-900 truncate">{equipment.location}</div>
                      <div className="text-sm text-gray-600">{equipment.assignee}</div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing 1-5 of 247 equipment items
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
              <ChevronDown className="w-4 h-4 rotate-90 text-gray-600" />
            </button>
            <button 
              className="px-3 py-2 rounded-md text-white font-medium"
              style={{ backgroundColor: '#236571' }}
            >
              1
            </button>
            <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700">
              2
            </button>
            <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700">
              3
            </button>
            <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Site_Equipment_Info;