import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Search, Filter, Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Material_Request_List() {
  const [projects, setProjects] = useState([]);
  const [projectFilter, setProjectFilter] = useState('All Projects');
  const [materials, setMaterials] = useState([]);
  const [groupedMaterials, setGroupedMaterials] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedPhases, setExpandedPhases] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch all projects for the filter dropdown
  useEffect(() => {
    axios.get('http://localhost:8080/api/projects/all')
      .then(res => {
        setProjects([{ id: 'All Projects', name: 'All Projects' }, ...res.data.map(p => ({ id: p.projectId, name: p.projectName }))]);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch materials based on selected project
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        let url = 'http://localhost:8080/api/projects/materials/request-list';
        if (projectFilter !== 'All Projects') {
          url = `http://localhost:8080/api/projects/${projectFilter}/materials/request-list`;
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

  // Status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Not Requested':
        return `${baseClasses} bg-light_gray/40 text-slatebluegray`;
      case 'Pending':
        return `${baseClasses} bg-web_yellow/10 text-web_yellow`;
      case 'Approved':
        return `${baseClasses} bg-deep_green/10 text-deep_green`;
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-light_gray/40 text-slatebluegray`;
    }
  };

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-main_dark">Material Request List</h1>
        </div>
        <p className="text-slatebluegray text-base">Manage and track all material requests for your projects</p>
      </div>

      {/* Filters */}
      <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-slatebluegray" />
          <h2 className="text-lg font-semibold text-main_dark">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Filter */}
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">Project</label>
            <div className="relative">
              <select
                value={projectFilter}
                onChange={e => setProjectFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent appearance-none bg-white pr-10 transition-all duration-150"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slatebluegray pointer-events-none" />
            </div>
          </div>
          
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slatebluegray" />
              <input
                type="text"
                placeholder="Search by material, project, or phase..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Material Requests */}
      {Object.keys(groupedMaterials).length === 0 ? (
        <div className="bg-purewhite border border-gray-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-main_dark mb-2">No Material Requests Found</h3>
          <p className="text-slatebluegray">Try adjusting your filters or create a new material request to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMaterials).map(([project, phases]) => (
            <div key={project} className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <button
                className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-web_yellow/20 to-web_yellow/10 hover:from-web_yellow/30 hover:to-web_yellow/15 transition-all duration-150 focus:outline-none"
                onClick={() => toggleProject(project)}
              >
                <span className="font-bold text-lg text-main_dark">{project}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slatebluegray">
                    {Object.keys(phases).length} phase{Object.keys(phases).length !== 1 ? 's' : ''}
                  </span>
                  {expandedProjects[project] ? (
                    <ChevronUp className="w-5 h-5 text-slatebluegray" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slatebluegray" />
                  )}
                </div>
              </button>
              
              {expandedProjects[project] && (
                <div className="divide-y divide-gray-200">
                  {Object.entries(phases).map(([phase, mats]) => (
                    <div key={phase}>
                      <button
                        className="w-full flex justify-between items-center px-6 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 focus:outline-none"
                        onClick={() => togglePhase(project, phase)}
                      >
                        <span className="font-semibold text-main_dark">{phase}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slatebluegray">
                            {mats.length} material{mats.length !== 1 ? 's' : ''}
                          </span>
                          {expandedPhases[`${project}__${phase}`] ? (
                            <ChevronUp className="w-4 h-4 text-slatebluegray" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slatebluegray" />
                          )}
                        </div>
                      </button>
                      
                      {expandedPhases[`${project}__${phase}`] && (
                        <div className="p-6 bg-white">
                          {/* Phase Actions */}
                          <div className="mb-6">
                            {mats.every(mat => mat.status === 'Pending') ? (
                              <div className="flex items-center gap-2">
                                <span className="px-4 py-2 rounded-lg bg-web_yellow/10 text-web_yellow font-medium text-sm border border-web_yellow/20">
                                  Request Pending
                                </span>
                              </div>
                            ) : mats.some(mat => mat.status === 'Not Requested') ? (
                              <button
                                className="bg-deep_green hover:bg-deep_green/80 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center gap-2"
                                onClick={() => {
                                  console.log('Navigating with:', { project, phase, mats });
                                  navigate('/site-manager/material-request-list/material-request', {
                                    state: {
                                      project: project,
                                      phase: phase,
                                      materials: mats
                                    }
                                  });
                                }}
                              >
                                <Plus className="w-4 h-4" />
                                Create Request
                              </button>
                            ) : (
                              <span className="text-slatebluegray text-sm">No actions available</span>
                            )}
                          </div>

                          {/* Materials Table */}
                          <div className="overflow-hidden border border-gray-200 rounded-lg">
                            {/* Table Header */}
                            <div className="grid grid-cols-5 gap-4 bg-gray-50 px-4 py-3 font-semibold text-slatebluegray text-sm border-b border-gray-200">
                              <div>Material Name</div>
                              <div>Quantity</div>
                              <div>Unit</div>
                              <div>Status</div>
                              <div>Action</div>
                            </div>
                            
                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                              {mats.map(mat => (
                                <div key={mat.materialId || mat.id} className="grid grid-cols-5 gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors duration-150">
                                  <div className="font-medium text-main_dark">{mat.materialName}</div>
                                  <div className="text-slatebluegray">{mat.quantity}</div>
                                  <div className="text-slatebluegray">{mat.unitOfMeasurement}</div>
                                  <div>
                                    <span className={getStatusBadge(mat.status)}>{mat.status}</span>
                                  </div>
                                  <div>
                                    {mat.status === 'Not Requested' ? (
                                      <button
                                        className="bg-deep_green hover:bg-deep_green/80 text-white font-medium px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 text-sm"
                                        onClick={() => window.location.href = '/site-manager/material-request-list/material-request'}
                                      >
                                        New Request
                                      </button>
                                    ) : (
                                      <span className="text-slatebluegray text-sm">-</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
