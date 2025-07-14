import React from 'react';

const MaintenanceTable = ({ data }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-yellow-200 text-yellow-800';
      case 'Overdue':
        return 'bg-red-200 text-red-700';
      case 'Confirmed':
        return 'bg-[#236571] text-white';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  const getActionButton = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'Reschedule';
      case 'Overdue':
        return 'Schedule Now';
      case 'Confirmed':
        return 'View Details';
      default:
        return 'Update';
    }
  };

  return (
    <div className="overflow-auto mt-6 border border-[#E4E4E4] rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#CEB8AD] text-[#191919]">
          <tr>
            <th className="px-4 py-3">Equipment</th>
            <th className="px-4 py-3">Maintenance Type</th>
            <th className="px-4 py-3">Scheduled Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((item, idx) => (
            <tr key={idx} className="border-b border-[#E4E4E4] hover:bg-[#F9F9F9]">
              <td className="px-4 py-3">
                <div className="font-semibold">{item.equipment}</div>
                <div className="text-xs text-gray-500">{item.unit}</div>
              </td>
              <td className="px-4 py-3">{item.type}</td>
              <td className="px-4 py-3">{item.date}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-[#236571] font-medium cursor-pointer hover:underline">
                {getActionButton(item.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;
