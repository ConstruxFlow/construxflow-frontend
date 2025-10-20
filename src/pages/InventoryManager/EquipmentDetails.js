import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { ArrowLeft, Calendar, Wrench, MapPin, User, FileText } from 'lucide-react';

const API_BASE = import.meta?.env?.VITE_API_BASE ?? 'http://localhost:8080/api';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Request', href: '/Inventory-requests' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

export default function EquipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEquipmentDetails();
  }, [id]);

  const fetchEquipmentDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/equipment/details/${id}`);
      if (!response.ok) throw new Error('Failed to fetch equipment details');
      const data = await response.json();
      setEquipment(data);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching equipment details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in use':
        return 'bg-yellow-100 text-yellow-800';
      case 'under maintenance':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar links={navLinks} />
        <div className="flex items-center justify-center min-h-96 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
            <p className="text-gray-600">Loading equipment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar links={navLinks} />
        <main className="py-4 sm:py-6">
          <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Equipment</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => navigate('/equipment-scheduling')}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-150"
              >
                Back to Equipment Scheduling
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar links={navLinks} />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/equipment-scheduling')}
              className="flex items-center gap-2 text-slatebluegray hover:text-main_dark font-medium transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Equipment Scheduling
            </button>
          </div>

          {equipment ? (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-main_dark mb-2">{equipment.name}</h1>
                    <p className="text-gray-600">Equipment ID: #{equipment.id}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(equipment.status)}`}>
                      {equipment.status || 'Unknown Status'}
                    </span>
                    <button
                      onClick={() => navigate(`/view-schedule-page/${id}`)}
                      className="bg-web_yellow hover:bg-web_yellow/90 text-main_dark px-4 py-2 rounded-lg font-medium transition-colors duration-150"
                    >
                      View Schedule
                    </button>
                  </div>
                </div>
              </div>

              {/* Equipment Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Wrench className="w-5 h-5 text-deep_green" />
                    <h2 className="text-lg font-semibold text-main_dark">Basic Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-1">Type</label>
                        <p className="text-main_dark font-medium">{equipment.type || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-1">Brand</label>
                        <p className="text-main_dark font-medium">{equipment.brand || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-1">Model</label>
                        <p className="text-main_dark font-medium">{equipment.model || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-1">Utilization</label>
                        <p className="text-main_dark font-medium">{equipment.utilization || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Status */}
                <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-deep_green" />
                    <h2 className="text-lg font-semibold text-main_dark">Location & Status</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-1">Current Location</label>
                      <p className="text-main_dark font-medium">{equipment.location || 'N/A'}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-1">Last Maintenance</label>
                        <p className="text-main_dark font-medium">{equipment.lastMaintenance || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-1">Next Maintenance</label>
                        <p className="text-main_dark font-medium">{equipment.nextMaintenance || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-deep_green" />
                    <h2 className="text-lg font-semibold text-main_dark">Specifications & Notes</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-1">Specifications</label>
                      <p className="text-main_dark">{equipment.specifications || 'No specifications available.'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-1">Notes</label>
                      <p className="text-main_dark">{equipment.notes || 'No additional notes.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-main_dark mb-2">No Equipment Found</h3>
              <p className="text-gray-600">The equipment details could not be found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}