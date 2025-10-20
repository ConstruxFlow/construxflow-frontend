import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Clock, CheckCircle, Plus } from 'lucide-react';
import { FaSearch, FaDownload, FaEye, FaMapMarkerAlt, FaDollarSign, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import NavBar from '../../components/NavBar';

function ActionTile({ onClick, icon, label, iconColorClass, hoverClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 bg-white border border-light_gray rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none w-full text-left ${hoverClass}`}
    >
      <span className={`rounded-full p-2 bg-light_gray/40 flex items-center justify-center ${iconColorClass}`}>
        {icon}
      </span>
      <span className="font-medium text-base text-main_dark">{label}</span>
    </button>
  );
}

const statusOptions = ['All Status', 'not-started', 'in-progress', 'completed', 'on-hold', 'delayed'];
const budgetRanges = ['All Budgets', 'Under $50K', '$50K - $200K', '$200K - $500K', '$500K - $1M', 'Over $1M'];
const itemsPerPage = 10;

const roleMap = {
  'Purchasing_Manager': "Purchasing Manager",
  'Inventory_Manager': "Inventory Manager",
  'Site_Manager': "Site Manager",
  'Maintenance_Head': "Maintenance Head",
  'Finance_Officer': "Finance Officer"
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  // User stats and managers
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '-', icon: Users, color: 'bg-light_brown' },
    { title: 'Active Users', value: '-', icon: CheckCircle, color: 'bg-deep_green' },
    { title: 'New This Month', value: '-', icon: UserPlus, color: 'bg-web_yellow' },
    { title: 'Pending Approval', value: '-', icon: Clock, color: 'bg-light_gray' }
  ]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  // Project stats and list
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('All Budgets');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [projLoading, setProjLoading] = useState(true);

  // Fetch users and calculate stats
  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      setUserLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/user/all-users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();

        const totalUsers = data.length;
        const activeUsers = data.filter(user => user.status === 'Active' || !user.status).length || totalUsers;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const newThisMonth = data.filter(user => {
          if (!user.created_at) return false;
          const created = new Date(user.created_at);
          return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
        }).length;

        const pendingApproval = data.filter(user => user.status === 'Pending').length;

        const managers = data.filter(user =>
          ['Purchasing_Manager', 'Inventory_Manager', 'Site_Manager', 'Maintenance_Head', 'Finance_Officer'].includes(user.userRole)
        );

        const usersFormatted = managers.map(user => ({
          id: user.userId,
          name: user.userName,
          email: user.email,
          role: roleMap[user.userRole] || user.userRole,
          status: user.status || 'Active',
          avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.userName)}&backgroundColor=236571`
        }));

        setUsers(usersFormatted);

        setStats([
          { title: 'Total Users', value: totalUsers.toString(), icon: Users, color: 'bg-light_brown' },
          { title: 'Active Users', value: activeUsers.toString(), icon: CheckCircle, color: 'bg-deep_green' },
          { title: 'New This Month', value: newThisMonth.toString(), icon: UserPlus, color: 'bg-web_yellow' },
          { title: 'Pending Approval', value: pendingApproval.toString(), icon: Clock, color: 'bg-light_gray' }
        ]);

        setUserError(null);
      } catch (err) {
        setUserError('Failed to load users and stats');
      } finally {
        setUserLoading(false);
      }
    };
    fetchAndCalculateStats();
  }, []);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedStatus, selectedBudgetRange, sortBy, sortOrder]);

  const fetchProjects = async () => {
    setProjLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/projects/all');
      const data = await response.json();
      if (response.ok) {
        setProjects(data || []);
      }
    } catch (error) {
      // handle error
    } finally {
      setProjLoading(false);
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
    navigate(`/admin-projects-list/${projectId}`);
  };

  // Project stats
  const statsProjects = {
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

  return (
    <div className="min-h-screen bg-purewhite font-sans">
      
      <main className="max-w-full mx-auto px-4 sm:px-14 lg:px-16 py-8">
        {/* User Stats */}
        <h2 className="text-2xl font-bold mb-2 text-gray-800">User details</h2>
        <p className="text-gray-600 mb-8 text-base">
          Manage your team members, track their activities, and perform bulk actions to streamline operations.
        </p>
        {userError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{userError}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-main_dark mt-1">
                    {userLoading ? (
                      <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Manager Details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Manager Details</h3>
            <button
              onClick={() => navigate('/admin-managers')}
              className="flex items-center space-x-2 bg-web_yellow text-main_dark px-3 py-2 rounded-lg font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Managers</span>
            </button>
          </div>
          <div className="space-y-4">
            {users.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Project Stats */}
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Project Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-main_dark">{statsProjects.totalProjects}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{statsProjects.activeProjects}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{statsProjects.completedProjects}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-main_dark">
                  {formatCurrency(statsProjects.totalBudget).replace('$', '$')}
                </div>
                <div className="text-sm text-gray-600">Total Budget</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(statsProjects.avgBudget).replace('$', '$')}
                </div>
                <div className="text-sm text-gray-600">Avg Budget</div>
              </div>
            </div>
          </div>
        </div>
        {/* Project Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
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
        {/* Project Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light_brown/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Project Info</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="w-4 h-4" /> Location
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                    onClick={() => handleSort('budget')}
                  >
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="w-4 h-4" /> Budget
                      {sortBy === 'budget' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <div className="flex items-center gap-2">
                      <FaClipboardList className="w-4 h-4" /> Phases
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Priority</th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                    onClick={() => handleSort('endDate')}
                  >
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4" /> Timeline
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
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={project.location}>{project.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-main_dark">{formatCurrency(budget)}</div>
                        <div className="text-xs text-gray-500">{project.phases.length} phases</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-main_dark">{project.phases.length} phases</div>
                        <div className="text-xs text-gray-500">{project.phases.reduce((sum, phase) => sum + (phase.materials?.length || 0), 0)} materials</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.progressStatus)}`}>{project.progressStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatDate(project.startDate)} - {formatDate(project.endDate)}</div>
                        <div className="text-xs text-gray-500">{duration} days</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleViewProject(project.projectId)} className="text-deep_green hover:text-deep_green/80 transition-colors" title="View Project Details"><FaEye className="w-4 h-4" /></button>
                          <button className="text-gray-600 hover:text-gray-800 transition-colors" title="Download Documents"><FaDownload className="w-4 h-4" /></button>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                        <h3 className="font-semibold text-main_dark text-sm">{project.projectName}</h3>
                      </div>
                      <p className="text-xs text-gray-500 font-mono">{project.projectId}</p>
                      <p className="text-xs text-gray-600 truncate">{project.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.progressStatus)}`}>{project.progressStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                    <div>
                      <span className="text-gray-500">Budget:</span>
                      <div className="font-semibold text-main_dark">{formatCurrency(budget)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <div className="font-semibold">{duration} days</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs text-gray-500">{project.phases.length} phases • {project.phases.reduce((sum, phase) => sum + (phase.materials?.length || 0), 0)} materials</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-600">{formatDate(project.startDate)} - {formatDate(project.endDate)}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewProject(project.projectId)} className="text-deep_green hover:text-deep_green/80 transition-colors"><FaEye className="w-4 h-4" /></button>
                      <button className="text-gray-600 hover:text-gray-800 transition-colors"><FaDownload className="w-4 h-4" /></button>
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
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 text-sm rounded font-medium transition-colors ${currentPage === index + 1 ? 'bg-web_yellow text-main_dark' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}
