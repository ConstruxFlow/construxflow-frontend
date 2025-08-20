import { use, useEffect, useState } from "react";
import { Filter, Plus, Calendar, ChevronDown, User } from "lucide-react";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/LoadingOverlay";
import {
  isThisWeek,
  isThisMonth,
  isPast,
  parseISO,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const getStatusColor = (type) => {
  switch (type) {
    case "Emergency":
      return "bg-red-500 text-white";
    case "Corrective":
      return "bg-[#EFC11A] text-yellow-900";
    case "Preventive":
      return "bg-[#236571] text-white";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const quickSchedulePresets = [
  { label: "30 Days", value: 30 },
  { label: "60 Days", value: 60 },
  { label: "90 Days", value: 90 },
  { label: "6 Months", value: 180 },
  { label: "1 Year", value: 365 },
];

export default function NextScheduleContainer() {
  const [selectedTab, setSelectedTab] = useState("Due This Week");
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  // const [requestId, setRequestId] = useState("MR-2024-001");
  const [priority, setPriority] = useState("");
  const [currentStatus, setCurrentStatus] = useState("In Progress");
  const [newStatus, setNewStatus] = useState(
    selectedMaintenance?.newStatus || ""
  );
  const [equipment, setEquipment] = useState("HVAC System - Building A");
  const [description, setDescription] = useState("");
  const [assignedTechnician, setAssignedTechnician] = useState("John Smith");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("2 hours");
  const [notes, setNotes] = useState("");

  // Schedule Next Maintenance form state
  const [maintenanceType, setMaintenanceType] = useState(
    "Preventive Maintenance"
  );
  const [scheduledDate, setScheduledDate] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("1 hour");
  const [priorityLevel, setPriorityLevel] = useState("Low");
  const [assignedTech, setAssignedTech] = useState("John Smith (Current)");
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = ["Due This Week", "Due This Month", "Overdue"];
  const [showTeam, setShowTeam] = useState(false);
  const [technicianId, setTechnicianId] = useState(null);
  const [technicianDetails, setTechnicianDetails] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const [nextmaintenanceType, setNextMaintenanceType] = useState("");
  const [nextscheduledDate, setNextScheduledDate] = useState("");
  const [nextestimatedDuration, setNextEstimatedDuration] = useState("");
  const [nextpriorityLevel, setNextPriorityLevel] = useState("");
  const [nextassignedTech, setNextAssignedTech] = useState("");
  const [nextteamMembers, setNextTeamMembers] = useState([]);
  const [updaeStatus, setUpdateStatus] = useState("ASSIGNED");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showNextSchedule, setShowNextSchedule] = useState(false);
  const [assignments, setAssignments] = useState([]);

  // Add this missing state for multiple technician selection
  const [selectedNextTechs, setSelectedNextTechs] = useState([]);

  const navigation = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state on mount
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

  // Fetch equipment schedules
  useEffect(() => {
    fetch("http://localhost:8080/api/equipment-scheduling")
      .then((res) => res.json())
      .then(setUpcomingMaintenance)
      .catch(console.error);
  }, []);

  console.log("Upcoming Maintenance Data:", upcomingMaintenance);

  // useEffect(() => {
  //   if (upcomingMaintenance.length > 0 && !selectedMaintenance) {
  //     setSelectedMaintenance(upcomingMaintenance[0]);
  //     setNewStatus(upcomingMaintenance[0].newStatus || "");
  //   }
  // }, [upcomingMaintenance]);

  // console.log("Selected Maintenance:", selectedMaintenance?.id);

  useEffect(() => {
    if (!selectedMaintenance?.id) return;

    fetch(
      `http://localhost:8080/api/equipmentassigntechnician/getbyassignId?scheduleId=${encodeURIComponent(
        selectedMaintenance.id
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return res.json();
      })
      .then((data) => {
        // ✅ Ensure data is always an array
        const formattedData = Array.isArray(data) ? data : data ? [data] : [];
        setAssignments(formattedData);

        // ✅ Set technicianId only if one of them exists
        if (formattedData.length > 0) {
          setTechnicianId(formattedData[0].technicianId);
        }
      })
      .catch((err) => console.error("Fetch Error:", err));
  }, [selectedMaintenance]);

  // ✅ Run this only when selectedMaintenance is updated

  console.log("fxcgvjvb", assignments.technicianId);

  useEffect(() => {
    if (!Array.isArray(assignments) || assignments.length === 0) return;

    const firstTechId = assignments[0].technicianId;

    if (!firstTechId) return;

    fetch(
      `http://localhost:8080/api/team?id=${encodeURIComponent(firstTechId)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch technician");
        return res.json();
      })
      .then((data) => setTechnicianDetails(data))
      .catch(console.error);
  }, [assignments]);
  // ✅ Run this only when technicianId or assignments.technicianId is updated

  console.log("Upcoming Maintenance Data:", upcomingMaintenance);
  console.log("Assignments Data:", assignments);
  console.log("details of technician", technicianDetails);

  const handleChangeStatus = async () => {
    // ✅ Strict validation - only allow actual status values
    if (
      !newStatus ||
      newStatus.trim() === "" ||
      newStatus === "Select new status" ||
      !["Completed", "On Hold", "Cancelled"].includes(newStatus)
    ) {
      toast.error(
        "Please select a valid status (Completed, On Hold, or Cancelled)!"
      );
      return;
    }

    if (!assignments || assignments.length === 0) {
      toast.error("No assignments found to update!");
      return;
    }

    if (!selectedMaintenance?.id) {
      toast.error("Please select a maintenance request first!");
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress((p) => (p >= 90 ? p : p + Math.random() * 5));
    }, 150);

    try {
      setLoadingProgress(10);

      // Update status for ALL assignments
      const assignmentPromises = assignments.map((assignment) =>
        fetch(
          `http://localhost:8080/api/equipmentassigntechnician/status?id=${encodeURIComponent(
            assignment.assignId
          )}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newStatus),
          }
        )
      );

      const assignResults = await Promise.all(assignmentPromises);

      // Check if all assignment updates were successful
      for (const result of assignResults) {
        if (!result.ok) throw new Error("Failed to update assignment status");
      }

      setLoadingProgress(50);

      // Update equipment status
      const equipRes = await fetch(
        `http://localhost:8080/api/equipment-scheduling/status?id=${encodeURIComponent(
          selectedMaintenance.id
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: newStatus,
        }
      );

      if (!equipRes.ok) throw new Error("Failed to update equipment status");

      const equipData = await equipRes.json();
      setLoadingProgress(100);
      toast.success(
        `Status updated successfully to "${newStatus}" for all assignments!`
      );
      setUpdateStatus(equipData.newStatus);

      // Navigate with all assignment IDs
      const assignIds = assignments.map((a) => a.assignId).join("&assignId=");
      navigation(
        `/maintenance/task-complete/${selectedMaintenance.id}?assignId=${assignIds}`
      );
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Status update failed: " + err.message);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/team/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch team data");
        }
        return res.json();
      })
      .then((data) => {
        setTeamMembers(data);
      })
      .catch((err) => {
        console.error("Error fetching team members:", err);
        alert("Failed to load team members. Please try again later.");
      });
  }, [selectedMaintenance]);

  console.log("Team Members:", teamMembers);

  const handleScheduleSubmit = async () => {
    // ✅ Enhanced validation for schedule submission
    if (
      !newStatus ||
      newStatus.trim() === "" ||
      newStatus === "Select new status" ||
      !["Completed", "On Hold", "Cancelled"].includes(newStatus)
    ) {
      toast.error("Please select a valid status before scheduling!");
      return;
    }

    if (
      !assignments ||
      assignments.length === 0 ||
      !selectedMaintenance?.id ||
      !scheduledDate ||
      !maintenanceType ||
      !estimatedDuration ||
      !priorityLevel ||
      selectedNextTechs.length === 0
    ) {
      toast.error(
        "Please fill in all required fields and select at least one technician!"
      );
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress((p) => (p >= 90 ? p : p + Math.random() * 5));
    }, 150);

    try {
      setLoadingProgress(10);

      // First update all assignment statuses
      await handleChangeStatus();

      setLoadingProgress(40);

      // Create next schedule requests for each assignment with multiple technicians
      const schedulePromises = assignments.map((assignment) => {
        const requestBody = {
          assignId: assignment.assignId,
          equipmentId: assignment.equipmentId,
          equipmentScheduleId: selectedMaintenance?.id,
          nextMaintenanceType: maintenanceType,
          nextDate: scheduledDate,
          estimateDuration: estimatedDuration,
          priority: priorityLevel,
          technicianIds: selectedNextTechs,
          lastMaintenanceDate: new Date().toISOString().split("T")[0],
        };

        return fetch("http://localhost:8080/api/nextschedule/setnextschedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      });

      const scheduleResults = await Promise.all(schedulePromises);

      // Check if all schedule submissions were successful
      for (const result of scheduleResults) {
        if (!result.ok) throw new Error("Failed to schedule maintenance");
      }

      setLoadingProgress(100);
      toast.success("Maintenance scheduled successfully for all assignments!");

      // Navigate with all assignment IDs
      const assignIds = assignments.map((a) => a.assignId).join("&assignId=");
      navigation(
        `/maintenance/task-complete/${selectedMaintenance.id}?assignId=${assignIds}`
      );
    } catch (err) {
      console.error("Schedule Error:", err);
      toast.error(`Failed to schedule maintenance: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
      clearInterval(progressInterval);
      setLoadingProgress(0);
    }
  };

  const resetFormFields = () => {
    setPriority("");
    setDescription("");
    setEquipment("");
    setStartDate("");
    setDuration("1-2 hours");
    setNotes("");
    setNewStatus("");
    setTechnicianDetails(null);
    setAssignments([]);
  };

  useEffect(() => {
    if (!selectedMaintenance) {
      resetFormFields();
    }
  }, [selectedMaintenance]);

  const filteredMaintenance = upcomingMaintenance.filter((item) => {
    if (!item.date) return false;

    const dueDate = parseISO(item.date); // Only include items with ASSIGNED status

    if (item.status !== "ASSIGNED") return false;

    switch (selectedTab) {
      case "Due This Week":
        return isThisWeek(dueDate, { weekStartsOn: 1 }); // Monday as start

      case "Due This Month":
        return isThisMonth(dueDate);

      case "Overdue":
        return isPast(dueDate) && item.status === "ASSIGNED";

      default:
        return true;
    }
  });

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
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Next Schedule
              </h1>
              <p className="text-gray-600 text-sm">
                Manage maintenance next schedule and assignments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#236571] text-white rounded-md text-sm font-medium hover:bg-[#1e5a63] transition">
                <Plus className="w-4 h-4" />
                New Request
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Upcoming Maintenance */}
            <div className="lg:col-span-2">
              {/* Upcoming Scheduled Maintenance */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Upcoming Scheduled Maintenance
                </h2>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                        selectedTab === tab
                          ? "border-[#236571] text-[#236571]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Maintenance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredMaintenance.map((item, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        selectedMaintenance?.id === item.id
                          ? "border-[#236571] bg-[#f1f9f9]"
                          : "border-gray-200"
                      }`}
                      onClick={() => {
                        setSelectedMaintenance(item);
                        setNewStatus(item.newStatus || "");
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            item.maintenanceType
                          )}`}
                        >
                          {item.maintenanceType}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.equipmentName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.maintenanceType + " Maintenance"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due:{" "}
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Request Details */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Maintenance Request Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Request ID
                    </label>
                    <input
                      type="text"
                      value={selectedMaintenance?.id || ""}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        value={selectedMaintenance?.priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                      >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#EFC11A] text-yellow-900 rounded-full text-xs font-medium">
                      {currentStatus}
                    </span>
                    <span className="text-sm text-gray-500">To</span>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Change Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full border rounded-md px-3 py-2 text-sm appearance-none transition-colors ${
                          !newStatus ||
                          newStatus === "" ||
                          newStatus === "Select new status"
                            ? "border-red-300 bg-white text-gray-700 focus:border-red-500"
                            : "border-gray-300 bg-[#236571] text-white focus:border-[#236571]"
                        }`}
                        onChange={(e) => setNewStatus(e.target.value)}
                        value={newStatus || ""} // ✅ Add proper value binding
                      >
                        <option value="" className="bg-white text-gray-700">
                          Select new status
                        </option>
                        <option
                          value="Completed"
                          className="bg-white text-gray-700"
                        >
                          Completed
                        </option>
                        <option
                          value="On Hold"
                          className="bg-white text-gray-700"
                        >
                          On Hold
                        </option>
                        <option
                          value="Cancelled"
                          className="bg-white text-gray-700"
                        >
                          Cancelled
                        </option>
                      </select>
                      <ChevronDown
                        className={`absolute right-3 top-2.5 h-4 w-4 pointer-events-none transition-colors ${
                          !newStatus ||
                          newStatus === "" ||
                          newStatus === "Select new status"
                            ? "text-gray-400"
                            : "text-white"
                        }`}
                      />
                    </div>
                    {(!newStatus ||
                      newStatus === "" ||
                      newStatus === "Select new status") && (
                      <p className="text-red-500 text-xs mt-1">
                        Please select a valid status to continue
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment
                  </label>
                  <input
                    type="text"
                    value={selectedMaintenance?.equipmentName || ""}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={selectedMaintenance?.description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter maintenance description..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>
              </div>

              {/* Assignment Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Assignment Details
                </h2>

                {/* Technicians */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Technicians
                  </label>

                  {!Array.isArray(assignments) || assignments.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No technicians assigned.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {assignments.map((assign, index) => {
                        const tech = teamMembers.find(
                          (t) => t.empId === assign.technicianId
                        );

                        const initials =
                          tech?.name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase() || "T";

                        const displayName =
                          tech?.name || assign.technicianId || "Technician";

                        return (
                          <div
                            key={assign.assignId || index}
                            className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm"
                          >
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-[#236571] rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase">
                              {initials}
                            </div>

                            {/* Name */}
                            <div className="text-sm font-medium text-gray-800">
                              {displayName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Shared Fields */}
                {assignments.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Start Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={assignments[0]?.startDate || ""}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          />
                          <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estimated Duration
                        </label>
                        <div className="relative">
                          <select
                            value={assignments[0]?.duration || "1-2 hours"}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                          >
                            <option>1-2 hours</option>
                            <option>2-4 hours</option>
                            <option>3-6 hours</option>
                            <option>1 day</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={assignments[0]?.notes || ""}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional notes..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        rows={2}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Schedule Next Maintenance */}
            <div className="lg:col-span-1">
              {/* ✅ Checkbox toggler */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="toggle-next-schedule"
                  checked={showNextSchedule}
                  onChange={(e) => setShowNextSchedule(e.target.checked)}
                  className="h-4 w-4 text-[#236571] border-gray-300 rounded"
                />
                <label
                  htmlFor="toggle-next-schedule"
                  className="text-sm text-gray-700"
                >
                  Schedule Next Maintenance
                </label>
              </div>

              {/* ✅ Conditionally show schedule form */}
              {showNextSchedule && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Schedule Next Maintenance
                    </h2>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Maintenance Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Next Maintenance Type
                      </label>
                      <div className="relative">
                        <select
                          value={maintenanceType}
                          onChange={(e) => setMaintenanceType(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                        >
                          <option>Preventive Maintenance</option>
                          <option>Corrective Maintenance</option>
                          <option>Emergency Maintenance</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Scheduled Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scheduled Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Estimated Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Duration
                      </label>
                      <div className="relative">
                        <select
                          value={estimatedDuration}
                          onChange={(e) => setEstimatedDuration(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                        >
                          <option>1 hour</option>
                          <option>2 hours</option>
                          <option>4 hours</option>
                          <option>1 day</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Priority Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority Level
                      </label>
                      <div className="relative">
                        <select
                          value={priorityLevel}
                          onChange={(e) => setPriorityLevel(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                        >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Assigned Technician */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Technician
                      </label>
                      <div className="relative">
                        <select
                          value={assignedTech}
                          onChange={(e) => setAssignedTech(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                        >
                          <option value="">Select Technician</option>
                          {teamMembers.map((member) => (
                            <option key={member.empId} value={member.empId}>
                              {member.name} (
                              {member.specializations?.join(", ")})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* ✅ Multiple Technician Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Technicians{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value=""
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            if (!selectedNextTechs.includes(selectedId)) {
                              setSelectedNextTechs([
                                ...selectedNextTechs,
                                selectedId,
                              ]);
                            }
                          }}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none"
                        >
                          <option value="" disabled>
                            Select technicians...
                          </option>
                          {teamMembers
                            .filter(
                              (tech) =>
                                tech.availabilityStatus === "AVAILABLE" &&
                                !selectedNextTechs.includes(tech.empId)
                            )
                            .map((member) => (
                              <option key={member.empId} value={member.empId}>
                                {member.name} (
                                {member.specializations?.join(", ")})
                              </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>

                      {/* ✅ Selected Technicians Display */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedNextTechs.map((techId) => {
                          const tech = teamMembers.find(
                            (t) => t.empId === techId
                          );
                          if (!tech) return null;
                          return (
                            <span
                              key={techId}
                              className="inline-flex items-center gap-2 bg-[#236571] text-white text-xs px-3 py-1 rounded-full"
                            >
                              {tech.name}
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedNextTechs(
                                    selectedNextTechs.filter(
                                      (id) => id !== techId
                                    )
                                  )
                                }
                                className="text-white hover:text-red-300"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Schedule Preview (Optional) */}
                    {isExpanded && (
                      <div className="border-t pt-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900 mb-2">
                            Scheduled Maintenance Preview
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <span className="font-medium">Type:</span>{" "}
                              {maintenanceType}
                            </p>
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {scheduledDate}
                            </p>
                            <p>
                              <span className="font-medium">Technicians:</span>{" "}
                              {selectedNextTechs.length > 0
                                ? selectedNextTechs
                                    .map(
                                      (techId) =>
                                        teamMembers.find(
                                          (t) => t.empId === techId
                                        )?.name
                                    )
                                    .filter(Boolean)
                                    .join(", ")
                                : "Not assigned"}
                            </p>
                            <p>
                              <span className="font-medium">Duration:</span>{" "}
                              {estimatedDuration}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ✅ Submit Buttons - Always Visible */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={
                    showNextSchedule ? handleScheduleSubmit : handleChangeStatus
                  }
                  disabled={
                    !newStatus ||
                    newStatus.trim() === "" ||
                    newStatus === "Select new status" ||
                    !["Completed", "On Hold", "Cancelled"].includes(
                      newStatus
                    ) ||
                    isLoading ||
                    !selectedMaintenance?.id ||
                    assignments.length === 0 ||
                    (showNextSchedule && selectedNextTechs.length === 0)
                  }
                  className={`flex-1 font-medium py-2 rounded-md text-sm transition ${
                    !newStatus ||
                    newStatus.trim() === "" ||
                    newStatus === "Select new status" ||
                    !["Completed", "On Hold", "Cancelled"].includes(
                      newStatus
                    ) ||
                    isLoading ||
                    !selectedMaintenance?.id ||
                    assignments.length === 0 ||
                    (showNextSchedule && selectedNextTechs.length === 0)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#EFC11A] hover:bg-yellow-400 text-yellow-900"
                  }`}
                  title={
                    !selectedMaintenance?.id
                      ? "Please select a maintenance request first"
                      : assignments.length === 0
                      ? "No assignments found"
                      : !newStatus ||
                        newStatus === "" ||
                        newStatus === "Select new status" ||
                        !["Completed", "On Hold", "Cancelled"].includes(
                          newStatus
                        )
                      ? "Please select a valid status (Completed, On Hold, or Cancelled)"
                      : showNextSchedule && selectedNextTechs.length === 0
                      ? "Please select at least one technician"
                      : ""
                  }
                >
                  {isLoading
                    ? "Processing..."
                    : showNextSchedule
                    ? "Schedule Maintenance"
                    : "Update Status Only"}
                </button>

                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                  onClick={resetFormFields}
                  disabled={isLoading}
                >
                  Cancel
                </button>
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
