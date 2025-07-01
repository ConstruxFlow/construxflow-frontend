import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import NavBar from "../../components/NavBar";

const serviceHistory = [
  {
    date: "March 15, 2024",
    type: "Critical",
    typeColor: "bg-red-100 text-red-600",
    issue: "Compressor Failure",
    technician: "John Martinez",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    parts: [
      { name: "Compressor Motor - Model CM-150", qty: 1 },
      { name: "Pressure Valve - PV-26", qty: 2 },
    ],
    notes:
      "Complete motor replacement due to bearing failure. System tested and operational. Recommended monthly inspections going forward.",
    open: true,
  },
  {
    date: "February 28, 2024",
    type: "Routine",
    typeColor: "bg-yellow-100 text-yellow-800",
    issue: "Scheduled Maintenance",
    technician: "Sarah Chen",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    parts: [
      { name: "Air Filter – AF-120", qty: 1 },
      { name: "Oil Filter – OF-45", qty: 1 },
    ],
    notes:
      "Routine quarterly maintenance completed. All filters replaced, oil changed, and pressure levels checked. System running optimally.",
    open: false,
  },
  {
    date: "January 10, 2024",
    type: "Repair",
    typeColor: "bg-orange-100 text-orange-600",
    issue: "Pressure Leak",
    technician: "Mike Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    parts: [
      { name: "Rubber Gasket Set – RG-30", qty: 1 },
      { name: "Sealant Compound – SC-15", qty: 1 },
    ],
    notes:
      "Identified and repaired pressure leak in main connection joint. Replaced gaskets and applied industrial sealant. System pressure restored to normal levels.",
    open: false,
  },
];

export default function ServiceHistoryContainer() {
  const [openIndexes, setOpenIndexes] = useState(
    serviceHistory.map((item) => !!item.open)
  );

  const toggleOpen = (idx) => {
    setOpenIndexes((prev) =>
      prev.map((open, i) => (i === idx ? !open : open))
    );
  };

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
    
    
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-2 flex justify-center items-start">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="rounded-t-lg bg-[#236571] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width={28} height={28} fill="none" viewBox="0 0 24 24">
              <path
                d="M5 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V4Z"
                fill="#EFC11A"
              />
            </svg>
            <div>
              <div className="text-white text-lg font-semibold leading-tight">
                Service History
              </div>
              <div className="text-[#EFC11A] text-xs">
                Equipment ID: EC-2024-001
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#EFC11A] text-[#236571] text-sm font-semibold px-4 py-2 rounded shadow hover:bg-yellow-400 transition">
            <FaDownload className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        {/* Equipment Info */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="font-semibold text-gray-700 mb-2 text-sm">
            Equipment Information
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-10 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Name: </span>
              <span className="font-semibold text-gray-900">
                Industrial Compressor Unit
              </span>
            </div>
            <div>
              <span className="text-gray-500">Model: </span>
              <span className="font-semibold text-gray-900">AC-500X</span>
            </div>
            <div>
              <span className="text-gray-500">Location: </span>
              <span className="font-semibold text-gray-900">
                Building A - Floor 2
              </span>
            </div>
          </div>
        </div>

        {/* Service History */}
        <div className="bg-white rounded-b-lg px-6 py-5">
          <div className="font-semibold text-gray-700 mb-4 text-sm">
            Maintenance History
          </div>
          <div className="flex flex-col gap-4">
            {serviceHistory.map((item, idx) => (
              <div
                key={item.date}
                className="border border-gray-200 rounded-lg bg-gray-50"
              >
                {/* Accordion Header */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3 rounded-t-lg focus:outline-none"
                  onClick={() => toggleOpen(idx)}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#236571] flex items-center">
                      <svg
                        className="mr-1"
                        width={18}
                        height={18}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x={2}
                          y={2}
                          width={20}
                          height={20}
                          rx={6}
                          fill="#236571"
                        />
                        <text
                          x="12"
                          y="16"
                          textAnchor="middle"
                          fontSize="11"
                          fill="white"
                          fontFamily="Arial"
                        >
                          {new Date(item.date).toLocaleString("en-US", {
                            month: "short",
                          })}
                        </text>
                      </svg>
                      {item.date}
                    </span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${item.typeColor}`}
                    >
                      {item.type}
                    </span>
                  </div>
                  {openIndexes[idx] ? (
                    <MdKeyboardArrowUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <MdKeyboardArrowDown className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                {/* Accordion Body */}
                {openIndexes[idx] && (
                  <div className="px-4 pb-4 text-sm">
                    <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-2">
                      <div>
                        <div className="text-gray-500">Issue Type</div>
                        <div className="font-semibold text-gray-800">
                          {item.issue}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Assigned Technician</div>
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                          <img
                            src={item.avatar}
                            alt={item.technician}
                            className="w-6 h-6 rounded-full border"
                          />
                          {item.technician}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-gray-500">Parts Used</div>
                      <ul className="ml-4 list-disc">
                        {item.parts.map((part) => (
                          <li key={part.name} className="flex justify-between">
                            <span>{part.name}</span>
                            <span className="text-gray-500 ml-2">
                              Qty: {part.qty}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-gray-500">Notes</div>
                      <div className="text-gray-700">{item.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
