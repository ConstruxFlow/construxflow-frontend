import React, { useState } from 'react';
import { ChevronDown, Calendar, Send, Clock, Phone, CheckCircle } from 'lucide-react';

export default function Material_Request_Form() {
  const [formData, setFormData] = useState({
    project: '',
    phase: '',
    material: '',
    quantity: '',
    unit: 'Tons',
    requestDate: '2025-06-20',
    notes: '',
    priority: 'Medium'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
          <div className="space-y-6">
            {/* Select Project */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#EFC11A' }}></span>
                Select Project
              </label>
              <div className="relative">
                <select 
                  value={formData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent appearance-none bg-white pr-10"
                  style={{ focusRingColor: '#236571' }}
                >
                  <option value="">Choose a project...</option>
                  <option value="project1">Downtown Office Complex</option>
                  <option value="project2">Residential Tower A</option>
                  <option value="project3">Shopping Mall Renovation</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Select Phase */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#EFC11A' }}></span>
                Select Phase
              </label>
              <div className="relative">
                <select 
                  value={formData.phase}
                  onChange={(e) => handleInputChange('phase', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent appearance-none bg-white pr-10"
                  style={{ focusRingColor: '#236571' }}
                >
                  <option value="">Choose a phase...</option>
                  <option value="foundation">Foundation</option>
                  <option value="structure">Structure</option>
                  <option value="finishing">Finishing</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#EFC11A' }}></span>
                Material
              </label>
              <div className="relative">
                <select 
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent appearance-none bg-white pr-10"
                  style={{ focusRingColor: '#236571' }}
                >
                  <option value="">Select material...</option>
                  <option value="cement">Portland Cement</option>
                  <option value="steel">Steel Rebar</option>
                  <option value="concrete">Concrete Blocks</option>
                  <option value="sand">Sand</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#EFC11A' }}></span>
                Quantity
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ focusRingColor: '#236571' }}
                />
                <div className="relative">
                  <select 
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent appearance-none bg-white pr-10 min-w-[100px]"
                    style={{ focusRingColor: '#236571' }}
                  >
                    <option value="Tons">Tons</option>
                    <option value="Bags">Bags</option>
                    <option value="Meters">Meters</option>
                    <option value="Units">Units</option>
                    <option value="Cubic Yards">Cubic Yards</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
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
              type="button"
              onClick={handleSubmit}
              className="w-full flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#EFC11A', color: '#000' }}
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Request
            </button>
          </div>
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