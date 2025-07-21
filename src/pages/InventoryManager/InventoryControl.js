// src/pages/inventorymanager/InventoryControl.js
import React from 'react';
import NavBar from '../../components/NavBar';
import InventoryControlPanel from '../../components/InventoryManager/InventoryControlPanel';

const InventoryControl = () => {
  return (
    <>
     <NavBar
        links={[
        {name: 'Dashboard', path: '/inventory-dashboard'},
        {name: 'Inventory Control', path: '/inventory-control'},
        {name: 'Inventory Monitoring', path: '/inventory-monitoring'},
        {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
        {name: 'Equipment Sheduling', path: '/equipment-scheduling'},
        
     ]}
      />
      <InventoryControlPanel />
    </>
  );
};

export default InventoryControl;
