import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar, Send, Clock, Phone, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Material_Request_Form() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project: '',
    phase: '',
    requestDate: '2025-06-20',
    notes: '',
    priority: 'Medium'
  });
  const [materials, setMaterials] = useState([]);
  const [materialQuantities, setMaterialQuantities] = useState({});

  // Auto-fill project and phase if passed via router state
  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        project: location.state.project || prev.project,
        phase: location.state.phase || prev.phase
      }));
    }
  }, [location.state]);

  // Fetch materials for the selected phase
  useEffect(() => {
    if (formData.phase) {
      // Temporarily use mock data while debugging backend issue
      const mockMaterials = [
        { materialId: 1, materialName: 'Portland Cement', unitOfMeasurement: 'Bags', quantity: 200 },
        { materialId: 2, materialName: 'Steel Rebar', unitOfMeasurement: 'Meters', quantity: 500 },
        { materialId: 3, materialName: 'Concrete Blocks', unitOfMeasurement: 'Units', quantity: 1500 },
        { materialId: 4, materialName: 'Sand', unitOfMeasurement: 'Cubic Yards', quantity: 10 }
      ];
      setMaterials(mockMaterials);
      
      // Auto-fill mock quantities
      const quantities = {};
      mockMaterials.forEach(material => {
        if (material.quantity) {
          quantities[material.materialId] = material.quantity.toString();
        }
      });
      setMaterialQuantities(quantities);

      // TODO: Uncomment this when backend issue is fixed
      /*
      const fetchMaterials = async () => {
        try {
          const response = await axios.get(`http://localhost:5454/api/projects/${formData.project}/phases/${formData.phase}/materials`);
          setMaterials(response.data);
          
          // Auto-fill quantities from phase materials
          const quantities = {};
          response.data.forEach(material => {
            if (material.quantity) {
              quantities[material.materialId] = material.quantity.toString();
            }
          });
          setMaterialQuantities(quantities);
        } catch (error) {
          console.error('Error fetching materials:', error);
        }
      };
      fetchMaterials();
      */
    }
  }, [formData.phase, formData.project]);

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
    
    // Filter out materials with zero or empty quantities
    const selectedMaterials = materials
      .filter(material => materialQuantities[material.materialId] && materialQuantities[material.materialId] > 0)
      .map(material => ({
        materialId: material.materialId,
        materialName: material.materialName,
        quantity: materialQuantities[material.materialId],
        unitOfMeasurement: material.unitOfMeasurement
      }));

    if (selectedMaterials.length === 0) {
      alert('Please select at least one material with quantity.');
      return;
    }

    const requestData = {
      ...formData,
      materials: selectedMaterials
    };

    try {
      await axios.post('http://localhost:5454/api/material-requests/create', requestData);
      alert('Material request submitted successfully!');
      // Redirect back to the Material Request List page
      navigate('/material-request-list');
    } catch (error) {
      alert('Failed to submit material request.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: '#F3F4F6' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Material Request Form</h1>
            <p className="text-sm text-gray-600 mt-2">Submit your material requirements for project phases</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Project and Phase Display (Read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <div className="px-4 py-3 bg-gray-100 rounded-lg">
                  {formData.project || 'Not selected'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phase</label>
                <div className="px-4 py-3 bg-gray-100 rounded-lg">
                  {formData.phase || 'Not selected'}
                </div>
              </div>
            </div>

            {/* Materials List */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#EFC11A' }}></span>
                Select Materials and Quantities
              </label>
              
              {/* Use BOQ Quantities Button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleUseBOQQuantities}
                  className="px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
                  style={{ backgroundColor: '#236571' }}
                >
                  Use BOQ Quantities
                </button>
                <p className="text-xs text-gray-500 mt-1">Auto-fill quantities from Bill of Quantities</p>
              </div>
              
              <div className="space-y-3">
                {materials.map((material) => (
                  <div key={material.materialId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{material.materialName}</h3>
                      <p className="text-sm text-gray-500">Unit: {material.unitOfMeasurement}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={materialQuantities[material.materialId] || ''}
                        onChange={(e) => handleMaterialQuantityChange(material.materialId, e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                        style={{ focusRingColor: '#236571' }}
                        min="0"
                      />
                      <span className="text-sm text-gray-500">{material.unitOfMeasurement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Date */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#EFC11A' }}></span>
                Request Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.requestDate}
                  onChange={(e) => handleInputChange('requestDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ focusRingColor: '#236571' }}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#EFC11A' }}></span>
                Additional Notes (Optional)
              </label>
              <textarea
                placeholder="Add any special requirements or notes..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent resize-none"
                style={{ focusRingColor: '#236571' }}
              />
            </div>

            {/* Priority Level */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#EFC11A' }}></span>
                Priority Level
              </label>
              <div className="flex gap-6">
                {['Low', 'Medium', 'High', 'Urgent'].map((priority) => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#EFC11A', color: '#000' }}
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Request
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Processing Time */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#EFC11A' }}>
                <Clock className="w-4 h-4 text-gray-800" />
              </div>
              <h3 className="font-semibold text-gray-900">Processing Time</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">Standard requests: 2-3 business days</p>
            <p className="text-sm text-gray-600">Urgent requests: Same day</p>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#236571' }}>
                <Phone className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Need Help?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">Call: (555) 123-4567</p>
            <p className="text-sm text-gray-600">Email: materials@company.com</p>
          </div>

          {/* Approval Process */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-green-100">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Approval Process</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">Auto-approved: Under $1,000</p>
            <p className="text-sm text-gray-600">Manager approval: Over $1,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}