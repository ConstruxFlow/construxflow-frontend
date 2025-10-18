import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Settings, 
  Package, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  Edit,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';
import NavBar from '../NavBar';

const ProjectEquipmentDashboard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projectEquipment, setProjectEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Mock data for project equipment - will be replaced with API calls
  useEffect(() => {
    const fetchProjectEquipment = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockProjectEquipment = [
          {
            id: 1,
            equipmentId: 1,
            name: 'Hydraulic Excavator CAT 320',
            category: 'Heavy Machinery',
            brand: 'Caterpillar',
            model: 'CAT 320',
            status: 'In Use',
            assignedDate: '2024-11-15',
            startDate: '2024-11-16',
            expectedEndDate: '2024-12-15',
            operator: 'John Martinez',
            location: 'Zone A - Foundation',
            totalHoursUsed: 45.5,
            totalKilometers: 0,
            todayHours: 8.5,
            todayKilometers: 0,
            notes: 'Working on foundation excavation',
            lastUpdated: '2024-11-20 17:30'
          },
          {
            id: 2,
            equipmentId: 2,
            name: 'Concrete Mixer Truck',
            category: 'Transport Vehicle',
            brand: 'Volvo',
            model: 'FM 400',
            status: 'Pending',
            assignedDate: '2024-11-18',
            startDate: null,
            expectedEndDate: '2024-12-20',
            operator: 'Sarah Chen',
            location: 'Zone B - Structure',
            totalHoursUsed: 0,
            totalKilometers: 0,
            todayHours: 0,
            todayKilometers: 0,
            notes: 'Awaiting approval from inventory manager',
            lastUpdated: '2024-11-18 10:15'
          },
          {
            id: 3,
            equipmentId: 3,
            name: 'Pneumatic Drill Set',
            category: 'Hand Tools',
            brand: 'DeWalt',
            model: 'D25133K',
            status: 'Returned',
            assignedDate: '2024-11-10',
            startDate: '2024-11-11',
            expectedEndDate: '2024-11-20',
            operator: 'Mike Johnson',
            location: 'Warehouse A',
            totalHoursUsed: 32.0,
            totalKilometers: 0,
            todayHours: 0,
            todayKilometers: 0,
            notes: 'Completed drilling work, returned in good condition',
            lastUpdated: '2024-11-20 16:45'
          }
        ];
        setProjectEquipment(mockProjectEquipment);
      } catch (error) {
        console.error('Error fetching project equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectEquipment();
  }, [projectId]);

  const statuses = ['All Status', 'Pending', 'In Use', 'Returned', 'Maintenance'];
  const categories = ['All Categories', 'Heavy Machinery', 'Transport Vehicle', 'Hand Tools', 'Power Equipment'];

  const filteredEquipment = projectEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.operator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Use': return 'bg-green-100 text-green-800';
      case 'Returned': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'In Use': return <Activity className="w-4 h-4" />;
      case 'Returned': return <CheckCircle className="w-4 h-4" />;
      case 'Maintenance': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = (equipment) => {
    setSelectedEquipment(equipment);
    setShowUpdateModal(true);
  };

  const handleDailyUpdate = (equipment) => {
    navigate(`/site-manager/equipment-usage/${equipment.equipmentId}`, {
      state: { equipment, projectId }
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Heavy Machinery': return <Settings className="w-5 h-5" />;
      case 'Transport Vehicle': return <Package className="w-5 h-5" />;
      case 'Hand Tools': return <Package className="w-5 h-5" />;
      case 'Power Equipment': return <Package className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  // Calculate statistics
  const stats = {
    total: projectEquipment.length,
    pending: projectEquipment.filter(item => item.status === 'Pending').length,
    inUse: projectEquipment.filter(item => item.status === 'In Use').length,
    returned: projectEquipment.filter(item => item.status === 'Returned').length,
    totalHours: projectEquipment.reduce((sum, item) => sum + (item.totalHoursUsed || 0), 0),
    totalKilometers: projectEquipment.reduce((sum, item) => sum + (item.totalKilometers || 0), 0)
  };

  if (loading) {
    return (
      <>
        <NavBar
          profileURL='profile'
          links={[
            { name: "Dashboard", href: "/site-manager" },
            { name: "Projects", href: "/site-manager/projects-list" },
            { name: "Materials", href: "/site-manager/material-request-list" },
            { name: "Inventory", href: "/site-manager/site-inventory" },
            { name: "Purchase Orders", href: "/site-manager/order-details" },
          ]}
        />
        <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep_green mx-auto mb-4"></div>
            <p className="text-slatebluegray">Loading project equipment...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar
        profileURL='profile'
        links={[
          { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
          { name: "Materials", href: "/site-manager/material-request-list" },
          { name: "Inventory", href: "/site-manager/site-inventory" },
          { name: "Purchase Orders", href: "/site-manager/order-details" },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-main_dark">Project Equipment Dashboard</h1>
              <p className="text-slatebluegray text-lg">Manage and monitor equipment assigned to your project</p>
            </div>
            <button
              onClick={() => navigate(`/site-manager/equipment-selection/${projectId}`)}
              className="bg-deep_green text-white px-6 py-3 rounded-lg font-semibold hover:bg-deep_green/90 transition-colors duration-150 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Request New Equipment
            </button>
          </div>

          {/* Project Info */}
          <div className="bg-gradient-to-r from-deep_green/10 to-web_yellow/10 border border-deep_green/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-main_dark">Residential Complex A</h2>
                <p className="text-slatebluegray">Project ID: {projectId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Equipment',
              value: stats.total.toString(),
              icon: Package,
              bgColor: 'bg-gradient-to-br from-deep_green to-deep_green/80',
              textColor: 'text-deep_green'
            },
            {
              label: 'In Use',
              value: stats.inUse.toString(),
              icon: Activity,
              bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
              textColor: 'text-green-600'
            },
            {
              label: 'Pending',
              value: stats.pending.toString(),
              icon: Clock,
              bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
              textColor: 'text-yellow-600'
            },
            {
              label: 'Total Hours',
              value: `${stats.totalHours.toFixed(1)}h`,
              icon: TrendingUp,
              bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
              textColor: 'text-blue-600'
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-purewhite rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-main_dark mb-1">{stat.value}</h3>
                <p className="text-slatebluegray text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-slatebluegray" />
            <h2 className="text-lg font-semibold text-main_dark">Search & Filter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slatebluegray" />
              <input
                type="text"
                placeholder="Search equipment or operator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All Status');
                }}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Equipment List */}
        <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredEquipment.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-main_dark mb-2">No Equipment Found</h3>
                <p className="text-slatebluegray mb-4">Try adjusting your search terms or filters.</p>
                <button
                  onClick={() => navigate(`/site-manager/equipment-selection/${projectId}`)}
                  className="bg-deep_green text-white px-6 py-2 rounded-lg font-semibold hover:bg-deep_green/90 transition-colors duration-150"
                >
                  Request Equipment
                </button>
              </div>
            ) : (
              filteredEquipment.map((equipment) => (
                <div key={equipment.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    {/* Equipment Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-deep_green/20 to-web_yellow/20 rounded-xl flex items-center justify-center">
                        {getCategoryIcon(equipment.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-main_dark text-lg">{equipment.name}</h3>
                        <p className="text-slatebluegray text-sm">{equipment.brand} {equipment.model}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-slatebluegray">
                            <User className="w-4 h-4" />
                            {equipment.operator}
                          </span>
                          <span className="flex items-center gap-1 text-slatebluegray">
                            <MapPin className="w-4 h-4" />
                            {equipment.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center gap-6">
                      {/* Status */}
                      <div className="text-center">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(equipment.status)}`}>
                          {getStatusIcon(equipment.status)}
                          {equipment.status}
                        </div>
                        <div className="text-xs text-slatebluegray mt-1">
                          {equipment.status === 'In Use' ? `Today: ${equipment.todayHours}h` : equipment.lastUpdated}
                        </div>
                      </div>

                      {/* Usage Stats */}
                      <div className="text-right min-w-0">
                        <div className="text-sm">
                          <span className="text-slatebluegray">Total Hours: </span>
                          <span className="font-medium text-main_dark">{equipment.totalHoursUsed.toFixed(1)}h</span>
                        </div>
                        {equipment.totalKilometers > 0 && (
                          <div className="text-sm">
                            <span className="text-slatebluegray">Total KM: </span>
                            <span className="font-medium text-main_dark">{equipment.totalKilometers.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {equipment.status === 'In Use' && (
                          <button
                            onClick={() => handleDailyUpdate(equipment)}
                            className="px-3 py-2 bg-web_yellow text-main_dark rounded-lg text-sm font-medium hover:bg-web_yellow/90 transition-colors duration-150"
                          >
                            Update Usage
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusUpdate(equipment)}
                          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-150"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slatebluegray hover:text-main_dark transition-colors duration-150">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {equipment.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-slatebluegray italic">{equipment.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Update Modal */}
        {showUpdateModal && selectedEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-main_dark mb-4">Update Equipment Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-main_dark mb-2">Equipment</label>
                  <p className="text-sm text-slatebluegray">{selectedEquipment.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-main_dark mb-2">Current Status</label>
                  <p className="text-sm text-slatebluegray">{selectedEquipment.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-main_dark mb-2">New Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent">
                    <option value="Pending">Pending</option>
                    <option value="In Use">In Use</option>
                    <option value="Returned">Returned</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle status update
                      setShowUpdateModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-deep_green text-white rounded-lg font-medium hover:bg-deep_green/90 transition-colors duration-150"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProjectEquipmentDashboard;








