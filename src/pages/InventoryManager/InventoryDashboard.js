// src/pages/InventoryManager/InventoryDashboard.js
import React from 'react';
import NavBar from '../../components/NavBar'; 
import DashboardOverview from '../../components/InventoryManager/DashboardOverview';

const InventoryDashboard = () => {
  return (
    <div>
         <NavBar 
      links={[
        {name: 'Dashboard', path: '/inventory-dashboard'},
        {name: 'Inventory Control', path: '/inventory-control'},
        {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
        {name: 'Dashboard'},
        {name: 'Dashboard'},
     ]}
        />
      <DashboardOverview />
    </div>
  );
};

export default InventoryDashboard;
