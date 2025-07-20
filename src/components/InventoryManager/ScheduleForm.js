// src/components/InventoryManager/forms/ScheduleForm.js
import React from 'react';

const ScheduleForm = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-4xl mx-auto">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Equipment Name</label>
          <input type="text" placeholder="Excavator CAT 320" className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Schedule Date From</label>
          <input type="date" className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Schedule Date To</label>
          <input type="date" className="w-full border border-[#E4E4E4] rounded p-2" />
        </div>

        <div>
          <label className="block text-[#2E2F34] font-medium mb-1">Assign To Site</label>
          <select className="w-full border border-[#E4E4E4] rounded p-2">
            <option>Downtown Site</option>
            <option>Uptown Project</option>
            <option>Highway Expansion</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
          <button type="reset" className="bg-gray-200 text-[#2E2F34] px-4 py-2 rounded">Reset</button>
          <button type="submit" className="bg-[#efc11a] text-white px-4 py-2 rounded">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
