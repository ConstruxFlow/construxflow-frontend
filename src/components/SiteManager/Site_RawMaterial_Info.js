import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaHistory, FaExclamationTriangle, FaExclamationCircle, FaTimesCircle, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Base API URL for backend. Set REACT_APP_API_BASE in .env to override.
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export default function Site_RawMaterial_Info() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showAddUsageModal, setShowAddUsageModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const itemsPerPage = 10;

  // Load projects and materials
  useEffect(() => {
    loadProjects();
  }, []);

  // Load materials when project changes
  useEffect(() => {
    if (selectedProject) {
      loadMaterialsForProject(selectedProject);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      setProjectsLoading(true);
      // Try to load projects from backend
      try {
        const res = await axios.get(`${API_BASE}/api/projects/all`);
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data);
          // prefer to set selectedProject to an object with same shape as mock (projectId, projectName)
          setSelectedProject(res.data[0]);
          return;
        }
      } catch (err) {
        console.error('Error fetching projects from backend:', err.message || err);
        // fallthrough to set mock projects
      }

      // Fallback to mock projects
      const mockProjects = [
        { projectId: 1, projectName: 'Residential Complex A', status: 'ONGOING', location: 'Downtown Area' },
        { projectId: 2, projectName: 'Office Tower B', status: 'ONGOING', location: 'Business District' },
        { projectId: 3, projectName: 'Shopping Mall C', status: 'ONGOING', location: 'Suburban Area' },
        { projectId: 4, projectName: 'Hospital Extension', status: 'ONGOING', location: 'Medical District' }
      ];
      setProjects(mockProjects);
      setSelectedProject(mockProjects[0]); // Select first project by default
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadMaterialsForProject = async (project) => {
    try {
      setLoading(true);
      console.log('Loading materials for project:', project);
      
      try {
        // Try /api/projects/{id}/materials first
        const res = await axios.get(`${API_BASE}/api/projects/${project.projectId}/materials`);
        console.log('API Response:', res.data);

        if (!res.data) {
          throw new Error('No data in response');
        }

        // Handle both array response and ApiResponse wrapper
        const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
        console.log('Parsed material list:', list);

        // Map PurchasingOrderMaterialDTO to UI material shape
        const mapped = list.map(item => ({
          rawMaterialId: item.purchasingOrderMaterialId,
          materialName: item.material?.materialName || 'Unknown',
          materialType: item.material?.materialType || 'Unknown',
          currentQuantity: item.quantity ? Number(item.quantity) : 0,
          warningLevel: item.warningLevel || 0,
          criticalLevel: item.criticalLevel || 0,
          urgentLevel: item.urgentLevel || 0,
          unitOfMeasurement: item.material?.unitOfMeasurement || '',
          // Compute stock status based on quantity vs levels
          stockStatus: item.quantity <= item.urgentLevel ? 'URGENT' 
                    : item.quantity <= item.criticalLevel ? 'CRITICAL'
                    : item.quantity <= item.warningLevel ? 'WARNING'
                    : 'NORMAL',
          projectName: project.projectName || '',
          // Add reorderLevel field for frontend management
          reorderLevel: item.reorderLevel || item.warningLevel || 0,
          // Add usage logs array for frontend management
          usageLogs: item.usageLogs || []
        }));

        console.log('Mapped materials:', mapped);
        setMaterials(mapped);
        return;
      } catch (err) {
        console.error('Error fetching materials from primary endpoint:', err?.message || err);
        
        // Try fallback to purchasing order endpoint
        try {
          console.log('Trying fallback endpoint...');
          const res = await axios.get(`${API_BASE}/api/purchasingorder/project/${project.projectId}/delivered-materials`);
          const list = res?.data?.data || [];
          console.log('Fallback response:', list);
          
          if (list && list.length > 0) {
            const mapped = list.map(item => ({
              rawMaterialId: item.purchasingOrderMaterialId,
              materialName: item.material?.materialName || 'Unknown',
              materialType: item.material?.materialType || 'Unknown',
              currentQuantity: item.quantity ? Number(item.quantity) : 0,
              warningLevel: item.warningLevel || 0,
              criticalLevel: item.criticalLevel || 0,
              urgentLevel: item.urgentLevel || 0,
              unitOfMeasurement: item.material?.unitOfMeasurement || '',
              stockStatus: item.quantity <= item.urgentLevel ? 'URGENT' 
                        : item.quantity <= item.criticalLevel ? 'CRITICAL'
                        : item.quantity <= item.warningLevel ? 'WARNING'
                        : 'NORMAL',
              projectName: project.projectName || '',
              reorderLevel: item.reorderLevel || item.warningLevel || 0,
              usageLogs: item.usageLogs || []
            }));
            console.log('Mapped fallback materials:', mapped);
            setMaterials(mapped);
            return;
          }
        } catch (fallbackErr) {
          console.error('Error fetching from fallback endpoint:', fallbackErr?.message || fallbackErr);
        }
        
        // Both endpoints failed, use mock data
        console.log('Using mock data as fallback');
      }

      // Fallback to mock data if backend fails
      const mockMaterials = getMockMaterialsForProject(project.projectId);
      console.log('Mock materials:', mockMaterials);
      setMaterials(mockMaterials);
    } catch (error) {
      console.error('Error loading materials:', error);
      setMaterials([]); // Reset on total failure
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveredMaterials = async () => {
    // Refresh materials for current project
    if (selectedProject) {
      loadMaterialsForProject(selectedProject);
    }
  };

  // Update reorder level in frontend state
  const updateReorderLevel = (materialId, newReorderLevel) => {
    setMaterials(prevMaterials => 
      prevMaterials.map(material => 
        material.rawMaterialId === materialId 
          ? { 
              ...material, 
              reorderLevel: newReorderLevel,
              // Update stock status based on new reorder level
              stockStatus: material.currentQuantity <= newReorderLevel ? 'WARNING' : 'NORMAL'
            } 
          : material
      )
    );
  };

  // Add usage log to material in frontend state
  const addUsageLog = (materialId, newUsageLog) => {
    setMaterials(prevMaterials => 
      prevMaterials.map(material => {
        if (material.rawMaterialId === materialId) {
          const updatedLogs = [newUsageLog, ...(material.usageLogs || [])];
          const quantityChange = (newUsageLog.quantityReceived || 0) - (newUsageLog.quantityUsed || 0);
          const newQuantity = material.currentQuantity + quantityChange;
          
          return {
            ...material,
            currentQuantity: newQuantity,
            usageLogs: updatedLogs,
            // Update stock status based on new quantity
            stockStatus: newQuantity <= material.urgentLevel ? 'URGENT' 
                       : newQuantity <= material.criticalLevel ? 'CRITICAL'
                       : newQuantity <= material.reorderLevel ? 'WARNING'
                       : 'NORMAL'
          };
        }
        return material;
      })
    );
  };

  // Mock data for development (remove when backend is ready)
  const getMockMaterialsForProject = (projectId) => {
    switch (projectId) {
      case 1:
        return [
          {
            rawMaterialId: 1,
            materialName: 'Concrete Mix',
            materialType: 'Building Material',
            currentQuantity: 850,
            warningLevel: 300,
            criticalLevel: 200,
            urgentLevel: 100,
            unitOfMeasurement: 'bags',
            stockStatus: 'NORMAL',
            projectName: 'Residential Complex A',
            reorderLevel: 300,
            usageLogs: [
              {
                logId: 1,
                usageDate: '2024-01-15',
                quantityUsed: 50,
                quantityReceived: 0,
                quantityAdjusted: 0,
                remarks: 'Daily construction usage',
                loggedBy: 'Site Manager'
              },
              {
                logId: 2,
                usageDate: '2024-01-14',
                quantityUsed: 45,
                quantityReceived: 0,
                quantityAdjusted: 0,
                remarks: 'Daily construction usage',
                loggedBy: 'Site Manager'
              }
            ]
          },
          {
            rawMaterialId: 2,
            materialName: 'Steel Rebar',
            materialType: 'Structural',
            currentQuantity: 45,
            warningLevel: 80,
            criticalLevel: 60,
            urgentLevel: 40,
            unitOfMeasurement: 'tons',
            stockStatus: 'WARNING',
            projectName: 'Residential Complex A',
            reorderLevel: 80,
            usageLogs: []
          },
          {
            rawMaterialId: 3,
            materialName: 'Ceramic Tiles',
            materialType: 'Finishing',
            currentQuantity: 2540,
            warningLevel: 800,
            criticalLevel: 600,
            urgentLevel: 400,
            unitOfMeasurement: 'sqft',
            stockStatus: 'NORMAL',
            projectName: 'Residential Complex A',
            reorderLevel: 800,
            usageLogs: []
          }
        ];
      case 2:
        return [
          {
            rawMaterialId: 4,
            materialName: 'Exterior Paint',
            materialType: 'Coating',
            currentQuantity: 125,
            warningLevel: 100,
            criticalLevel: 75,
            urgentLevel: 50,
            unitOfMeasurement: 'gallons',
            stockStatus: 'NORMAL',
            projectName: 'Office Tower B',
            reorderLevel: 100,
            usageLogs: []
          },
          {
            rawMaterialId: 5,
            materialName: 'Lumber 2x4',
            materialType: 'Wood',
            currentQuantity: 15,
            warningLevel: 50,
            criticalLevel: 30,
            urgentLevel: 20,
            unitOfMeasurement: 'pieces',
            stockStatus: 'URGENT',
            projectName: 'Office Tower B',
            reorderLevel: 50,
            usageLogs: []
          }
        ];
      case 3:
        return [
          {
            rawMaterialId: 1,
            materialName: 'Concrete Mix',
            materialType: 'Building Material',
            currentQuantity: 850,
            warningLevel: 300,
            criticalLevel: 200,
            urgentLevel: 100,
            unitOfMeasurement: 'bags',
            stockStatus: 'NORMAL',
            projectName: 'Shopping Mall C',
            reorderLevel: 300,
            usageLogs: []
          },
          {
            rawMaterialId: 2,
            materialName: 'Steel Rebar',
            materialType: 'Structural',
            currentQuantity: 45,
            warningLevel: 80,
            criticalLevel: 60,
            urgentLevel: 40,
            unitOfMeasurement: 'tons',
            stockStatus: 'WARNING',
            projectName: 'Shopping Mall C',
            reorderLevel: 80,
            usageLogs: []
          }
        ];
      case 4:
        return [
          {
            rawMaterialId: 3,
            materialName: 'Ceramic Tiles',
            materialType: 'Finishing',
            currentQuantity: 2540,
            warningLevel: 800,
            criticalLevel: 600,
            urgentLevel: 400,
            unitOfMeasurement: 'sqft',
            stockStatus: 'NORMAL',
            projectName: 'Hospital Extension',
            reorderLevel: 800,
            usageLogs: []
          },
          {
            rawMaterialId: 4,
            materialName: 'Exterior Paint',
            materialType: 'Coating',
            currentQuantity: 125,
            warningLevel: 100,
            criticalLevel: 75,
            urgentLevel: 50,
            unitOfMeasurement: 'gallons',
            stockStatus: 'NORMAL',
            projectName: 'Hospital Extension',
            reorderLevel: 100,
            usageLogs: []
          }
        ];
      default:
        return [];
    }
  };

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
    if (status === 'URGENT') return 'text-red-600 font-semibold';
    if (status === 'CRITICAL') return 'text-orange-600 font-semibold';
    if (status === 'WARNING') return 'text-yellow-600 font-semibold';
    return 'text-main_dark font-medium';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'CRITICAL':
        return 'bg-orange-100 text-orange-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-deep_green/10 text-deep_green';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'URGENT':
        return 'Urgent';
      case 'CRITICAL':
        return 'Critical';
      case 'WARNING':
        return 'Warning';
      default:
        return 'Normal';
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

  const handleViewUsage = (material) => {
    setSelectedMaterial(material);
    setShowUsageModal(true);
  };

  const handleEditReorderLevels = (material) => {
    setSelectedMaterial(material);
    setShowReorderModal(true);
  };

  const handleAddUsageLog = (material) => {
    setSelectedMaterial(material);
    setShowAddUsageModal(true);
  };

  // Get unique values for filters
  const types = ['All Types', ...new Set(materials.map(m => m.materialType))];
  const statuses = ['All Status', 'Normal', 'Warning', 'Critical', 'Urgent'];

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = 
      material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.materialType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All Types' || material.materialType === selectedType;
    
    let statusMatch = true;
    if (selectedStatus !== 'All Status') {
      const statusLower = selectedStatus.toLowerCase();
      statusMatch = material.stockStatus.toLowerCase() === statusLower;
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

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-500 text-6xl mb-4">🏗️</div>
          <h2 className="text-xl font-semibold text-main_dark mb-2">No Project Selected</h2>
          <p className="text-gray-600 mb-4">Please select a project to view its raw materials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Raw Materials Management - {selectedProject?.projectName}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Track and manage raw materials inventory for {selectedProject?.projectName}
              </p>
              <p className="text-sm text-web_yellow font-medium mt-1">
                💡 Materials automatically appear here when material requests are marked as "Delivered"
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {/* Project Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Select Project</label>
                <select
                  value={selectedProject?.projectId || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const found = projects.find(p => String(p.projectId) === String(val));
                    setSelectedProject(found || null);
                    setCurrentPage(1); // Reset to first page when changing projects
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm min-w-[200px]"
                  disabled={projectsLoading}
                >
                  {projectsLoading ? (
                    <option>Loading projects...</option>
                  ) : (
                    projects.map(project => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectName} - {project.location}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Project Info Card */}
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4 lg:col-span-2">
              <div className="text-sm text-gray-600 mb-1">Current Project</div>
              <div className="text-lg font-bold text-main_dark mb-1">
                {selectedProject?.projectName || 'No Project Selected'}
              </div>
              <div className="text-xs text-gray-500">
                {selectedProject?.location || ''} • Status: {selectedProject?.status || ''}
              </div>
            </div>
            
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{materials.length}</div>
              <div className="text-sm text-gray-600">Total Materials</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {materials.filter(m => m.stockStatus === 'WARNING').length}
              </div>
              <div className="text-sm text-gray-600">Warning Level</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {materials.filter(m => m.stockStatus === 'CRITICAL').length}
              </div>
              <div className="text-sm text-gray-600">Critical Level</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">
                {materials.filter(m => m.stockStatus === 'URGENT').length}
              </div>
              <div className="text-sm text-gray-600">Urgent Level</div>
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
              {materials.length === 0 ? (
                'No materials found for this project'
              ) : (
                `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, sortedMaterials.length)} of ${sortedMaterials.length} materials`
              )}
            </p>
          </div>

          {/* Materials Table */}
          {materials.length === 0 ? (
            <div className="bg-purewhite border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Materials Found</h3>
              <p className="text-gray-500 mb-4">
                This project doesn't have any raw materials yet. Materials will appear here when material requests are marked as "Delivered".
              </p>
            </div>
          ) : (
            <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-light_brown/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">ID</th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                        onClick={() => handleSort('materialName')}
                      >
                        <div className="flex items-center gap-2">
                          Material Name
                          {sortBy === 'materialName' && (
                            <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                        onClick={() => handleSort('materialType')}
                      >
                        <div className="flex items-center gap-2">
                          Type
                          {sortBy === 'materialType' && (
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
                      <tr key={material.rawMaterialId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-main_dark">
                          #{material.rawMaterialId}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-main_dark text-sm">{material.materialName}</div>
                          <div className="text-xs text-gray-500">{material.projectName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(material.materialType)}`}>
                            {material.materialType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${getStockColor(material.stockStatus)}`}>
                            {material.currentQuantity} {material.unitOfMeasurement}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaExclamationTriangle className="w-3 h-3 text-gray-400" />
                              <span>{material.reorderLevel} {material.unitOfMeasurement}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockStatusColor(material.stockStatus)}`}>
                            {getStockStatusText(material.stockStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewUsage(material)}
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                              title="View Usage History"
                            >
                              <FaHistory className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditReorderLevels(material)}
                              className="text-green-600 hover:text-green-800 transition-colors p-1"
                              title="Edit Reorder Levels"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddUsageLog(material)}
                              className="text-web_yellow hover:text-web_yellow/80 transition-colors p-1"
                              title="Add Usage Log"
                            >
                              <FaPlus className="w-4 h-4" />
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
                {paginatedMaterials.map((material) => (
                  <div key={material.rawMaterialId} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-main_dark text-sm">#{material.rawMaterialId}</h3>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="font-semibold text-main_dark text-sm">{material.materialName}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">{material.projectName}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.materialType)}`}>
                            {material.materialType}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(material.stockStatus)}`}>
                          {getStockStatusText(material.stockStatus)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <p><span className="font-medium">Current Stock:</span>
                        <span className={getStockColor(material.stockStatus)}> {material.currentQuantity} {material.unitOfMeasurement}</span>
                      </p>
                      <p><span className="font-medium">Reorder Level:</span> {material.reorderLevel} {material.unitOfMeasurement}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewUsage(material)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2 text-xs"
                      >
                        <FaHistory className="w-4 h-4 inline mr-1" />
                        Usage History
                      </button>
                      <button
                        onClick={() => handleEditReorderLevels(material)}
                        className="text-green-600 hover:text-green-800 transition-colors p-2 text-xs"
                      >
                        <FaEdit className="w-4 h-4 inline mr-1" />
                        Edit Levels
                      </button>
                      <button
                        onClick={() => handleAddUsageLog(material)}
                        className="text-web_yellow hover:text-web_yellow/80 transition-colors p-2 text-xs"
                      >
                        <FaPlus className="w-4 h-4 inline mr-1" />
                        Add Usage
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Usage History Modal */}
      {showUsageModal && selectedMaterial && (
        <UsageHistoryModal 
          material={selectedMaterial} 
          onClose={() => setShowUsageModal(false)} 
        />
      )}

      {/* Edit Reorder Levels Modal */}
      {showReorderModal && selectedMaterial && (
        <EditReorderLevelsModal 
          material={selectedMaterial} 
          onClose={() => setShowReorderModal(false)}
          onSave={updateReorderLevel}
        />
      )}

      {/* Add Usage Log Modal */}
      {showAddUsageModal && selectedMaterial && (
        <AddUsageLogModal 
          material={selectedMaterial} 
          onClose={() => setShowAddUsageModal(false)}
          onSave={addUsageLog}
        />
      )}
    </div>
  );
}

// Usage History Modal Component
function UsageHistoryModal({ material, onClose }) {
  const [usageLogs, setUsageLogs] = useState(material.usageLogs || []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-main_dark">
              Usage History - {material.materialName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimesCircle className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Track daily usage, received quantities, and adjustments for {material.materialName}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Usage Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Used</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Received</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Adjusted</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Remarks</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usageLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        No usage logs found for this material
                      </td>
                    </tr>
                  ) : (
                    usageLogs.map((log) => (
                      <tr key={log.logId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{log.usageDate}</td>
                        <td className="px-4 py-3 text-sm text-red-600 font-medium">
                          {log.quantityUsed > 0 ? `-${log.quantityUsed}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">
                          {log.quantityReceived > 0 ? `+${log.quantityReceived}` : '+'}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                          {log.quantityAdjusted !== 0 ? (log.quantityAdjusted > 0 ? `+${log.quantityAdjusted}` : log.quantityAdjusted) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{log.remarks}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{log.loggedBy}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Reorder Levels Modal Component
function EditReorderLevelsModal({ material, onClose, onSave }) {
  const [formData, setFormData] = useState({
    reorderLevel: material.reorderLevel || 0
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Update in frontend state
      onSave(material.rawMaterialId, formData.reorderLevel);
      onClose();
    } catch (error) {
      console.error('Error updating reorder levels:', error);
      alert('Failed to update reorder levels. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-main_dark">
            Edit Reorder Level
          </h2>
          <p className="text-gray-600 mt-2">
            Update reorder level for {material.materialName}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reorder Level ({material.unitOfMeasurement})
            </label>
            <input
              type="number"
              value={formData.reorderLevel}
              onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
              min="0"
              step="1"
            />
            <p className="text-xs text-gray-500 mt-2">
              When stock falls below this level, the status will change to "Warning"
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-web_yellow hover:bg-web_yellow/80 text-white font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Usage Log Modal Component
function AddUsageLogModal({ material, onClose, onSave }) {
  const [formData, setFormData] = useState({
    usageDate: new Date().toISOString().split('T')[0],
    quantityUsed: 0,
    quantityReceived: 0,
    quantityAdjusted: 0,
    remarks: '',
    loggedBy: 'Site Manager'
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'remarks' || field === 'loggedBy' ? value : (parseFloat(value) || 0)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Create new usage log
      const newUsageLog = {
        logId: Date.now(), // Generate unique ID
        usageDate: formData.usageDate,
        quantityUsed: formData.quantityUsed,
        quantityReceived: formData.quantityReceived,
        quantityAdjusted: formData.quantityAdjusted,
        remarks: formData.remarks || 'No remarks provided',
        loggedBy: formData.loggedBy
      };

      // Update in frontend state
      onSave(material.rawMaterialId, newUsageLog);
      onClose();
    } catch (error) {
      console.error('Error adding usage log:', error);
      alert('Failed to add usage log. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getNetChange = () => {
    return (formData.quantityReceived - formData.quantityUsed + formData.quantityAdjusted);
  };

  const getNewStock = () => {
    return material.currentQuantity + getNetChange();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-main_dark">
            Add Usage Log - {material.materialName}
          </h2>
          <p className="text-gray-600 mt-2">
            Record material usage, receipts, or adjustments
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Current Stock Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Current Stock Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Current Quantity:</span>
                <span className="font-semibold ml-2">{material.currentQuantity} {material.unitOfMeasurement}</span>
              </div>
              <div>
                <span className="text-gray-600">Reorder Level:</span>
                <span className="font-semibold ml-2">{material.reorderLevel} {material.unitOfMeasurement}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.usageDate}
              onChange={(e) => handleInputChange('usageDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Used
              </label>
              <input
                type="number"
                value={formData.quantityUsed}
                onChange={(e) => handleInputChange('quantityUsed', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Received
              </label>
              <input
                type="number"
                value={formData.quantityReceived}
                onChange={(e) => handleInputChange('quantityReceived', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                min="0"
                step="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Adjusted
            </label>
            <input
              type="number"
              value={formData.quantityAdjusted}
              onChange={(e) => handleInputChange('quantityAdjusted', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
              step="1"
              placeholder="Positive for gain, negative for loss"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use positive numbers for inventory gains, negative for losses
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
              rows="3"
              placeholder="Enter remarks about this transaction..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logged By
            </label>
            <input
              type="text"
              value={formData.loggedBy}
              onChange={(e) => handleInputChange('loggedBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">Transaction Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Net Change:</span>
                <span className={`font-semibold ${getNetChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getNetChange() >= 0 ? '+' : ''}{getNetChange()} {material.unitOfMeasurement}
                </span>
              </div>
              <div className="flex justify-between">
                <span>New Stock Level:</span>
                <span className="font-semibold text-main_dark">
                  {getNewStock()} {material.unitOfMeasurement}
                </span>
              </div>
              <div className="flex justify-between">
                <span>New Status:</span>
                <span className={`font-semibold ${
                  getNewStock() <= material.urgentLevel ? 'text-red-600' :
                  getNewStock() <= material.criticalLevel ? 'text-orange-600' :
                  getNewStock() <= material.reorderLevel ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {getNewStock() <= material.urgentLevel ? 'URGENT' :
                   getNewStock() <= material.criticalLevel ? 'CRITICAL' :
                   getNewStock() <= material.reorderLevel ? 'WARNING' : 'NORMAL'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || (formData.quantityUsed === 0 && formData.quantityReceived === 0 && formData.quantityAdjusted === 0)}
            className="flex-1 bg-web_yellow hover:bg-web_yellow/80 text-white font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Log'}
          </button>
        </div>
      </div>
    </div>
  );
}