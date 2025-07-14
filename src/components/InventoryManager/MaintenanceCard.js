import React from 'react';

const MaintenanceCard = ({ title, value, description, buttonLabel, bgColor, onClick }) => {
  return (
    <div className="flex-1 border border-[#E4E4E4] bg-white rounded-lg shadow-sm p-5">
      <h4 className="text-lg font-semibold text-[#2E2F34]">{title}</h4>
      <div className="text-4xl font-bold text-[#191919] my-2">{value}</div>
      <p className="text-sm text-[#2E2F34] mb-4">{description}</p>
      <button onClick={onClick} className={`${bgColor} text-white px-4 py-2 rounded`}>
        {buttonLabel}
      </button>
    </div>
  );
};

export default MaintenanceCard;
