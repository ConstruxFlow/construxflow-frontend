export default function ScheduleTimeline({ date, tasks }) {
  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  ];
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="font-semibold text-gray-900 mb-2">{date}</div>
      <div className="border-t border-gray-200 mt-2 pt-2">
        {timeSlots.map((slot, idx) => {
          const task = tasks.find((t) => t.time === slot);
          return (
            <div
              key={slot}
              className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-b-0"
            >
              <div className="w-24 text-xs text-gray-500">{slot}</div>
              {task ? (
                <div className={`flex-1 rounded px-3 py-2 font-semibold text-xs flex flex-col
                  ${task.type === "Preventive" ? "bg-[#236571] text-white" : ""}
                  ${task.type === "Emergency" ? "bg-[#EFC11A] text-yellow-900" : ""}
                  ${task.type === "Routine" ? "bg-gray-200 text-gray-700" : ""}
                `}>
                  <div>{task.title}</div>
                  <div className="font-normal text-xs">{task.team}</div>
                  <div className="font-normal text-xs">{task.timeRange}</div>
                </div>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-[#236571] inline-block" /> Preventive
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-[#EFC11A] inline-block" /> Emergency
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-200 inline-block" /> Routine
        </div>
      </div>
    </div>
  );
}
