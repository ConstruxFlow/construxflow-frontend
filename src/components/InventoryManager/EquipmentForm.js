// File: src/components/EquipmentForm.js
import React, { useState } from 'react';

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
          <label className="block text-[#2E2F34] font-medium mb-1">Equipment Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2">
            <option value="">Select</option>
            <option value="Machine">Machine</option>
            <option value="Vehicle">Vehicle</option>
          </select>
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Equipment Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Brand</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Model</label>
          <input type="text" name="model" value={formData.model} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Serial Number / VIN</label>
          <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Condition</label>
          <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2">
            <option value="">Select</option>
            <option value="Brand New">Brand New</option>
            <option value="Used">Used</option>
          </select>
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Purchase Date</label>
          <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Purchase Source</label>
          <input type="text" name="purchaseSource" value={formData.purchaseSource} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Purchase Cost (LKR)</label>
          <input type="number" name="purchaseCost" value={formData.purchaseCost} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Current Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2">
            <option value="">Select</option>
            <option value="Operational">Operational</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Next Maintenance Due</label>
          <input type="date" name="nextMaintenance" value={formData.nextMaintenance} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-[#2E2F34] font-medium mb-1">Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full border border-[#E4E4E4] rounded p-2 h-24"></textarea>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button type="reset" className="bg-gray-200 text-[#2E2F34] px-4 py-2 rounded">Reset</button>
        <button type="submit" className="bg-[#efc11a] text-white px-4 py-2 rounded">Add Equipment</button>
      </div>
    </form>
  );
};

export default EquipmentForm;
