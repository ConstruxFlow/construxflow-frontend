import { useState } from "react";
import { Filter, Plus, Calendar, ChevronDown, User } from "lucide-react";
import NavBar from "../../components/NavBar";

const upcomingMaintenance = [
  {
    title: "HVAC System A1",
    subtitle: "Preventive Maintenance",
    date: "Due Dec 27, 2024",
    status: "Scheduled",
    statusColor: "bg-[#236571] text-white"
  },
  {
    title: "Elevator Unit 2",
    subtitle: "Inspection Maintenance",
    date: "Due Dec 15, 2024",
    status: "Overdue",
    statusColor: "bg-[#EFC11A] text-yellow-900"
  },
  {
    title: "Fire Safety System",
    subtitle: "Emergency Check",
    date: "Due Jan 20, 2025",
    status: "Scheduled",
    statusColor: "bg-red-500 text-white"
  }
];

const quickSchedulePresets = [
  { label: "30 Days", value: 30 },
  { label: "60 Days", value: 60 },
  { label: "90 Days", value: 90 },
  { label: "6 Months", value: 180 },
  { label: "1 Year", value: 365 }
];

export default function NextScheduleContainer() {
  const [selectedTab, setSelectedTab] = useState("Due This Week");
  const [requestId, setRequestId] = useState("MR-2024-001");
  const [priority, setPriority] = useState("High");
  const [currentStatus, setCurrentStatus] = useState("In Progress");
  const [equipment, setEquipment] = useState("HVAC System - Building A");
  const [description, setDescription] = useState("");
  const [assignedTechnician, setAssignedTechnician] = useState("John Smith");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("2 hours");
  const [notes, setNotes] = useState("");
  
  // Schedule Next Maintenance form state
  const [maintenanceType, setMaintenanceType] = useState("Preventive Maintenance");
  const [scheduledDate, setScheduledDate] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("1 hour");
  const [priorityLevel, setPriorityLevel] = useState("Low");
  const [assignedTech, setAssignedTech] = useState("John Smith (Current)");
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = ["Due This Week", "Due This Month", "Overdue"];
  const [showTeam, setShowTeam] = useState(false);

  return (
    <>
    <NavBar
      links={[
          { name: "Dashboard", href: "#" },
          { name: "Task", href: "#" },
          { name: "Team", href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");
              
              setShowTeam(true);
            },
           },
          { name: "Equipment", href: "#" },
          { name: "Request Tracker", href: "#" },
        ]}
        showButton={true}
    />

    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Next Schedule</h1>
            <p className="text-gray-600 text-sm">Manage maintenance next schedule and assignments</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#236571] text-white rounded-md text-sm font-medium hover:bg-[#1e5a63] transition">
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upcoming Maintenance */}
          <div className="lg:col-span-2">
            {/* Upcoming Scheduled Maintenance */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Scheduled Maintenance</h2>
              
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                      selectedTab === tab
                        ? "border-[#236571] text-[#236571]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Maintenance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingMaintenance.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Request Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Request Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request ID</label>
                  <input
                    type="text"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#EFC11A] text-yellow-900 rounded-full text-xs font-medium">
                    {currentStatus}
                  </span>
                  <span className="text-sm text-gray-500">To</span>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change Status</label>
                  <div className="relative">
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none bg-[#236571] text-white"
                      defaultValue="Select new status"
                    >
                      <option>Select new status</option>
                      <option>Completed</option>
                      <option>On Hold</option>
                      <option>Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-white pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter maintenance description..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            </div>

            {/* Assignment Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Technician</label>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#236571] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{assignedTechnician}</span>
                  <span className="text-xs text-gray-500">Senior Technician</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="mm/dd/yyyy --:-- --"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                  <div className="relative">
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                    >
                      <option>2 hours</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>1 day</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-[#236571] text-white rounded-md text-sm font-medium hover:bg-[#1e5a63] transition">
                  Confirm
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Schedule Next Maintenance */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Schedule Next Maintenance</h2>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Maintenance Type</label>
                  <div className="relative">
                    <select
                      value={maintenanceType}
                      onChange={(e) => setMaintenanceType(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                    >
                      <option>Preventive Maintenance</option>
                      <option>Corrective Maintenance</option>
                      <option>Emergency Maintenance</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      placeholder="mm/dd/yyyy"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                  <div className="relative">
                    <select
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                    >
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>4 hours</option>
                      <option>1 day</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                  <div className="relative">
                    <select
                      value={priorityLevel}
                      onChange={(e) => setPriorityLevel(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Technician</label>
                  <div className="relative">
                    <select
                      value={assignedTech}
                      onChange={(e) => setAssignedTech(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                    >
                      <option>John Smith (Current)</option>
                      <option>Sarah Wilson</option>
                      <option>Mike Johnson</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Schedule Presets</label>
                  <div className="flex flex-wrap gap-2">
                    {quickSchedulePresets.map((preset) => (
                      <button
                        key={preset.value}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t pt-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Scheduled Maintenance Preview</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Type:</span> {maintenanceType}</p>
                        <p><span className="font-medium">Date:</span> To be selected</p>
                        <p><span className="font-medium">Technician:</span> John Smith</p>
                        <p><span className="font-medium">Duration:</span> 2 hours</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 bg-[#EFC11A] hover:bg-yellow-400 text-yellow-900 font-medium py-2 rounded-md text-sm transition">
                    Schedule Maintenance
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
