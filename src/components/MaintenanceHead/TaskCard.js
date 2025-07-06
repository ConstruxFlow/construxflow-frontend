import { MapPin, ChevronDown } from "lucide-react";

export default function TaskCard({
  id,
  title,
  location,
  due,
  priority,
  priorityColor,
  status,
  statusColor,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-500">#{id}</span>
          <span className={`text-xs px-2 py-0.5 rounded font-semibold ${priorityColor}`}>
            {priority}
          </span>
        </div>
        <div className="font-medium text-gray-900">{title}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <MapPin className="w-3 h-3" />
          {location}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-[130px]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Due: {due}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${statusColor}`}>
            {status}
            <ChevronDown className="w-3 h-3 ml-1" />
          </span>
        </div>
      </div>
    </div>
  );
}
