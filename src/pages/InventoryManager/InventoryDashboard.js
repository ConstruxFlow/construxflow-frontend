// src/pages/InventoryManager/InventoryDashboard.js
import React, { useState } from 'react';
import NavBar from '../../components/NavBar'; 
import DashboardOverview from '../../components/InventoryManager/DashboardOverview';

const InventoryDashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  const navigationLinks = [
    { name: 'Dashboard', path: '/inventory-dashboard', active: true },
    { name: 'Inventory Control', path: '/inventory-control' },
    { name: 'Inventory Monitoring', path: '/inventory-monitoring' },
    { name: 'Maintenance Requests', path: '/maintenance-requests-overview' },
    { name: 'Equipment Scheduling', path: '/equipment-scheduling' },
  ];

  
  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Enhanced Navigation Bar */}
      <NavBar links={navigationLinks} />
      
      {/* Quick Actions Bar */}
      

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto">
        <DashboardOverview />
      </main>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>© 2025 Construction Inventory Management</span>
              <span>•</span>
              <span>Version 2.1.0</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm text-[#236571] hover:underline">
                Help & Support
              </button>
              <button className="text-sm text-[#236571] hover:underline">
                Export Data
              </button>
              <button className="bg-[#efc11a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;