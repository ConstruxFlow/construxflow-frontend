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
import NavBar from '../NavBar';
import { toast } from 'react-toastify';
import LoadingOverlay from '../LoadingOverlay';

const EquipmentUsageUpdate = () => {
  const navigate = useNavigate();
  const { equipmentId } = useParams();
  const location = useLocation();
  const { equipment, projectId } = location.state || {};

  const [formData, setFormData] = useState({
    equipmentId: equipmentId || '',
    projectId: projectId || '',
    operator: equipment?.operator || '',
    usageDate: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    hoursUsed: '0',
    kilometersTraveled: '0',
    location: equipment?.location || '',
    purpose: '',
    notes: '',
    fuelConsumption: '',
    maintenanceNotes: '',
    weatherConditions: 'Clear',
    status: 'Completed'
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previousUsage, setPreviousUsage] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState("");

  // Fetch last usage data from API
  useEffect(() => {
    const fetchPreviousUsage = async () => {
      setLoading(true);
      try {
        console.log('Fetching last usage for equipment:', equipmentId);
        
        const response = await fetch(`http://localhost:8080/api/equipment-usage/last-usage/${equipmentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch last usage data');
        }
        
        const lastUsageData = await response.json();
        console.log('Last usage data received:', lastUsageData);
        
        // Transform API response to match the expected format
        const transformedUsage = {
          lastUpdated: lastUsageData.lastLoggedAt || '',
          lastUsageHours: lastUsageData.lastUsageHours || 0,
          lastUsageLocation: lastUsageData.lastUsageLocation || '',
          lastUsageDate: lastUsageData.lastUsageDate || '',
          operator: lastUsageData.operator || '',
          purpose: lastUsageData.purpose || '',
          status: lastUsageData.status || '',
          hasUsageHistory: lastUsageData.hasUsageHistory || false
        };
        
        setPreviousUsage(transformedUsage);
      } catch (error) {
        console.error('Error fetching previous usage:', error);
        // Set default empty state if API fails
        setPreviousUsage({
          lastUpdated: '',
          lastUsageHours: 0,
          lastUsageLocation: 'No previous usage',
          lastUsageDate: '',
          operator: '',
          purpose: '',
          status: '',
          hasUsageHistory: false
        });
      } finally {
        setLoading(false);
      }
    };

    if (equipmentId) {
      fetchPreviousUsage();
    }
  }, [equipmentId]);

  // Ensure form data is properly initialized with route params and location state
  useEffect(() => {
    if (equipmentId || projectId || equipment) {
      setFormData(prev => ({
        ...prev,
        equipmentId: equipmentId || prev.equipmentId,
        projectId: projectId || prev.projectId,
        operator: equipment?.operator || prev.operator,
        location: equipment?.location || prev.location
      }));
    }
  }, [equipmentId, projectId, equipment]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeChange = (field, value) => {
    handleInputChange(field, value);
    
    // Calculate hours with the new value
    const startTime = field === 'startTime' ? value : formData.startTime;
    const endTime = field === 'endTime' ? value : formData.endTime;
    
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diffMs = end - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      const calculatedHours = Math.max(0, diffHours);
      
      // Update hours used with a slight delay to ensure the time field is updated first
      setTimeout(() => {
        handleInputChange('hoursUsed', calculatedHours.toFixed(1));
      }, 0);
    }
  };

  // Helper function to check if end time is after start time
  const isTimeRangeValid = () => {
    if (!formData.startTime || !formData.endTime) return true;
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    return end > start;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Log current form data
    console.log('Current form data:', formData);
    console.log('Equipment ID:', formData.equipmentId);
    console.log('Project ID:', formData.projectId);
    
    if (!formData.equipmentId || !formData.projectId) {
      toast.error('Missing equipment ID or project ID. Please check the URL and try again.');
      return;
    }
    
    if (!formData.operator || !formData.startTime || !formData.endTime || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isTimeRangeValid()) {
      toast.error('End time must be after start time');
      return;
    }

    if (parseFloat(formData.hoursUsed) <= 0) {
      toast.error('Hours used must be greater than 0. Please check your start and end times.');
      return;
    }

    setSubmitting(true);
    setError("");
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress((p) => (p >= 90 ? p : p + Math.random() * 5));
    }, 200);

    try {
      setLoadingProgress(10);

      // Prepare the request body according to your DTO structure
      const requestBody = {
        equipmentId: parseInt(formData.equipmentId),
        projectId: formData.projectId,
        operator: formData.operator,
        usageDate: formData.usageDate,
        startTime: `${formData.usageDate}T${formData.startTime}:00`,
        endTime: `${formData.usageDate}T${formData.endTime}:00`,
        hoursUsed: parseFloat(formData.hoursUsed) || 0.0,
        kilometersTraveled: parseFloat(formData.kilometersTraveled) || 0.0,
        location: formData.location,
        purpose: formData.purpose || '',
        notes: formData.notes || '',
        fuelConsumption: formData.fuelConsumption ? `${formData.fuelConsumption}L` : '',
        maintenanceNotes: formData.maintenanceNotes || '',
        weatherConditions: formData.weatherConditions || 'Clear',
        status: formData.status || 'Completed',
        loggedAt: new Date().toISOString(),
        loggedBy: formData.operator
      };

      console.log('Sending Request Body:', JSON.stringify(requestBody, null, 2));

      setLoadingProgress(25);

      const response = await fetch('http://localhost:8080/api/equipment-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      setLoadingProgress(50);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        throw new Error(`Failed to submit equipment usage: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      setLoadingProgress(90);
      
      console.log('Success Response:', result);
      
      setLoadingProgress(100);
      toast.success("Daily usage updated successfully!");
      navigate(`/site-manager/project-equipment/${projectId}`);
      
    } catch (error) {
      console.error('Error updating usage:', error);
      setError(error.message);
      toast.error("Error updating usage. Please try again.");
    } finally {
      setSubmitting(false);
      clearInterval(progressInterval);
      setLoadingProgress(0);
    }
  };

  if (!equipment) {
    return (
      <>
        <NavBar
          profileURL='profile'
          links={[
            { name: "Dashboard", href: "/site-manager" },
            { name: "Projects", href: "/site-manager/projects-list" },
            { name: "Materials", href: "/site-manager/material-request-list" },
            { name: "Inventory", href: "/site-manager/site-inventory" },
            { name: "Purchase Orders", href: "/site-manager/order-details" },
          ]}
        />
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
      </>
    );
  }

  return (
    <>
      {submitting && <LoadingOverlay progress={loadingProgress} />}
      <NavBar
        profileURL='profile'
        links={[
          { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
          { name: "Materials", href: "/site-manager/material-request-list" },
          { name: "Inventory", href: "/site-manager/site-inventory" },
          { name: "Purchase Orders", href: "/site-manager/order-details" },
        ]}
      />
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
            {loading && (
              <div className="mt-4 pt-4 border-t border-deep_green/20 text-center">
                <div className="text-slatebluegray text-sm">Loading previous usage data...</div>
              </div>
            )}
            {!loading && previousUsage && previousUsage.hasUsageHistory && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-deep_green/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-main_dark">{previousUsage.lastUsageHours.toFixed(1)}h</div>
                  <div className="text-xs text-slatebluegray">Last Usage Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-main_dark">{previousUsage.lastUsageDate}</div>
                  <div className="text-xs text-slatebluegray">Last Usage Date</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-main_dark">{previousUsage.lastUsageLocation}</div>
                  <div className="text-xs text-slatebluegray">Last Location</div>
                </div>
              </div>
            )}
            {!loading && previousUsage && !previousUsage.hasUsageHistory && (
              <div className="mt-4 pt-4 border-t border-deep_green/20 text-center">
                <div className="text-slatebluegray text-sm">No previous usage recorded for this equipment</div>
              </div>
            )}
          </div>
        </div>

        {/* Usage Update Form */}
        <form onSubmit={handleSubmit} className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-150 ${
                    !isTimeRangeValid() 
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-web_yellow focus:border-transparent'
                  }`}
                  required
                />
                {!isTimeRangeValid() && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    End time must be after start time
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Hours Used * <span className="text-xs text-gray-500">(Auto-calculated)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.hoursUsed}
                  readOnly
                  placeholder="Enter start and end times to calculate"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
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
    </>
  );
};

export default EquipmentUsageUpdate;







