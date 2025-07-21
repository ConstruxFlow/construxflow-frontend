// FinancialProjectDetails.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClipboardList,
  FaDownload,
  FaFileContract,
  FaChartPie,
  FaTable,
  FaUsers,
  FaTools,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBuilding,
  FaPercentage,
  FaLayerGroup,
  FaCube,
  FaBalanceScale,
//   FaTrendingUp,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import LoadingOverlay from '../../components/LoadingOverlay';

const AdminProjectDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`);
      const data = await response.json();
      
      if (response.ok) {
        setProject(data);
        setLoading(false);
      } else {
        toast.error('Failed to fetch project details');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Network error: Failed to fetch project details');
      console.error('Error fetching project details:', error);
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProjectBudget = () => {
    if (!project) return 0;
    return project.phases.reduce((total, phase) => total + (phase.subtotal || 0), 0);
  };

  const getPhaseProgress = (phase) => {
    // This would normally be calculated based on actual progress data
    // For now, we'll simulate based on status
    switch (phase.status?.toLowerCase()) {
      case 'completed': return 100;
      case 'in-progress': return 65;
      case 'started': return 30;
      default: return 0;
    }
  };

  const getOverallProgress = () => {
    if (!project || !project.phases.length) return 0;
    const totalProgress = project.phases.reduce((sum, phase) => sum + getPhaseProgress(phase), 0);
    return Math.round(totalProgress / project.phases.length);
  };

  const getMaterialCostBreakdown = () => {
    if (!project) return [];
    
    const materialTypes = {};
    project.phases.forEach(phase => {
      phase.materials?.forEach(material => {
        const type = material.materialType || 'General';
        if (!materialTypes[type]) {
          materialTypes[type] = { total: 0, count: 0 };
        }
        materialTypes[type].total += material.total;
        materialTypes[type].count += 1;
      });
    });
    
    return Object.entries(materialTypes).map(([type, data]) => ({
      type,
      total: data.total,
      count: data.count,
      percentage: (data.total / calculateProjectBudget()) * 100
    }));
  };

  const getPhaseFinancialSummary = () => {
    if (!project) return [];
    
    return project.phases.map(phase => ({
      ...phase,
      materialCount: phase.materials?.length || 0,
      avgMaterialCost: phase.materials?.length ? phase.subtotal / phase.materials.length : 0,
      costPercentage: (phase.subtotal / calculateProjectBudget()) * 100
    }));
  };

  const getTopExpensiveMaterials = () => {
    if (!project) return [];
    
    const allMaterials = [];
    project.phases.forEach(phase => {
      phase.materials?.forEach(material => {
        allMaterials.push({
          ...material,
          phaseName: phase.phaseName
        });
      });
    });
    
    return allMaterials
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProjectDuration = () => {
    if (!project) return 0;
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTimeRemaining = () => {
    if (!project) return 0;
    const today = new Date();
    const end = new Date(project.endDate);
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
         profileURL='/admin/profile'
        links={[
          { name: "Dashboard", href: "/admin", active: true },
          { name: "Projects", href: "/admin/projects-list" },
          { name: "Inventory", href: "/admin-inventory" },
          { name: "Users", href: "/admin-users" },
        ]}
        />
        <div className="py-6">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <FaExclamationTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-main_dark mb-2">Project Not Found</h2>
              <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or has been removed.</p>
              <button 
                onClick={() => navigate('/admin/projects-list')}
                className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors"
              >
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalBudget = calculateProjectBudget();
  const overallProgress = getOverallProgress();
  const materialBreakdown = getMaterialCostBreakdown();
  const phaseFinancialSummary = getPhaseFinancialSummary();
  const topExpensiveMaterials = getTopExpensiveMaterials();
  const duration = getProjectDuration();
  const timeRemaining = getTimeRemaining();

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {isLoading && <LoadingOverlay />}
      
      <NavBar
        profileURL='/admin/profile'
        links={[
          { name: "Dashboard", href: "/admin", active: true },
          { name: "Projects", href: "/admin/projects-list" },
          { name: "Inventory", href: "/admin-inventory" },
          { name: "Users", href: "/admin-users" },
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/admin/projects-list')}
              className="text-gray-600 hover:text-main_dark transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                {project.projectName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FaBuilding className="w-4 h-4" />
                  {project.projectId}
                </span>
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  {project.location}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.progressStatus)}`}>
                  {project.progressStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors text-sm font-medium flex items-center gap-2">
                <FaDownload className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">
                    {formatCurrency(totalBudget)}
                  </div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaDollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">{project.phases.length}</div>
                  <div className="text-sm text-gray-600">Project Phases</div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaClipboardList className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">{overallProgress}%</div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
                <div className="p-3 bg-web_yellow/20 rounded-lg">
                  <FaChartPie className="w-6 h-6 text-main_dark" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">{Math.max(0, timeRemaining)}</div>
                  <div className="text-sm text-gray-600">Days Remaining</div>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <FaClock className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-main_dark">Overall Progress</h3>
              <span className="text-sm text-gray-600">{overallProgress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-deep_green h-3 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Started: {formatDate(project.startDate)}</span>
              <span>Due: {formatDate(project.endDate)}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', name: 'Financial Overview', icon: FaChartPie },
                  { id: 'phases', name: 'Phase Breakdown', icon: FaLayerGroup },
                  { id: 'materials', name: 'Material Costs', icon: FaCube },
                  { id: 'timeline', name: 'Timeline', icon: FaCalendarAlt }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-web_yellow text-main_dark'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Financial Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cost Breakdown Chart */}
                    <div>
                      <h4 className="text-lg font-semibold text-main_dark mb-4">Cost Breakdown by Material Type</h4>
                      <div className="space-y-3">
                        {materialBreakdown.map(item => (
                          <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-main_dark">{item.type}</span>
                                <span className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-web_yellow h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <div className="text-sm font-semibold text-main_dark">{formatCurrency(item.total)}</div>
                              <div className="text-xs text-gray-500">{item.count} items</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project Statistics */}
                    <div>
                      <h4 className="text-lg font-semibold text-main_dark mb-4">Project Statistics</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaBalanceScale className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="text-sm text-gray-600">Average Cost per Phase</div>
                              <div className="text-lg font-semibold text-main_dark">
                                {formatCurrency(totalBudget / project.phases.length)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {/* <FaTrendingUp className="w-5 h-5 text-green-600" /> */}
                            <div>
                              <div className="text-sm text-gray-600">Total Materials</div>
                              <div className="text-lg font-semibold text-main_dark">
                                {project.phases.reduce((sum, phase) => sum + (phase.materials?.length || 0), 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-web_yellow/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FaFileInvoiceDollar className="w-5 h-5 text-main_dark" />
                            <div>
                              <div className="text-sm text-gray-600">Cost per Day</div>
                              <div className="text-lg font-semibold text-main_dark">
                                {formatCurrency(totalBudget / duration)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Expensive Materials */}
                  <div>
                    <h4 className="text-lg font-semibold text-main_dark mb-4">Top 10 Most Expensive Materials</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {topExpensiveMaterials.map((material, index) => (
                            <tr key={`${material.phaseMaterialId}-${index}`}>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-main_dark">{material.materialName}</div>
                                <div className="text-sm text-gray-500">{material.materialType}</div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {material.phaseName}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {material.quantity} {material.unitOfMeasurement}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(material.rate)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-main_dark">
                                {formatCurrency(material.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'phases' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-main_dark">Phase-wise Financial Breakdown</h4>
                  <div className="grid grid-cols-1 gap-6">
                    {phaseFinancialSummary.map(phase => (
                      <div key={phase.phaseId} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h5 className="text-lg font-semibold text-main_dark">{phase.phaseName}</h5>
                            <div className="text-sm text-gray-600">
                              {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-main_dark">{formatCurrency(phase.subtotal)}</div>
                            <div className="text-sm text-gray-600">{phase.costPercentage.toFixed(1)}% of total</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Materials Count</div>
                            <div className="text-xl font-semibold text-main_dark">{phase.materialCount}</div>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Avg Material Cost</div>
                            <div className="text-xl font-semibold text-main_dark">
                              {formatCurrency(phase.avgMaterialCost)}
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Progress</div>
                            <div className="text-xl font-semibold text-main_dark">{getPhaseProgress(phase)}%</div>
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-deep_green h-2 rounded-full transition-all duration-300"
                            style={{ width: `${phase.costPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-main_dark">Detailed Material Costs</h4>
                  {project.phases.map(phase => (
                    <div key={phase.phaseId} className="bg-gray-50 rounded-lg p-6">
                      <h5 className="text-lg font-semibold text-main_dark mb-4">{phase.phaseName}</h5>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {phase.materials?.map(material => (
                              <tr key={material.phaseMaterialId}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-main_dark">
                                  {material.materialName}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {material.materialType || 'N/A'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {material.quantity}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {material.unitOfMeasurement}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(material.rate)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-main_dark">
                                  {formatCurrency(material.total)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-light_brown/30">
                            <tr>
                              <td colSpan="5" className="px-4 py-3 text-sm font-semibold text-main_dark text-right">
                                Phase Subtotal:
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-main_dark">
                                {formatCurrency(phase.subtotal)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-main_dark">Project Timeline & Milestones</h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                    <div className="space-y-6">
                      {project.phases.map((phase, index) => (
                        <div key={phase.phaseId} className="relative flex items-start">
                          <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                            getPhaseProgress(phase) === 100 
                              ? 'bg-green-500 border-green-500' 
                              : getPhaseProgress(phase) > 0 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'bg-gray-300 border-gray-300'
                          }`}></div>
                          <div className="ml-10 flex-1">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-lg font-semibold text-main_dark">{phase.phaseName}</h5>
                                <span className="text-sm text-gray-600">{getPhaseProgress(phase)}% Complete</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div>
                                  <div className="text-sm text-gray-600">Start Date</div>
                                  <div className="font-medium">{formatDate(phase.startDate)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">End Date</div>
                                  <div className="font-medium">{formatDate(phase.endDate)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Budget</div>
                                  <div className="font-medium">{formatCurrency(phase.subtotal)}</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-deep_green h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${getPhaseProgress(phase)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents Section */}
          {project.documentPaths && project.documentPaths.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-main_dark mb-4">Project Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.documentPaths.map((docPath, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaFileContract className="w-5 h-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-main_dark">
                        {docPath.split('\\').pop()}
                      </div>
                      <div className="text-xs text-gray-500">BOQ Document</div>
                    </div>
                    <button className="text-deep_green hover:text-deep_green/80 transition-colors">
                      <FaDownload className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProjectDetails;
