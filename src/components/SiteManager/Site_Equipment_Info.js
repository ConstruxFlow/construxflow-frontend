import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Settings, CheckCircle, AlertCircle, Clock, Package, Truck, Wrench, Zap, Building } from 'lucide-react';

const Site_Equipment_Info = () => {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [searchTerm, setSearchTerm] = useState('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusOptions = ['All Status', 'In Use', 'Overdue', 'Returned', 'Maintenance', 'Available'];
  const locationOptions = ['All Locations', 'Zone A - Foundation', 'Zone B - Structure', 'Zone C - Finishing', 'Warehouse A', 'Maintenance Bay'];

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        // Mock data for now - replace with actual API call when backend is ready
        const mockProjects = [
          { id: 1, name: 'Residential Complex A' },
          { id: 2, name: 'Office Tower B' },
          { id: 3, name: 'Shopping Mall C' },
          { id: 4, name: 'Hospital Extension' }
        ];
        setProjects(mockProjects);
        setSelectedProject(1); // Select first project by default
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!selectedProject) return;
      setLoading(true);
      try {
        // Mock data for now - replace with actual API call when backend is ready
        const mockEquipment = getMockEquipmentForProject(selectedProject);
        setEquipmentData(mockEquipment);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [selectedProject]);

  const getMockEquipmentForProject = (projectId) => {
    switch (projectId) {
      case 1:
        return [
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
          }
        ];
      case 2:
        return [
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
            status: 'Maintenance',
            statusColor: 'bg-yellow-100 text-yellow-800',
            date: 'Maintenance: Nov 22, 2024',
            location: 'Maintenance Bay',
            assignee: 'David Wilson'
          }
        ];
      case 3:
        return [
          {
            id: 6,
            name: 'Bulldozer D6T',
            category: 'Heavy Machinery',
            status: 'In Use',
            statusColor: 'bg-deep_green/10 text-deep_green',
            date: 'Assigned: Nov 14, 2024',
            location: 'Zone A - Foundation',
            assignee: 'Alex Rodriguez'
          },
          {
            id: 7,
            name: 'Forklift 3-Ton',
            category: 'Material Handling',
            status: 'Available',
            statusColor: 'bg-blue-100 text-blue-800',
            date: 'Available',
            location: 'Warehouse A',
            assignee: 'None'
          }
        ];
      case 4:
        return [
          {
            id: 8,
            name: 'Scaffolding Set',
            category: 'Safety Equipment',
            status: 'In Use',
            statusColor: 'bg-deep_green/10 text-deep_green',
            date: 'Assigned: Nov 16, 2024',
            location: 'Zone B - Structure',
            assignee: 'Lisa Wang'
          }
        ];
      default:
        return [];
    }
  };

  const filteredEquipment = equipmentData.filter(item => {
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    const matchesLocation = locationFilter === 'All Locations' || item.location === locationFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesLocation && matchesSearch;
  });

  if (projectsLoading) {
    return (
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep_green mx-auto mb-4"></div>
            <p className="text-slatebluegray">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-xl font-semibold text-main_dark mb-2">No Project Selected</h2>
            <p className="text-slatebluegray mb-4">Please select a project to view its equipment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-main_dark">
            Equipment Information - {selectedProject ? projects.find(p => p.id === selectedProject)?.name || 'Unknown Project' : 'Select Project'}
          </h1>
        </div>
        <p className="text-slatebluegray text-base">
          Track and manage all site equipment and their current status for the selected project
        </p>
        
        {/* Project Selector */}
        <div className="mt-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Project:</label>
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm min-w-[200px]"
            disabled={projectsLoading}
          >
            {projectsLoading ? (
              <option>Loading projects...</option>
            ) : (
              <>
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          {
            value: equipmentData.length.toString(),
            label: 'Total Equipment',
            icon: Package,
            bgColor: 'bg-gradient-to-br from-deep_green to-deep_green/80'
          },
          {
            value: equipmentData.filter(item => item.status === 'In Use').length.toString(),
            label: 'In Use',
            icon: CheckCircle,
            bgColor: 'bg-gradient-to-br from-deep_green to-deep_green/80'
          },
          {
            value: equipmentData.filter(item => item.status === 'Returned').length.toString(),
            label: 'Returned',
            icon: Settings,
            bgColor: 'bg-gradient-to-br from-light_brown to-light_brown/80'
          },
          {
            value: equipmentData.filter(item => item.status === 'Overdue').length.toString(),
            label: 'Overdue',
            icon: AlertCircle,
            bgColor: 'bg-gradient-to-br from-red-500 to-red-600'
          }
        ].map((stat, index) => {
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
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold text-main_dark mb-2">Loading Equipment...</h3>
              <p className="text-slatebluegray">Please wait while we fetch the equipment data.</p>
            </div>
          ) : filteredEquipment.length === 0 ? (
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
          Showing 1-{filteredEquipment.length} of {equipmentData.length} equipment items
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-150">
            <ChevronDown className="w-4 h-4 rotate-90 text-slatebluegray" />
          </button>
          <button className="px-4 py-2 rounded-lg bg-deep_green text-white font-medium shadow-sm hover:shadow-md transition-all duration-150">
            1
          </button>
          <button className="px-4 py-2 rounded-2xl border border-gray-300 hover:bg-gray-50 text-slatebluegray transition-colors duration-150">
            2
          </button>
          <button className="px-4 py-2 rounded-2xl border border-gray-300 hover:bg-gray-50 text-slatebluegray transition-colors duration-150">
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
