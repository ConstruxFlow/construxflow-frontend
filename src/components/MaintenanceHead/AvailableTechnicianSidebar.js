import TechnicianCard from "./TechnicianCard";

const technicians = [
  { initials: "JS", name: "John Smith", skills: "Plumbing, HVAC", status: "Active" },
  { initials: "SW", name: "Sarah Wilson", skills: "Electrical, Lighting", status: "On Task" },
  { initials: "MJ", name: "Mike Johnson", skills: "General Maintenance", status: "Unavailable" },
  { initials: "LC", name: "Lisa Chen", skills: "Plumbing, Water System", status: "Active" },
];

export default function AvailableTechniciansSidebar() {
  return (
    <aside className="w-full md:w-80 bg-white rounded-xl shadow p-5">
      <div className="text-[#236571] font-semibold mb-4 text-lg">Available Technicians</div>
      <div>
        {technicians.map((tech) => (
          <TechnicianCard key={tech.initials} {...tech} />
        ))}
      </div>
    </aside>
  );
}
