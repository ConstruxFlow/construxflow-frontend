import React from 'react';
import { Bell, Plus, User, Settings, BarChart3, Truck, Package, Wrench, Droplets, Heart, Fuel } from 'lucide-react';

const InventoryDashboard = () => {
  const stockItems = [
    { name: 'Spare Parts', icon: <Settings className="w-8 h-8" />, count: 248, capacity: 25, status: 'Critical', color: 'bg-red-500' },
    { name: 'Machinery', icon: <Wrench className="w-8 h-8" />, count: 89, capacity: 85, status: 'Good', color: 'bg-[#236571]' },
    { name: 'Fluids & Lubricants', icon: <Droplets className="w-8 h-8" />, count: '156L', capacity: 45, status: 'Low', color: 'bg-[#EFC11A]' },
    { name: 'First Aid', icon: <Heart className="w-8 h-8" />, count: 342, capacity: 75, status: 'Good', color: 'bg-[#236571]' },
    { name: 'Fuel', icon: <Fuel className="w-8 h-8" />, count: '1,240L', capacity: 20, status: 'Critical', color: 'bg-red-500' }
  ];

  const supplierItems = [
    { item: 'Steel Rods (500 units)', status: 'Delivered', eta: 'Today', statusColor: 'bg-green-500' },
    { item: 'Hydraulic Oil (200L)', status: 'In Transit', eta: 'Dec 20', statusColor: 'bg-blue-500' },
    { item: 'Safety Helmets (50 pcs)', status: 'Delayed', eta: 'Dec 22', statusColor: 'bg-[#EFC11A]' },
    { item: 'Diesel Fuel (1000L)', status: 'In Transit', eta: 'Dec 19', statusColor: 'bg-blue-500' },
    { item: 'First Aid Kits (25 pcs)', status: 'Pending', eta: 'Dec 25', statusColor: 'bg-gray-400' }
  ];

  const criticalItems = [
    { name: 'Diesel Fuel', current: '1,240L', min: '2,000L', priority: 'high', icon: '🛢️' },
    { name: 'Spare Parts', current: '248', min: '500', priority: 'high', icon: '⚙️' },
    { name: 'Hydraulic Oil', current: '156L', min: '300L', priority: 'medium', icon: '🛢️' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Critical': return 'text-red-500';
      case 'Good': return 'text-green-500';
      case 'Low': return 'text-[#EFC11A]';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        {/* ✅ All content wrapped in a centered responsive container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-[#EFC11A] text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2 font-medium">
                <Plus className="w-4 h-4" />
                <span>Add Stock</span>
              </button>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Current Stock Status */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Stock Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stockItems.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-600">{item.icon}</div>
                    <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-gray-800 font-medium mb-2">{item.name}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{item.count}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.capacity}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500">{item.capacity}% of capacity</div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-column section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Supplier Dispatch Status */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Supplier Dispatch Status</h2>
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="bg-gray-200 px-4 py-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-700">Item</div>
                    <div className="text-sm font-medium text-gray-700">Status</div>
                    <div className="text-sm font-medium text-gray-700">ETA</div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {supplierItems.map((item, index) => (
                    <div key={index} className="px-4 py-3">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="text-sm text-gray-900">{item.item}</div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${item.statusColor}`}></div>
                          <span className="text-sm text-gray-700">{item.status}</span>
                        </div>
                        <div className="text-sm text-gray-700">{item.eta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Critical Stock Needs */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Critical Stock Needs</h2>
              <div className="space-y-4">
                {criticalItems.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.priority === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          <span className="text-sm">{item.icon}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            Current: {item.current} | Min: {item.min}
                          </div>
                        </div>
                      </div>
                      <button className="bg-[#EFC11A] text-gray-800 px-3 py-1 rounded text-sm font-medium">
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Consumption Forecast */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Consumption Forecast</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Forecast chart would be displayed here</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default InventoryDashboard;
