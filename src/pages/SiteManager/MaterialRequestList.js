import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  FileText,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import MaterialRequestCard from '../../components/SiteManager/MaterialRequestCard';

const MaterialRequestList = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [materialRequests, setMaterialRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [project, setProject] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch project details and material requests on component mount
  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchMaterialRequests();
    } else {
      // If no projectId, redirect to materials page
      navigate('/site-manager/materials');
    }
  }, [projectId, navigate]);

  // Filter requests when search changes
  useEffect(() => {
    filterRequests();
  }, [materialRequests, searchTerm]);

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log('materialRequests state changed:', materialRequests);
  }, [materialRequests]);

  useEffect(() => {
    console.log('filteredRequests state changed:', filteredRequests);
  }, [filteredRequests]);

  const fetchProjectDetails = async () => {
    try {
      // Mock project data - replace with actual API call
      const mockProject = {
        id: projectId,
        projectName: 'Office Building Project',
        location: 'Downtown Area',
        startDate: '2024-01-15',
        endDate: '2024-12-31'
      };
      setProject(mockProject);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchMaterialRequests = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockRequests = [
        {
          id: 1,
          project: 'Office Building Project',
          phase: 'Foundation',
          status: 'Pending',
          requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          materials: [
            { materialName: 'Cement', quantity: 50, unitOfMeasurement: 'Bags' },
            { materialName: 'Steel Bars', quantity: 200, unitOfMeasurement: 'KG' },
            { materialName: 'Sand', quantity: 100, unitOfMeasurement: 'Cubic Meters' }
          ]
        },
        {
          id: 2,
          project: 'Office Building Project',
          phase: 'Structure',
          status: 'Approved',
          requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          materials: [
            { materialName: 'Bricks', quantity: 5000, unitOfMeasurement: 'Pieces' },
            { materialName: 'Concrete Mix', quantity: 20, unitOfMeasurement: 'Cubic Meters' }
          ]
        },
        {
          id: 3,
          project: 'Office Building Project',
          phase: 'Interior',
          status: 'In Progress',
          requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          materials: [
            { materialName: 'Tiles', quantity: 1000, unitOfMeasurement: 'Square Meters' },
            { materialName: 'Paint', quantity: 100, unitOfMeasurement: 'Liters' }
          ]
        },
        {
          id: 4,
          project: 'Office Building Project',
          phase: 'Electrical',
          status: 'Delivered',
          requestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          materials: [
            { materialName: 'Electrical Wires', quantity: 500, unitOfMeasurement: 'Meters' },
            { materialName: 'Switches', quantity: 50, unitOfMeasurement: 'Pieces' }
          ]
        }
      ];
      
      console.log('Setting mock material requests:', mockRequests);
      setMaterialRequests(mockRequests);
      
      // Log the current state after setting
      setTimeout(() => {
        console.log('Current materialRequests state:', materialRequests);
      }, 100);
      
    } catch (error) {
      console.error('Error fetching material requests:', error);
      toast.error('Failed to fetch material requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    console.log('Filtering requests. Current materialRequests:', materialRequests);
    console.log('Search term:', searchTerm);
    
    let filtered = [...materialRequests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.phase?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.materials?.some(material => 
          material.materialName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    console.log('Filtered results:', filtered);
    setFilteredRequests(filtered);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      // For now, just update local state since backend API might not be ready
      // TODO: Replace with actual API call when backend is ready
      /*
      await axios.put(`http://localhost:8080/api/material-requests/${requestId}`, {
        status: newStatus,
        statusUpdatedAt: new Date().toISOString()
      });
      */
      
      // Update local state immediately for better UX
      setMaterialRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: newStatus }
            : request
        )
      );
      
      // Also update filtered requests to maintain search consistency
      setFilteredRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: newStatus }
            : request
        )
      );
      
      toast.success(`Status updated to ${newStatus}`);
      
      // Log the update for debugging
      console.log(`Status updated for request ${requestId} to ${newStatus}`);
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      
      // Revert the change if there was an error
      setMaterialRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: request.status }
            : request
        )
      );
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this material request?')) {
      try {
        await axios.delete(`http://localhost:8080/api/material-requests/${requestId}`);
        setMaterialRequests(prev => prev.filter(request => request.id !== requestId));
        toast.success('Material request deleted successfully');
      } catch (error) {
        console.error('Error deleting material request:', error);
        toast.error('Failed to delete material request');
      }
    }
  };

  const handleEdit = (request) => {
    navigate(`/site-manager/materials/edit-request/${request.id}`, { 
      state: { materialRequest: request } 
    });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading material requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate('/site-manager/materials')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Projects
                </button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {project ? `Material Requests - ${project.projectName}` : 'Material Requests'}
              </h1>
              <p className="text-gray-600 mt-2">
                {project ? `Manage material requests for ${project.projectName}` : 'Track and manage material requests for your projects'}
              </p>
            </div>
            <button
              onClick={() => navigate('/site-manager/materials/create-request')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search phases or materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{filteredRequests.length}</span> of{' '}
            <span className="font-medium">{materialRequests.length}</span> material requests
          </p>
        </div>

        {/* Material Requests Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <MaterialRequestCard
                key={request.id}
                materialRequest={request}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No material requests found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search'
                : 'Get started by creating your first material request'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/site-manager/materials/create-request')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Material Request
              </button>
            )}
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Material Request Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Request ID</label>
                    <p className="text-lg font-semibold text-gray-900">#{selectedRequest.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Project</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.project}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phase</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedRequest.phase}</p>
                  </div>
                </div>

                {/* Materials List */}
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-3 block">Requested Materials</label>
                  <div className="space-y-3">
                    {selectedRequest.materials?.map((material, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{material.materialName}</h4>
                            <p className="text-sm text-gray-600">Quantity: {material.quantity} {material.unitOfMeasurement}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Request Date */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Request Date</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedRequest.requestDate ? new Date(selectedRequest.requestDate).toLocaleDateString() : 'Date not set'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleEdit(selectedRequest);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Request
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialRequestList;
