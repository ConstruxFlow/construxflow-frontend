import React from 'react';
import MaterialRequestRow from './MaterialRequestRow';

const MaterialRequestTable = ({ data }) => {
  return (
    <div className="overflow-auto rounded-lg shadow border border-[#E4E4E4]">
      <table className="w-full text-sm">
        <thead className="bg-[#efc11a] text-[#191919]">
          <tr>
            <th className="p-3 text-left">Request ID</th>
            <th className="p-3 text-left">Requested Items</th>
            <th className="p-3 text-left">Requested By</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Priority</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((request, i) => (
            <MaterialRequestRow key={i} request={request} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialRequestTable;

