import React, { useState } from 'react';
import { Calendar, Package, FileText, User, AlertTriangle, BarChart3 } from 'lucide-react';

const AddMaterialForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantity: '',
    unit: '',
    reorderLevel: '',
    purchaseDate: '',
    expirationDate: '',
    supplier: '',
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
      name: '',
      category: '',
      description: '',
      quantity: '',
      unit: '',
      reorderLevel: '',
      purchaseDate: '',
      expirationDate: '',
      supplier: '',
    });
  };

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-main_dark mb-2">Add New Inventory Material</h1>
        <p className="text-slatebluegray text-base">Register new materials, supplies, and consumables to your inventory</p>
      </div>

      {/* Form */}
      <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Basic Material Information */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Basic Material Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Material Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter material name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Category
                </label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Oil">Oil</option>
                  <option value="Lubricant">Lubricant</option>
                  <option value="Spare Part">Spare Part</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                  <option value="Consumable">Consumable</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Description
                </label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter detailed description of the material..."
                />
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Stock Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Quantity in Stock
                </label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={formData.quantity} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter current quantity"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Unit of Measure
                </label>
                <select 
                  name="unit" 
                  value={formData.unit} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                >
                  <option value="">Select unit</option>
                  <option value="Liters">Liters</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Kg">Kilograms</option>
                  <option value="Meters">Meters</option>
                  <option value="Boxes">Boxes</option>
                  <option value="Gallons">Gallons</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Reorder Level
                </label>
                <input 
                  type="number" 
                  name="reorderLevel" 
                  value={formData.reorderLevel} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter minimum stock level for reorder alerts"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Date Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Expiration Date
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="expirationDate" 
                    value={formData.expirationDate} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  />
                  <AlertTriangle className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Supplier Information</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Supplier Name
              </label>
              <input 
                type="text" 
                name="supplier" 
                value={formData.supplier} 
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                placeholder="Enter supplier name or company"
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
                    Adding Material...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    Add Material
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
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-main_dark">Stock Tracking</h3>
          </div>
          <p className="text-sm text-slatebluegray">
            Real-time inventory tracking with automatic stock level monitoring and alerts.
          </p>
        </div>

        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <AlertTriangle className="w-5 h-5 text-main_dark" />
            </div>
            <h3 className="font-semibold text-main_dark">Expiry Alerts</h3>
          </div>
          <p className="text-sm text-slatebluegray">
            Automated notifications for materials approaching expiration dates.
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
            Complete material records with purchase history and usage tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialForm;
