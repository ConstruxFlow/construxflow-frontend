import React from 'react';
import { Package, AlertTriangle, Wrench, ClipboardList, TrendingUp, TrendingDown, Info } from 'lucide-react';

const DashboardOverview = () => {
  const metricCards = [
    { 
      label: 'Total Equipment', 
      value: 247, 
      icon: Package,
      status: 'Active', 
      statusColor: 'bg-deep_green/10 text-deep_green',
      change: '+5%',
      trend: 'up'
    },
    { 
      label: 'Low Stock Items', 
      value: 12, 
      icon: AlertTriangle,
      status: 'Critical', 
      statusColor: 'bg-red-100 text-red-700',
      change: '+2',
      trend: 'up'
    },
    { 
      label: 'Pending Maintenance', 
      value: 8, 
      icon: Wrench,
      status: 'Scheduled', 
      statusColor: 'bg-web_yellow/10 text-web_yellow',
      change: '-3',
      trend: 'down'
    },
    { 
      label: 'Active Requests', 
      value: 23, 
      icon: ClipboardList,
      status: 'Processing', 
      statusColor: 'bg-light_brown/20 text-light_brown',
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return 'bg-deep_green/10 text-deep_green';
      case 'Good': return 'bg-blue-100 text-blue-700';
      case 'Low': return 'bg-web_yellow/10 text-web_yellow';
      default: return 'bg-light_gray/40 text-slatebluegray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-web_yellow/10 text-web_yellow';
      case 'Low': return 'bg-light_gray/40 text-slatebluegray';
      default: return 'bg-light_gray/40 text-slatebluegray';
    }
  };

  const getMaintenanceStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-deep_green/10 text-deep_green';
      case 'Pending': return 'bg-web_yellow/10 text-web_yellow';
      case 'Planning': return 'bg-light_gray/40 text-slatebluegray';
      default: return 'bg-light_gray/40 text-slatebluegray';
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-semibold text-main_dark mb-1 tracking-tight">
          Inventory Dashboard
        </h1>
        <p className="text-slatebluegray text-base">
          Real-time insights into your construction inventory
        </p>
      </div>

      {/* Urgent Actions Alert */}
      <div className="bg-gradient-to-r from-web_yellow/15 via-web_yellow/8 to-transparent border-l-4 border-web_yellow rounded-lg p-4 mb-5 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-full flex items-center justify-center text-main_dark text-lg font-bold shadow-lg animate-pulse">
            ⚠
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base text-main_dark mb-2">
              Immediate Actions Required
            </h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-2 bg-purewhite px-3 py-1.5 rounded-full shadow-md border border-red-200">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
                <span className="text-main_dark font-medium">5 critical maintenance items</span>
              </span>
              <span className="flex items-center gap-2 bg-purewhite px-3 py-1.5 rounded-full shadow-md border border-web_yellow/20">
                <div className="w-3 h-3 bg-gradient-to-r from-web_yellow to-web_yellow/70 rounded-full animate-pulse"></div>
                <span className="text-main_dark font-medium">New shipment arrived</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {metricCards.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">{item.label}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">{item.value}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.statusColor}`}>
                    {item.status}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.trend === 'up' ? 
                      <TrendingUp className="w-3 h-3 text-red-500" /> : 
                      <TrendingDown className="w-3 h-3 text-green-500" />
                    }
                    <span className={`text-xs ${item.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <IconComponent className="w-5 h-5 text-main_dark" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Equipment Distribution */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-5">
            <h3 className="font-semibold text-main_dark mb-4 text-base">Equipment Distribution by Site</h3>
            <div className="space-y-3">
              {siteDistribution.map((site, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-deep_green rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {site.site.slice(-1)}
                    </div>
                    <div>
                      <p className="font-semibold text-main_dark text-sm">{site.site}</p>
                      <p className="text-xs text-slatebluegray">{site.units} units ({site.percentage}%)</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(site.status)}`}>
                    {site.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-5">
            <h3 className="font-semibold text-main_dark mb-4 text-base">Upcoming Maintenance Schedule</h3>
            <div className="space-y-3">
              {upcomingMaintenance.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-main_dark text-sm">{item.equipment}</p>
                    <p className="text-xs text-slatebluegray">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getMaintenanceStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Inventory Health */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-5">
            <h3 className="font-semibold text-main_dark mb-4 text-base">Inventory Health Status</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-14 h-14 bg-deep_green/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-deep_green">18</span>
                </div>
                <p className="text-sm font-medium text-main_dark">Healthy Items</p>
                <p className="text-xs text-slatebluegray">Good stock levels</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-red-600">5</span>
                </div>
                <p className="text-sm font-medium text-main_dark">Critical Stock</p>
                <p className="text-xs text-slatebluegray">Immediate attention</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-14 h-14 bg-web_yellow/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-web_yellow">4</span>
                </div>
                <p className="text-sm font-medium text-main_dark">Low Reorder</p>
                <p className="text-xs text-slatebluegray">Reorder soon</p>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-5">
            <h3 className="font-semibold text-main_dark mb-4 text-base">Recent Inventory Updates</h3>
            <div className="space-y-3">
              {recentUpdates.map((update, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    update.type === 'addition' ? 'bg-deep_green' :
                    update.type === 'removal' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}>
                    {update.type === 'addition' ? '+' : update.type === 'removal' ? '−' : '↔'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-main_dark">{update.action}</p>
                    <p className="text-xs text-slatebluegray">{update.item}</p>
                  </div>
                  <span className="text-xs text-slatebluegray">{update.date}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-deep_green font-medium hover:bg-gray-50 rounded-lg transition-colors">
              View All Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
