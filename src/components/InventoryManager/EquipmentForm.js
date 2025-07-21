import React, { useState } from 'react';
import { Calendar, Settings, DollarSign, MapPin, FileText, Package, Wrench } from 'lucide-react';

const EquipmentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    condition: '',
    purchaseDate: '',
    purchaseSource: '',
    purchaseCost: '',
    location: '',
    status: '',
    notes: '',
    nextMaintenance: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      type: '',
      name: '',
      category: '',
      brand: '',
      model: '',
      serialNumber: '',
      condition: '',
      purchaseDate: '',
      purchaseSource: '',
      purchaseCost: '',
      location: '',
      status: '',
      notes: '',
      nextMaintenance: '',
    });
  };

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-main_dark mb-2">Add New Equipment</h1>
        <p className="text-slatebluegray text-base">Register new machinery, tools, or vehicles to your inventory</p>
      </div>

      {/* Form */}
      <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Basic Equipment Information */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Basic Equipment Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Equipment Type
                </label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                >
                  <option value="">Select equipment type</option>
                  <option value="Machine">Machine</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Tool">Tool</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Equipment Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter equipment name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Category
                </label>
                <input 
                  type="text" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Brand
                </label>
                <input 
                  type="text" 
                  name="brand" 
                  value={formData.brand} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Model
                </label>
                <input 
                  type="text" 
                  name="model" 
                  value={formData.model} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter model number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Serial Number / VIN
                </label>
                <input 
                  type="text" 
                  name="serialNumber" 
                  value={formData.serialNumber} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter serial number or VIN"
                />
              </div>
            </div>
          </div>

          {/* Purchase Information */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Purchase Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Condition
                </label>
                <select 
                  name="condition" 
                  value={formData.condition} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                >
                  <option value="">Select condition</option>
                  <option value="Brand New">Brand New</option>
                  <option value="Used - Excellent">Used - Excellent</option>
                  <option value="Used - Good">Used - Good</option>
                  <option value="Used - Fair">Used - Fair</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Purchase Date
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="purchaseDate" 
                    value={formData.purchaseDate} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  />
                  <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Purchase Source
                </label>
                <input 
                  type="text" 
                  name="purchaseSource" 
                  value={formData.purchaseSource} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter supplier or source"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Purchase Cost (LKR)
                </label>
                <input 
                  type="number" 
                  name="purchaseCost" 
                  value={formData.purchaseCost} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter cost in LKR"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Location & Status */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Location & Status</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Current Location
                </label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter current location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Status
                </label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                >
                  <option value="">Select status</option>
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Disposed">Disposed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Next Maintenance Due
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="nextMaintenance" 
                    value={formData.nextMaintenance} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  />
                  <Wrench className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Additional Information</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Notes
              </label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                placeholder="Enter any additional notes, specifications, or remarks..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button 
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-lg text-slatebluegray hover:text-main_dark font-semibold hover:bg-gray-50 transition-all duration-150"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark"></div>
                    Adding Equipment...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    Add Equipment
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-main_dark">Auto-Tracking</h3>
          </div>
          <p className="text-sm text-slatebluegray">
            Equipment is automatically tracked and monitored once added to the system.
          </p>
        </div>

        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Wrench className="w-5 h-5 text-main_dark" />
            </div>
            <h3 className="font-semibold text-main_dark">Maintenance Alerts</h3>
          </div>
          <p className="text-sm text-slatebluegray">
            Receive automated reminders for scheduled maintenance activities.
          </p>
        </div>

        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-light_brown via-light_brown to-light_brown/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-main_dark">Documentation</h3>
          </div>
          <p className="text-sm text-slatebluegray">
            All equipment records are maintained with complete documentation history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EquipmentForm;
