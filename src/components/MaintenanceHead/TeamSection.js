// TeamSection.jsx
const teamMembers = [
  {
    initials: "JD",
    name: "John Davis",
    skills: "HVAC, Electrical",
    status: "Available",
    badge: "bg-[#236571] text-white",
  },
  {
    initials: "SM",
    name: "Sarah Miller",
    skills: "Plumbing, Ground",
    status: "On Task",
    badge: "bg-[#EFC11A] text-yellow-900",
  },
  {
    initials: "MJ",
    name: "Mike Johnson",
    skills: "Carpentry, Painting",
    status: "Available",
    badge: "bg-[#236571] text-white",
  },
  {
    initials: "LT",
    name: "Lisa Thompson",
    skills: "Electrical, Security",
    status: "On Duty",
    badge: "bg-gray-200 text-gray-700",
  },
  {
    initials: "RW",
    name: "Robert Wilson",
    skills: "HVAC, Mechanical",
    status: "On Task",
    badge: "bg-[#EFC11A] text-yellow-900",
  },
  {
    initials: "AI",
    name: "Anne Insert",
    skills: "General, Cleaning",
    status: "Available",
    badge: "bg-[#236571] text-white",
  },
  {
    initials: "DG",
    name: "David Garcia",
    skills: "Plumbing, HVAC",
    status: "On Duty",
    badge: "bg-gray-200 text-gray-700",
  },
];

export default function TeamSection({ onClose }) {
  return (
    <aside className="w-full max-w-xs bg-white rounded-xl shadow-xl border border-gray-200 p-6 fixed top-8 right-8 z-50">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-[#236571]">Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="text-xs text-gray-500 mb-4">
          Maintenance Technicians
        </div>
        <div className="flex flex-col gap-3">
          {teamMembers.map((member) => (
            <div
              key={member.initials}
              className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-[#236571] text-white">
                  {member.initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {member.name}
                  </div>
                  <div className="text-xs text-gray-500">{member.skills}</div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${member.badge}`}
              >
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
