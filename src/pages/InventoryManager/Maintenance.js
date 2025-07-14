import React from 'react';
import NavBar from '../../components/NavBar';
import MaintenanceCard from '../../components/InventoryManager/MaintenanceCard';
import MaintenanceTable from '../../components/InventoryManager/MaintenanceTable';

const Maintenance = () => {
  const maintenanceData = [
    {
      equipment: 'Excavator CAT 320',
      unit: 'Unit 001',
      type: 'Hydraulic System Check',
      date: 'June 22, 2025',
      status: 'Scheduled',
    },
    {
      equipment: 'Tower Crane TC–400',
      unit: 'Unit 002',
      type: 'Annual Inspection',
      date: 'June 20, 2025',
      status: 'Overdue',
    },
    {
      equipment: 'Bulldozer D6T',
      unit: 'Unit 003',
      type: 'Engine Oil Change',
      date: 'June 24, 2025',
      status: 'Confirmed',
    },
  ];

  return (
    <>
      <NavBar />

      <div className="p-6 bg-[#FCFCFC] min-h-screen">
        <h2 className="text-2xl font-bold text-[#2E2F34] mb-6">Equipment Maintenance Scheduling</h2>

        {/* Top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <MaintenanceCard
            title="Upcoming Maintenance"
            value="15"
            description="Equipment units this week"
            buttonLabel="View Schedule"
            bgColor="bg-[#efc11a]"
          />
          <MaintenanceCard
            title="Overdue Maintenance"
            value="3"
            description="Critical items"
            buttonLabel="Take Action"
            bgColor="bg-[#236571]"
          />
        </div>

        {/* Calendar placeholder */}
        <div className="bg-white border border-[#E4E4E4] rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-[#2E2F34] mb-4">Maintenance Calendar</h3>
          <div className="h-40 flex items-center justify-center text-gray-400 italic">
            [Calendar Component or Library Goes Here]
          </div>
        </div>

        {/* Table */}
        <MaintenanceTable data={maintenanceData} />
      </div>
    </>
  );
};

export default Maintenance;
