import React, { useState } from 'react';

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
    { id: 1, description: 'Steel Rebar X4', unit: '--', quantity: 30, unitPrice: 850.60, total: 42500.00 },
    { id: 2, description: 'Concrete Mix C25', unit: '--', quantity: 120, unitPrice: 95.08, total: 11400.00 },
    { id: 3, description: 'Formwork Panels', unit: '--', quantity: 200, unitPrice: 35.00, total: 7000.00 }
  ]);

  const subtotal = materials.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.0859; // 8.59%
  const shipping = 450.00;
  const total = subtotal + tax + shipping;

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      unit: '--',
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

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Purchase Order</h1>
          <p className="text-gray-600">Select project, review materials, and submit your purchase order</p>
        </div>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          ← Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Selection */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orderData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                >
                  <option>Select Project</option>
                  <option>Downtown Office Complex</option>
                  <option>Residential Tower A</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phase</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orderData.phase}
                  onChange={(e) => handleInputChange('phase', e.target.value)}
                >
                  <option>Select Phase</option>
                  <option>Foundation</option>
                  <option>Framing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orderData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                >
                  <option>Select Supplier</option>
                  <option>BuildMart Supplies Inc.</option>
                  <option>Construction Materials Co.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orderData.expectedDelivery}
                  onChange={(e) => handleInputChange('expectedDelivery', e.target.value)}
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>
          </div>

          {/* Materials & Quantities */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Materials & Quantities</h3>
              <button
                onClick={addNewItem}
                className="text-black font-semibold px-4 py-2 rounded-md text-sm flex items-center gap-2"
                style={{ backgroundColor: '#EFC11A' }}
                >
                + Add Item
                </button>

            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Item Description</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Unit</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Quantity</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Unit Price</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Total</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <tr key={material.id} className="border-b">
                      <td className="py-3">
                        <input
                          type="text"
                          value={material.description}
                          onChange={(e) => updateMaterial(material.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="py-3">
                        <select
                          value={material.unit}
                          onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
                          className="w-16 px-1 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option>--</option>
                          <option>kg</option>
                          <option>m³</option>
                          <option>pcs</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          value={material.unitPrice}
                          onChange={(e) => updateMaterial(material.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          step="0.01"
                        />
                      </td>
                      <td className="py-3 font-medium">
                        ${material.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => removeMaterial(material.id)}
                          className="text-red-500 hover:text-red-700 px-2 py-1"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any special delivery instructions or requirements..."
                  value={orderData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={orderData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  >
                    <option>Net 30 Days</option>
                    <option>Net 15 Days</option>
                    <option>Net 60 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={orderData.priorityLevel}
                    onChange={(e) => handleInputChange('priorityLevel', e.target.value)}
                  >
                    <option>Standard</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Project:</span>
                <span className="font-medium">Downtown Office Complex</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phase:</span>
                <span className="font-medium">Foundation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier:</span>
                <span className="font-medium">BuildMart Supplies Inc.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Delivery:</span>
                <span className="font-medium">Dec 15, 2024</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8.5%):</span>
                <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>${shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                className="w-full text-black font-semibold py-3 rounded-lg"
                style={{ backgroundColor: '#EFC11A' }}
                >
                🔄 Submit Purchase Order
                </button>

              <button className="w-full border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                📄 Save as Draft
              </button>
            </div>

            <div className="mt-4 p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
              <div className="flex items-start">
                <span className="text-orange-500 mr-2">⚠️</span>
                <div className="text-sm">
                  <span className="font-medium text-orange-800">Note:</span>
                  <span className="text-orange-700"> This purchase order will require approval from the project manager before submission to the supplier.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create_Purchase_Order;