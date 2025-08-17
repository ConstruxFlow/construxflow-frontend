import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PauseCircle, 
  PlayCircle,
  History,
  Save,
  X
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProjectStatusManager = ({ project, onStatusUpdate, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState(project?.progressStatus || project?.status || '');
  const [statusHistory, setStatusHistory] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Status options with descriptions
  const statusOptions = [
    {
      value: 'Planning',
      label: 'Planning',
      description: 'Project is in planning phase',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      value: 'In Progress',
      label: 'In Progress',
      description: 'Project is actively being worked on',
      icon: <PlayCircle className="w-4 h-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      value: 'On Hold',
      label: 'On Hold',
      description: 'Project is temporarily paused',
      icon: <PauseCircle className="w-4 h-4" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    {
      value: 'Completed',
      label: 'Completed',
      description: 'Project has been finished',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    }
  ];

  // Get current status info
  const getCurrentStatusInfo = () => {
    return statusOptions.find(option => option.value === selectedStatus) || statusOptions[0];
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === (project?.progressStatus || project?.status)) {
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      // Update project status in backend
      const response = await axios.put(`http://localhost:8080/api/projects/${project.projectId || project.id}`, {
        ...project,
        progressStatus: selectedStatus,
        statusUpdatedAt: new Date().toISOString(),
        statusUpdatedBy: 'Site Manager' // This would come from auth context
      });

      if (response.status === 200) {
        // Add to status history
        const newHistoryEntry = {
          id: Date.now(),
          status: selectedStatus,
          timestamp: new Date().toISOString(),
          updatedBy: 'Site Manager',
          notes: `Status changed to ${selectedStatus}`
        };

        setStatusHistory(prev => [newHistoryEntry, ...prev]);

        // Notify parent component
        onStatusUpdate(project.projectId || project.id, selectedStatus);
        
        toast.success(`Project status updated to ${selectedStatus}`);
        onClose();
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Load status history (this would come from backend in real implementation)
  useEffect(() => {
    // Mock status history - replace with actual API call
    const mockHistory = [
      {
        id: 1,
        status: 'Planning',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedBy: 'Site Manager',
        notes: 'Project created and status set to Planning'
      },
      {
        id: 2,
        status: 'In Progress',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedBy: 'Site Manager',
        notes: 'Construction work started'
      }
    ];
    setStatusHistory(mockHistory);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Update Project Status</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Info */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">{project?.projectName}</h3>
          <p className="text-sm text-gray-600">{project?.location}</p>
        </div>

        {/* Current Status */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Current Status</h4>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getCurrentStatusInfo().bgColor} ${getCurrentStatusInfo().color} ${getCurrentStatusInfo().borderColor} border`}>
            {getCurrentStatusInfo().icon}
            <span className="font-medium">{getCurrentStatusInfo().label}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">{getCurrentStatusInfo().description}</p>
        </div>

        {/* Status Selection */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Select New Status</h4>
          <div className="space-y-3">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStatus === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={selectedStatus === option.value}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className={`p-2 rounded-lg ${option.bgColor}`}>
                  <span className={option.color}>{option.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Status History */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Status History</h4>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <History className="w-4 h-4" />
              {showHistory ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showHistory && (
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {statusHistory.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{entry.status}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{entry.notes}</div>
                    <div className="text-xs text-gray-500 mt-1">Updated by {entry.updatedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusUpdate}
            disabled={isUpdating || !selectedStatus || selectedStatus === (project?.progressStatus || project?.status)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Status
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatusManager;
