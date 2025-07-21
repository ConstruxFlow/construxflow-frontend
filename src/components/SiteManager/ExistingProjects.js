// ExistingProjects.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaSearch, FaTrash, FaEye } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';

const ExistingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchTerm, setSearchTerm] = useState('');
  
  const statusOptions = [
    'All Status',
    'Not Started',
    'Planning',
    'In Progress',
    'On Hold',
    'Completed'
  ];

  const user = JSON.parse(localStorage.getItem('user'));
  const managerId = user?.id;

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/projects/all')
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch projects');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setDeletingId(projectId);
    try {
      await axios.delete(`http://localhost:8080/api/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => (p.projectId || p.id) !== projectId));
    } catch (err) {
      alert('Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'In Progress':
        return { statusColor: 'text-deep_green', statusBg: 'bg-deep_green/10' };
      case 'Completed':
        return { statusColor: 'text-green-600', statusBg: 'bg-green-100' };
      case 'On Hold':
        return { statusColor: 'text-web_yellow', statusBg: 'bg-web_yellow/10' };
      case 'Planning':
        return { statusColor: 'text-light_brown', statusBg: 'bg-light_brown/10' };
      default:
        return { statusColor: 'text-slatebluegray', statusBg: 'bg-light_gray/40' };
    }
  };

  if (loading) {
    return (
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600 ml-3">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  // Filter projects by status and managerId
  const filteredProjects = projects.filter(project => {
    // Only show projects for this manager
    if (managerId && project.managerId !== managerId) return false;

    if (statusFilter !== 'All Status') {
      const status = (project.progressStatus || project.status || '')
        .toLowerCase()
        .replace(/[_-]/g, ' ')
        .trim();
      if (status !== statusFilter.toLowerCase()) return false;
    }
    if (searchTerm.trim() !== '') {
      const name = (project.projectName || project.name || '').toLowerCase();
      const location = (project.location || '').toLowerCase();
      const status = (project.progressStatus || project.status || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      if (!name.includes(term) && !location.includes(term) && !status.includes(term)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main_dark mb-2">Construction Projects</h1>
          <p className="text-slatebluegray text-base">Manage and track all your construction projects</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-main_dark font-medium">
            <span>Create New Project</span>
          </div>
          <button
            className="bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold px-6 py-3 rounded-lg transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md"
            onClick={() => window.location.href = '/site-manager/projects-list/create-project'}
          >
            <FaPlus className="text-sm" />
            New Project
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-purewhite border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <IoFilter className="text-slatebluegray text-lg" />
            <span className="text-main_dark font-medium">Status:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <FaSearch className="text-slatebluegray text-sm" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-purewhite border border-gray-200 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-main_dark mb-2">No Projects Found</h3>
            <p className="text-slatebluegray">Try adjusting your filters or create a new project to get started.</p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const name = project.projectName || project.name || 'Unnamed Project';
            const status = project.progressStatus || project.status || 'Unknown';
            const startDate = project.startDate || '-';
            const endDate = project.endDate || '-';
            const { statusColor, statusBg } = getStatusStyles(status);
            
            return (
              <div 
                key={project.projectId || project.id} 
                className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-main_dark">{name}</h3>
                  <button 
                    className="bg-deep_green hover:bg-deep_green/80 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-150 shadow-sm hover:shadow-md"
                    onClick={() => navigate(`/site-manager/projects-list/edit-project/${project.projectId || project.id}`)}
                  >
                    <FaEdit className="text-xs" />
                    Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="text-slatebluegray text-sm font-medium block mb-2">Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${statusBg.replace('/10', '')}`}></span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor} ${statusBg}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-slatebluegray text-sm font-medium block mb-2">Start Date</label>
                    <p className="text-main_dark font-medium">{startDate}</p>
                  </div>
                  
                  <div>
                    <label className="text-slatebluegray text-sm font-medium block mb-2">End Date</label>
                    <p className="text-main_dark font-medium">{endDate}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-150 shadow-sm hover:shadow-md"
                    onClick={() => navigate('/site-manager/material-request-list')}
                  >
                    <FaEye className="text-xs" />
                    View Materials
                  </button>
                  <button
                    className="text-red-600 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-red-200 bg-red-50 hover:bg-red-100 transition-all duration-150"
                    onClick={() => handleDelete(project.projectId || project.id)}
                    disabled={deletingId === (project.projectId || project.id)}
                  >
                    <FaTrash className="text-xs" />
                    {deletingId === (project.projectId || project.id) ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExistingProjects;
