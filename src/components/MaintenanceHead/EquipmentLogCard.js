import { ClipboardCheck, AlertTriangle, Calendar, LogOut } from "lucide-react";

export default function EquipmentLogCard({
  name,
  type,
  status,
  statusColor,
  id,
  location,
  lastMaintenance,
  nextService,
  nextServiceColor,
  breakdowns,
  actions,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col min-w-[320px]">
      {/* Card Header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${statusColor}`}>
        <div>
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 font-semibold">{name}</span>
          </div>
          <span className="text-xs text-gray-600 block">{type}</span>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          status === "Operational"
            ? "bg-green-600 text-white"
            : status === "Needs Service"
            ? "bg-yellow-400 text-yellow-900"
            : "bg-red-500 text-white"
        }`}>
          {status}
        </span>
      </div>
      {/* Card Body */}
      <div className="px-4 py-4 flex-1 flex flex-col justify-between">
        <div className="mb-3">
          <div className="flex items-center text-sm mb-1 justify-between">
            <span className="text-gray-500 w-32">Equipment ID</span>
            <span className="text-gray-900 font-medium">{id}</span>
          </div>
          <div className="flex items-center text-sm mb-1 justify-between">
            <span className="text-gray-500 w-32">Location</span>
            <span className="text-gray-900 font-medium">{location}</span>
          </div>
          <div className="flex items-center text-sm mb-1 justify-between">
            <span className="text-gray-500 w-32">Last Maintenance</span>
            <span className="text-gray-900 font-medium">{lastMaintenance}</span>
          </div>
          <div className="flex items-center text-sm mb-1 justify-between">
            <span className="text-gray-500 w-32">Next Service</span>
            <span className={`font-medium ${nextServiceColor}`}>{nextService}</span>
          </div>
          <div className="flex items-center text-sm justify-between">
            <span className="text-gray-500 w-32">Total Breakdowns</span>
            <span className="text-gray-900 font-medium">{breakdowns} incidents</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex-1 bg-deep_green/90 hover:bg-deep_green text-purewhite px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1">
            <ClipboardCheck className="w-4 h-4" /> View Logs
          </button>
          {actions.includes("Schedule Service") && (
            <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-1">
              <Calendar className="w-4 h-4" /> Schedule Service
            </button>
          )}
          {actions.includes("Log Repair") && (
            <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-1">
              <LogOut className="w-4 h-4" /> Log Repair
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
