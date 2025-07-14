import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export default function Material_Request_List() {
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('All Projects');
  const [materials, setMaterials] = useState([]);
  const [groupedMaterials, setGroupedMaterials] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedPhases, setExpandedPhases] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all projects for the filter dropdown
  useEffect(() => {
    axios.get('http://localhost:5454/api/projects/all')
      .then(res => {
        setProjects([{ id: 'All Projects', name: 'All Projects' }, ...res.data.map(p => ({ id: p.projectId, name: p.projectName }))]);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch materials based on selected project
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        let url = 'http://localhost:5454/api/projects/materials/request-list';
        if (projectFilter !== 'All Projects') {
          url = `http://localhost:5454/api/projects/${projectFilter}/materials/request-list`;
        }
        const res = await axios.get(url);
        setMaterials(res.data);
      } catch (err) {
        setMaterials([]);
        console.error(err);
      }
    };
    fetchMaterials();
  }, [projectFilter]);

  // Group materials by project and phase, applying search globally
  useEffect(() => {
    // Filter materials by search term first
    let filtered = materials;
    if (searchTerm) {
      filtered = materials.filter(mat =>
        (mat.materialName && mat.materialName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (mat.projectName && mat.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (mat.phaseName && mat.phaseName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    // Group filtered materials by project and phase
    const grouped = {};
    filtered.forEach(item => {
      const projectName = item.projectName || 'Unknown Project';
      const phaseName = item.phaseName || 'Unknown Phase';
      if (!grouped[projectName]) grouped[projectName] = {};
      if (!grouped[projectName][phaseName]) grouped[projectName][phaseName] = [];
      grouped[projectName][phaseName].push(item);
    });
    setGroupedMaterials(grouped);
  }, [materials, searchTerm]);

  // Handle expand/collapse for projects
  const toggleProject = (project) => {
    setExpandedProjects(prev => ({ ...prev, [project]: !prev[project] }));
  };
  // Handle expand/collapse for phases
  const togglePhase = (project, phase) => {
    setExpandedPhases(prev => ({ ...prev, [`${project}__${phase}`]: !prev[`${project}__${phase}`] }));
  };

  // Filter by search term
  const filterMaterials = (materials) => {
    if (!searchTerm) return materials;
    return materials.filter(mat =>
      (mat.materialName && mat.materialName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mat.projectName && mat.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mat.phaseName && mat.phaseName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Not Requested':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: '#F3F4F6' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Material Request List</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and track all material requests for your projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <div className="relative">
                <select
                  value={projectFilter}
                  onChange={e => setProjectFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent appearance-none bg-white pr-10"
                  style={{ focusRingColor: '#236571' }}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by material, project, or phase..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ focusRingColor: '#236571' }}
                />
              </div>
            </div>
            {/* Empty columns for layout */}
            <div></div>
            <div></div>
          </div>
        </div>

        {/* Grouped Material Requests */}
        {Object.keys(groupedMaterials).length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">No material requests found.</div>
        ) : (
          Object.entries(groupedMaterials).map(([project, phases]) => (
            <div key={project} className="mb-6 border rounded-lg shadow bg-white">
              <button
                className="w-full flex justify-between items-center px-6 py-3 bg-yellow-200 hover:bg-yellow-300 transition-colors rounded-t-lg focus:outline-none"
                onClick={() => toggleProject(project)}
              >
                <span className="font-bold text-lg text-gray-900">{project}</span>
                {expandedProjects[project] ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedProjects[project] && (
                <div className="divide-y divide-gray-200">
                  {Object.entries(phases).map(([phase, mats]) => (
                    <div key={phase}>
                      <button
                        className="w-full flex justify-between items-center px-6 py-2 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
                        onClick={() => togglePhase(project, phase)}
                      >
                        <span className="font-semibold text-gray-800">{phase}</span>
                        {expandedPhases[`${project}__${phase}`] ? <ChevronUp /> : <ChevronDown />}
                      </button>
                      {expandedPhases[`${project}__${phase}`] && (
                        <div className="px-8 py-4">
                          <div className="grid grid-cols-5 gap-4 pb-2 border-b font-semibold text-gray-700">
                            <div>Material Name</div>
                            <div>Quantity</div>
                            <div>Unit</div>
                            <div>Status</div>
                            <div>Action</div>
                          </div>
                          {mats.map(mat => (
                            <div key={mat.materialId || mat.id} className="grid grid-cols-5 gap-4 py-2 items-center border-b last:border-b-0">
                              <div>{mat.materialName}</div>
                              <div>{mat.quantity}</div>
                              <div>{mat.unitOfMeasurement}</div>
                              <div>
                                <span className={getStatusBadge(mat.status)}>{mat.status}</span>
                              </div>
                              <div>
                                {/* Example action: New Request if status is Not Requested */}
                                {mat.status === 'Not Requested' ? (
                                  <button
                                    className="px-3 py-1 text-white font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity text-sm"
                                    style={{ backgroundColor: '#236571' }}
                                    onClick={() => window.location.href = '/material-request-list/material-request'}
                                  >
                                    New Request
                                  </button>
                                ) : (
                                  <span className="text-gray-400 text-sm">-</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}