export default function PrioritySelector({ value, onChange }) {
  const options = [
    { label: "Low", color: "bg-gray-200 text-gray-700" },
    { label: "Medium", color: "bg-[#EFC11A] text-yellow-900" },
    { label: "High", color: "bg-red-500 text-white" },
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
