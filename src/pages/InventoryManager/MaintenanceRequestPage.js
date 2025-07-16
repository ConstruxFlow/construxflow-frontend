// pages/InventoryManager/MaintenanceRequestPage.js
import React from 'react';
import MaintenanceRequestDetails from '../../components/InventoryManager/MaintenanceRequestDetails';
import NavBar from '../../components/NavBar'; // adjust path if needed

const dummyRequest = {
  equipmentName: 'Hydraulic Excavator - CAT 320D',
  requestedBy: 'Mike Rodriguez - Maintenance Supervisor',
  schedule: 'January 15, 2024 - 9:00 AM',
  priority: 'High Priority',
  availability: 'Currently assigned to Site B - Available after Jan 18, 2024',
  comments:
    'Routine maintenance for hydraulic system. Needs to replace filters and check fluid levels.',
  materials: [
    {
      name: 'Hydraulic Filter - HF6177',
      desc: 'Primary hydraulic system filter',
      qty: 2,
      stock: 15,
      notes: 'Replace both primary and secondary filters',
    },
    {
      name: 'Hydraulic Fluid - ISO 46',
      desc: 'High-performance hydraulic oil',
      qty: '20L',
      stock: '85L',
      notes: 'Top-up and system flush',
    },
    {
      name: 'O-Ring Seal Kit',
      desc: 'Complete seal replacement kit',
      qty: 1,
      stock: 3,
    },
  ],
};

const MaintenanceRequestPage = () => {
  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <NavBar 
        links={[
        {name: 'Dashboard', path: '/inventory-dashboard'},
        {name: 'Maintenance', path: '/maintenance-requests-overview'},
        {name: 'Dashboard'},
        {name: 'Dashboard'},
        {name: 'Dashboard'},
     ]}/>
     
      <div className="max-w-5xl mx-auto p-6">
        <MaintenanceRequestDetails request={dummyRequest} />
      </div>
    </div>
  );
};

export default MaintenanceRequestPage;
