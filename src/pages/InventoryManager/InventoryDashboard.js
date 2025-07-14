// src/pages/InventoryManager/InventoryDashboard.js
import React from 'react';
import NavBar from '../../components/NavBar'; 
import DashboardOverview from '../../components/InventoryManager/DashboardOverview';

const InventoryDashboard = () => {
  return (
    <div>
        <NavBar /> {/* ✅ Add this line */}
      <DashboardOverview />
    </div>
  );
};

export default InventoryDashboard;
