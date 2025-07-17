import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5454/api/projects/all')
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
      await axios.delete(`http://localhost:5454/api/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => (p.projectId || p.id) !== projectId));
    } catch (err) {
      alert('Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to map backend status to color classes
  const getStatusStyles = (status) => {
    switch (status) {
      case 'In Progress':
        return { statusColor: 'text-blue-600', statusBg: 'bg-blue-100' };
      case 'Completed':
        return { statusColor: 'text-green-600', statusBg: 'bg-green-100' };
      case 'On Hold':
        return { statusColor: 'text-orange-600', statusBg: 'bg-orange-100' };
      case 'Planning':
        return { statusColor: 'text-purple-600', statusBg: 'bg-purple-100' };
      default:
        return { statusColor: 'text-gray-600', statusBg: 'bg-gray-100' };
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>{error}</div>;

  // Filter projects by status
  const filteredProjects = projects.filter(project => {
    // Status filter
    if (statusFilter !== 'All Status') {
      const status = (project.progressStatus || project.status || '')
        .toLowerCase()
        .replace(/[_-]/g, ' ')
        .trim();
      if (status !== statusFilter.toLowerCase()) return false;
    }
    // Search filter
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen pt-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Construction Projects</h1>
          <p className="text-gray-600">Manage and track all your construction projects</p>
        </div>
        <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-lg font-medium text-[#000000]">
            <span>🏗️</span>
            Create New Project
        </span>
        
        <button
            className="px-4 py-2 text-black font-semibold rounded-lg"
            style={{ backgroundColor: '#EFC11A' }}
            onClick={() => window.location.href = '/site-manager/projects-list/create-project'}
        >
            + New Project
        </button>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">Status:</span>
          <select
            className="border border-gray-300 rounded-md px-3 py-1 bg-white"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 bg-white w-64"
          />
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-gray-500">No projects found.</div>
        ) : (
          filteredProjects.map((project) => {
            // Map backend fields to UI fields
            // Adjust these as per your ProjectResponseDTO
            const name = project.projectName || project.name || 'Unnamed Project';
            const status = project.progressStatus || project.status || 'Unknown';
            const startDate = project.startDate || '-';
            const endDate = project.endDate || '-';
            const { statusColor, statusBg } = getStatusStyles(status);
            return (
              <div key={project.projectId || project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                  <button 
                    className="text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    style={{backgroundColor: '#236571'}}
                    onClick={() => navigate(`/site-manager/projects-list/edit-project/${project.projectId || project.id}`)}
                  >
                    ✏️ Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="text-gray-600 text-sm font-medium block mb-1">Status</label>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} ${statusBg}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-600 text-sm font-medium block mb-1">Start Date</label>
                    <p className="text-gray-900">{startDate}</p>
                  </div>
                  
                  <div>
                    <label className="text-gray-600 text-sm font-medium block mb-1">End Date</label>
                    <p className="text-gray-900">{endDate}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                {/* <button 
                    className="text-black font-semibold px-4 py-2 rounded text-sm flex items-center gap-2"
                    style={{ backgroundColor: '#EFC11A' }}
                >
                    + Add Phase
                </button> */}
                <button 
                    className="text-black font-semibold px-4 py-2 rounded text-sm flex items-center gap-2"
                    style={{ backgroundColor: '#EFC11A' }}
                    onClick={() => navigate('/site-manager/material-request-list')}
                >
                    🗎 View Materials
                </button>
                <button
                  className="text-red-600 font-semibold px-4 py-2 rounded text-sm flex items-center gap-2 border border-red-200 bg-red-50 hover:bg-red-100"
                  onClick={() => handleDelete(project.projectId || project.id)}
                  disabled={deletingId === (project.projectId || project.id)}
                >
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