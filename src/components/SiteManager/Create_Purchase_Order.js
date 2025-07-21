import React, { useState } from 'react';
import { Plus, Trash2, Save, Send, ArrowLeft, Calendar, Package, Building, User, FileText, AlertTriangle } from 'lucide-react';

const Create_Purchase_Order = () => {
  const [orderData, setOrderData] = useState({
    project: '',
    phase: '',
    supplier: '',
    expectedDelivery: '',
    paymentTerms: 'Net 30 Days',
    priorityLevel: 'Standard',
    specialInstructions: ''
  });

  const [materials, setMaterials] = useState([
    { id: 1, description: 'Steel Rebar X4', unit: 'kg', quantity: 30, unitPrice: 850.60, total: 25518.00 },
    { id: 2, description: 'Concrete Mix C25', unit: 'm³', quantity: 120, unitPrice: 95.08, total: 11409.60 },
    { id: 3, description: 'Formwork Panels', unit: 'pcs', quantity: 200, unitPrice: 35.00, total: 7000.00 }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const subtotal = materials.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.085; // 8.5%
  const shipping = 450.00;
  const total = subtotal + tax + shipping;

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      unit: 'pcs',
      quantity: 0,
      unitPrice: 0,
      total: 0
    };
    setMaterials([...materials, newItem]);
  };

  const updateMaterial = (id, field, value) => {
    setMaterials(materials.map(material => {
      if (material.id === id) {
        const updated = { ...material, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return material;
    }));
  };

  const removeMaterial = (id) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Purchase order submitted successfully!');
    }, 2000);
  };

  const handleSaveDraft = async () => {
    setIsDraft(true);
    // Simulate API call
    setTimeout(() => {
      setIsDraft(false);
      alert('Purchase order saved as draft!');
    }, 1500);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'standard': return 'bg-deep_green/10 text-deep_green border-deep_green/20';
      default: return 'bg-light_gray/40 text-slatebluegray border-light_gray';
    }
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Create Purchase Order
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Select project, review materials, and submit your purchase order
              </p>
            </div>
            <button className="flex items-center gap-2 text-slatebluegray hover:text-main_dark font-medium transition-colors duration-150">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Selection */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-deep_green" />
                  <h3 className="text-lg font-semibold text-main_dark">Project Selection</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slatebluegray mb-2">
                      Project <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      value={orderData.project}
                      onChange={(e) => handleInputChange('project', e.target.value)}
                    >
                      <option value="">Select Project</option>
                      <option value="downtown-office">Downtown Office Complex</option>
                      <option value="residential-tower">Residential Tower A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slatebluegray mb-2">
                      Phase <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      value={orderData.phase}
                      onChange={(e) => handleInputChange('phase', e.target.value)}
                    >
                      <option value="">Select Phase</option>
                      <option value="foundation">Foundation</option>
                      <option value="framing">Framing</option>
                      <option value="finishing">Finishing</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Supplier Information */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-deep_green" />
                  <h3 className="text-lg font-semibold text-main_dark">Supplier Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slatebluegray mb-2">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      value={orderData.supplier}
                      onChange={(e) => handleInputChange('supplier', e.target.value)}
                    >
                      <option value="">Select Supplier</option>
                      <option value="buildmart">BuildMart Supplies Inc.</option>
                      <option value="construction-materials">Construction Materials Co.</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slatebluegray mb-2">
                      Expected Delivery <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                        value={orderData.expectedDelivery}
                        onChange={(e) => handleInputChange('expectedDelivery', e.target.value)}
                      />
                      <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-deep_green pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials & Quantities */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-deep_green" />
                    <h3 className="text-lg font-semibold text-main_dark">Materials & Quantities</h3>
                  </div>
                  <button
                    onClick={addNewItem}
                    className="bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
                
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-light_brown/30">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Item Description</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Unit</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Quantity</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Unit Price</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Total</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {materials.map((material) => (
                          <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={material.description}
                                onChange={(e) => updateMaterial(material.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                                placeholder="Item description"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={material.unit}
                                onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
                                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                              >
                                <option value="pcs">pcs</option>
                                <option value="kg">kg</option>
                                <option value="m³">m³</option>
                                <option value="tons">tons</option>
                                <option value="bags">bags</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={material.quantity}
                                onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={material.unitPrice}
                                onChange={(e) => updateMaterial(material.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                                step="0.01"
                              />
                            </td>
                            <td className="px-4 py-3 font-semibold text-main_dark">
                              ${material.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => removeMaterial(material.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden divide-y divide-gray-200">
                    {materials.map((material) => (
                      <div key={material.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={material.description}
                              onChange={(e) => updateMaterial(material.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent mb-2"
                              placeholder="Item description"
                            />
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="number"
                                value={material.quantity}
                                onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Qty"
                              />
                              <select
                                value={material.unit}
                                onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="pcs">pcs</option>
                                <option value="kg">kg</option>
                                <option value="m³">m³</option>
                                <option value="tons">tons</option>
                                <option value="bags">bags</option>
                              </select>
                              <input
                                type="number"
                                value={material.unitPrice}
                                onChange={(e) => updateMaterial(material.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                                step="0.01"
                                placeholder="Price"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeMaterial(material.id)}
                            className="text-red-600 hover:text-red-800 transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-main_dark">
                            Total: ${material.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-deep_green" />
                  <h3 className="text-lg font-semibold text-main_dark">Additional Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slatebluegray mb-2">Special Instructions</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150 resize-none"
                      placeholder="Enter any special delivery instructions or requirements..."
                      value={orderData.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-2">Payment Terms</label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                        value={orderData.paymentTerms}
                        onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                      >
                        <option value="Net 30 Days">Net 30 Days</option>
                        <option value="Net 15 Days">Net 15 Days</option>
                        <option value="Net 60 Days">Net 60 Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slatebluegray mb-2">Priority Level</label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                        value={orderData.priorityLevel}
                        onChange={(e) => handleInputChange('priorityLevel', e.target.value)}
                      >
                        <option value="Standard">Standard</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-slatebluegray">Project:</span>
                    <span className="font-medium text-main_dark">
                      {orderData.project ? 'Downtown Office Complex' : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slatebluegray">Phase:</span>
                    <span className="font-medium text-main_dark">
                      {orderData.phase ? 'Foundation' : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slatebluegray">Supplier:</span>
                    <span className="font-medium text-main_dark">
                      {orderData.supplier ? 'BuildMart Supplies Inc.' : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slatebluegray">Expected Delivery:</span>
                    <span className="font-medium text-main_dark">
                      {orderData.expectedDelivery || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slatebluegray">Priority:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(orderData.priorityLevel)}`}>
                      {orderData.priorityLevel}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slatebluegray">Subtotal:</span>
                    <span className="font-medium text-main_dark">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slatebluegray">Tax (8.5%):</span>
                    <span className="font-medium text-main_dark">${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slatebluegray">Shipping:</span>
                    <span className="font-medium text-main_dark">${shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span className="text-main_dark">Total:</span>
                    <span className="text-main_dark">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !orderData.project || !orderData.supplier}
                    className="w-full bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold py-3 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Purchase Order
                      </>
                    )}
                  </button>

                  <button 
                    onClick={handleSaveDraft}
                    disabled={isDraft}
                    className="w-full border border-gray-300 py-3 rounded-lg font-semibold text-slatebluegray hover:text-main_dark hover:bg-gray-50 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDraft ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slatebluegray"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save as Draft
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-orange-50/50 border-l-4 border-orange-400 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-semibold text-orange-800">Note:</span>
                      <span className="text-orange-700"> This purchase order will require approval from the project manager before submission to the supplier.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create_Purchase_Order;
