// src/components/InventoryManager/AddMaterialForm.js
import React, { useState } from 'react';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Material Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" required />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2">
            <option value="">Select</option>
            <option value="Oil">Oil</option>
            <option value="Lubricant">Lubricant</option>
            <option value="Spare Part">Spare Part</option>
            <option value="Chemical">Chemical</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2 h-24"></textarea>
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Quantity in Stock</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Unit of Measure</label>
          <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2">
            <option value="">Select</option>
            <option value="Liters">Liters</option>
            <option value="Bottles">Bottles</option>
            <option value="Pieces">Pieces</option>
            <option value="Kg">Kg</option>
          </select>
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Reorder Level</label>
          <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Purchase Date</label>
          <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Expiration Date</label>
          <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">Supplier Name</label>
          <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button type="reset" className="bg-gray-200 text-[#2E2F34] px-4 py-2 rounded">Reset</button>
        <button type="submit" className="bg-[#efc11a] text-white px-4 py-2 rounded">Add Material</button>
      </div>
    </form>
  );
};

export default AddMaterialForm;
