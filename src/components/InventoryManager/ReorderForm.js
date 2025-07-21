import React, { useState } from 'react';
import { Calendar, Package, User, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

const ReorderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    materialName: '',
    currentStock: '',
    reorderLevel: '',
    reorderQuantity: '',
    supplierName: '',
    expectedDeliveryDate: '',
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
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        alert('Reorder request submitted successfully!');
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      alert('Failed to submit reorder request.');
    }
  };

  const handleReset = () => {
    setFormData({
      materialName: '',
      currentStock: '',
      reorderLevel: '',
      reorderQuantity: '',
      supplierName: '',
      expectedDeliveryDate: '',
    });
  };

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-main_dark mb-2">Reorder Inventory Material</h1>
        <p className="text-slatebluegray text-base">Submit a reorder request for low stock materials</p>
      </div>

      {/* Form */}
      <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Material Information */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Material Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Material Name
                </label>
                <input
                  type="text"
                  name="materialName"
                  value={formData.materialName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter material name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Current Stock
                </label>
                <input
                  type="number"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter current stock quantity"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Reorder Level
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter minimum stock level"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Reorder Quantity
                </label>
                <input
                  type="number"
                  name="reorderQuantity"
                  value={formData.reorderQuantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter quantity to reorder"
                  required
                />
              </div>
            </div>
          </div>

          {/* Supplier & Delivery Information */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Supplier & Delivery Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter supplier name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Expected Delivery Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="expectedDeliveryDate"
                    value={formData.expectedDeliveryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                    required
                  />
                  <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                </div>
              </div>
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Submit Reorder
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Processing Time */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <AlertCircle className="w-5 h-5 text-main_dark" />
            </div>
            <h3 className="font-semibold text-main_dark">Processing Time</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-deep_green rounded-full"></span>
              Standard orders: 3-5 business days
            </p>
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-web_yellow rounded-full"></span>
              Urgent orders: 1-2 business days
            </p>
          </div>
        </div>

        {/* Approval Process */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-main_dark">Approval Process</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-deep_green rounded-full"></span>
              Auto-approved: Under $500
            </p>
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-web_yellow rounded-full"></span>
              Manager approval: Over $500
            </p>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-light_brown via-light_brown to-light_brown/80 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-main_dark">Delivery Options</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-deep_green rounded-full"></span>
              Standard delivery: Free
            </p>
            <p className="text-sm text-slatebluegray flex items-center gap-2">
              <span className="w-2 h-2 bg-web_yellow rounded-full"></span>
              Express delivery: Additional cost
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReorderForm;
