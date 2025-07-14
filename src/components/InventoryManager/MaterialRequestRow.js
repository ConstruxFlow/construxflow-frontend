import React from 'react';

const getStatusStyle = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-700';
    case 'Pending':
      return 'bg-blue-100 text-blue-700';
    case 'Processing':
      return 'bg-orange-100 text-orange-700';
    case 'Completed':
      return 'bg-gray-200 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'High':
      return 'text-red-600';
    case 'Medium':
      return 'text-yellow-700';
    case 'Low':
      return 'text-blue-700';
    default:
      return 'text-gray-600';
  }
};

const MaterialRequestRow = ({ request }) => {
  return (
    <tr className="border-b border-[#E4E4E4] bg-white hover:bg-[#F9F9F9]">
      <td className="p-3 font-medium">{request.id}</td>
      <td className="p-3">
        <div className="font-semibold">{request.items}</div>
        <div className="text-xs text-gray-500">{request.itemCount}</div>
      </td>
      <td className="p-3">{request.requestedBy}</td>
      <td className="p-3">{request.date}</td>
      <td className={`p-3 font-semibold ${getPriorityStyle(request.priority)}`}>{request.priority}</td>
      <td className="p-3">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusStyle(request.status)}`}>
          {request.status}
        </span>
      </td>
      <td className="p-3">
        <button className="bg-[#236571] text-white px-3 py-1 rounded text-sm font-semibold hover:opacity-90">
          {request.status === 'Approved' ? 'Process' : 'View Details'}
        </button>
      </td>
    </tr>
  );
};

export default MaterialRequestRow;
