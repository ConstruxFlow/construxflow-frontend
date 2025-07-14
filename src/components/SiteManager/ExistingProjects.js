import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExistingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            onClick={() => window.location.href = '/projects-list/create-project'}
        >
            + New Project
        </button>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">Status:</span>
          <select className="border border-gray-300 rounded-md px-3 py-1 bg-white">
            <option>All Projects</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>On Hold</option>
            <option>Planning</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="border border-gray-300 rounded-md px-3 py-1 bg-white w-64"
          />
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-gray-500">No projects found.</div>
        ) : (
          projects.map((project) => {
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
                    onClick={() => window.location.href = '/projects-list/edit-project'}
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
                <button 
                    className="text-black font-semibold px-4 py-2 rounded text-sm flex items-center gap-2"
                    style={{ backgroundColor: '#EFC11A' }}
                >
                    + Add Phase
                </button>
                <button 
                    className="text-black font-semibold px-4 py-2 rounded text-sm flex items-center gap-2"
                    style={{ backgroundColor: '#EFC11A' }}
                >
                    🗎 View Materials
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