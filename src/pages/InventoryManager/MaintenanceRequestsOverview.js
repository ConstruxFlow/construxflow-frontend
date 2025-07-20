import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import MaintenanceRequestTable from '../../components/InventoryManager/MaintenanceRequestTable';

const MaintenanceRequestsOverview = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/schedule-maintenance-materials/overview")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching maintenance requests:", err);
      });
  }, []);

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
