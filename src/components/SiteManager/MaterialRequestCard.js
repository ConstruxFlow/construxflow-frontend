import React from 'react';
import { 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  Package,
  Edit,
  Eye,
  Trash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MaterialRequestCard = ({ materialRequest, onStatusUpdate, onDelete, onEdit, onViewDetails }) => {
  const navigate = useNavigate();

  // Simple status workflow: Pending → Approved → In Progress → Delivered
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { 
          icon: <Clock className="w-4 h-4" />, 
          color: 'text-orange-600', 
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-200'
        };
      case 'approved':
        return { 
          icon: <CheckCircle className="w-4 h-4" />, 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        };
      case 'in progress':
        return { 
          icon: <PlayCircle className="w-4 h-4" />, 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200'
        };
      case 'delivered':
        return { 
          icon: <Package className="w-4 h-4" />, 
          color: 'text-green-600', 
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        };
      default:
        return { 
          icon: <Clock className="w-4 h-4" />, 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Calculate progress based on status
  const calculateProgress = () => {
    const status = materialRequest?.status?.toLowerCase() || 'pending';
    
    switch (status) {
      case 'pending': return 25;
      case 'approved': return 50;
      case 'in progress': return 75;
      case 'delivered': return 100;
      default: return 25;
    }
  };

  const statusInfo = getStatusInfo(materialRequest?.status);
  const progress = calculateProgress();

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Request #{materialRequest?.id || 'N/A'}
            </h3>
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}>
            {statusInfo.icon}
            {materialRequest?.status || 'Pending'}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(materialRequest)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Request"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewDetails(materialRequest)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(materialRequest?.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Request"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project & Phase Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Project:</span>
          <span className="truncate">{materialRequest?.project || 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Phase:</span>
          <span className="truncate">{materialRequest?.phase || 'Not specified'}</span>
        </div>
      </div>

      {/* Materials Summary */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Requested Materials:</h4>
        <div className="space-y-2">
          {materialRequest?.materials?.slice(0, 3).map((material, index) => (
            <div key={index} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
              <span className="text-gray-700 font-medium">{material.materialName}</span>
              <span className="text-gray-600">
                {material.quantity} {material.unitOfMeasurement}
              </span>
            </div>
          ))}
          {materialRequest?.materials?.length > 3 && (
            <div className="text-xs text-gray-500 text-center py-1">
              +{materialRequest.materials.length - 3} more materials
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Request Progress</span>
          <span className="text-sm font-semibold text-gray-900">{progress}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Request Date */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Requested: {materialRequest?.requestDate ? new Date(materialRequest.requestDate).toLocaleDateString() : 'Date not set'}</span>
        </div>
      </div>

      {/* Quick Status Update */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Update Status:</span>
          <select
            value={materialRequest?.status || 'Pending'}
            onChange={(e) => {
              const newStatus = e.target.value;
              console.log(`Updating status for request ${materialRequest?.id} to ${newStatus}`);
              onStatusUpdate(materialRequest?.id, newStatus);
            }}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-colors"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Current: <span className="font-medium">{materialRequest?.status || 'Pending'}</span>
        </div>
      </div>
    </div>
  );
};

export default MaterialRequestCard;
