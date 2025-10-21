import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaExclamationCircle, 
  FaMapMarkerAlt, 
  FaTools, 
  FaUser, 
  FaCheck, 
  FaTimes,
  FaEdit,
  FaBox,
  FaExclamationTriangle
} from 'react-icons/fa';
import { Save, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from "react-toastify";
import axios from 'axios';

const MaintenanceRequestDetails = ({ request, onUpdate, equipmentId }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inventoryCheck, setInventoryCheck] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'

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
    // Map status for display purposes
    const displayStatus = status?.toLowerCase();
    switch (displayStatus) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved': // Display as "APPROVED" in frontend
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': // Display as "REJECTED" in frontend
        return 'text-red-600 bg-red-50 border-red-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-slatebluegray bg-light_gray/40 border-light_gray';
    }
  };

  const getDisplayStatus = (status) => {
    // Ensure frontend always shows "APPROVED" even if database has "ACCEPT"
    if (!status) return 'Pending';
    
    const statusMap = {
      'accept': 'APPROVED',
      'reject': 'REJECTED', 
      'pending': 'PENDING',
      'approved': 'APPROVED',
      'rejected': 'REJECTED'
    };
    
    return statusMap[status.toLowerCase()] || status;
  };

  const checkInventoryAvailability = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/schedule-maintenance-materials/${equipmentId}/check-inventory`
      );
      setInventoryCheck(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to check inventory:", error);
      alert('Failed to check inventory availability');
      return null;
    }
  };

  const handleApprove = async () => {
    // First check inventory
    const inventoryResult = await checkInventoryAvailability();
    
    if (!inventoryResult || !inventoryResult.allMaterialsAvailable) {
      setInventoryCheck(inventoryResult);
      setActionType('approve');
      setShowConfirmDialog(true);
      return;
    }

    // If all materials available, proceed with approval
    await executeApprove();
  };

 const executeApprove = async () => {
    setIsApproving(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/schedule-maintenance-materials/${equipmentId}/approve`
      );

      if (response.data.success) {
        toast.success(`Request approved successfully! ${response.data.inventoryItemsUpdated} inventory items updated.`);
        if (onUpdate) onUpdate();
      } else {
        toast.error('Failed to approve request: ' + response.data.message);
      }
    } catch (err) {
      console.error("Failed to approve request:", err);
      toast.error('Failed to approve request: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsApproving(false);
      setShowConfirmDialog(false);
    }
  };

  const handleReject = async () => {
    setActionType('reject');
    setShowConfirmDialog(true);
  };

  const executeReject = async () => {
    setIsRejecting(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/schedule-maintenance-materials/${equipmentId}/reject`
      );

      if (response.data.success) {
        alert('Request rejected successfully!');
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to reject request: ' + response.data.message);
      }
    } catch (err) {
      console.error("Failed to reject request:", err);
      alert('Failed to reject request: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsRejecting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleUpdateInventory = async () => {
    setIsUpdating(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/schedule-maintenance-materials/${equipmentId}/update-inventory`
      );

      if (response.data.success) {
        alert(`Inventory updated successfully! ${response.data.inventoryItemsUpdated} items processed.`);
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to update inventory: ' + response.data.message);
      }
    } catch (err) {
      console.error("Failed to update inventory:", err);
      alert('Failed to update inventory: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
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

  const renderInventoryCheck = () => {
    if (!inventoryCheck || !inventoryCheck.materialAvailability) return null;

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h4 className="font-semibold text-yellow-800">Inventory Check</h4>
        </div>
        
        <div className="space-y-2">
          {inventoryCheck.materialAvailability.map((material, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
              <span className="font-medium">{material.materialName}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  Requested: <strong>{material.requestedQuantity}</strong>
                </span>
                <span className="text-sm">
                  Available: <strong>{material.availableQuantity}</strong>
                </span>
                {material.isAvailable ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {!inventoryCheck.allMaterialsAvailable && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">
              ⚠️ Some materials have insufficient stock. You can still approve, but inventory won't be updated for unavailable items.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderConfirmDialog = () => {
    if (!showConfirmDialog) return null;

    const isApprove = actionType === 'approve';
    const hasInventoryIssues = inventoryCheck && !inventoryCheck.allMaterialsAvailable;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-main_dark">
              Confirm {isApprove ? 'Approval' : 'Rejection'}
            </h3>
          </div>

          {isApprove && hasInventoryIssues && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-700 text-sm">
                <strong>Warning:</strong> Some materials have insufficient stock. 
                Inventory will only be updated for available items.
              </p>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            Are you sure you want to {isApprove ? 'approve' : 'reject'} this maintenance request?
            This action cannot be undone.
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={isApprove ? executeApprove : executeReject}
              disabled={isApproving || isRejecting}
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isApprove 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {(isApproving || isRejecting) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isApprove ? 'Approving...' : 'Rejecting...'}
                </>
              ) : (
                <>
                  {isApprove ? <FaCheck className="w-4 h-4" /> : <FaTimes className="w-4 h-4" />}
                  Confirm {isApprove ? 'Approve' : 'Reject'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Don't show action buttons if request is already approved/rejected
  // Check both "APPROVED" and "ACCEPT" for approved status
  const isApproved = request.status && 
    (request.status.toLowerCase() === 'approved' || request.status.toLowerCase() === 'accept');
  
  const isRejected = request.status && 
    (request.status.toLowerCase() === 'rejected' || request.status.toLowerCase() === 'reject');
  
  const showActionButtons = !isApproved && !isRejected;

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

      {/* Inventory Check Results */}
      {inventoryCheck && renderInventoryCheck()}

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

          {/* Status - Display as "APPROVED" even if database has "ACCEPT" */}
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Current Status
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                {getDisplayStatus(request.status)}
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

      {/* Actions - Only show if request is pending */}
      {showActionButtons && (
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
          </div>
        </div>
      )}

      {/* Status Display for non-pending requests */}
      {!showActionButtons && (
        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-main_dark mb-4">Request Status</h3>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
            isApproved 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isApproved ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">
              This request has been {getDisplayStatus(request.status).toLowerCase()}
            </span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {renderConfirmDialog()}
    </div>
  );
};

export default MaintenanceRequestDetails;