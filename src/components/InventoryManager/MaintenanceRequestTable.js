import React from 'react';
import MaintenanceRequestRow from './MaintenanceRequestRow';

const MaintenanceRequestTable = ({ requests }) => {
  return (
    <div className="overflow-auto rounded-xl shadow border border-[#E4E4E4]">
      <table className="w-full text-sm">
        <thead className="bg-[#2E2F34] text-white">
          <tr>
            <th className="p-3 text-left">Equipment</th>
            <th className="p-3 text-left">Scheduled Date</th>
            <th className="p-3 text-left">Requested By</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, i) => (
            <MaintenanceRequestRow key={i} request={req} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceRequestTable;
