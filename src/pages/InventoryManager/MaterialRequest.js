import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import MaterialRequestFilter from '../../components/InventoryManager/MaterialRequestFilter';
import MaterialRequestTable from '../../components/InventoryManager/MaterialRequestTable';
import MaterialRequestRow from '../../components/InventoryManager/MaterialRequestRow';

const MaterialRequest = () => {
  const filters = ['All Requests', 'Pending', 'Approved', 'Completed'];
  const [activeFilter, setActiveFilter] = useState('All Requests');

  const requests = [
    {
      id: 'REQ-2025-001',
      items: 'Hydraulic Fluid, Filter Kit',
      itemCount: '2 items',
      requestedBy: 'Maintenance Team A',
      date: 'June 18, 2025',
      priority: 'High',
      status: 'Processing',
    },
    {
      id: 'REQ-2025-002',
      items: 'Concrete Mixer Blades x2',
      itemCount: '1 item type',
      requestedBy: 'Site Manager - Downtown',
      date: 'June 17, 2025',
      priority: 'Medium',
      status: 'Approved',
    },
    {
      id: 'REQ-2025-003',
      items: 'Engine Oil, Air Filter, Spark Plugs',
      itemCount: '3 items',
      requestedBy: 'Equipment Operator',
      date: 'June 16, 2025',
      priority: 'Low',
      status: 'Pending',
    },
    {
      id: 'REQ-2025-004',
      items: 'Hydraulic Hoses, Fittings',
      itemCount: '2 items',
      requestedBy: 'Maintenance Team B',
      date: 'June 15, 2025',
      priority: 'High',
      status: 'Completed',
    },
  ];

  return (
    <>
      <NavBar />

      <div className="p-6 bg-[#FCFCFC] min-h-screen">
        <h2 className="text-2xl font-bold text-[#2E2F34] mb-1">Maintenance Material Requests</h2>
        <p className="text-[#2E2F34] mb-6">Manage and track material requests for maintenance operations</p>

        {/* Search and Button */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-[#E4E4E4] rounded-xl p-4 mb-4 shadow">
          <input
            type="text"
            placeholder="Search requests..."
            className="flex-1 px-4 py-2 rounded border border-[#E4E4E4] w-full"
          />
          <div className="flex gap-3">
            <button className="bg-[#efc11a] text-white px-4 py-2 rounded hover:opacity-90">Search</button>
            <button className="bg-[#236571] text-white px-4 py-2 rounded hover:opacity-90">+ New Request</button>
          </div>
        </div>

        {/* Filters */}
        <MaterialRequestFilter filters={filters} activeFilter={activeFilter} onSelect={setActiveFilter} />

        {/* Table */}
        <MaterialRequestTable data={requests} />

        {/* Pagination */}
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <p>Showing 1 to 4 of 12 requests</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-8 h-8 rounded ${
                  n === 1 ? 'bg-[#236571] text-white' : 'bg-white border border-[#E4E4E4] text-[#2E2F34]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialRequest;
