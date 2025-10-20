import { CheckCircle, User } from "lucide-react";
import { use, useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

export default function TaskCompleteContainer() {
  const [showTeam, setShowTeam] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [teamMember, setTeamMember] = useState(null);
  const [completionTime, setCompletionTime] = useState(null);
  const { id } = useParams();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const assignId = params.get("assignId");
  const assignId2 = params.get("assignId2");
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetch(
      `http://localhost:8080/api/equipment-scheduling/${encodeURIComponent(id)}`
    )
      .then((res) => {
        if (res.status === 404) {
          throw new Error("Equipment not found");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch equipment details");
        }
        return res.json();
      })
      .then((data) => {
        setEquipment(data);
      })
      .catch((err) => {
        console.error("Error fetching equipment details:", err);
        setEquipment(null);
      });
  }, [id]);

  console.log("Equipment data:", equipment);
  console.log("Assignment ID:", assignId);

  useEffect(() => {
    if (!assignId || !id) return;

    fetch(
      `http://localhost:8080/api/equipmentassigntechnician/getbyassignId?scheduleId=${encodeURIComponent(
        id
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return res.json();
      })
      .then((data) => {
        const formatted = Array.isArray(data) ? data : [data];
        setAssignments(formatted);
      })
      .catch((err) => {
        console.error("Error fetching assignment details:", err);
        setAssignments([]);
      });
  }, [assignId, id]);

  console.log("Assignment data:", assignments);

  // Add this new useEffect to fetch next schedule data for multiple assignments
  useEffect(() => {
    if (!assignId) return;

    fetch(
      `http://localhost:8080/api/nextschedule?assignId=${encodeURIComponent(
        assignId
      )}`
    )
      .then((res) => {
        if (res.status === 404) throw new Error("Schedule not found");
        if (!res.ok) throw new Error("Failed to fetch next schedule");
        return res.json();
      })
      .then((data) => {
        // Handle both single object and array responses
        const scheduleArray = Array.isArray(data) ? data : [data];

        // ✅ Get unique maintenance details (since they should be the same)
        const uniqueSchedule =
          scheduleArray.length > 0
            ? {
                nextDate: scheduleArray[0].nextDate, // "2025-07-23"
                nextMaintenanceType: scheduleArray[0].nextMaintenanceType, // "Preventive Maintenance"
                priority: scheduleArray[0].priority, // "Low"
                estimateDuration: scheduleArray[0].estimateDuration, // "1 hour"
                technicians: scheduleArray.map((item) => ({
                  technicianId: item.technicianId,
                  nextScheduleId: item.nextScheduleId,
                })),
              }
            : null;

        setNextSchedule(uniqueSchedule);
      })
      .catch((err) => {
        setNextSchedule(null);
        console.error("Error fetching next schedule:", err);
      });
  }, [assignId]);

  console.log("Next Schedule data:", nextSchedule);

  useEffect(() => {
    fetch("http://localhost:8080/api/team/all")
      .then((res) => res.json())
      .then(setTeamMembers)
      .catch((err) => {
        console.error("Error fetching team members:", err);
      });
  }, []);

  console.log("Team Member data:", teamMember);

  function getHoursDifference(startDateStr, endDateStr) {
    if (!startDateStr || !endDateStr) return null;
    // Parse date strings
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    // If invalid date, return null
    if (isNaN(start) || isNaN(end)) return null;
    // Calculate difference in ms
    const diffMs = end - start;
    // Convert ms to hours
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours.toFixed(1); // e.g., 24.0 or 27.5 etc.
  }

  useEffect(() => {
    if (!completionTime) {
      setCompletionTime(new Date().toISOString());
    }
  }, [completionTime]);

  // Formatting as before
  if (!completionTime) return null;

  const date = new Date(completionTime);
  const formatted = `Completed on ${date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  })} at ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;

  const handleGenerateWorkReport = () => {
    // Add print styles to current page temporarily
    const printStyle = document.createElement('style');
    printStyle.id = 'temp-work-report-print-style';
    printStyle.textContent = `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body * {
          visibility: hidden;
        }
        .print-work-report-content, .print-work-report-content * {
          visibility: visible;
        }
        .print-work-report-content {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          background: white !important;
          padding: 20px !important;
          box-shadow: none !important;
        }
        /* Preserve all background colors */
        .bg-gray-50, .bg-slate-50 {
          background-color: #f9fafb !important;
        }
        .bg-white {
          background-color: white !important;
        }
        .bg-green-50 {
          background-color: #f0fdf4 !important;
        }
        .bg-blue-50 {
          background-color: #eff6ff !important;
        }
        .bg-yellow-50, .bg-\\[\\#EFC11A\\] {
          background-color: #fefce8 !important;
        }
        .bg-gray-100 {
          background-color: #f3f4f6 !important;
        }
        /* Preserve text colors */
        .text-\\[\\#236571\\] {
          color: #236571 !important;
        }
        .text-gray-600 {
          color: #4b5563 !important;
        }
        .text-gray-700 {
          color: #374151 !important;
        }
        .text-gray-900 {
          color: #111827 !important;
        }
        .text-gray-800 {
          color: #1f2937 !important;
        }
        .text-green-600 {
          color: #059669 !important;
        }
        .text-yellow-900 {
          color: #713f12 !important;
        }
        /* Preserve borders */
        .border-gray-200 {
          border-color: #e5e7eb !important;
        }
        .border-gray-400 {
          border-color: #9ca3af !important;
        }
        /* Hide buttons in print */
        button {
          display: none !important;
        }
        /* Preserve shadows and rounded corners */
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .rounded-lg {
          border-radius: 8px !important;
        }
        .rounded-full {
          border-radius: 9999px !important;
        }
        /* Page break controls */
        .technicians-section {
          page-break-before: always !important;
          break-before: page !important;
          margin-top: 0 !important;
          padding-top: 20px !important;
        }
        .technicians-section .text-sm {
          margin-top: 0 !important;
        }
        /* Prevent page breaks within sections */
        .bg-white {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      }
    `;
    
    // Add the print style to current page
    document.head.appendChild(printStyle);
    
    // Trigger print on current page
    window.print();
    
    // Remove the temporary print style after printing
    setTimeout(() => {
      const tempStyle = document.getElementById('temp-work-report-print-style');
      if (tempStyle) {
        tempStyle.remove();
      }
    }, 1000);
  };

  return (
    <>
      <NavBar
      profileURL="/maintenance/profile"
        links={[
          {
            name: "Dashboard",
            href: "#",
            onClick: () => navigate("/maintenance/dashboard"),
          },
          {
            name: "Task",
            href: "#",
            onClick: () => navigate("/maintenance/scheduling"),
          },
          {
            name: "Schedule",
            href: "#",
            onClick: () =>
              navigate("/maintenance/update-equipment-maintenance"),
          },
          {
            name: "Team",
            href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");

              setShowTeam(true);
            },
          },
          {
            name: "Equipment",
            href: "#",
            onClick: () => navigate("/maintenance/equipment"),
          },
          {
            name: "Add Technician",
            href: "#",
            onClick: () => navigate("/maintenance/add-member"),
          },
        ]}
        
      />

      <div className="min-h-screen bg-gray-50 px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl print-work-report-content">
          {/* Success Banner */}
          <div className="bg-[#EFC11A] rounded-lg flex flex-col items-center justify-center py-8 mb-8">
            <CheckCircle className="w-10 h-10 text-[#236571] mb-2" />
            <h2 className="text-xl font-semibold text-[#236571] mb-1">
              Task Completed Successfully
            </h2>
            <div className="text-gray-800 text-sm">{formatted}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Request Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="font-semibold text-[#236571] mb-3">
                  Request Summary
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Request ID:</div>
                    <div className="font-medium text-gray-900">
                      {equipment?.id}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Equipment Name:</div>
                    <div className="font-medium text-gray-900">
                      {equipment?.equipmentName}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Category:</div>
                    <div className="font-medium text-gray-900">
                      {equipment?.equipmentType}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="font-semibold text-[#236571] mb-3">
                  Status Update
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Previous Status:</div>
                    <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium mt-1">
                      {equipment?.priority} Priority -{" "}
                      {equipment?.maintenanceType}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Current Status:</div>
                    <div className="inline-block px-3 py-1 rounded-full bg-[#EFC11A] text-yellow-900 text-xs font-medium mt-1">
                      Operational - Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-[#236571] mb-4">
                  Completion Details
                </h3>
                {/* ✅ Show shared values like Start Date, Notes only once */}
                {assignments.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-500">Start Date:</div>
                      <div className="font-medium text-gray-900">
                        {assignments[0]?.startDate || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Expected Duration:</div>
                      <div className="font-medium text-gray-900">
                        {assignments[0]?.duration || "N/A"}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-gray-500">Notes:</div>
                      <div className="font-medium text-gray-900">
                        {assignments[0]?.notes || "No notes provided"}
                      </div>
                    </div>
                  </div>
                )}
                {/* ✅ Show technician list */}
                <div className="mt-4 technicians-section">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Technicians:
                  </div>
                  <div className="space-y-3">
                    {assignments.map((assign, index) => {
                      const tech = teamMembers.find(
                        (t) => t.empId === assign.technicianId
                      );
                      const initials =
                        tech?.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")
                          ?.toUpperCase() || "T";

                      return (
                        <div
                          key={assign.assignId}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-[#236571] text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {tech?.name ?? assign.technicianId}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Duration difference */}
                {nextSchedule && assignments.length > 0 && (
                  <div className="mt-6 text-sm">
                    <div className="text-gray-500">Actual Duration:</div>
                    <div className="font-medium text-gray-900">
                      {getHoursDifference(
                        assignments[0]?.startDate,
                        nextSchedule?.nextDate
                      ) || "N/A"}{" "}
                      hours ({assignments[0]?.duration || "Expected unknown"})
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Equipment Status Updated */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-[#236571]">
                    Equipment Status Updated
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#236571] text-white text-xs font-medium">
                    Operational
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <div className="flex justify-between">
                    <span>Next Maintenance:</span>
                    <span className="font-medium">
                      {/* ✅ Shows: "2025-07-23" */}
                      {nextSchedule?.nextDate || "Not scheduled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection Due:</span>
                    <span className="font-medium">
                      {assignments[0]?.startDate || "N/A"}
                    </span>
                  </div>
                  {nextSchedule?.technicians && (
                    <div className="flex justify-between mt-1">
                      <span>Assigned Technicians:</span>
                      <span className="font-medium">
                        {/* ✅ Shows: "2 technician(s)" */}
                        {nextSchedule.technicians.length} technician(s)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button 
                  className="w-full bg-[#EFC11A] hover:bg-yellow-400 text-[#236571] font-semibold rounded-md py-2 transition"
                  onClick={handleGenerateWorkReport}
                >
                  Generate Work Report
                </button>
                <button
                  className="w-full bg-[#236571] hover:bg-[#17484b] text-white font-semibold rounded-md py-2 transition"
                  onClick={() => {
                    navigate(`/maintenance/log?equipmentId=${equipment?.equipmentId || id}`);
                  }}
                >
                  Equipment Log
                </button>
                <button
                  className="w-full border border-gray-400 text-gray-800 font-semibold rounded-md py-2 transition"
                  onClick={() => {
                    navigate("/maintenance/dashboard");
                  }}
                >
                  Return to Dashboard
                </button>
              </div>

              {/* Recommended Actions */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="font-semibold text-gray-600 mb-2">
                  Recommended Actions
                </div>
                <div className="bg-white rounded mb-2 p-3 shadow-sm">
                  <div className="font-semibold text-gray-800 text-sm">
                    {/* ✅ Shows: "Preventive Maintenance" */}
                    {nextSchedule?.nextMaintenanceType ||
                      "No upcoming maintenance"}
                  </div>
                  {nextSchedule?.nextDate && (
                    <div className="text-xs text-gray-600 mt-1">
                      {/* ✅ Shows: "Scheduled for: 2025-07-23" */}
                      Scheduled for: {nextSchedule.nextDate}
                    </div>
                  )}
                  {nextSchedule?.estimateDuration && (
                    <div className="text-xs text-gray-600">
                      {/* ✅ Shows: "Duration: 1 hour" */}
                      Duration: {nextSchedule.estimateDuration}
                    </div>
                  )}
                </div>
              </div>

              {/* Next Maintenance Details (Optional - if you want to show more details) */}
              {nextSchedule && nextSchedule.technicians && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="font-semibold text-gray-600 mb-2">
                    Next Maintenance Team
                  </div>
                  <div className="space-y-2">
                    {nextSchedule.technicians.map((tech, index) => {
                      const teamMember = teamMembers.find(
                        (t) => t.empId === tech.technicianId
                      );
                      return (
                        <div
                          key={tech.nextScheduleId}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-6 h-6 bg-[#236571] text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {teamMember?.name?.charAt(0) || "T"}
                          </div>
                          <span className="text-gray-700">
                            {teamMember?.name || tech.technicianId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notifications Sent */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="font-semibold text-gray-600 mb-2">
                  Notifications Sent
                </div>
                <div className="flex flex-col gap-1 text-sm text-gray-800">
                  <div className="flex items-center gap-2">
                    <span>Inventory Manager</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Admin</span>
                    <span className="text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay and Team Sidebar */}
      {showTeam && (
        <>
          {/* BLUR OVERLAY */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-all"
            onClick={() => setShowTeam(false)}
            aria-label="Close team sidebar"
          />
          {/* TEAM SIDEBAR */}
          <TeamSection onClose={() => setShowTeam(false)} />
        </>
      )}
    </>
  );
}
