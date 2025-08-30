import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  Calendar, 
  MapPin, 
  User, 
  ArrowRight,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const ProjectSelection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Mock data for projects - will be replaced with API calls
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockProjects = [
          {
            id: 'PROJ-001',
            name: 'Residential Complex A',
            location: 'Downtown District',
            startDate: '2024-10-01',
            endDate: '2025-06-30',
            status: 'In Progress',
            manager: 'John Smith',
            progress: 65,
            description: 'Multi-story residential complex with 120 units'
          },
          {
            id: 'PROJ-002',
            name: 'Commercial Plaza B',
            location: 'Business District',
            startDate: '2024-11-15',
            endDate: '2025-08-15',
            status: 'Planning',
            manager: 'Sarah Johnson',
            progress: 15,
            description: 'Modern commercial plaza with retail and office spaces'
          },
          {
            id: 'PROJ-003',
            name: 'Highway Bridge Extension',
            location: 'Northern Expressway',
            startDate: '2024-09-01',
            endDate: '2025-03-31',
            status: 'In Progress',
            manager: 'Mike Chen',
            progress: 80,
            description: 'Extension of existing highway bridge structure'
          },
          {
            id: 'PROJ-004',
            name: 'Industrial Warehouse C',
            location: 'Industrial Zone',
            startDate: '2024-12-01',
            endDate: '2025-05-31',
            status: 'Planning',
            manager: 'Lisa Wang',
            progress: 25,
            description: 'Large-scale industrial warehouse facility'
          }
        ];
        setProjects(mockProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const statuses = ['All Status', 'Planning', 'In Progress', 'Completed', 'On Hold'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Planning': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <CheckCircle className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'On Hold': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleProjectSelect = (projectId) => {
    navigate(`/site-manager/project-equipment/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep_green mx-auto mb-4"></div>
          <p className="text-slatebluegray">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-main_dark mb-4">Select a Project</h1>
            <p className="text-slatebluegray text-lg">Choose a project to manage its equipment and materials</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              {
                label: 'Total Projects',
                value: projects.length.toString(),
                icon: FolderOpen,
                bgColor: 'bg-gradient-to-br from-deep_green to-deep_green/80'
              },
              {
                label: 'In Progress',
                value: projects.filter(p => p.status === 'In Progress').length.toString(),
                icon: CheckCircle,
                bgColor: 'bg-gradient-to-br from-green-500 to-green-600'
              },
              {
                label: 'Planning',
                value: projects.filter(p => p.status === 'Planning').length.toString(),
                icon: Clock,
                bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-purewhite rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgColor} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-main_dark mb-1 text-center">{stat.value}</h3>
                  <p className="text-slatebluegray text-sm text-center">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-slatebluegray" />
            <h2 className="text-lg font-semibold text-main_dark">Search & Filter Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slatebluegray" />
              <input
                type="text"
                placeholder="Search projects, locations, or managers..."
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-main_dark mb-2">No Projects Found</h3>
              <p className="text-slatebluegray mb-4">Try adjusting your search terms or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All Status');
                }}
                className="text-deep_green hover:text-deep_green/80 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => handleProjectSelect(project.id)}
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-deep_green/20 to-web_yellow/20 rounded-xl flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-deep_green" />
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.status}
                  </span>
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-main_dark text-lg mb-1">{project.name}</h3>
                    <p className="text-slatebluegray text-sm">{project.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slatebluegray" />
                      <span className="text-main_dark">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slatebluegray" />
                      <span className="text-main_dark">{project.manager}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slatebluegray" />
                      <span className="text-main_dark">
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slatebluegray">Progress</span>
                      <span className="font-medium text-main_dark">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-deep_green to-web_yellow h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <button className="w-full bg-deep_green text-white py-2 px-4 rounded-lg font-medium hover:bg-deep_green/90 transition-colors duration-150 flex items-center justify-center gap-2 group-hover:bg-deep_green/90">
                      <span>Manage Equipment</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-deep_green/10 to-web_yellow/10 border border-deep_green/20 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-main_dark mb-2">Need to create a new project?</h3>
            <p className="text-slatebluegray mb-4">Start a new construction project and manage its equipment from the beginning.</p>
            <button
              onClick={() => navigate('/site-manager/projects-list/create-project')}
              className="bg-deep_green text-white px-6 py-3 rounded-lg font-semibold hover:bg-deep_green/90 transition-colors duration-150"
            >
              Create New Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelection;
