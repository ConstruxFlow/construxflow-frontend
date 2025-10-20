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
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch equipment requests for the specific project from API
  useEffect(() => {
    const fetchProjectEquipment = async () => {
      setLoading(true);
      try {
        console.log("Fetching equipment requests for project:", projectId);
        
        const response = await fetch("http://localhost:8080/api/equipment-requests");
        
        if (!response.ok) {
          throw new Error("Failed to fetch equipment requests");
        }
        
        const data = await response.json();
        console.log("All equipment requests:", data);
        
        // Filter equipment requests by project ID
        const projectRequests = data.filter(request => request.projectId === projectId);
        console.log("Filtered project requests:", projectRequests);
        
        // Transform the API response to match the expected format
        const equipmentMap = new Map(); // Use Map to ensure unique equipment
        
        projectRequests.forEach(request => {
          if (request.equipmentDetails && request.equipmentDetails.length > 0) {
            request.equipmentDetails.forEach(equipment => {
              const equipmentId = equipment.id;
              
              // Check if equipment already exists, if so, update with latest request info
              if (!equipmentMap.has(equipmentId) || 
                  new Date(request.requestDate) > new Date(equipmentMap.get(equipmentId).assignedDate)) {
                equipmentMap.set(equipmentId, {
                  id: equipment.id,
                  equipmentId: equipment.id,
                  name: equipment.name,
                  category: equipment.category,
                  brand: equipment.brand,
                  model: equipment.model,
                  status: request.status, // Use request status
                  assignedDate: request.requestDate,
                  startDate: request.requestedStartDate,
                  expectedEndDate: request.requestedEndDate,
                  operator: request.siteManagerId,
                  location: request.expectedLocation,
                  totalHoursUsed: equipment.totalUsageHours || 0,
                  totalKilometers: equipment.totalKilometers || 0,
                  todayHours: equipment.todayHours || 0,
                  todayKilometers: equipment.todayKilometers || 0,
                  notes: request.additionalNotes || equipment.notes,
                  lastUpdated: equipment.lastUpdated || request.requestDate,
                  requestId: request.id,
                  priority: request.priority,
                  requestPurpose: request.requestPurpose
                });
              }
            });
          } else {
            // If no equipment details, create entries based on equipment IDs
            request.equipmentIds.forEach((equipmentId) => {
              // Only add if not already exists or this request is more recent
              if (!equipmentMap.has(equipmentId) || 
                  new Date(request.requestDate) > new Date(equipmentMap.get(equipmentId).assignedDate)) {
                equipmentMap.set(equipmentId, {
                  id: `${request.id}-${equipmentId}`,
                  equipmentId: equipmentId,
                  name: `Equipment #${equipmentId}`,
                  category: 'Unknown',
                  brand: 'N/A',
                  model: 'N/A',
                  status: request.status,
                  assignedDate: request.requestDate,
                  startDate: request.requestedStartDate,
                  expectedEndDate: request.requestedEndDate,
                  operator: request.siteManagerId,
                  location: request.expectedLocation,
                  totalHoursUsed: 0,
                  totalKilometers: 0,
                  todayHours: 0,
                  todayKilometers: 0,
                  notes: request.additionalNotes,
                  lastUpdated: request.requestDate,
                  requestId: request.id,
                  priority: request.priority,
                  requestPurpose: request.requestPurpose
                });
              }
            });
          }
        });
        
        // Convert Map to Array for unique equipment
        const transformedEquipment = Array.from(equipmentMap.values());
        
        console.log("Transformed unique equipment data:", transformedEquipment);
        console.log("Total unique equipment count:", transformedEquipment.length);
        setProjectEquipment(transformedEquipment);
        
      } catch (error) {
        console.error('Error fetching project equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectEquipment();
    }
  }, [projectId]);

  // Fetch equipment usage summary for each equipment
  useEffect(() => {
    const fetchEquipmentUsageSummary = async () => {
      if (projectEquipment.length === 0) return;

      try {
        console.log("Fetching usage summary for equipment:", projectEquipment.length);
        
        // Fetch usage summary for each equipment
        const equipmentWithUsage = await Promise.all(
          projectEquipment.map(async (equipment) => {
            try {
              const response = await fetch(`http://localhost:8080/api/equipment-usage/summary/${equipment.equipmentId}`);
              
              if (response.ok) {
                const usageSummary = await response.json();
                console.log(`Usage summary for equipment ${equipment.equipmentId}:`, usageSummary);
                
                // Update equipment with usage summary data
                return {
                  ...equipment,
                  totalHoursUsed: usageSummary.totalHoursUsed || equipment.totalHoursUsed,
                  totalKilometers: usageSummary.totalKilometers || equipment.totalKilometers,
                  todayHours: usageSummary.todayHours || equipment.todayHours,
                  todayKilometers: usageSummary.todayKilometers || equipment.todayKilometers,
                  lastUsageDate: usageSummary.lastUsageDate || equipment.lastUpdated,
                  averageDailyHours: usageSummary.averageDailyHours || 0,
                  totalUsageDays: usageSummary.totalUsageDays || 0,
                  lastLocation: usageSummary.lastLocation || equipment.location,
                  usageSummaryLoaded: true
                };
              } else {
                console.warn(`Failed to fetch usage summary for equipment ${equipment.equipmentId}`);
                return {
                  ...equipment,
                  usageSummaryLoaded: false
                };
              }
            } catch (error) {
              console.error(`Error fetching usage summary for equipment ${equipment.equipmentId}:`, error);
              return {
                ...equipment,
                usageSummaryLoaded: false
              };
            }
          })
        );

        console.log("Equipment with usage summaries:", equipmentWithUsage);
        setProjectEquipment(equipmentWithUsage);
        
      } catch (error) {
        console.error('Error fetching equipment usage summaries:', error);
      }
    };

    // Only fetch usage summaries after project equipment is loaded
    if (projectEquipment.length > 0 && !projectEquipment.some(eq => eq.usageSummaryLoaded !== undefined)) {
      fetchEquipmentUsageSummary();
    }
  }, [projectEquipment]);

  const statuses = ['All Status', 'Pending', 'Approved', 'In Use', 'Returned', 'Maintenance'];
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
      case 'Approved': return 'bg-emerald-100 text-emerald-800';
      case 'In Use': return 'bg-green-100 text-green-800';
      case 'Returned': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'In Use': return <Activity className="w-4 h-4" />;
      case 'Returned': return <CheckCircle className="w-4 h-4" />;
      case 'Maintenance': return <AlertTriangle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = (equipment) => {
    setSelectedEquipment(equipment);
    // Set default to the first available option if current status is not in the allowed list
    const allowedStatuses = ['In Use', 'Returned', 'Maintenance'];
    const defaultStatus = allowedStatuses.includes(equipment.status) ? equipment.status : 'In Use';
    setNewStatus(defaultStatus);
    setShowUpdateModal(true);
  };

  const updateEquipmentStatus = async () => {
    if (!selectedEquipment || !newStatus) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/equipment-requests/updateStatus?requestId=${selectedEquipment.requestId}&status=${encodeURIComponent(newStatus)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update equipment status');
      }

      // Refresh the equipment list to show updated status
      const updatedResponse = await fetch("http://localhost:8080/api/equipment-requests");
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        const projectRequests = data.filter(request => request.projectId === projectId);
        
        const equipmentMap = new Map();
        
        projectRequests.forEach(request => {
          if (request.equipmentDetails && request.equipmentDetails.length > 0) {
            request.equipmentDetails.forEach(equipment => {
              const equipmentId = equipment.id;
              
              if (!equipmentMap.has(equipmentId) || 
                  new Date(request.requestDate) > new Date(equipmentMap.get(equipmentId).assignedDate)) {
                equipmentMap.set(equipmentId, {
                  id: equipment.id,
                  equipmentId: equipment.id,
                  name: equipment.name,
                  category: equipment.category,
                  brand: equipment.brand,
                  model: equipment.model,
                  status: request.status,
                  assignedDate: request.requestDate,
                  startDate: request.requestedStartDate,
                  expectedEndDate: request.requestedEndDate,
                  operator: request.siteManagerId,
                  location: request.expectedLocation,
                  totalHoursUsed: equipment.totalUsageHours || 0,
                  totalKilometers: equipment.totalKilometers || 0,
                  todayHours: equipment.todayHours || 0,
                  todayKilometers: equipment.todayKilometers || 0,
                  notes: request.additionalNotes || equipment.notes,
                  lastUpdated: equipment.lastUpdated || request.requestDate,
                  requestId: request.id,
                  priority: request.priority,
                  requestPurpose: request.requestPurpose
                });
              }
            });
          } else {
            request.equipmentIds.forEach((equipmentId) => {
              if (!equipmentMap.has(equipmentId) || 
                  new Date(request.requestDate) > new Date(equipmentMap.get(equipmentId).assignedDate)) {
                equipmentMap.set(equipmentId, {
                  id: `${request.id}-${equipmentId}`,
                  equipmentId: equipmentId,
                  name: `Equipment #${equipmentId}`,
                  category: 'Unknown',
                  brand: 'N/A',
                  model: 'N/A',
                  status: request.status,
                  assignedDate: request.requestDate,
                  startDate: request.requestedStartDate,
                  expectedEndDate: request.requestedEndDate,
                  operator: request.siteManagerId,
                  location: request.expectedLocation,
                  totalHoursUsed: 0,
                  totalKilometers: 0,
                  todayHours: 0,
                  todayKilometers: 0,
                  notes: request.additionalNotes,
                  lastUpdated: request.requestDate,
                  requestId: request.id,
                  priority: request.priority,
                  requestPurpose: request.requestPurpose
                });
              }
            });
          }
        });

        const transformedEquipment = Array.from(equipmentMap.values());
        setProjectEquipment(transformedEquipment);
      }

      setShowUpdateModal(false);
      setSelectedEquipment(null);
      setNewStatus('');
      
      // Show success message
      setToast({
        show: true,
        message: 'Equipment status updated successfully!',
        type: 'success'
      });
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
      
    } catch (error) {
      console.error('Error updating equipment status:', error);
      setToast({
        show: true,
        message: 'Failed to update equipment status. Please try again.',
        type: 'error'
      });
      
      // Auto-hide toast after 5 seconds for errors
      setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 5000);
    } finally {
      setIsUpdating(false);
    }
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
    approved: projectEquipment.filter(item => item.status === 'Approved').length,
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
          {/* <div className="bg-gradient-to-r from-deep_green/10 to-web_yellow/10 border border-deep_green/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-main_dark">Residential Complex A</h2>
                <p className="text-slatebluegray">Project ID: {projectId}</p>
              </div>
            </div>
          </div> */}
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
              label: 'Approved',
              value: stats.approved.toString(),
              icon: CheckCircle,
              bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
              textColor: 'text-emerald-600'
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
                          {equipment.status === 'In Use' ? (
                            equipment.usageSummaryLoaded && equipment.todayHours !== undefined ? 
                              `Today: ${equipment.todayHours}h${equipment.todayKilometers ? `, ${equipment.todayKilometers}km` : ''}` :
                              `Today: ${equipment.todayHours || 0}h`
                          ) : equipment.lastUpdated}
                        </div>
                      </div>

                      {/* Usage Stats */}
                      <div className="text-right min-w-0">
                        {equipment.usageSummaryLoaded === false && (
                          <div className="text-xs text-slatebluegray mb-1 flex items-center justify-end gap-1">
                            <div className="animate-spin w-3 h-3 border border-gray-300 border-t-deep_green rounded-full"></div>
                            Loading usage...
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="text-slatebluegray">Total Hours: </span>
                          <span className="font-medium text-main_dark">{equipment.totalHoursUsed.toFixed(1)}h</span>
                          {equipment.usageSummaryLoaded && equipment.averageDailyHours && (
                            <span className="text-xs text-slatebluegray ml-1">
                              (~{equipment.averageDailyHours.toFixed(1)}h/day)
                            </span>
                          )}
                        </div>
                        {equipment.totalKilometers > 0 && (
                          <div className="text-sm">
                            <span className="text-slatebluegray">Total KM: </span>
                            <span className="font-medium text-main_dark">{equipment.totalKilometers.toLocaleString()}</span>
                          </div>
                        )}
                        {equipment.usageSummaryLoaded && equipment.totalUsageDays > 0 && (
                          <div className="text-xs text-slatebluegray">
                            Active {equipment.totalUsageDays} day{equipment.totalUsageDays !== 1 ? 's' : ''}
                          </div>
                        )}
                        {equipment.usageSummaryLoaded && equipment.lastUsageDate && (
                          <div className="text-xs text-slatebluegray">
                            Last used: {new Date(equipment.lastUsageDate).toLocaleDateString()}
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
                        {equipment.status !== 'Pending' ? (
                          <button
                            onClick={() => handleStatusUpdate(equipment)}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-150"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-3 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                            title="Status update disabled for pending requests"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
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
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowUpdateModal(false);
                setSelectedEquipment(null);
                setNewStatus('');
              }
            }}
          >
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-main_dark mb-4">Update Equipment Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-main_dark mb-2">Equipment</label>
                  <p className="text-sm text-slatebluegray">{selectedEquipment.name}</p>
                  <p className="text-xs text-slatebluegray">Request ID: {selectedEquipment.requestId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-main_dark mb-2">Current Status</label>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEquipment.status)}`}>
                    {getStatusIcon(selectedEquipment.status)}
                    {selectedEquipment.status}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-main_dark mb-2">New Status</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                  >
                    <option value="In Use">In Use</option>
                    <option value="Returned">Returned</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUpdateModal(false);
                      setSelectedEquipment(null);
                      setNewStatus('');
                    }}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateEquipmentStatus}
                    disabled={isUpdating || newStatus === selectedEquipment.status}
                    className="flex-1 px-4 py-2 bg-deep_green text-white rounded-lg font-medium hover:bg-deep_green/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Status'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-4 rounded-lg shadow-lg flex items-center gap-3`}>
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="flex-shrink-0 text-white hover:text-gray-200 transition-colors duration-150"
            >
              <span className="sr-only">Close</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProjectEquipmentDashboard;








