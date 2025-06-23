import React, { useState } from 'react';
import { Upload, Calendar, User, AlertCircle } from 'lucide-react';

const MaintenanceMaterialRequest = () => {
  const [formData, setFormData] = useState({
    equipmentType: '',
    equipmentName: '',
    materialPartName: '',
    quantity: '',
    requestingDate: '',
    urgency: 'Medium',
    attachments: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">M</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Material Request</h1>
          </div>
          <p className="text-gray-600">Submit your maintenance requests for maintenance tasks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Maintenance Material Request Form</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Equipment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipment Type
                  </label>
                  <select
                    name="equipmentType"
                    value={formData.equipmentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  >
                    <option value="">Select Equipment Type</option>
                    <option value="hvac">HVAC System</option>
                    <option value="electrical">Electrical Equipment</option>
                    <option value="plumbing">Plumbing System</option>
                    <option value="mechanical">Mechanical Equipment</option>
                  </select>
                </div>

                {/* Equipment Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipment Name
                  </label>
                  <select
                    name="equipmentName"
                    value={formData.equipmentName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  >
                    <option value="">Select Equipment</option>
                    <option value="air-conditioner">Air Conditioner</option>
                    <option value="generator">Generator</option>
                    <option value="pump">Water Pump</option>
                    <option value="boiler">Boiler</option>
                  </select>
                </div>

                {/* Material/Part Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material/Part Name
                  </label>
                  <select
                    name="materialPartName"
                    value={formData.materialPartName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  >
                    <option value="">Select Material/Part</option>
                    <option value="filter">Air Filter</option>
                    <option value="belt">Drive Belt</option>
                    <option value="gasket">Gasket</option>
                    <option value="valve">Control Valve</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  />
                </div>

                {/* Requesting Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requesting Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="requestingDate"
                      value={formData.requestingDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Urgency
                  </label>
                  <div className="flex space-x-4">
                    {['High', 'Medium', 'Low'].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="urgency"
                          value={level}
                          checked={formData.urgency === level}
                          onChange={handleInputChange}
                          className="mr-2 text-teal-700 focus:ring-teal-700"
                        />
                        <span 
                          className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                            level === 'High' ? 'bg-red-100 text-red-800' :
                            level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          } ${formData.urgency === level ? 'ring-2 ring-offset-1 ring-teal-700' : ''}`}
                        >
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-700 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG files</p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="mt-4 inline-block bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-teal-800 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                  {formData.attachments && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {formData.attachments.name}
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-yellow-400 text-yellow-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Request Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Request Preview</h3>
                <span className="bg-teal-700 text-white px-2 py-1 rounded text-xs font-medium">
                  PREVIEW
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Request ID</p>
                  <p className="text-sm text-gray-900">MR-2025-0002</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Equipment</p>
                  <p className="text-sm text-gray-900">
                    {formData.equipmentName || 'Not selected'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Material</p>
                  <p className="text-sm text-gray-900">
                    {formData.materialPartName || 'Not selected'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Quantity</p>
                  <p className="text-sm text-gray-900">
                    {formData.quantity || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Requested by</p>
                  <p className="text-sm text-gray-900">John Doe</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Priority</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    formData.urgency === 'High' ? 'bg-red-100 text-red-800' :
                    formData.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {formData.urgency}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>John Doe</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>Maintenance Department</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMaterialRequest;
