import React from 'react';
import NavBar from '../../components/NavBar';
import MaintenanceRequestTable from '../../components/InventoryManager/MaintenanceRequestTable';

const MaintenanceRequestsOverview = () => {
  const data = [
    {
      equipment: 'Excavator CAT-320',
      date: 'Jan 15, 2024',
      requestedBy: 'John Mitchell',
      status: 'Pending',
    },
    {
      equipment: 'Concrete Mixer CM-500',
      date: 'Jan 18, 2024',
      requestedBy: 'Sarah Johnson',
      status: 'Approved',
    },
    {
      equipment: 'Tower Crane TC-1000',
      date: 'Jan 22, 2024',
      requestedBy: 'Mike Rodriguez',
      status: 'Completed',
    },
    {
      equipment: 'Jackhammer JH-250',
      date: 'Jan 25, 2024',
      requestedBy: 'David Chen',
      status: 'Pending',
    },
  ];

  return (
    <>
      <NavBar 
      links={[
        {name: 'Dashboard', path: '/inventory-dashboard'},
        {name: 'Inventory Control', path: '/inventory-control'},
        {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
        {name: 'Dashboard'},
        {name: 'Dashboard'},
     ]}
        />

      <div className="p-6 bg-[#FCFCFC] min-h-screen">
        <h2 className="text-3xl font-bold text-[#2E2F34] mb-2">Maintenance Requests Overview</h2>
        <p className="text-[#2E2F34] mb-6">Monitor and manage equipment maintenance schedules</p>

        <div className="bg-white p-4 border border-[#E4E4E4] rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4 text-[#2E2F34]">Upcoming Maintenance Schedule</h3>
          <MaintenanceRequestTable requests={data} />
        </div>
      </div>
    </>
  );
};

export default MaintenanceRequestsOverview;
