import React from 'react';
import NavBar from '../../components/NavBar';  // ✅ Import the navbar

const InventoryMonitoring = () => {
  const inventoryData = [
    {
      name: 'Hydraulic Pump – CAT 320',
      serial: 'HP-CAT320-001',
      category: 'Excavator Parts',
      stock: 3,
      minLevel: 5,
      status: 'Low Stock',
      action: 'Reorder',
    },
    {
      name: 'Steel Reinforcement Bars',
      serial: 'Grade: 60, Size: 16mm',
      category: 'Construction Materials',
      stock: 150,
      minLevel: 50,
      status: 'Good',
      action: 'View Details',
    },
    {
      name: 'Concrete Mixer Blades',
      serial: 'Model: CMB-500',
      category: 'Mixer Parts',
      stock: 8,
      minLevel: 10,
      status: 'Medium',
      action: 'Update Stock',
    },
    {
      name: 'Excavator Tracks',
      serial: 'Compatible: CAT 320/330',
      category: 'Excavator Parts',
      stock: 2,
      minLevel: 4,
      status: 'Low Stock',
      action: 'Reorder',
    },
    {
      name: 'Safety Helmets',
      serial: 'Type: Hard Hat, Color: Yellow',
      category: 'Safety Equipment',
      stock: 45,
      minLevel: 20,
      status: 'Good',
      action: 'View Details',
    },
  ];

  return (
    <>
      <NavBar /> {/* ✅ NavBar at top */}

      <div className="p-6 bg-[#FCFCFC] min-h-screen">
        <h2 className="text-3xl font-bold text-[#236571] mb-1">Inventory Monitoring</h2>
        <p className="text-[#2E2F34] mb-6">Track and manage your construction equipment and materials</p>

        {/* Search + Add */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-[#E4E4E4] rounded-xl p-4 mb-6 shadow">
          <input
            type="text"
            placeholder="Search equipment, parts, or serial numbers..."
            className="flex-1 px-4 py-2 rounded border border-[#E4E4E4] w-full"
          />
          <div className="flex gap-3">
            <button className="bg-[#efc11a] text-white px-4 py-2 rounded hover:opacity-90">Search</button>
            <button className="bg-[#236571] text-white px-4 py-2 rounded hover:opacity-90">+ Add New Item</button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          {['All Items', 'Machinery', 'Spare Parts', 'Low Stock', 'Critical'].map((filter, i) => (
            <button
              key={i}
              className={`px-4 py-1 rounded-full text-sm ${
                i === 0 ? 'bg-[#efc11a] text-white' : 'bg-[#E4E4E4] text-[#2E2F34]'
              } hover:opacity-90`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Inventory Table */}
        <div className="overflow-auto rounded-lg shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#efc11a] text-[#191919] text-left">
                <th className="p-3">Item Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Minimum Level</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, i) => (
                <tr key={i} className="border-b border-[#E4E4E4] bg-white hover:bg-[#F9F9F9]">
                  <td className="p-3">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.serial}</div>
                  </td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3 font-bold">{item.stock}</td>
                  <td className="p-3">{item.minLevel}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        item.status === 'Low Stock'
                          ? 'bg-red-100 text-red-700'
                          : item.status === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        item.action === 'Reorder'
                          ? 'bg-[#236571] text-white'
                          : item.action === 'Update Stock'
                          ? 'bg-yellow-400 text-white'
                          : 'bg-[#2E2F34] text-white'
                      }`}
                    >
                      {item.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <p>Showing 1 to 5 of 47 results</p>
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

export default InventoryMonitoring;
