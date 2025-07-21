import React, { useState } from 'react';
import NavBar from '../../components/NavBar'; 
import DashboardOverview from '../../components/InventoryManager/DashboardOverview';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

const InventoryDashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Enhanced Navigation Bar */}
      <NavBar links={navLinks} profileURL='/inventory/profile'/>
      
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          <DashboardOverview />
        </div>
      </main>

      <div className="bg-purewhite border-t border-gray-200 mt-8">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-slatebluegray">
              <span className="font-medium">© 2025 Construction Inventory Management</span>
              <span className="hidden sm:inline">•</span>
              <span>Version 2.1.0</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="text-sm text-deep_green hover:text-deep_green/80 font-medium transition-colors duration-150">
                Help & Support
              </button>
              <button className="text-sm text-deep_green hover:text-deep_green/80 font-medium transition-colors duration-150">
                Export Data
              </button>
              <button className="bg-web_yellow hover:bg-web_yellow/80 text-main_dark px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow-md">
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
