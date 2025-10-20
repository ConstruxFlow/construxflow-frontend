import React from 'react';
import NavBar from '../../components/NavBar';
import ViewScheduleForm from '../../components/InventoryManager/ViewScheduleForm';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Request', path: '/Inventory-requests' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

const ViewSchedulePage = () => {
  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar 
        links={navLinks}
        logoSrc="/logo1.png"
      />
      <ViewScheduleForm />
    </div>
  );
};

export default ViewSchedulePage;
