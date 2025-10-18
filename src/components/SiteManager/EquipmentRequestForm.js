import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Send,
  Package
} from 'lucide-react';

const EquipmentRequestForm = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  const selectedEquipmentIds = location.state?.selectedEquipment || [];

  const [formData, setFormData] = useState({
    projectId: projectId,
    requestedStartDate: '',
    requestedEndDate: '',
    priority: 'Medium',
    requestPurpose: '',
    expectedLocation: '',
    additionalNotes: '',
    equipmentIds: selectedEquipmentIds
  });

  const [selectedEquipmentDetails, setSelectedEquipmentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Mock data for selected equipment details
  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockEquipmentDetails = [
          {
            id: 1,
            name: 'Hydraulic Excavator CAT 320',
            category: 'Heavy Machinery',
            brand: 'Caterpillar',
            model: 'CAT 320'
          },
          {
            id: 2,
            name: 'Concrete Mixer Truck',
            category: 'Transport Vehicle',
            brand: 'Volvo',
            model: 'FM 400'
          }
        ].filter(item => selectedEquipmentIds.includes(item.id));
        
        setSelectedEquipmentDetails(mockEquipmentDetails);
      } catch (error) {
        console.error('Error fetching equipment details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedEquipmentIds.length > 0) {
      fetchEquipmentDetails();
    } else {
      setLoading(false);
    }
  }, [selectedEquipmentIds]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.requestedStartDate || !formData.requestedEndDate || !formData.requestPurpose) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.requestedStartDate) >= new Date(formData.requestedEndDate)) {
      alert('End date must be after start date');
      return;
    }

    setSubmitting(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - navigate to confirmation or back to project
      alert('Equipment request submitted successfully!');
      navigate(`/site-manager/project-equipment/${projectId}`);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep_green mx-auto mb-4"></div>
          <p className="text-slatebluegray">Loading equipment details...</p>
        </div>
      </div>
    );
  }

  if (selectedEquipmentIds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-main_dark mb-2">No Equipment Selected</h3>
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
              <h1 className="text-3xl font-bold text-main_dark">Equipment Request Form</h1>
              <p className="text-slatebluegray text-lg">Submit your equipment request for approval</p>
            </div>
          </div>

          {/* Selected Equipment Summary */}
          <div className="bg-gradient-to-r from-deep_green/10 to-web_yellow/10 border border-deep_green/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-deep_green" />
              <h2 className="text-xl font-semibold text-main_dark">Selected Equipment</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEquipmentDetails.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 border border-deep_green/20">
                  <h3 className="font-semibold text-main_dark">{item.name}</h3>
                  <p className="text-slatebluegray text-sm">{item.brand} {item.model}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-deep_green/20 text-deep_green text-xs rounded-full">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Requested Start Date *
                </label>
                <input
                  type="date"
                  value={formData.requestedStartDate}
                  onChange={(e) => handleInputChange('requestedStartDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Requested End Date *
                </label>
                <input
                  type="date"
                  value={formData.requestedEndDate}
                  onChange={(e) => handleInputChange('requestedEndDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                />
              </div>
            </div>

            {/* Priority and Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Priority Level
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                    {formData.priority} Priority
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-main_dark mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Expected Location on Site
                </label>
                <input
                  type="text"
                  value={formData.expectedLocation}
                  onChange={(e) => handleInputChange('expectedLocation', e.target.value)}
                  placeholder="e.g., Zone A - Foundation, Building 2, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Purpose of Equipment Usage *
              </label>
              <textarea
                value={formData.requestPurpose}
                onChange={(e) => handleInputChange('requestPurpose', e.target.value)}
                placeholder="Describe what work will be done with this equipment..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                required
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Any special requirements, operator preferences, or additional information..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
              />
            </div>

            {/* Request Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-main_dark mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-deep_green" />
                Request Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slatebluegray">Equipment Items:</span>
                  <span className="ml-2 font-medium text-main_dark">{selectedEquipmentDetails.length}</span>
                </div>
                <div>
                  <span className="text-slatebluegray">Duration:</span>
                  <span className="ml-2 font-medium text-main_dark">
                    {formData.requestedStartDate && formData.requestedEndDate 
                      ? `${Math.ceil((new Date(formData.requestedEndDate) - new Date(formData.requestedStartDate)) / (1000 * 60 * 60 * 24))} days`
                      : 'Not specified'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-slatebluegray">Priority:</span>
                  <span className={`ml-2 font-medium ${getPriorityColor(formData.priority).replace('bg-', 'text-').replace('100', '800')}`}>
                    {formData.priority}
                  </span>
                </div>
                <div>
                  <span className="text-slatebluegray">Status:</span>
                  <span className="ml-2 font-medium text-deep_green">Pending Approval</span>
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
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

export default EquipmentRequestForm;








