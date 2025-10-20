import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import { X, Calendar, User, Clock, AlertTriangle, Info } from "lucide-react";

// Status badge component
const StatusBadge = ({ status }) => {
  let base = "px-3 py-1 rounded-full font-semibold text-xs";
  switch (status?.toUpperCase()) {
    case "PENDING":
      return (
        <span className={`${base} bg-[#EFC11A] text-black`}>
          Pending
        </span>
      );
    case "APPROVED":
      return (
        <span className={`${base} bg-[#236571] text-white`}>
          Approved
        </span>
      );
    case "COMPLETED":
      return (
        <span className={`${base} bg-emerald-400 text-white`}>
          Completed
        </span>
      );
    case "SCHEDULED":
      return (
        <span className={`${base} bg-blue-500 text-white`}>
          Scheduled
        </span>
      );
    default:
      return (
        <span className={`${base} bg-gray-400 text-white`}>
          {status || 'Unknown'}
        </span>
      );
  }
};

// Icon component for demo
const EquipmentIcon = ({ type }) => {
  switch (type) {
    case "excavator":
      return <span className="mr-2 text-[#236571]">🚜</span>;
    case "mixer":
      return <span className="mr-2 text-[#236571]">⚙️</span>;
    case "crane":
      return <span className="mr-2 text-[#236571]">🏗️</span>;
    case "jackhammer":
      return <span className="mr-2 text-[#236571]">🔨</span>;
    default:
      return null;
  }
};

// Main component
const MaintenanceRequestDashboard = () => {
  const [showTeam, setShowTeam] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [creatingSchedule, setCreatingSchedule] = useState(false);
  const navigate = useNavigate();

  // Fetch maintenance schedule requests
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/maintenance-schedule-requests/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch maintenance requests');
        }
        
        const data = await response.json();
        setMaintenanceRequests(data);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  // Handle view details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  // Handle create schedule
  const handleCreateSchedule = async (request) => {
    try {
      setCreatingSchedule(true);
      console.log('Creating schedule for equipment:', request.equipment.id);
      console.log('Updating request status to APPROVED for request:', request.id);
      
      // Update the request status to APPROVED
      const response = await fetch(`http://localhost:8080/api/maintenance-schedule-requests/${request.id}/status?status=APPROVED`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to update request status');
      }
      
      const updatedRequest = await response.json();
      console.log('Request status updated successfully:', updatedRequest);
      
      // Update the local state to reflect the status change
      setMaintenanceRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === request.id 
            ? { ...req, status: 'APPROVED' }
            : req
        )
      );
      
      // Update the selected request if it's the one being modified
      if (selectedRequest && selectedRequest.id === request.id) {
        setSelectedRequest({ ...selectedRequest, status: 'APPROVED' });
      }
      
      // Close the modal
      setShowDetailModal(false);
      
      // Navigate to technician assignment page using equipment ID
      navigate(`/maintenance/scheduling/${request.equipment.id}?requestby=IM`);
      
    } catch (error) {
      console.error('Error updating request status:', error);
      // You might want to show an error message to the user here
      alert('Failed to update request status. Please try again.');
    } finally {
      setCreatingSchedule(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format datetime for display
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <NavBar
        profileURL="/maintenance/profile"
        links={[
          {
            name: "Dashboard",
            href: "#",
            onClick: () => navigate("/maintenance/dashboard"),
          },
          {
            name: "Task",
            href: "#",
            onClick: () => navigate("/maintenance/scheduling"),
          },
          {
            name: "Schedule",
            href: "#",
            onClick: () =>
              navigate("/maintenance/update-equipment-maintenance"),
          },
          {
            name: "Team",
            href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");

              setShowTeam(true);
            },
          },
          {
            name: "Equipment",
            href: "#",
            onClick: () => navigate("/maintenance/equipment"),
          },
          {
            name: "Add Technician",
            href: "#",
            onClick: () => navigate("/maintenance/add-member"),
          },
        ]}
      />

      <div className="bg-[#f7fafd] min-h-screen py-10">
        <div className="max-w-4xl mx-auto">
          {/* Outer container */}
          <div className="bg-white rounded-xl shadow-md p-8">
            {/* Title and subtitle */}
            <h1 className="text-2xl font-bold mb-2 text-black">
              Maintenance Requests Overview
            </h1>
            <p className="text-gray-600 mb-6">
              Monitor and manage equipment maintenance schedules
            </p>
            {/* Table container */}
            <div className="bg-white rounded-lg">
              <h2 className="text-lg font-semibold mb-3">
                Upcoming Maintenance Schedule
              </h2>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#236571]"></div>
                  <span className="ml-2 text-gray-600">Loading maintenance requests...</span>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#236571] text-white">
                      <th className="text-left py-3 px-4 font-semibold">Equipment</th>
                      <th className="text-left py-3 px-4 font-semibold">Equipment Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Requested Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceRequests.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No maintenance requests found
                        </td>
                      </tr>
                    ) : (
                      maintenanceRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b last:border-none hover:bg-slate-50"
                        >
                          <td className="py-4 px-4 flex items-center">
                            <EquipmentIcon type={request.equipmentType.toLowerCase()} />
                            <div>
                              <span className="font-semibold text-gray-800">{request.equipmentName}</span>
                              <div className="text-xs text-gray-500">{request.equipment.brand} {request.equipment.model}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{request.equipmentType}</td>
                          <td className="py-4 px-4 text-gray-700">{formatDateTime(request.requestedAt)}</td>
                          <td className="py-4 px-4">
                            <StatusBadge status={request.status} />
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => handleViewDetails(request)}
                              className="bg-[#236571] text-white px-4 py-2 rounded-lg font-medium text-sm shadow hover:bg-[#1a4e57] transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay and Team Sidebar */}
      {showTeam && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-all"
            onClick={() => setShowTeam(false)}
            aria-label="Close team sidebar"
          />
          <TeamSection onClose={() => setShowTeam(false)} />
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-all"
            onClick={handleCloseModal}
            aria-label="Close detail modal"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Maintenance Request Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Equipment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-[#236571]" />
                    Equipment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900 font-semibold">{selectedRequest.equipmentName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-gray-900">{selectedRequest.equipmentType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Brand & Model</label>
                      <p className="text-gray-900">{selectedRequest.equipment.brand} {selectedRequest.equipment.model}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Serial Number</label>
                      <p className="text-gray-900">{selectedRequest.equipment.serialNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p className="text-gray-900">{selectedRequest.equipment.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Location</label>
                      <p className="text-gray-900">{selectedRequest.equipment.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Status</label>
                      <p className="text-gray-900">{selectedRequest.equipment.status}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Condition</label>
                      <p className="text-gray-900">{selectedRequest.equipment.condition}</p>
                    </div>
                  </div>
                </div>

                {/* Maintenance Schedule Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[#236571]" />
                    Maintenance Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Next Maintenance</label>
                      <p className="text-gray-900 font-semibold">{formatDate(selectedRequest.equipment.nextMaintenance)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Maintenance</label>
                      <p className="text-gray-900">{selectedRequest.equipment.lastMaintenance ? formatDate(selectedRequest.equipment.lastMaintenance) : 'Not recorded'}</p>
                    </div>
                  </div>
                </div>

                {/* Request Information */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-[#EFC11A]" />
                    Request Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Request ID</label>
                      <p className="text-gray-900">#{selectedRequest.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Requested At</label>
                      <p className="text-gray-900 flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        {formatDateTime(selectedRequest.requestedAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">
                        <StatusBadge status={selectedRequest.status} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reason</label>
                      <p className="text-gray-900 bg-white p-3 rounded border">{selectedRequest.reason}</p>
                    </div>
                    {selectedRequest.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                        <p className="text-gray-900 bg-white p-3 rounded border">{selectedRequest.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Equipment Notes */}
                {selectedRequest.equipment.notes && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipment Notes</h3>
                    <p className="text-gray-900 bg-white p-3 rounded border">{selectedRequest.equipment.notes}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleCreateSchedule(selectedRequest)}
                  disabled={creatingSchedule}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    creatingSchedule 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#236571] hover:bg-[#1a4e57]'
                  } text-white`}
                >
                  {creatingSchedule ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Approving...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Create Schedule
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MaintenanceRequestDashboard;
