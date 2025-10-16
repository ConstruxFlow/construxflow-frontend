import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Edit, 
  Trash, 
  Eye,
  CheckCircle,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectProgressCard = ({ project, onStatusUpdate, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Calculate project progress based on phases
  const calculateProgress = () => {
    if (!project.phases || project.phases.length === 0) return 0;
    
    const totalPhases = project.phases.length;
    const completedPhases = project.phases.filter(phase => 
      phase.status === 'Completed' || phase.status === 'completed'
    ).length;
    
    return Math.round((completedPhases / totalPhases) * 100);
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!project.endDate) return null;
    
    const endDate = new Date(project.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    switch (statusLower) {
      case 'completed':
      case 'completed':
        return { 
          icon: <CheckCircle className="w-4 h-4" />, 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        };
      case 'in progress':
      case 'in_progress':
        return { 
          icon: <PlayCircle className="w-4 h-4" />, 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200'
        };
      case 'on hold':
      case 'on_hold':
        return { 
          icon: <PauseCircle className="w-4 h-4" />, 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200'
        };
      case 'planning':
        return { 
          icon: <Clock className="w-4 h-4" />, 
          color: 'text-purple-600', 
          bgColor: 'bg-purple-100',
          borderColor: 'border-purple-200'
        };
      default:
        return { 
          icon: <AlertCircle className="w-4 h-4" />, 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200'
        };
    }
  };

  const progress = calculateProgress();
  const daysRemaining = calculateDaysRemaining();
  const statusInfo = getStatusInfo(project.progressStatus || project.status);

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await onStatusUpdate(project.projectId || project.id, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {project.projectName}
          </h3>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}>
            {statusInfo.icon}
            {project.progressStatus || project.status || 'Not Started'}
          </div>
        </div>
        
        {/* Action Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(project.projectId || project.id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Project"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/site-manager/projects-list/edit-project/${project.projectId || project.id}`)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="View Project"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/site-manager/materials/project/${project.projectId || project.id}/material-requests`)}
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="View Materials"
          >
            <Package className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project.projectId || project.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Project"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{project.location || 'Location not set'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Start date not set'}</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Project Progress</span>
          <span className="text-sm font-semibold text-gray-900">{progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Progress Details */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>{project.phases?.length || 0} phases</span>
          <span>{project.phases?.filter(p => p.status === 'Completed' || p.status === 'completed').length || 0} completed</span>
        </div>
      </div>

      {/* Timeline Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</span>
        </div>
        
        {daysRemaining !== null && (
          <div className={`text-sm font-medium ${
            daysRemaining < 0 ? 'text-red-600' : 
            daysRemaining < 7 ? 'text-orange-600' : 
            daysRemaining < 30 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` :
             daysRemaining === 0 ? 'Due today' :
             `${daysRemaining} days remaining`}
          </div>
        )}
      </div>

      {/* Quick Status Update */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Quick Update:</span>
          <select
            value={project.progressStatus || project.status || ''}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={isUpdatingStatus}
            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Status</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressCard;
