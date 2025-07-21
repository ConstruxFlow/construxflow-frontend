import React, { useState, useEffect } from 'react';
import { Calendar, Send, Clock, Phone, CheckCircle, FileText, AlertCircle, Package } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Material_Request_Form({ project: propProject, phase: propPhase, materials: propMaterials }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project: propProject || '',
    phase: propPhase || '',
    requestDate: '2025-06-20',
    notes: '',
    priority: 'Medium'
  });
  const [materials, setMaterials] = useState(propMaterials || []);
  const [materialQuantities, setMaterialQuantities] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log(materials);
  

  // Auto-fill project and phase if passed via router state or props
  useEffect(() => {
    if (location.state || propProject || propPhase) {
      setFormData(prev => ({
        ...prev,
        project: (location.state && location.state.project) || propProject || prev.project,
        phase: (location.state && location.state.phase) || propPhase || prev.phase
      }));
    }
  }, [location.state, propProject, propPhase]);

  // If materials are passed as props, use them and set quantities
  useEffect(() => {
    if (propMaterials && propMaterials.length > 0) {
      setMaterials(propMaterials);
      const quantities = {};
      propMaterials.forEach(material => {
        if (material.quantity) {
          quantities[material.materialId] = material.quantity.toString();
        }
      });
      setMaterialQuantities(quantities);
    }
  }, [propMaterials]);

  // If no propMaterials, fallback to fetching or mock data
  useEffect(() => {
    if ((!propMaterials || propMaterials.length === 0) && formData.phase) {
      // Temporarily use mock data while debugging backend issue
      const mockMaterials = [
        { materialId: 1, materialName: 'Portland Cement', unitOfMeasurement: 'Bags', quantity: 200 },
        { materialId: 2, materialName: 'Steel Rebar', unitOfMeasurement: 'Meters', quantity: 500 },
        { materialId: 3, materialName: 'Concrete Blocks', unitOfMeasurement: 'Units', quantity: 1500 },
        { materialId: 4, materialName: 'Sand', unitOfMeasurement: 'Cubic Yards', quantity: 10 }
      ];
      setMaterials(mockMaterials);
      const quantities = {};
      mockMaterials.forEach(material => {
        if (material.quantity) {
          quantities[material.materialId] = material.quantity.toString();
        }
      });
      setMaterialQuantities(quantities);
    }
  }, [formData.phase, formData.project, propMaterials]);

  console.log('Form Data:', formData);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMaterialQuantityChange = (materialId, quantity) => {
    setMaterialQuantities(prev => ({
      ...prev,
      [materialId]: quantity
    }));
  };

  const handleUseBOQQuantities = () => {
    const quantities = {};
    materials.forEach(material => {
      if (material.quantity) {
        quantities[material.materialId] = material.quantity.toString();
      }
    });
    setMaterialQuantities(quantities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Filter out materials with zero or empty quantities
    const selectedMaterials = materials
      .filter(material => materialQuantities[material.materialId] && materialQuantities[material.materialId] > 0)
      .map(material => ({
        materialId: Number(
          typeof material.materialId === "string"
            ? material.materialId.replace(/[^0-9]/g, "")
            : material.materialId
        ),
        materialName: material.materialName,
        quantity: Number(materialQuantities[material.materialId]),
        unitOfMeasurement: material.unitOfMeasurement,
        unitPrice: material.unitPrice
      }));

    if (selectedMaterials.length === 0) {
      alert('Please select at least one material with quantity.');
      setIsSubmitting(false);
      return;
    }

    // Prepare payload matching backend DTO
    const requestData = {
      project: formData.project,
      phase: formData.phase,
      requestDate: formData.requestDate,
      notes: formData.notes,
      priority: formData.priority,
      materials: selectedMaterials
    };

    console.log('Submitting material request:', requestData);

    try {
      await axios.post('http://localhost:8080/api/material-requests/create', requestData);
      alert('Material request submitted successfully!');
      // Redirect back to the Material Request List page
      navigate('/material-request-list');
    } catch (error) {
      alert('Failed to submit material request.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-web_yellow bg-web_yellow/10 border-web_yellow/30';
      case 'low': return 'text-deep_green bg-deep_green/10 border-deep_green/30';
      default: return 'text-slatebluegray bg-light_gray/40 border-light_gray';
    }
  };

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-main_dark">Material Request Form</h1>
        </div>
        <p className="text-slatebluegray text-base">Submit your material requirements for project phases</p>
      </div>

      {/* Main Form */}
      <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 mb-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Project and Phase Display */}
          <div>
            <h2 className="text-lg font-semibold text-main_dark mb-6">Project Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">Project</label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-medium text-main_dark">
                  {formData.project || 'Not selected'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">Phase</label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-medium text-main_dark">
                  {formData.phase || 'Not selected'}
                </div>
              </div>
            </div>
          </div>

          {/* Materials Selection */}
          <div>
            <h2 className="text-lg font-semibold text-main_dark mb-6">Select Materials and Quantities</h2>
            
            {/* Use BOQ Quantities Button */}
            <div className="mb-6 p-4 bg-gradient-to-r from-web_yellow/10 to-web_yellow/5 border border-web_yellow/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-main_dark mb-1">Auto-fill from BOQ</h3>
                  <p className="text-sm text-slatebluegray">Use quantities from Bill of Quantities</p>
                </div>
                <button
                  type="button"
                  onClick={handleUseBOQQuantities}
                  className="bg-deep_green hover:bg-deep_green/80 text-white px-4 py-2 rounded-lg font-medium transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Use BOQ Quantities
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {materials.map((material) => (
                <div key={material.materialId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-150 bg-white">
                  <div className="flex-1">
                    <h3 className="font-semibold text-main_dark">{material.materialName}</h3>
                    <p className="text-sm text-slatebluegray">Unit: {material.unitOfMeasurement}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={materialQuantities[material.materialId] || ''}
                      onChange={(e) => handleMaterialQuantityChange(material.materialId, e.target.value)}
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                      min="0"
                    />
                    <span className="text-sm text-slatebluegray font-medium min-w-16">
                      {material.unitOfMeasurement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Request Details */}
          <div>
            <h2 className="text-lg font-semibold text-main_dark mb-6">Request Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Date */}
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Request Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => handleInputChange('requestDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                  />
                  <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-deep_green pointer-events-none" />
                </div>
              </div>

              {/* Priority Level */}
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Low', 'Medium', 'High', 'Urgent'].map((priority) => (
                    <label key={priority} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={formData.priority === priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-4 h-4 text-web_yellow border-gray-300 focus:ring-2 focus:ring-web_yellow"
                      />
                      <span className={`ml-2 text-sm font-medium px-2 py-1 rounded-full border ${getPriorityColor(priority)}`}>
                        {priority}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                placeholder="Add any special requirements or notes..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-6 py-4 bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark mr-2"></div>
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Processing Time */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Clock className="w-5 h-5 text-main_dark" />
            </div>
            <h3 className="font-semibold text-main_dark">Processing Time</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-deep_green rounded-full"></span>
              Standard requests: 2-3 business days
            </p>
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Urgent requests: Same day
            </p>
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-main_dark">Need Help?</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="font-medium">Call:</span> (555) 123-4567
            </p>
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="font-medium">Email:</span> materials@company.com
            </p>
          </div>
        </div>

        {/* Approval Process */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-light_brown via-light_brown to-light_brown/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-main_dark">Approval Process</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-deep_green rounded-full"></span>
              Auto-approved: Under $1,000
            </p>
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-web_yellow rounded-full"></span>
              Manager approval: Over $1,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
