import React from 'react';

const MaterialRequestFilter = ({ filters, activeFilter, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {filters.map((label) => (
        <button
          key={label}
          onClick={() => onSelect(label)}
          className={`px-4 py-1 rounded-full text-sm ${
            activeFilter === label ? 'bg-[#efc11a] text-white' : 'bg-[#E4E4E4] text-[#2E2F34]'
          } hover:opacity-90`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default MaterialRequestFilter;
