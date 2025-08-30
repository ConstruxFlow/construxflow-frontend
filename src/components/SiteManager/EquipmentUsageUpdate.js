import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Save,
  Package,
  TrendingUp,
  Activity,
  Fuel,
  Cloud,
  Wrench
} from 'lucide-react';

const EquipmentUsageUpdate = () => {
  const navigate = useNavigate();
  const { equipmentId } = useParams();
  const location = useLocation();
  const { equipment, projectId } = location.state || {};

  const [formData, setFormData] = useState({
    equipmentId: equipmentId,
    projectId: projectId,
    operator: equipment?.operator || '',
    usageDate: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    hoursUsed: '',
    kilometersTraveled: '',
    location: equipment?.location || '',
    purpose: '',
    notes: '',
    fuelConsumption: '',
    maintenanceNotes: '',
    weatherConditions: '',
    status: 'Completed'
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previousUsage, setPreviousUsage] = useState(null);

  // Mock data for previous usage - will be replaced with API calls
  useEffect(() => {
    const fetchPreviousUsage = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockPreviousUsage = {
          lastUpdated: '2024-11-19 17:30',
          totalHours: 37.0,
          totalKilometers: 0,
          todayHours: 8.0,
          todayKilometers: 0,
          location: 'Zone A - Foundation',
          operator: 'John Martinez',
          notes: 'Foundation excavation work completed successfully'
        };
        setPreviousUsage(mockPreviousUsage);
      } catch (error) {
        console.error('Error fetching previous usage:', error);
      } finally {
        setLoading(false);
      }
    };

    if (equipmentId) {
      fetchPreviousUsage();
    }
  }, [equipmentId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateHours = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      return Math.max(0, diffHours);
    }
    return 0;
  };

  const handleTimeChange = (field, value) => {
    handleInputChange(field, value);
    if (field === 'startTime' || field === 'endTime') {
      const calculatedHours = calculateHours();
      handleInputChange('hoursUsed', calculatedHours.toFixed(1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.operator || !formData.startTime || !formData.endTime || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.hoursUsed) <= 0) {
      alert('Hours used must be greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - navigate back to project equipment dashboard
      alert('Daily usage updated successfully!');
      navigate(`/site-manager/project-equipment/${projectId}`);
    } catch (error) {
      console.error('Error updating usage:', error);
      alert('Error updating usage. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny': return '☀️';
      case 'Cloudy': return '☁️';
      case 'Rainy': return '🌧️';
      case 'Windy': return '💨';
      default: return '🌤️';
    }
  };

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-main_dark mb-2">Equipment Not Found</h3>
          <p className="text-slatebluegray mb-4">Please go back and select equipment first.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-deep_green text-white px-6 py-2 rounded-lg font-semibold hover:bg-deep_green/90 transition-colors duration-150"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
            >
              <ArrowLeft className="w-5 h-5 text-slatebluegray" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-main_dark">Daily Usage Update</h1>
              <p className="text-slatebluegray text-lg">Update equipment usage for today</p>
            </div>
          </div>

          {/* Equipment Info */}
          <div className="bg-gradient-to-r from-deep_green/10 to-web_yellow/10 border border-deep_green/20 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-main_dark">{equipment.name}</h2>
                <p className="text-slatebluegray">{equipment.brand} {equipment.model}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-deep_green/20 text-deep_green text-xs rounded-full">
                  {equipment.category}
                </span>
              </div>
            </div>

            {/* Previous Usage Summary */}
            {previousUsage && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-deep_green/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-main_dark">{previousUsage.totalHours.toFixed(1)}h</div>
                  <div className="text-xs text-slatebluegray">Total Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-main_dark">{previousUsage.todayHours.toFixed(1)}h</div>
                  <div className="text-xs text-slatebluegray">Yesterday</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-main_dark">{previousUsage.location}</div>
                  <div className="text-xs text-slatebluegray">Last Location</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Usage Update Form */}
        <form onSubmit={handleSubmit} className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <Activity className="w-4 h-4 inline mr-2" />
                  Operator *
                </label>
                <input
                  type="text"
                  value={formData.operator}
                  onChange={(e) => handleInputChange('operator', e.target.value)}
                  placeholder="Who operated the equipment today?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Usage Date *
                </label>
                <input
                  type="date"
                  value={formData.usageDate}
                  onChange={(e) => handleInputChange('usageDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                />
              </div>
            </div>

            {/* Time Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Hours Used *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.hoursUsed}
                  onChange={(e) => handleInputChange('hoursUsed', e.target.value)}
                  placeholder="Calculated automatically"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                />
              </div>
            </div>

            {/* Location and Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location on Site *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Zone A - Foundation, Building 2, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Purpose of Usage
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="What work was done today?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                />
              </div>
            </div>

            {/* Kilometers and Fuel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Kilometers Traveled
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.kilometersTraveled}
                  onChange={(e) => handleInputChange('kilometersTraveled', e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <Fuel className="w-4 h-4 inline mr-2" />
                  Fuel Consumption
                </label>
                <input
                  type="text"
                  value={formData.fuelConsumption}
                  onChange={(e) => handleInputChange('fuelConsumption', e.target.value)}
                  placeholder="e.g., 15L, 3.2 gallons"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                />
              </div>
            </div>

            {/* Weather and Maintenance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <Cloud className="w-4 h-4 inline mr-2" />
                  Weather Conditions
                </label>
                <select
                  value={formData.weatherConditions}
                  onChange={(e) => handleInputChange('weatherConditions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                >
                  <option value="">Select weather condition</option>
                  <option value="Sunny">☀️ Sunny</option>
                  <option value="Cloudy">☁️ Cloudy</option>
                  <option value="Rainy">🌧️ Rainy</option>
                  <option value="Windy">💨 Windy</option>
                  <option value="Foggy">🌫️ Foggy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <Wrench className="w-4 h-4 inline mr-2" />
                  Maintenance Issues
                </label>
                <input
                  type="text"
                  value={formData.maintenanceNotes}
                  onChange={(e) => handleInputChange('maintenanceNotes', e.target.value)}
                  placeholder="Any issues noticed today?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any observations, challenges, or additional information about today's usage..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
              />
            </div>

            {/* Usage Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-main_dark mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-deep_green" />
                Today's Usage Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slatebluegray">Hours Used:</span>
                  <span className="ml-2 font-medium text-main_dark">
                    {formData.hoursUsed ? `${formData.hoursUsed}h` : 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-slatebluegray">Kilometers:</span>
                  <span className="ml-2 font-medium text-main_dark">
                    {formData.kilometersTraveled ? `${formData.kilometersTraveled} km` : '0 km'}
                  </span>
                </div>
                <div>
                  <span className="text-slatebluegray">Location:</span>
                  <span className="ml-2 font-medium text-main_dark">
                    {formData.location || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-deep_green text-white px-8 py-3 rounded-lg font-semibold hover:bg-deep_green/90 transition-colors duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Daily Usage
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentUsageUpdate;
