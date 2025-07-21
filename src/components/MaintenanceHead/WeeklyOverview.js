export default function WeeklyOverview({ days, activeDay, onDayClick }) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white rounded-lg shadow-sm mb-6">
      {days.map((day) => (
        <button
          key={day.date}
          onClick={() => onDayClick(day.date)}
          className={`flex flex-col items-center px-2 py-1 rounded-md transition font-medium ${
            day.date === activeDay
              ? "bg-[#EFC11A] text-[#236571]"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <span className="text-xs">{day.label}</span>
          <span className="font-bold">{day.day}</span>
          <span
            className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
              day.date === activeDay
                ? "bg-[#236571] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {day.tasks} Task{day.tasks !== 1 ? "s" : ""}
          </span>
        </button>
      ))}
    </div>
  );
}
