import React from 'react';

const EquipmentCard = ({ icon, name, status, utilization, buttonText, color }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-600';
      case 'In Use':
        return 'text-red-600';
      case 'Partially Available':
        return 'text-yellow-600';
      case 'Under Maintenance':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-[#E4E4E4] shadow hover:shadow-md transition duration-300">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg text-[#2E2F34] mb-1">{name}</h3>
      <p className="text-sm">
        <span className="font-medium">Status: </span>
        <span className={getStatusColor(status)}>{status}</span>
      </p>
      <p className="text-sm mb-4">
        <span className="font-medium">Utilization: </span>
        {utilization} Utilized
      </p>
      <button className={`w-full py-2 rounded text-sm font-semibold ${color}`}>
        {buttonText}
      </button>
    </div>
  );
};

export default EquipmentCard;
