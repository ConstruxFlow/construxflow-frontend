// src/components/InventoryManager/forms/ReorderForm.js
import React, { useState } from 'react';

const ReorderForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    materialName: '',
    currentStock: '',
    reorderLevel: '',
    reorderQuantity: '',
    supplierName: '',
    expectedDeliveryDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Material Name</label>
          <input
            type="text"
            name="materialName"
            value={formData.materialName}
            onChange={handleChange}
            className="w-full border border-[#E4E4E4] rounded p-2"
          />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Current Stock</label>
          <input
            type="number"
            name="currentStock"
            value={formData.currentStock}
            onChange={handleChange}
            className="w-full border border-[#E4E4E4] rounded p-2"
          />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Reorder Level</label>
          <input
            type="number"
            name="reorderLevel"
            value={formData.reorderLevel}
            onChange={handleChange}
            className="w-full border border-[#E4E4E4] rounded p-2"
          />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Reorder Quantity</label>
          <input
            type="number"
            name="reorderQuantity"
            value={formData.reorderQuantity}
            onChange={handleChange}
            className="w-full border border-[#E4E4E4] rounded p-2"
          />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Supplier Name</label>
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            className="w-full border border-[#E4E4E4] rounded p-2"
          />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Expected Delivery Date</label>
          <input
            type="date"
            name="expectedDeliveryDate"
            value={formData.expectedDeliveryDate}
            onChange={handleChange}
            className="w-full border border-[#E4E4E4] rounded p-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button type="reset" className="bg-gray-200 text-[#2E2F34] px-4 py-2 rounded">Reset</button>
        <button type="submit" className="bg-[#efc11a] text-white px-4 py-2 rounded">Submit Reorder</button>
      </div>
    </form>
  );
};

export default ReorderForm;
