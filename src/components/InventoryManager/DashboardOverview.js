import React from 'react';

const DashboardOverview = () => {
  const metricCards = [
    { 
      label: 'Total Equipment', 
      value: 247, 
      icon: '🚚', 
      status: 'Active', 
      color: 'green',
      change: '+5%',
      trend: 'up'
    },
    { 
      label: 'Low Stock Items', 
      value: 12, 
      icon: '⚠️', 
      status: 'Critical', 
      color: 'red',
      change: '+2',
      trend: 'up'
    },
    { 
      label: 'Pending Maintenance', 
      value: 8, 
      icon: '⚙️', 
      status: 'Scheduled', 
      color: 'yellow',
      change: '-3',
      trend: 'down'
    },
    { 
      label: 'Active Requests', 
      value: 23, 
      icon: '📋', 
      status: 'Processing', 
      color: 'blue',
      change: '+8',
      trend: 'up'
    },
  ];

  const upcomingMaintenance = [
    { equipment: 'Excavator #021', date: '8 July 2025', priority: 'High', status: 'Scheduled' },
    { equipment: 'Concrete Mixer #112', date: '10 July 2025', priority: 'Medium', status: 'Pending' },
    { equipment: 'Crane #045', date: '12 July 2025', priority: 'High', status: 'Scheduled' },
    { equipment: 'Bulldozer #033', date: '15 July 2025', priority: 'Low', status: 'Planning' },
  ];

  const recentUpdates = [
    { action: 'Added', item: '50 Cement Bags', date: '6 July', type: 'addition' },
    { action: 'Issued', item: '3 Safety Helmets to Site B', date: '5 July', type: 'removal' },
    { action: 'Added', item: '2 Drills to main store', date: '4 July', type: 'addition' },
    { action: 'Transferred', item: '15 Steel Rods to Site C', date: '3 July', type: 'transfer' },
  ];

  const siteDistribution = [
    { site: 'Site A', units: 120, percentage: 49, status: 'Optimal' },
    { site: 'Site B', units: 80, percentage: 32, status: 'Good' },
    { site: 'Site C', units: 47, percentage: 19, status: 'Low' },
  ];

  return (
    <div className="p-6 bg-[#FCFCFC] min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#236571] mb-2">Dashboard Overview</h1>
        <p className="text-lg text-[#2E2F34] opacity-80">Real-time insights into your construction inventory</p>
        <div className="w-24 h-1 bg-[#efc11a] rounded-full mt-3"></div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-[#236571]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-full bg-gray-50">
                <span className="text-3xl">{item.icon}</span>
              </div>
              <div className="text-right">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  item.color === 'green' ? 'bg-green-100 text-green-700' :
                  item.color === 'red' ? 'bg-red-100 text-red-700' :
                  item.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-[#2E2F34] mb-1">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
              <div className={`text-sm font-medium ${
                item.trend === 'up' ? 'text-red-500' : 'text-green-500'
              }`}>
                {item.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Critical Alert</h4>
                <p className="text-sm text-red-700">5 pieces of equipment require immediate maintenance</p>
              </div>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-[#efc11a] p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <span className="text-yellow-600 text-xl">ℹ️</span>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Inventory Update</h4>
                <p className="text-sm text-yellow-700">New shipment of spare parts arrived</p>
              </div>
            </div>
            <button className="bg-[#efc11a] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
              Update Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-xl text-[#236571] mb-4">Equipment Distribution by Site</h3>
            <div className="space-y-4">
              {siteDistribution.map((site, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-[#CEB8AD] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#236571] rounded-lg flex items-center justify-center text-white font-bold">
                      {site.site.slice(-1)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#191919]">{site.site}</p>
                      <p className="text-sm text-[#191919] opacity-80">{site.units} units ({site.percentage}%)</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    site.status === 'Optimal' ? 'bg-green-100 text-green-700' :
                    site.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {site.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-xl text-[#236571] mb-4">Upcoming Maintenance Schedule</h3>
            <div className="space-y-3">
              {upcomingMaintenance.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-[#2E2F34]">{item.equipment}</p>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.priority === 'High' ? 'bg-red-100 text-red-700' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'Scheduled' ? 'bg-green-100 text-green-700' :
                      item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Inventory Health */}
          <div className="bg-[#E4E4E4] p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-[#2E2F34]">Inventory Health Status</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-green-700">18</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Healthy Items</p>
                <p className="text-xs text-gray-500">Good stock levels</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-red-600">5</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Critical Stock</p>
                <p className="text-xs text-gray-500">Immediate attention</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-yellow-600">4</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Low Reorder</p>
                <p className="text-xs text-gray-500">Reorder soon</p>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white border-l-4 border-[#efc11a] p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-[#236571]">Recent Inventory Updates</h3>
            <div className="space-y-3">
              {recentUpdates.map((update, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    update.type === 'addition' ? 'bg-green-500' :
                    update.type === 'removal' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}>
                    {update.type === 'addition' ? '+' : update.type === 'removal' ? '−' : '↔'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#2E2F34]">{update.action}</p>
                    <p className="text-xs text-gray-600">{update.item}</p>
                  </div>
                  <span className="text-xs text-gray-500">{update.date}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-[#236571] font-medium hover:bg-gray-50 rounded-lg transition-colors">
              View All Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;