// FinancialProjectsList.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClipboardList,
  FaChartPie,
  FaDownload,
  FaFileContract,
  FaClock,
  FaBuilding,
  FaTools,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import LoadingOverlay from '../../components/LoadingOverlay';

const FinancialProjectsList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('All Budgets');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedStatus, selectedBudgetRange]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/projects/all');
      const data = await response.json();
      
      if (response.ok) {
        setProjects(data || []);
        setLoading(false);
      } else {
        toast.error('Failed to fetch projects');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Network error: Failed to fetch projects');
      console.error('Error fetching projects:', error);
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects.filter(project => {
      const matchesSearch = 
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All Status' || 
        project.progressStatus === selectedStatus;
      
      const projectBudget = calculateProjectBudget(project);
      const matchesBudget = selectedBudgetRange === 'All Budgets' || 
        checkBudgetRange(projectBudget, selectedBudgetRange);
      
      return matchesSearch && matchesStatus && matchesBudget;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'budget':
          aValue = calculateProjectBudget(a);
          bValue = calculateProjectBudget(b);
          break;
        case 'startDate':
        case 'endDate':
          aValue = new Date(a[sortBy]);
          bValue = new Date(b[sortBy]);
          break;
        case 'projectName':
          aValue = a.projectName.toLowerCase();
          bValue = b.projectName.toLowerCase();
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const calculateProjectBudget = (project) => {
    return project.phases.reduce((total, phase) => total + (phase.subtotal || 0), 0);
  };

  const checkBudgetRange = (budget, range) => {
    switch (range) {
      case 'Under $50K': return budget < 50000;
      case '$50K - $200K': return budget >= 50000 && budget < 200000;
      case '$200K - $500K': return budget >= 200000 && budget < 500000;
      case '$500K - $1M': return budget >= 500000 && budget < 1000000;
      case 'Over $1M': return budget >= 1000000;
      default: return true;
    }
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

  const getProjectDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProjectPriority = (project) => {
    const budget = calculateProjectBudget(project);
    const endDate = new Date(project.endDate);
    const today = new Date();
    const daysToEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    if (budget > 1000000 || daysToEnd < 7) return 'high';
    if (budget > 500000 || daysToEnd < 14) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-web_yellow/20 text-main_dark border-web_yellow/40';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleViewProject = (projectId) => {
    navigate(`/financial/financial-project-details/${projectId}`);
  };

  // Calculate summary statistics
  const stats = {
    totalProjects: projects.length,
    totalBudget: projects.reduce((sum, project) => sum + calculateProjectBudget(project), 0),
    activeProjects: projects.filter(p => p.progressStatus === 'in-progress').length,
    completedProjects: projects.filter(p => p.progressStatus === 'completed').length,
    avgBudget: projects.length > 0 ? projects.reduce((sum, project) => sum + calculateProjectBudget(project), 0) / projects.length : 0
  };

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const statusOptions = ['All Status', 'not-started', 'in-progress', 'completed', 'on-hold', 'delayed'];
  const budgetRanges = ['All Budgets', 'Under $50K', '$50K - $200K', '$200K - $500K', '$500K - $1M', 'Over $1M'];

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {isLoading && <LoadingOverlay />}
      
      <NavBar
        links={[
          { name: 'Dashboard', path: '/financial/dashboard' },
          { name: 'Payment Approvals', path: '/financial/payment-list' },
          { name: 'Purchase Orders', path: '/financial/purchase-order-list' },
          { name: 'Projects', path: '/financial/financial-projects' },
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Project Financial Overview
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Monitor project budgets, costs, and financial performance
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors text-sm font-medium flex items-center gap-2">
                <FaDownload className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">{stats.totalProjects}</div>
                  <div className="text-sm text-gray-600">Total Projects</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.activeProjects}</div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">
                    {formatCurrency(stats.totalBudget).replace('$', '$')}
                  </div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats.avgBudget).replace('$', '$')}
                  </div>
                  <div className="text-sm text-gray-600">Avg Budget</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Projects</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by project name, ID, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status === 'All Status' ? status : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Range Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <select
                  value={selectedBudgetRange}
                  onChange={(e) => setSelectedBudgetRange(e.target.value)}
                  className="w-full lg:w-44 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {budgetRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
            </p>
          </div>

          {/* Projects Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Project Info
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        Location
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('budget')}
                    >
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="w-4 h-4" />
                        Budget
                        {sortBy === 'budget' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      <div className="flex items-center gap-2">
                        <FaClipboardList className="w-4 h-4" />
                        Phases
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Priority
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('endDate')}
                    >
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4" />
                        Timeline
                        {sortBy === 'endDate' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProjects.map((project) => {
                    const budget = calculateProjectBudget(project);
                    const priority = getProjectPriority(project);
                    const duration = getProjectDuration(project.startDate, project.endDate);
                    
                    return (
                      <tr key={project.projectId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-main_dark text-sm">{project.projectName}</div>
                            <div className="text-xs text-gray-500 font-mono">{project.projectId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={project.location}>
                            {project.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-main_dark">
                            {formatCurrency(budget)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {project.phases.length} phases
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-main_dark">
                            {project.phases.length} phases
                          </div>
                          <div className="text-xs text-gray-500">
                            {project.phases.reduce((sum, phase) => sum + (phase.materials?.length || 0), 0)} materials
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.progressStatus)}`}>
                            {project.progressStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {duration} days
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewProject(project.projectId)}
                              className="text-deep_green hover:text-deep_green/80 transition-colors"
                              title="View Project Details"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-800 transition-colors"
                              title="Download Documents"
                            >
                              <FaDownload className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {paginatedProjects.map((project) => {
                const budget = calculateProjectBudget(project);
                const priority = getProjectPriority(project);
                const duration = getProjectDuration(project.startDate, project.endDate);
                
                return (
                  <div key={project.projectId} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </span>
                          <h3 className="font-semibold text-main_dark text-sm">{project.projectName}</h3>
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{project.projectId}</p>
                        <p className="text-xs text-gray-600 truncate">{project.location}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.progressStatus)}`}>
                        {project.progressStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                      <div>
                        <span className="text-gray-500">Budget:</span>
                        <div className="font-semibold text-main_dark">
                          {formatCurrency(budget)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <div className="font-semibold">
                          {duration} days
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-gray-500">
                        {project.phases.length} phases • {project.phases.reduce((sum, phase) => sum + (phase.materials?.length || 0), 0)} materials
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-600">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewProject(project.projectId)}
                          className="text-deep_green hover:text-deep_green/80 transition-colors"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                          <FaDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} results
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

export default FinancialProjectsList;
