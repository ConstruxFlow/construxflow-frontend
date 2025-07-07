import React from 'react';
import NavBar from '../../components/NavBar';
import EquipmentCard from '../../components/InventoryManager/EquipmentCard';

const EquipmentScheduling = () => {
  const equipmentList = [
    {
      name: 'Excavator CAT 320',
      status: 'Available',
      utilization: '0%',
      buttonText: 'Schedule',
      color: 'bg-[#efc11a] text-white',
      icon: '🚜',
    },
    {
      name: 'Tower Crane TC–400',
      status: 'In Use',
      utilization: '85%',
      buttonText: 'View Schedule',
      color: 'bg-white text-[#2E2F34] border border-[#E4E4E4]',
      icon: '🏗️',
    },
    {
      name: 'Dump Truck Fleet',
      status: 'Partially Available',
      utilization: '60%',
      buttonText: 'Request Unit',
      color: 'bg-[#efc11a] text-white',
      icon: '🚛',
    },
    {
      name: 'Generator Set 500KW',
      status: 'Under Maintenance',
      utilization: 'N/A',
      buttonText: 'Maintenance Status',
      color: 'bg-[#236571] text-white',
      icon: '⚡',
    },
  ];

  return (
    <>
      <NavBar />

      <div className="p-6 bg-[#FCFCFC] min-h-screen">
        <h2 className="text-2xl font-bold text-[#2E2F34] mb-2">Site-Based Equipment Scheduling</h2>

        <div className="mb-6">
          <label htmlFor="siteSelect" className="block mb-1 font-medium text-[#2E2F34]">
            Select Site:
          </label>
          <select
            id="siteSelect"
            className="px-4 py-2 border border-[#E4E4E4] rounded w-full md:w-1/3"
          >
            <option>Downtown Construction Site</option>
            <option>Uptown High-Rise Project</option>
            <option>Bridge Expansion Site</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {equipmentList.map((item, idx) => (
            <EquipmentCard
              key={idx}
              icon={item.icon}
              name={item.name}
              status={item.status}
              utilization={item.utilization}
              buttonText={item.buttonText}
              color={item.color}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default EquipmentScheduling;
