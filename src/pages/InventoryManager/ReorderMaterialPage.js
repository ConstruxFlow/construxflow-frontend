import React from 'react';
import NavBar from '../../components/NavBar';
import ReorderForm from '../../components/InventoryManager/ReorderForm';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Request', href: '/Inventory-requests' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

const ReorderMaterialPage = () => {
  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar 
        links={navLinks}
        logoSrc="/logo1.png"
      />
      <ReorderForm />
    </div>
  );
};

export default ReorderMaterialPage;
