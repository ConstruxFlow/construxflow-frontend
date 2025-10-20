// TechnicianCard.jsx
export default function TechnicianCard({
  initials,
  name,
  skills,
  status, // "Active", "On Task", "Unavailable"
}) {
  // Color logic for status badge
  let badgeClass = "";
  let badgeText = "";
  if (status === "Available") {
    badgeClass = "bg-[#236571] text-white";
    badgeText = "Available";
  } else if (status === "On Task") {
    badgeClass = "bg-yellow-400 text-yellow-900";
    badgeText = "On Task";
  } else {
    badgeClass = "bg-gray-200 text-gray-500";
    badgeText = "Unavailable";
  }

  // Avatar color
  const avatarBg =
    status === "Unavailable" ? "bg-gray-300" : "bg-[#236571] text-white";

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white shadow-sm border border-gray-100 mb-2">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold ${avatarBg}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 truncate">{name}</div>
        <div className="text-xs text-gray-500 truncate">{skills}</div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
        {badgeText}
      </span>
    </div>
  );
}
