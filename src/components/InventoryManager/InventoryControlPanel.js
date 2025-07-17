// src/components/InventoryManager/InventoryControlPanel.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const InventoryControlPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FCFCFC] min-h-screen p-8">
      <h1 className="text-3xl font-bold text-[#236571] text-center mb-10">Inventory Control Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div
          onClick={() => navigate('/add-equipment')}
          className="cursor-pointer bg-white shadow-lg rounded-2xl p-8 border border-[#E4E4E4] hover:shadow-xl transition duration-300"
        >
          <h2 className="text-xl font-semibold text-[#2E2F34] mb-2">Add Equipment to Inventory</h2>
          <p className="text-sm text-gray-600">Click to register new machinery, tools, or vehicles to the equipment inventory.</p>
        </div>

        <div
          onClick={() => navigate('/add-material')}
          className="cursor-pointer bg-white shadow-lg rounded-2xl p-8 border border-[#E4E4E4] hover:shadow-xl transition duration-300"
        >
          <h2 className="text-xl font-semibold text-[#2E2F34] mb-2">Add Material to Inventory</h2>
          <p className="text-sm text-gray-600">Click to log oils, lubricants, spare parts, or other materials.</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryControlPanel;
