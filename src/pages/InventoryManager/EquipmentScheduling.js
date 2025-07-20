import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate hook
import NavBar from '../../components/NavBar';

const EquipmentScheduling = () => {
  const navigate = useNavigate(); // ✅ initialize navigate

  const originalList = [
    {
      name: 'Excavator CAT 320',
      status: 'Available',
      utilization: '0%',
      buttonText: 'Schedule',
      color: 'bg-[#efc11a] text-white',
      
    },
    {
      name: 'Tower Crane TC–400',
      status: 'In Use',
      utilization: '85%',
      buttonText: 'View Schedule',
      color: 'bg-white text-[#2E2F34] border border-[#E4E4E4]',
      
    },
    {
      name: 'Generator Set 500KW',
      status: 'Under Maintenance',
      utilization: 'N/A',
    
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statusOptions = ['All', 'Available', 'In Use', 'Under Maintenance'];

  const filteredEquipment = originalList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ✅ Function to handle button click and navigate
  const handleButtonClick = (item) => {
    if (item.buttonText === 'Schedule') {
      navigate(`/shedule-form`);
    } else if (item.buttonText === 'View Schedule') {
      navigate(`/view-schedule-page`);
    } 
  };

  return (
    <>
      <NavBar
        links={[
          { name: 'Dashboard', path: '/inventory-dashboard' },
          { name: 'Inventory Control', path: '/inventory-control' },
          { name: 'Inventory Monitoring', path: '/inventory-monitoring' },
          { name: 'Maintenance Requests', path: '/maintenance-requests-overview' },
          { name: 'Equipment Sheduling', path: '/equipment-scheduling' },
        ]}
      />

      <div className="p-6 bg-[#FCFCFC] min-h-screen">
        <h2 className="text-2xl font-bold text-[#2E2F34] mb-4">Site-Based Equipment Scheduling</h2>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search equipment..."
            className="px-4 py-2 border border-[#E4E4E4] rounded w-full md:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full border text-sm font-medium ${
                  filterStatus === status
                    ? 'bg-[#efc11a] text-white'
                    : 'bg-white text-[#2E2F34] border-[#E4E4E4]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Table */}
        <div className="overflow-x-auto rounded-lg shadow border border-[#E4E4E4] bg-white">
          <table className="min-w-full text-sm text-left text-[#2E2F34]">
            <thead className="bg-[#efc11a] text-white">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Equipment Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-[#f9f9f9]">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">
                      {item.icon} {item.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          item.status === 'Available'
                            ? 'text-green-600'
                            : item.status === 'In Use'
                            ? 'text-red-600'
                            : item.status === 'Under Maintenance'
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleButtonClick(item)} // ✅ navigate on click
                        className={`px-3 py-1 rounded font-semibold text-sm ${item.color}`}
                      >
                        {item.buttonText}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No matching equipment found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EquipmentScheduling;
