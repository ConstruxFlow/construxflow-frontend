import { useState } from "react";

import { Calendar } from "lucide-react";
import WeeklyOverview from "../../components/MaintenanceHead/WeeklyOverview";
import TaskTypeSelector from "../../components/MaintenanceHead/TaskTypeSelector";
import PrioritySelector from "../../components/MaintenanceHead/PrioritySelector";
import ScheduleTimeline from "../../components/MaintenanceHead/ScheduleTimeline";
import NavBar from "../../components/NavBar";

const weeklyDays = [
  { label: "Mon", day: 19, date: "2023-06-19", tasks: 2 },
  { label: "Tue", day: 20, date: "2023-06-20", tasks: 3 },
  { label: "Wed", day: 21, date: "2023-06-21", tasks: 1 },
  { label: "Thu", day: 22, date: "2023-06-22", tasks: 4 },
  { label: "Fri", day: 23, date: "2023-06-23", tasks: 1 },
  { label: "Sat", day: 24, date: "2023-06-24", tasks: 0 },
  { label: "Sun", day: 25, date: "2023-06-25", tasks: 1 },
];

const timelineTasks = [
  {
    time: "8:00 AM",
    title: "Excavator #EX-2103 Oil Change",
    team: "Mechanical Team A",
    type: "Preventive",
    timeRange: "8:00 - 8:45 AM",
  },
  {
    time: "9:00 AM",
    title: "Bulldozer #BD-1972 Hydraulic Check",
    team: "Mechanical Specialists",
    type: "Emergency",
    timeRange: "9:30 - 10:15 AM",
  },
  {
    time: "11:00 AM",
    title: "Crane #CR-4691 Safety Inspection",
    team: "Safety Team",
    type: "Routine",
    timeRange: "10:00 AM - 12:00 PM",
  },
  {
    time: "1:00 PM",
    title: "Loader #LP-2320 Electrical Repair",
    team: "Electrical Team B",
    type: "Emergency",
    timeRange: "1:00 - 1:45 PM",
  },
  {
    time: "2:00 PM",
    title: "Truck Fleet Preventive Maintenance",
    team: "Mechanical Team A",
    type: "Preventive",
    timeRange: "2:00 - 4:15 PM",
  },
];

export default function MaintenanceScheduling() {
  const [activeDay, setActiveDay] = useState("2023-06-22");
  const [taskType, setTaskType] = useState("Preventive");
  const [priority, setPriority] = useState("Medium");
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

    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Maintenance Scheduling</h1>
          <p className="text-gray-600 text-sm">
            Plan and schedule equipment maintenance tasks efficiently
          </p>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-4 items-center mb-6">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Equipment Type</label>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm bg-white">
              <option>All Equipment</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Site Location</label>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm bg-white">
              <option>All Sites</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Availability</label>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm bg-white">
              <option>All Status</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date Range</label>
            <div className="flex items-center border border-gray-200 rounded px-3 py-2 bg-white">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">Jun 19 - Jun 25, 2023</span>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <WeeklyOverview
          days={weeklyDays}
          activeDay={activeDay}
          onDayClick={setActiveDay}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Maintenance Task */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">New Maintenance Task</h2>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Equipment Type</label>
              <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white">
                <option>Select Equipment Type</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Equipment</label>
              <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white">
                <option>Select Equipment</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Task Type</label>
              <TaskTypeSelector value={taskType} onChange={setTaskType} />
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white" rows={2} placeholder="Describe the maintenance task." />
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Assigned Team</label>
              <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white">
                <option>Select Team</option>
              </select>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Date</label>
                <input type="date" className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Time</label>
                <input type="time" className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white" />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Estimated Duration</label>
              <input type="text" className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white" placeholder="1 hour" />
            </div>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <PrioritySelector value={priority} onChange={setPriority} />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#236571] hover:bg-[#17484b] text-white font-semibold rounded-md py-2 transition">
                Schedule Task
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 font-semibold rounded-md py-2 bg-white hover:bg-gray-50 transition">
                Save Draft
              </button>
            </div>
          </div>

          {/* Timeline */}
          <ScheduleTimeline
            date="Thursday, June 22, 2023"
            tasks={timelineTasks}
          />
        </div>
      </div>
    </div>
    </>
  );
}
