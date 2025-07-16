import React from 'react';
import { FaTools, FaTruckMoving, FaWrench, FaHammer } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  'Excavator CAT-320': <FaTruckMoving className="text-[#236571] mr-2" />,
  'Concrete Mixer CM-500': <FaTools className="text-[#236571] mr-2" />,
  'Tower Crane TC-1000': <FaWrench className="text-[#236571] mr-2" />,
  'Jackhammer JH-250': <FaHammer className="text-[#236571] mr-2" />,
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-[#efc11a] text-white';
    case 'Approved':
      return 'bg-blue-100 text-[#236571]';
    case 'Completed':
      return 'bg-green-200 text-green-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const MaintenanceRequestRow = ({ request }) => {
  const navigate = useNavigate();

  return (
    <tr className="border-b border-[#E4E4E4] hover:bg-[#F9F9F9]">
      <td className="flex items-center gap-2 p-3 font-semibold text-[#2E2F34]">
        {iconMap[request.equipment]}
        {request.equipment}
      </td>
      <td className="p-3 text-[#2E2F34]">{request.date}</td>
      <td className="p-3 text-[#2E2F34]">{request.requestedBy}</td>
      <td className="p-3">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(request.status)}`}>
          {request.status}
        </span>
      </td>
      <td className="p-3">
        <button className="bg-[#2E2F34] text-white text-sm px-4 py-1 rounded hover:opacity-90"
        onClick={()=>navigate("/maintenance-request-page")}
        >
          View Material Requests
        </button>
      </td>
    </tr>
  );
};

export default MaintenanceRequestRow;
