import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaExclamationCircle, 
  FaMapMarkerAlt, 
  FaTools, 
  FaUser, 
  FaCheck, 
  FaTimes,
  FaEdit
} from 'react-icons/fa';
import { Save, Package } from 'lucide-react';

const MaintenanceRequestDetails = ({ request, onUpdate }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-web_yellow bg-web_yellow/10 border-web_yellow/30';
      case 'low':
        return 'text-deep_green bg-deep_green/10 border-deep_green/30';
      default:
        return 'text-slatebluegray bg-light_gray/40 border-light_gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-slatebluegray bg-light_gray/40 border-light_gray';
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    // Simulate API call
    setTimeout(() => {
      setIsApproving(false);
      alert('Request approved successfully!');
      if (onUpdate) onUpdate();
    }, 2000);
  };

  const handleReject = async () => {
    setIsRejecting(true);
    // Simulate API call
    setTimeout(() => {
      setIsRejecting(false);
      alert('Request rejected successfully!');
      if (onUpdate) onUpdate();
    }, 2000);
  };

  const handleUpdateInventory = async () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      alert('Inventory updated successfully!');
      if (onUpdate) onUpdate();
    }, 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
          Maintenance Request Details
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Review and manage material requests for maintenance operations
        </p>
      </div>

      {/* Request Overview */}
      <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <FaTools className="w-5 h-5 text-deep_green" />
          <h2 className="text-lg font-semibold text-main_dark">Request Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Equipment Name */}
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Equipment Name
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <FaTools className="w-4 h-4 text-deep_green" />
              <span className="font-medium text-main_dark">
                {request.equipmentName || 'N/A'}
              </span>
            </div>
          </div>

          {/* Requested By */}
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Requested By
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <FaUser className="w-4 h-4 text-deep_green" />
              <span className="font-medium text-main_dark">
                {request.requestedBy || 'N/A'}
              </span>
            </div>
          </div>

          {/* Scheduled Date & Time */}
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Scheduled Date & Time
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <FaCalendarAlt className="w-4 h-4 text-deep_green" />
              <span className="font-medium text-main_dark">
                {formatDate(request.schedule) || 'N/A'}
              </span>
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Priority Level
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <FaExclamationCircle className="w-4 h-4 text-web_yellow" />
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                {request.priority || 'Medium'}
              </span>
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Availability Status
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <FaMapMarkerAlt className="w-4 h-4 text-deep_green" />
              <span className="font-medium text-main_dark">
                {request.availability || 'N/A'}
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Current Status
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                {request.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slatebluegray mb-2">
            Comments
          </label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-main_dark">
              {request.comments || 'No comments provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Requested Materials */}
      <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-deep_green" />
          <h3 className="text-lg font-semibold text-main_dark">Requested Materials</h3>
        </div>

        {request.materials && request.materials.length > 0 ? (
          <div className="space-y-4">
            {request.materials.map((material, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-150">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-main_dark">{material.name || 'Unnamed Material'}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slatebluegray">
                      <span className="font-medium">Qty:</span> {material.qty || 'N/A'}
                    </span>
                    <span className="text-slatebluegray">
                      <span className="font-medium">In Stock:</span> 
                      <span className={material.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {material.stock || 'N/A'}
                      </span>
                    </span>
                  </div>
                </div>
                
                {material.desc && (
                  <p className="text-sm text-gray-600 mb-2">{material.desc}</p>
                )}
                
                {material.notes && (
                  <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-xs text-blue-700">
                      <span className="font-medium">Notes:</span> {material.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No Materials Requested</h4>
            <p className="text-gray-500">This maintenance request does not include any material requirements.</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-main_dark mb-4">Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Approving...
              </>
            ) : (
              <>
                <FaCheck className="w-4 h-4" />
                Approve Request
              </>
            )}
          </button>

          <button
            onClick={handleReject}
            disabled={isRejecting}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRejecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Rejecting...
              </>
            ) : (
              <>
                <FaTimes className="w-4 h-4" />
                Reject Request
              </>
            )}
          </button>

          <button
            onClick={handleUpdateInventory}
            disabled={isUpdating}
            className="bg-deep_green hover:bg-deep_green/80 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <FaEdit className="w-4 h-4" />
                Update Inventory
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequestDetails;
