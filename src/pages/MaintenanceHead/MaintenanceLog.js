import { useState } from "react";
import { FaDownload, FaCalendarAlt, FaUser, FaTools } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

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
    typeColor: "bg-web_yellow/10 text-web_yellow",
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
  const navigation = useNavigate();

  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "#", onClick: () => navigation("/maintenance/dashboard") },
          { name: "Task", href: "#", onClick: () => navigation("/maintenance/scheduling") },
          {
            name: "Schedule",
            href: "#",
            onClick: () => navigation("/maintenance/update-equipment-maintenance"),
          },
          {
            name: "Team", href: "#",
            onClick: () => {
              console.log("Team link clicked");
              setShowTeam(true);
            },
          },
          { name: "Equipment", href: "#", onClick: () => navigation("/maintenance/equipment") },
          { name: "Add Technician", href: "#", onClick: () => navigation("/maintenance/add-member") },
        ]}
        showButton={true}
      />

      <div className="bg-purewhite min-h-screen">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-main_dark mb-2">Equipment Service History</h1>
            <p className="text-slatebluegray text-base">
              Complete maintenance and repair history for your equipment
            </p>
          </div>

          {/* Service History Card */}
          <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-deep_green to-deep_green/80 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg">
                  <FaTools className="w-6 h-6 text-main_dark" />
                </div>
                <div>
                  <div className="text-white text-lg font-semibold">
                    Service History
                  </div>
                  <div className="text-web_yellow text-sm">
                    Equipment ID: EC-2024-001
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-web_yellow hover:bg-web_yellow/80 text-main_dark text-sm font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150">
                <FaDownload className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            {/* Equipment Information */}
            <div className="border-b border-gray-200 px-6 py-5">
              <h3 className="font-semibold text-main_dark mb-4">Equipment Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slatebluegray">Name:</span>
                  <div className="font-semibold text-main_dark">Industrial Compressor Unit</div>
                </div>
                <div>
                  <span className="text-slatebluegray">Model:</span>
                  <div className="font-semibold text-main_dark">AC-500X</div>
                </div>
                <div>
                  <span className="text-slatebluegray">Location:</span>
                  <div className="font-semibold text-main_dark">Building A - Floor 2</div>
                </div>
              </div>
            </div>

            {/* Maintenance History */}
            <div className="px-6 py-5">
              <h3 className="font-semibold text-main_dark mb-6">Maintenance History</h3>
              <div className="space-y-4">
                {serviceHistory.map((item, idx) => (
                  <div
                    key={item.date}
                    className="bg-purewhite border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150"
                  >
                    {/* Accordion Header */}
                    <button
                      className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => toggleOpen(idx)}
                      type="button"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-lg flex items-center justify-center shadow-sm">
                          <FaCalendarAlt className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-main_dark flex items-center gap-3">
                            {item.date}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.typeColor}`}>
                              {item.type}
                            </span>
                          </div>
                          <div className="text-sm text-slatebluegray">{item.issue}</div>
                        </div>
                      </div>
                      {openIndexes[idx] ? (
                        <MdKeyboardArrowUp className="w-6 h-6 text-slatebluegray" />
                      ) : (
                        <MdKeyboardArrowDown className="w-6 h-6 text-slatebluegray" />
                      )}
                    </button>

                    {/* Accordion Body */}
                    {openIndexes[idx] && (
                      <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50/50">
                        <div className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <div className="text-sm font-medium text-slatebluegray mb-1">Issue Type</div>
                              <div className="font-semibold text-main_dark">{item.issue}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slatebluegray mb-2">Assigned Technician</div>
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.avatar}
                                  alt={item.technician}
                                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                />
                                <span className="font-semibold text-main_dark">{item.technician}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-sm font-medium text-slatebluegray mb-2">Parts Used</div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              {item.parts.map((part, partIdx) => (
                                <div key={part.name} className={`flex justify-between items-center py-2 ${partIdx !== item.parts.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                  <span className="text-sm text-main_dark">{part.name}</span>
                                  <span className="text-sm text-slatebluegray font-medium">
                                    Qty: {part.qty}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium text-slatebluegray mb-2">Service Notes</div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <p className="text-sm text-main_dark leading-relaxed">{item.notes}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay and Team Sidebar */}
      {showTeam && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-all"
            onClick={() => setShowTeam(false)}
            aria-label="Close team sidebar"
          />
          <TeamSection onClose={() => setShowTeam(false)} />
        </>
      )}
    </>
  );
}
