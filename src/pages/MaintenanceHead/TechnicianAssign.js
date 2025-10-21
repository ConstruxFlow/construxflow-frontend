import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UserPlus } from "lucide-react";
import TechnicianCard from "../../components/MaintenanceHead/TechnicianCard";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function TechnicianAssignmentMain() {
  const { id } = useParams();
  const location = useLocation();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Team members state
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  const [selectedTechs, setSelectedTechs] = useState([]);
  const [duration, setDuration] = useState("1-2 hours");
  const [instructions, setInstructions] = useState("");
  const [showTeam, setShowTeam] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // New states for assignment
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // States for assigned tasks tracking
  const [technicianAssignedDates, setTechnicianAssignedDates] = useState([]);
  const [loadingAssignedTasks, setLoadingAssignedTasks] = useState(false);

  // Check if technician ID is passed from WorkerProfile
  const preselectedTechnicianId = location.state?.technicianId;
  const isFromWorkerProfile = !!preselectedTechnicianId;

  // Fetch equipment details
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/equipment-scheduling/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch equipment data");
        return res.json();
      })
      .then((data) => {
        setEquipment(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch team members
  useEffect(() => {
    setLoadingTeam(true);
    fetch("http://localhost:8080/api/team/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch team members");
        return res.json();
      })
      .then((data) => {
        setTeamMembers(data);
        
        // Auto-select technician if coming from WorkerProfile
        if (preselectedTechnicianId && data.length > 0) {
          const technicianExists = data.find(tech => tech.empId === preselectedTechnicianId);
          if (technicianExists) {
            setSelectedTechs([preselectedTechnicianId]);
            console.log(`Auto-selected technician: ${technicianExists.name} (${preselectedTechnicianId})`);
          }
        }
        
        setLoadingTeam(false);
      })
      .catch(() => setLoadingTeam(false));
  }, [preselectedTechnicianId]);

  console.log(teamMembers);

  // Fetch assigned tasks for selected technicians
  const fetchAssignedTasksForTechnicians = async (technicianIds) => {
    if (!technicianIds || technicianIds.length === 0) {
      setTechnicianAssignedDates([]);
      return;
    }

    try {
      setLoadingAssignedTasks(true);
      const assignedDatesSet = new Set();

      // Fetch assigned tasks for each selected technician
      for (const techId of technicianIds) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/equipmentassigntechnician/getbytechnicianId?id=${encodeURIComponent(techId)}`
          );

          if (response.ok) {
            const tasksData = await response.json();
            
            // Extract assigned dates from tasks
            tasksData.forEach(task => {
              if (task.startDate) {
                const taskDate = new Date(task.startDate);
                // Format as YYYY-MM-DD for date input comparison
                const dateString = taskDate.toISOString().split('T')[0];
                assignedDatesSet.add(dateString);
              }
            });
          }
        } catch (err) {
          console.error(`Error fetching tasks for technician ${techId}:`, err);
        }
      }

      // Convert Set to Array
      const assignedDatesArray = Array.from(assignedDatesSet);
      setTechnicianAssignedDates(assignedDatesArray);
      console.log("Assigned dates for selected technicians:", assignedDatesArray);

    } catch (err) {
      console.error("Error fetching assigned tasks:", err);
      setTechnicianAssignedDates([]);
    } finally {
      setLoadingAssignedTasks(false);
    }
  };

  // Update assigned dates when selected technicians change
  useEffect(() => {
    fetchAssignedTasksForTechnicians(selectedTechs);
  }, [selectedTechs]);

  // Check if a date is already assigned to selected technicians
  const isDateAssigned = (dateString) => {
    return technicianAssignedDates.includes(dateString);
  };

  // Handle date change with validation
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    
    if (isDateAssigned(selectedDate)) {
      toast.error("Selected date is already assigned to one or more selected technicians. Please choose a different date.");
      return;
    }
    
    setStartDate(selectedDate);
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Phone number formatting function
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return null;
    
    // Remove any spaces, dashes, or other characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If number starts with 0 (Sri Lankan local format like 071, 077, etc.)
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      // Remove leading 0 and add +94
      return '+94' + cleaned.substring(1);
    }
    
    // If number already starts with 94 but no +
    if (cleaned.startsWith('94') && cleaned.length === 11) {
      return '+' + cleaned;
    }
    
    // If number already has +94 format
    if (phoneNumber.startsWith('+94')) {
      return phoneNumber;
    }
    
    // Return as is if format is unknown
    return phoneNumber;
  };

  // Assignment submit handler
  // SMS sending function
  const sendSMSToTechnicians = async (selectedTechnicianIds) => {
    try {
      console.log("Starting SMS sending process...");
      console.log("Selected technician IDs:", selectedTechnicianIds);
      console.log("Team members data:", teamMembers);

      // Get selected technicians with phone numbers
      const selectedTechnicians = teamMembers.filter(tech => 
        selectedTechnicianIds.includes(tech.empId)
      );

      console.log("Filtered selected technicians:", selectedTechnicians);

      if (selectedTechnicians.length === 0) {
        console.warn("No technicians found for selected IDs");
        return;
      }

      // Create assignment message
      const message = formatAssignmentMessage();
      console.log("Generated message:", message);

      // Send SMS to each selected technician
      for (const technician of selectedTechnicians) {
        console.log(`Processing technician: ${technician.name}`);
        
        // Check multiple possible phone field names
        const phoneNumber = technician.phoneNumber || technician.phone || technician.contactNumber || technician.mobile;
        console.log(`Phone number for ${technician.name}:`, phoneNumber);
        
        if (phoneNumber) {
          const formattedPhone = formatPhoneNumber(phoneNumber);
          console.log(`Formatted phone for ${technician.name}:`, formattedPhone);
          
          if (formattedPhone) {
            try {
              await sendSMS(formattedPhone, message);
              console.log(`✅ SMS sent successfully to ${technician.name} (${formattedPhone})`);
            } catch (smsError) {
              console.error(`❌ Failed to send SMS to ${technician.name}:`, smsError);
              // Continue with other technicians even if one fails
            }
          } else {
            console.warn(`⚠️ Invalid phone number format for technician: ${technician.name}`);
          }
        } else {
          console.warn(`⚠️ No phone number found for technician: ${technician.name}`);
          console.log("Available fields:", Object.keys(technician));
        }
      }

      toast.success("Assignment notifications sent to technicians!");
    } catch (error) {
      console.error("SMS sending error:", error);
      toast.error("Assignment successful, but failed to send SMS notifications");
    }
  };

  // Format assignment message
  const formatAssignmentMessage = () => {
    const technicianNames = teamMembers
      .filter(tech => selectedTechs.includes(tech.empId))
      .map(tech => tech.name)
      .join(", ");

    return `Task: -ConstruxFlow`;
  };

  // Send individual SMS
  const sendSMS = async (phoneNumber, message) => {
    console.log(`Attempting to send SMS to: ${phoneNumber}`);
    console.log(`Message length: ${message.length} characters`);
    
    try {
      const res = await fetch('http://localhost:8080/api/sms/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, message }),
      });

      console.log(`SMS API response status: ${res.status}`);
      console.log(`SMS API response ok: ${res.ok}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`SMS API error response: ${errorText}`);
        throw new Error(`SMS API returned ${res.status}: ${errorText}`);
      }

      // Handle both JSON and text responses
      const contentType = res.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        // Backend returned JSON
        responseData = await res.json();
        console.log(`SMS API JSON response:`, responseData);
      } else {
        // Backend returned plain text
        responseData = await res.text();
        console.log(`SMS API text response: ${responseData}`);
      }
      
      return responseData;
    } catch (fetchError) {
      console.error(`SMS fetch error:`, fetchError);
      
      // Handle JSON parse errors specifically
      if (fetchError.name === 'SyntaxError' && fetchError.message.includes('JSON')) {
        console.log('Backend returned non-JSON response, but request was successful');
        return { success: true, message: 'SMS sent successfully' };
      }
      
      // Check if it's a network/connection error
      if (fetchError.name === 'TypeError' || fetchError.message.includes('fetch')) {
        throw new Error(`Cannot connect to SMS service. Please check if the backend is running on http://localhost:8080`);
      }
      
      throw fetchError;
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg("");
    setIsLoading(true);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress((p) => (p >= 90 ? p : p + Math.random() * 5));
    }, 200);

    const reqBody = {
      equipmentId: equipment.equipmentId,
      equipmentSchedulingId: id,
      technicianIds: selectedTechs, // an array
      duration,
      notes: instructions,
      startDate: startDate || null,
      endDate: null,
      startTime: startTime || null,
      endTime: null,
      status: "ASSIGNED",
    };

    try {
      setLoadingProgress(10);

      const res = await fetch(
        "http://localhost:8080/api/equipmentassigntechnician/addassign",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody),
        }
      );

      setLoadingProgress(50);

      if (res.ok) {
        // Update scheduling status
        await updateSchedulingStatus(id, "ASSIGNED");
        
        setLoadingProgress(75);

        // Send SMS notifications to assigned technicians
        try {
          await sendSMSToTechnicians(selectedTechs);
        } catch (smsError) {
          console.error("SMS notification failed:", smsError);
          // Don't fail the assignment if SMS fails
        }

        setLoadingProgress(100); // Final progress
        toast.success("Technician assigned successfully!");
        navigation("/maintenance/update-equipment-maintenance");
      } else {
        const errText = await res.text();
        toast.error(`Failed to assign technician: ${errText}`);
      }
    } catch (err) {
      toast.error(`Error assigning technician: ${err.message}`);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
      clearInterval(progressInterval);
      setLoadingProgress(0);
    }
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigation("/login");
  };

  const handleLogin = () => {
    navigation("/login");
  };

  const updateSchedulingStatus = async (id, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/equipment-scheduling/status?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: newStatus, // Just the string "ASSIGNED"
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update scheduling status");
      }

      const result = await res.json();
      console.log("Status updated:", result);
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  return (
    <>
      <NavBar
        profileURL="/maintenance/profile"
        links={[
          {
            name: "Dashboard",
            href: "#",
            onClick: () => navigation("/maintenance/dashboard"),
          },
          {
            name: "Task",
            href: "#",
            onClick: () => navigation("/maintenance/scheduling"),
          },
          {
            name: "Schedule",
            href: "#",
            onClick: () =>
              navigation("/maintenance/update-equipment-maintenance"),
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
            onClick: () => navigation("/maintenance/equipment"),
          },
          {
            name: "Add Technician",
            href: "#",
            onClick: () => navigation("/maintenance/add-member"),
          },
        ]}
      />
      {isLoading && (
        <LoadingOverlay progress={loadingProgress} message="Processing..." />
      )}
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row items-start justify-center py-8 px-4 gap-8">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {preselectedTechnicianId ? "Assign Task to Technician" : "Technician Assignment"}
            </h1>
            <p className="text-gray-600">
              {preselectedTechnicianId 
                ? `Assigning maintenance request to ${location.state?.technicianName || 'selected technician'}`
                : "Assign maintenance requests to available technicians"
              }
            </p>
          </div>

          {/* Maintenance Request Details */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="text-[#236571] font-semibold mb-4 text-lg">
              Maintenance Request Details
            </div>
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : equipment ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Equipment ID
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.id}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full ${
                      equipment.status === "Pending"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    } text-xs font-semibold`}
                  >
                    {equipment.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Type
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.equipmentType}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.equipmentName}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Date
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.date ? equipment.date.slice(0, 10) : ""}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Time
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value={equipment.time}
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    rows={2}
                    value={equipment.description}
                    readOnly
                  />
                </div>
              </div>
            ) : (
              <div className="text-red-500">No equipment data found.</div>
            )}
          </div>

          {/* Assignment Details */}
          <form
            className="bg-white rounded-xl shadow p-6"
            onSubmit={handleAssign}
          >
            <div className="text-[#236571] font-semibold mb-4 text-lg">
              Assignment Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {preselectedTechnicianId ? "Assigned Technician" : "Select Technicians"} <span className="text-red-500">*</span>
                  {preselectedTechnicianId && (
                    <span className="text-xs text-blue-600 ml-2">
                      (Auto-selected from Worker Profile)
                    </span>
                  )}
                </label>
                {preselectedTechnicianId ? (
                  // Show read-only selected technician when coming from WorkerProfile
                  <div className="w-full border border-blue-200 bg-blue-50 rounded-md px-3 py-2 text-gray-800">
                    {(() => {
                      const selectedTech = teamMembers.find(tech => tech.empId === preselectedTechnicianId);
                      return selectedTech ? 
                        `${selectedTech.name} (${selectedTech.specializations?.join(", ") || 'No specializations'}) - ${selectedTech.availabilityStatus}` :
                        'Loading technician details...';
                    })()}
                  </div>
                ) : (
                  // Show normal dropdown when accessed normally
                  <select
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                    value=""
                    onChange={(e) => {
                      const selectedId = e.target.value;

                      // ✅ Only add if value exists and is not already selected
                      if (selectedId && !selectedTechs.includes(selectedId)) {
                        setSelectedTechs([...selectedTechs, selectedId]);
                      }

                      // ✅ Reset dropdown immediately after selection
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>
                      Select a technician...
                    </option>
                    {teamMembers
                      .filter(
                        (tech) =>
                          !selectedTechs.includes(tech.empId)
                      )
                      .map((tech) => (
                        <option key={tech.empId} value={tech.empId}>
                          {tech.name} ({tech.specializations?.join(", ")}) - {tech.availabilityStatus}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {!preselectedTechnicianId && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTechs.map((techId) => {
                    const tech = teamMembers.find((t) => t.empId === techId);
                    if (!tech) return null;
                    return (
                      <span
                        key={techId}
                        className="inline-flex items-center gap-2 bg-[#236571] text-white text-sm px-3 py-1 rounded-full"
                      >
                        {tech.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedTechs(
                              selectedTechs.filter((id) => id !== techId)
                            )
                          }
                          className="text-white hover:text-red-300 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Expected Duration
                </label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option>1-2 hours</option>
                  <option>2-4 hours</option>
                  <option>Same Day</option>
                  <option>Next Day</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Start Date
                  
                </label>
                <input
                  type="date"
                  className={`w-full border rounded-md px-3 py-2 text-gray-800 bg-gray-50 ${
                    startDate && isDateAssigned(startDate) 
                      ? "border-red-500 bg-red-50" 
                      : "border-gray-200"
                  }`}
                  value={startDate}
                  onChange={handleDateChange}
                  min={getTodayDate()}
                  required
                />
                {startDate && isDateAssigned(startDate) && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠️ This date is already assigned to selected technician(s)
                  </p>
                )}
                {loadingAssignedTasks && (
                  <p className="text-blue-500 text-xs mt-1">
                    🔄 Checking assigned dates...
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Special Instructions
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 bg-gray-50"
                rows={2}
                placeholder="Any specific instructions for the technician..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
            {submitMsg && (
              <div
                className={`mt-3 text-sm ${
                  submitMsg.startsWith("Technician assigned")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {submitMsg}
              </div>
            )}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-md border border-[#236571] text-[#236571] font-semibold bg-white hover:bg-gray-50 transition"
                onClick={() => {
                  setSelectedTechs([]); // ✅ Fixed: Use empty array instead of empty string
                  setDuration("1-2 hours");
                  setInstructions("");
                  setStartDate("");
                  setStartTime("");
                  setSubmitMsg("");
                }}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-6 py-2 rounded-md font-semibold flex items-center gap-2 shadow transition ${
                  selectedTechs.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#EFC11A] hover:bg-yellow-400 text-yellow-900"
                }`}
                disabled={submitting || selectedTechs.length === 0}
              >
                <UserPlus className="w-5 h-5" />
                {submitting ? "Assigning..." : "Assign Technician"}
              </button>
            </div>
          </form>
        </div>

        {/* Technicians List */}
        <aside className="w-full md:w-80 bg-white rounded-xl shadow p-5">
          <div className="text-[#236571] font-semibold mb-4 text-lg">
            All Technicians
          </div>
          <div>
            {loadingTeam ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              teamMembers.map((member) => (
                <TechnicianCard
                  key={member.empId}
                  initials={member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                  name={member.name}
                  skills={member.specializations?.join(", ")}
                  status={
                    member.availabilityStatus === "AVAILABLE"
                      ? "Available"
                      : member.availabilityStatus === "ONTASK"
                      ? "On Task"
                      : "Unavailable"
                  }
                />
              ))
            )}
          </div>
        </aside>
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
