import React from 'react';

const DashboardOverview = () => {
  return (
    <div className="p-6 bg-[#FCFCFC] min-h-screen">
      <h2 className="text-3xl font-bold text-[#236571] mb-1">Dashboard Overview</h2>
      <p className="text-[#2E2F34] mb-6">Real-time insights into your construction inventory</p>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Equipment', value: 247, icon: '🚚', status: 'Active', color: 'green' },
          { label: 'Low Stock Items', value: 12, icon: '⚠️', status: 'Critical', color: 'red' },
          { label: 'Pending Maintenance', value: 8, icon: '⚙️', status: 'Scheduled', color: 'yellow' },
          { label: 'Active Requests', value: 23, icon: '📋', status: 'Processing', color: 'gray' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-4xl">{item.icon}</span>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  item.color === 'green'
                    ? 'bg-green-100 text-green-700'
                    : item.color === 'red'
                    ? 'bg-red-100 text-red-700'
                    : item.color === 'yellow'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-2xl font-bold mt-2">{item.value}</p>
            <p className="text-[#2E2F34] text-sm">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="bg-[#E4E4E4] border-l-4 border-[#236571] p-4 rounded-xl flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#236571] text-lg">⚠️</span>
          <p className="text-sm text-[#2E2F34]">
            5 pieces of equipment require immediate maintenance to avoid project delays.
          </p>
        </div>
        <button className="bg-[#236571] text-white px-4 py-2 rounded-lg hover:opacity-90">View Details</button>
      </div>

      <div className="bg-yellow-50 border-l-4 border-[#efc11a] p-4 rounded-xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600 text-lg">ℹ️</span>
          <p className="text-sm text-[#2E2F34]">
            New shipment of spare parts arrived. Update inventory levels accordingly.
          </p>
        </div>
        <button className="bg-[#efc11a] text-white px-4 py-2 rounded-lg hover:opacity-90">
          Update Inventory
        </button>
      </div>

      {/* Equipment Distribution */}
      <div className="bg-[#CEB8AD] text-[#191919] p-4 rounded-xl mb-4 shadow">
        <h3 className="font-bold text-lg mb-2">Equipment Distribution</h3>
        <div className="flex justify-between text-sm">
          <p>Site A - <strong>120</strong> units</p>
          <p>Site B - <strong>80</strong> units</p>
          <p>Site C - <strong>47</strong> units</p>
        </div>
      </div>

      {/* Upcoming Maintenance */}
      <div className="bg-white text-[#2E2F34] p-4 rounded-xl mb-4 shadow">
        <h3 className="font-bold text-lg mb-2">Upcoming Maintenance</h3>
        <ul className="text-sm list-disc pl-5">
          <li>Excavator #021 – 8 July 2025</li>
          <li>Concrete Mixer #112 – 10 July 2025</li>
          <li>Crane #045 – 12 July 2025</li>
        </ul>
      </div>

      {/* Recent Inventory Updates */}
      <div className="bg-[#FCFCFC] border-l-4 border-[#efc11a] p-4 rounded-xl mb-4 shadow">
        <h3 className="font-bold text-lg mb-2 text-[#236571]">Recent Inventory Updates</h3>
        <ul className="text-sm list-disc pl-5 text-[#2E2F34]">
          <li>+ 50 Cement Bags added – 6 July</li>
          <li>- 3 Safety Helmets issued to Site B</li>
          <li>+ 2 Drills added to main store</li>
        </ul>
      </div>

      {/* Inventory Health Overview */}
      <div className="bg-[#E4E4E4] p-4 rounded-xl mb-6 shadow">
        <h3 className="font-bold text-lg mb-3 text-[#2E2F34]">Inventory Health</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white text-center rounded-xl p-3 shadow">
            <p className="text-2xl font-bold text-green-700">18</p>
            <p className="text-sm">Healthy Items</p>
          </div>
          <div className="bg-white text-center rounded-xl p-3 shadow">
            <p className="text-2xl font-bold text-red-600">5</p>
            <p className="text-sm">Critical Stock</p>
          </div>
          <div className="bg-white text-center rounded-xl p-3 shadow">
            <p className="text-2xl font-bold text-yellow-600">4</p>
            <p className="text-sm">Low Reorder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
