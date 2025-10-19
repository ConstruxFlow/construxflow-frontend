import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ScheduleOverview = ({ equipmentList = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Use current date instead of hardcoded date
  const [schedulingData, setSchedulingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch equipment scheduling data from API
  useEffect(() => {
    const fetchSchedulingData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/equipment-scheduling");
        if (!response.ok) {
          throw new Error("Failed to fetch scheduling data");
        }
        const data = await response.json();
        setSchedulingData(data);
        console.log("Fetched Scheduling Data:", data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching scheduling data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedulingData();
  }, []);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Get schedule status for a specific day
  const getScheduleStatus = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const targetDate = new Date(year, month, day);

    const scheduleForDay = schedulingData.find((schedule) => {
      if (!schedule.date) return false;
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === targetDate.toDateString();
    });

    if (scheduleForDay) {
      console.log(`Day ${day}: Found schedule with status "${scheduleForDay.status}" for ${scheduleForDay.equipmentName}`);
    }

    return scheduleForDay ? scheduleForDay.status : null;
  };

  // Get detailed schedule information for a specific day
  const getScheduleDetails = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const targetDate = new Date(year, month, day);

    return schedulingData.find((schedule) => {
      if (!schedule.date) return false;
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === targetDate.toDateString();
    });
  };

  // Legacy function for backward compatibility with equipmentList prop
  const hasPendingTask = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const targetDate = new Date(year, month, day);

    return equipmentList.some((task) => {
      if (!task.date || task.status?.toLowerCase() !== "pending") return false;
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === targetDate.toDateString();
    });
  };

  const isToday = (day) => {
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const targetDate = new Date(year, month, day);
    return targetDate.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Schedule Overview
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              {currentMonth} {currentYear}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const scheduleStatus = getScheduleStatus(day);
            const scheduleDetails = getScheduleDetails(day);
            const hasLegacyPending = hasPendingTask(day);
            
            // Create tooltip text
            const getTooltipText = () => {
              if (scheduleDetails) {
                return `${scheduleDetails.equipmentName} - ${scheduleDetails.maintenanceType} (${scheduleDetails.status})`;
              }
              if (isToday(day)) {
                return "Today";
              }
              return "";
            };
            
            return (
              <div
                key={index}
                title={getTooltipText()}
                className={`
                  relative text-center py-3 text-sm cursor-pointer rounded transition-colors
                  ${day === null ? "invisible" : ""}
                  ${
                    isToday(day)
                      ? "bg-yellow-400 text-yellow-900 font-semibold shadow-sm"
                      : scheduleStatus === "Completed"
                      ? "bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-300"
                      : scheduleStatus === "ASSIGNED" || scheduleStatus === "Accept"
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-300"
                      : scheduleStatus === "Pending"
                      ? "bg-orange-50 text-orange-700 hover:bg-orange-100 border-2 border-dashed border-orange-300"
                      : hasLegacyPending
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-dashed border-blue-300"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {day}
                {/* Status indicators - Enhanced visibility */}
                {scheduleStatus === "Completed" && !isToday(day) && (
                  <div className="absolute top-1 right-1">
                    <div className="w-3 h-3 bg-green-600 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                )}
                {(scheduleStatus === "ASSIGNED" || scheduleStatus === "Accept") && !isToday(day) && (
                  <div className="absolute top-1 right-1">
                    <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                )}
                {scheduleStatus === "Pending" && !isToday(day) && (
                  <div className="absolute top-1 right-1">
                    <div className="w-3 h-3 bg-orange-600 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                  </div>
                )}
                {hasLegacyPending && !scheduleStatus && !isToday(day) && (
                  <div className="absolute top-1 right-1">
                    <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                )}
                {isToday(day) && (
                  <div className="absolute top-1 right-1">
                    <div className="w-3 h-3 bg-yellow-800 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                )}
                
                {/* Additional status text for better visibility */}
                {scheduleStatus && !isToday(day) && (
                  <div className="absolute bottom-0.5 left-0.5 text-[8px] font-bold uppercase tracking-wider">
                    {scheduleStatus === "Completed" && "✓"}
                    {scheduleStatus === "ASSIGNED" && "A"}
                    {scheduleStatus === "Accept" && "✓"}
                    {scheduleStatus === "Pending" && "P"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend - Enhanced */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-800 rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-6 h-6 bg-green-50 border-2 border-green-300 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700">Completed ✓</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-6 h-6 bg-blue-50 border-2 border-blue-300 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700">Assign/Accept</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-6 h-6 bg-orange-50 border-2 border-dashed border-orange-300 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700">Pending P</span>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading schedule...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-red-600">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleOverview;
