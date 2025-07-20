// src/pages/ScheduleEquipment.js
import React from 'react';
import NavBar from '../../components/NavBar';
import ScheduleForm from '../../components/InventoryManager/ScheduleForm';

const ScheduleEquipment = () => {
  return (
    <>
      <NavBar 
        links={[
          { name: 'Dashboard', path: '/inventory-dashboard' },
          { name: 'Inventory Control', path: '/inventory-control' },
          { name: 'Inventory Monitoring', path: '/inventory-monitoring' },
          { name: 'Maintenance Requests', path: '/maintenance-requests-overview' },
          { name: 'Equipment Scheduling', path: '/equipment-scheduling' },
        ]}
      />
      <div className="bg-[#FCFCFC] min-h-screen py-8 px-4">
        <h1 className="text-3xl font-bold text-[#236571] text-center mb-6">Schedule Equipment</h1>
        <ScheduleForm />
      </div>
    </>
  );
};

export default ScheduleEquipment;
