import { CheckCircle, User } from "lucide-react";
import { use, useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

export default function TaskCompleteContainer() {
  const [showTeam, setShowTeam] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [teamMember, setTeamMember] = useState(null);
  const [completionTime, setCompletionTime] = useState(null);
  const { id } = useParams();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const assignId = params.get("assignId");
  const navigate = useNavigate();



  

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
    if (!assignId) return;

    fetch(
      `http://localhost:8080/api/equipmentassigntechnician/getbyassignId?id=${encodeURIComponent(
        assignId
      )}`
    )
      .then((res) => {
        if (res.status === 404) {
          throw new Error("Assignment not found");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch assignment");
        }
        return res.json();
      })
      .then((data) => {
        setAssignment(data);
      })
      .catch((err) => {
        console.error("Error fetching assignment details:", err);
        setAssignment(null);
      });
  }, [assignId]);

  console.log("Assignment data:", assignment);

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
        setNextSchedule(data);
      })
      .catch((err) => {
        setNextSchedule(null);
        console.error("Error fetching next schedule:", err);
      });
  }, [assignId]);

  console.log("Next Schedule data:", nextSchedule);

  useEffect(() => {
    if (!assignment?.technicianId) return;

    fetch(
      `http://localhost:8080/api/team?id=${encodeURIComponent(
        assignment?.technicianId
      )}`
    )
      .then((res) => {
        if (res.status === 404) throw new Error("Team Member Not Found");
        if (!res.ok) throw new Error("Failed to fetch team member");
        return res.json();
      })
      .then((data) => {
        setTeamMember(data);
      })
      .catch((err) => {
        console.error("Error fetching team member:", err);
        setTeamMember(null);
      });
  }, [assignment?.technicianId]);

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
    day: "2-digit"
  })} at ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })}`;

  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "#", onClick: () => navigate("/maintenance/dashboard") },
          { name: "Task", href: "#",onClick: () => navigate("/maintenance/scheduling") },
          {
            name: "Schedule",
            href: "#",
            onClick: () =>
              navigate("/maintenance/update-equipment-maintenance"),
          },
          { name: "Team", href: "#",
            onClick: () => {
              // e.preventDefault();
              console.log("Team link clicked");
              
              setShowTeam(true);
            },
           },
          { name: "Equipment", href: "#" ,onClick: () => navigate("/maintenance/equipment")},
          { name: "Add Technician", href: "#",onClick: () => navigate("/maintenance/add-member") },
        ]}
        showButton={true}
      />

      <div className="min-h-screen bg-gray-50 px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          {/* Success Banner */}
          <div className="bg-[#EFC11A] rounded-lg flex flex-col items-center justify-center py-8 mb-8">
            <CheckCircle className="w-10 h-10 text-[#236571] mb-2" />
            <h2 className="text-xl font-semibold text-[#236571] mb-1">
              Task Completed Successfully
            </h2>
            <div className="text-gray-800 text-sm">
              {formatted}
            </div>
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
                <div className="font-semibold text-[#236571] mb-3">
                  Completion Details
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#236571] flex items-center justify-center text-white font-bold text-base">
                    {teamMember?.name
                      ? teamMember.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()
                      : ""}
                  </div>
                  <div className="font-medium text-gray-900 text-sm">
                    {teamMember?.name}
                  </div>
                  <span className="text-xs text-gray-500">
                    Assigned Technician
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 text-sm">
                  <div>
                    <div className="text-gray-500">Actual Duration:</div>
                    <div className="font-medium text-gray-900">
                      {getHoursDifference(
                        assignment?.startDate,
                        nextSchedule?.nextDate
                      ) ?? "N/A"}{" "}
                      hours{" "}
                      <span className="text-gray-500 text-xs">
                        (Expected: {assignment?.duration})
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Materials Used:</div>
                    <ul className="list-disc ml-5 text-gray-900">
                      {equipment?.maintenanceRequests?.length > 0 ? (
                        equipment.maintenanceRequests.map((req) => (
                          <li key={req.id}>
                            {req.itemName} ({req.quantity}
                            {req.measurement ? ` ${req.measurement}` : ""})
                          </li>
                        ))
                      ) : (
                        <li>No materials recorded.</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-gray-500 text-sm">Quality Check:</div>
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    Passed
                  </span>
                </div>
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
                      {nextSchedule?.nextDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection Due:</span>
                    <span className="font-medium">{assignment?.startDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button className="w-full bg-[#EFC11A] hover:bg-yellow-400 text-[#236571] font-semibold rounded-md py-2 transition">
                  Generate Work Report
                </button>
                <button className="w-full bg-[#236571] hover:bg-[#17484b] text-white font-semibold rounded-md py-2 transition"
                onClick={() => {
                  navigate("/maintenance/log");
                }}
                >
                  Equipment Log
                </button>
                <button className="w-full border border-gray-400 text-gray-800 font-semibold rounded-md py-2 transition"
                onClick={() => {navigate('/maintenance/dashboard');}}
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
                    {nextSchedule?.nextMaintenanceType}
                  </div>
                </div>
              </div>

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
