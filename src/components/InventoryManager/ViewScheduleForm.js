// src/components/InventoryManager/forms/ViewScheduleForm.js
import React from 'react';

const ViewScheduleForm = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-4xl mx-auto">
    
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">Equipment</label>
        
            <input type="text" placeholder="Tower Crane TC-400" className="w-full border border-[#E4E4E4] rounded p-2" />
            
            
        </div>

        <div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">From Date</label>
          <input type="text" placeholder="12/12/2024" className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">To Date</label>
          <input type="text" placeholder="12/12/2024" className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

<div className="md:col-span-2">
          <label className="block text-[#2E2F34] font-medium mb-1">Loaction</label>
          <input type="text" placeholder="Site A" className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        
      </form>
    </div>
  );
};

export default ViewScheduleForm;
