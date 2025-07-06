export default function TaskTypeSelector({ value, onChange }) {
  const options = [
    { label: "Preventive", color: "bg-[#236571] text-white" },
    { label: "Emergency", color: "bg-[#EFC11A] text-yellow-900" },
    { label: "Routine", color: "bg-gray-200 text-gray-700" },
  ];
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onChange(opt.label)}
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            value === opt.label
              ? opt.color + " border-[#236571]"
              : "bg-gray-100 text-gray-700 border-transparent"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
