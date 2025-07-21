import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import MaintenanceRequestDetails from '../../components/InventoryManager/MaintenanceRequestDetails';
import { ArrowLeft } from 'lucide-react';

const MaintenanceRequestPage = () => {
  const { equipmentId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequestDetails();
  }, [equipmentId]);

  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/schedule-maintenance-materials/details/${equipmentId}`);
      setRequest(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load request details:", err);
      setError("Failed to load maintenance request details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          links={[
            {name: 'Dashboard', path: '/inventory-dashboard'},
            {name: 'Inventory Control', path: '/inventory-control'},
            {name: 'Inventory Monitoring', path: '/inventory-monitoring'},
            {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
            {name: 'Equipment Scheduling', path: '/equipment-scheduling'},
          ]}
        />
        <div className="flex items-center justify-center min-h-96 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
            <p className="text-gray-600">Loading maintenance request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          links={[
            {name: 'Dashboard', path: '/inventory-dashboard'},
            {name: 'Inventory Control', path: '/inventory-control'},
            {name: 'Inventory Monitoring', path: '/inventory-monitoring'},
            {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
            {name: 'Equipment Scheduling', path: '/equipment-scheduling'},
          ]}
        />
        <main className="py-4 sm:py-6">
          <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Request</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => navigate('/maintenance-requests-overview')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-150"
              >
                Back to Maintenance Requests
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
        links={[
          {name: 'Dashboard', path: '/inventory-dashboard'},
          {name: 'Inventory Control', path: '/inventory-control'},
          {name: 'Inventory Monitoring', path: '/inventory-monitoring'},
          {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
          {name: 'Equipment Scheduling', path: '/equipment-scheduling'},
        ]}
      />
      
      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/maintenance-requests-overview')}
              className="flex items-center gap-2 text-slatebluegray hover:text-main_dark font-medium transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Maintenance Requests
            </button>
          </div>

          {request ? (
            <MaintenanceRequestDetails request={request} onUpdate={fetchRequestDetails} />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-main_dark mb-2">No Request Found</h3>
              <p className="text-gray-600">The maintenance request could not be found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MaintenanceRequestPage;
