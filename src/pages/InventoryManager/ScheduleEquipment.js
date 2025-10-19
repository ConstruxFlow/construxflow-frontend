import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import ScheduleForm from '../../components/InventoryManager/ScheduleForm';

const ScheduleEquipment = () => {
  const { equipmentId } = useParams();

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar 
        links={[
          { name: 'Dashboard', href: '/inventory-dashboard' },
          { name: 'Inventory Control', href: '/inventory-control' },
          { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
          { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
          { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
        ]}
        logoSrc="/logo1.png"
      />
      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
              Schedule Equipment
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Assign equipment to construction sites and manage scheduling
            </p>
          </div>
          <ScheduleForm equipmentId={equipmentId} />
        </div>
      </main>
    </div>
  );
};

export default ScheduleEquipment;