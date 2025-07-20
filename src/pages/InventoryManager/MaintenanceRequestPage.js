import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import MaintenanceRequestDetails from '../../components/InventoryManager/MaintenanceRequestDetails';

const MaintenanceRequestPage = () => {
  const { equipmentId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/schedule-maintenance-materials/details/${equipmentId}`)
      .then((res) => {
        setRequest(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load request details:", err);
        setLoading(false);
      });
  }, [equipmentId]);

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      <NavBar
        links={[
        {name: 'Dashboard', path: '/inventory-dashboard'},
        {name: 'Inventory Control', path: '/inventory-control'},
        {name: 'Inventory Monitoring', path: '/inventory-monitoring'},
        {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
        {name: 'Equipment Sheduling', path: '/equipment-scheduling'},
        
     ]}
      />
      
      <div className="max-w-5xl mx-auto p-6">
        {loading ? (
          <p className="text-gray-500">Loading maintenance request...</p>
        ) : request ? (
          <MaintenanceRequestDetails request={request} />
        ) : (
          <p className="text-red-500">Failed to load maintenance request.</p>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRequestPage;
