import { useEffect, useState } from "react";
import { Plus, FileText, Phone, User, Badge } from "lucide-react";
import { FaDownload } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

export default function WorkerProfile() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showTeam, setShowTeam] = useState(false);
  const [technicianData, setTechnicianData] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const navigation = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [equipmentData, setEquipmentData] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [acceptedSchedulingData, setAcceptedSchedulingData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);


  // Get technician data from navigation state or fetch from API
  useEffect(() => {
    const fetchTechnicianData = async () => {
      try {
        setLoading(true);

        // Check if data was passed via navigation state
        if (location.state?.technicianData) {
          setTechnicianData(location.state.technicianData);
          setLoading(false);
          return;
        }

        // If no empId in URL, show error
        if (!id) {
          setError("No technician ID provided");
          setLoading(false);
          return;
        }

        // Fetch from API
        const response = await fetch(
          `http://localhost:8080/api/team?id=${encodeURIComponent(id)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch technician data");
        }

        const data = await response.json();
        setTechnicianData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicianData();
  }, [id, location.state]);

  // Fetch assigned tasks for the technician
  useEffect(() => {
    // Function to update technician status
    const updateTechnicianStatus = async (newStatus) => {
      if (!technicianData?.empId) return;

      try {
        const response = await fetch(
          `http://localhost:8080/api/team/updateStatus?empId=${encodeURIComponent(
            technicianData.empId
          )}&status=${encodeURIComponent(newStatus)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Update local state
          setTechnicianData((prev) => ({
            ...prev,
            availabilityStatus: newStatus,
          }));
          console.log(`Technician status updated to: ${newStatus}`);
          setStatusUpdateMessage(
            `Status automatically updated to ${newStatus} based on active tasks`
          );
          setTimeout(() => setStatusUpdateMessage(""), 5000); // Clear message after 5 seconds
        } else {
          console.error("Failed to update technician status");
        }
      } catch (error) {
        console.error("Error updating technician status:", error);
      }
    };

    const fetchAssignedTasks = async () => {
      if (!technicianData?.empId) return;

      try {
        setTasksLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/equipmentassigntechnician/getbytechnicianId?id=${encodeURIComponent(
            technicianData.empId
          )}`
        );

        if (response.ok) {
          const tasksData = await response.json();
          console.log("🔍 Raw tasks data from API:", tasksData);
          console.log("🔍 First task structure:", tasksData[0]);
          setAssignedTasks(tasksData);

          // Check if technician should be automatically set to ON_DUTY
          await checkAndUpdateTechnicianStatus(tasksData);
        } else {
          console.log("No tasks found for this technician");
          setAssignedTasks([]);
        }
      } catch (err) {
        console.error("Error fetching assigned tasks:", err);
        setAssignedTasks([]);
      } finally {
        setTasksLoading(false);
      }
    };

    // Function to check if technician should be ON_DUTY and update status
    const checkAndUpdateTechnicianStatus = async (tasks) => {
      if (!technicianData?.empId || !tasks) return;

      const activeTasks = tasks.filter((task) => {
        const cleanStatus = task.status?.replace(/"/g, '');
        return cleanStatus === "In Progress" || cleanStatus === "Assigned" || cleanStatus === "ASSIGNED";
      });

      const hasTasksToday = tasks.some((task) => {
        if (!task.startDate) return false;
        const taskDate = new Date(task.startDate);
        const today = new Date();
        const cleanStatus = task.status?.replace(/"/g, '');
        return (
          taskDate.toDateString() === today.toDateString() &&
          (cleanStatus === "In Progress" || cleanStatus === "Assigned" || cleanStatus === "ASSIGNED")
        );
      });

      // If technician has active tasks and is not already ONTASK, update status
      if (
        (activeTasks.length > 0 || hasTasksToday) &&
        technicianData.availabilityStatus !== "ONTASK"
      ) {
        await updateTechnicianStatus("ONTASK");
      }
    };

    fetchAssignedTasks();
  }, [technicianData?.empId, technicianData?.availabilityStatus]);

  // Function to map assigned tasks to display format
  const mapAssignedTasksToDisplay = (tasks) => {
    return tasks.map((task) => ({
      id: task.assignId,
      title: `Equipment Maintenance - ${task.equipmentSchedulingId}`,
      location: "Equipment Location", // You might want to fetch equipment details separately
      due: task.startDate || "Not scheduled",
      priority: getTaskPriority(task.status),
      priorityColor: getPriorityColor(task.status),
      status: task.status || "Unknown",
      statusColor: getStatusColor(task.status),
      duration: task.duration,
      notes: task.notes,
      startTime: task.startTime,
      endTime: task.endTime,
      equipmentId: task.equipmentSchedulingId,
    }));
  };

  // Helper functions for styling - handle extra quotes in status
  const getTaskPriority = (status) => {
    const cleanStatus = status?.replace(/"/g, '');
    switch (cleanStatus) {
      case "Assigned":
      case "ASSIGNED":
      case "In Progress":
        return "High Priority";
      case "Pending":
        return "Normal Priority";
      case "Completed":
        return "Low Priority";
      default:
        return "Normal Priority";
    }
  };

  const getPriorityColor = (status) => {
    const cleanStatus = status?.replace(/"/g, '');
    switch (cleanStatus) {
      case "Assigned":
      case "ASSIGNED":
      case "In Progress":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-deep_green/10 text-deep_green";
      case "Completed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-deep_green/10 text-deep_green";
    }
  };

  const getStatusColor = (status) => {
    const cleanStatus = status?.replace(/"/g, '');
    switch (cleanStatus) {
      case "Assigned":
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-web_yellow/20 text-web_yellow";
      case "Pending":
        return "bg-light_gray/40 text-slatebluegray";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-light_gray/40 text-slatebluegray";
    }
  };

  // Manual status change function
  const handleManualStatusChange = async (newStatus) => {
    if (!technicianData?.empId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/team/updateStatus?empId=${encodeURIComponent(
          technicianData.empId
        )}&status=${encodeURIComponent(newStatus)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update local state
        setTechnicianData((prev) => ({
          ...prev,
          availabilityStatus: newStatus,
        }));
        console.log(`Technician status manually updated to: ${newStatus}`);
        setStatusUpdateMessage(`Status manually updated to ${newStatus}`);
        setTimeout(() => setStatusUpdateMessage(""), 3000); // Clear message after 3 seconds
      } else {
        console.error("Failed to update technician status");
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating technician status:", error);
      alert("Error updating status. Please check your connection.");
    }
  };

const handleGetEquipment = async () => {
    setModalLoading(true);
    setShowAssignModal(true);

    try {
      const response = await fetch("http://localhost:8080/api/equipment-scheduling");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Filter only accepted scheduling data
      const acceptedData = data.filter(item => 
        item.status === "Accept" ||
        item.status === "Pending"
      );
      setAcceptedSchedulingData(acceptedData);
      console.log("Accepted scheduling data:", acceptedData);
    } catch (err) {
      console.error("Failed to fetch scheduling data:", err);
      setAcceptedSchedulingData([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleStartMaintenance = (id) => {
    navigation(`/maintenance/technician-assignment/${id}`, {
      state: { 
        technicianId: technicianData?.empId,
        technicianName: technicianData?.name 
      }
    });
  };

  // PDF Export Functions
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const displayTasks = mapAssignedTasksToDisplay(assignedTasks);
      const title = `${technicianData.name} - Task Assignment Report`;
      const date = new Date().toLocaleDateString();
      
      const htmlContent = generatePDFContent(displayTasks, title, date, technicianData);
      const fileName = `technician-report-${technicianData.name?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      await downloadPDF(htmlContent, fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generatePDFContent = (tasks, title, date, technician) => {
    // Calculate task statistics
    const totalTasks = assignedTasks.length;
    
    // Debug: Log all status values to identify the issue
    console.log("🔍 Debugging task statuses:");
    console.log("🔍 Total assignedTasks:", assignedTasks);
    assignedTasks.forEach((task, index) => {
      console.log(`Task ${index + 1}: Status = "${task.status}" (Type: ${typeof task.status})`);
      console.log(`Task ${index + 1}: Full task object:`, task);
    });
    
    // Status filtering - handle extra quotes in status values
    const completedTasksArray = assignedTasks.filter(task => {
      const cleanStatus = task.status?.replace(/"/g, ''); // Remove extra quotes
      console.log(`🔍 Checking task status: "${task.status}" cleaned to "${cleanStatus}" === "Completed"? ${cleanStatus === "Completed"}`);
      return cleanStatus === "Completed";
    });
    
    console.log("🔍 Completed tasks found:", completedTasksArray);
    console.log("🔍 Completed tasks count:", completedTasksArray.length);
    
    const completedTasks = completedTasksArray.length;
    
    const inProgressTasks = assignedTasks.filter(task => {
      const cleanStatus = task.status?.replace(/"/g, '');
      return cleanStatus === "In Progress" || cleanStatus === "IN_PROGRESS";
    }).length;
    
    const assignedTasksCount = assignedTasks.filter(task => {
      const cleanStatus = task.status?.replace(/"/g, '');
      return cleanStatus === "Assigned" || cleanStatus === "ASSIGNED";
    }).length;
    
    const pendingTasks = assignedTasks.filter(task => {
      const cleanStatus = task.status?.replace(/"/g, '');
      return cleanStatus === "Pending" || cleanStatus === "PENDING";
    }).length;
    
    console.log(`📊 Task Statistics:
    - Total: ${totalTasks}
    - Completed: ${completedTasks}
    - In Progress: ${inProgressTasks}
    - Assigned: ${assignedTasksCount}
    - Pending: ${pendingTasks}`);
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #f59e0b;
            padding-bottom: 15px;
          }
          .header h1 { 
            color: #1f2937; 
            margin: 0;
            font-size: 24px;
          }
          .header p { 
            color: #6b7280; 
            margin: 5px 0 0 0;
          }
          .technician-info {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #f59e0b;
          }
          .technician-info h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
          }
          .info-item {
            color: #4b5563;
            font-size: 14px;
          }
          .info-value {
            font-weight: bold;
            color: #1f2937;
            display: block;
            margin-top: 2px;
          }
          .summary {
            background-color: #f0f9ff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #0ea5e9;
          }
          .summary h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 10px;
          }
          .summary-item {
            background: white;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            border: 1px solid #e5e7eb;
          }
          .summary-number {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
          }
          .summary-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
          }
          .task-record { 
            border: 1px solid #e5e7eb; 
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #ffffff;
            page-break-inside: avoid;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .record-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 2px solid #f59e0b;
          }
          .task-title {
            font-weight: bold;
            font-size: 16px;
            color: #1f2937;
          }
          .task-badges {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          }
          .priority-high { background-color: #fee2e2; color: #dc2626; }
          .priority-normal { background-color: #fef3c7; color: #d97706; }
          .priority-low { background-color: #f3f4f6; color: #6b7280; }
          .status-completed { background-color: #dcfce7; color: #16a34a; }
          .status-in-progress { background-color: #fed7aa; color: #ea580c; }
          .status-assigned { background-color: #dbeafe; color: #2563eb; }
          .status-pending { background-color: #fef3c7; color: #ca8a04; }
          .task-details {
            margin-top: 10px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px dotted #e5e7eb;
          }
          .detail-label {
            font-weight: 600;
            color: #4b5563;
            width: 30%;
          }
          .detail-value {
            color: #1f2937;
            width: 70%;
            text-align: right;
          }
          .notes-section {
            margin-top: 15px;
            padding: 10px;
            background-color: #f8fafc;
            border-radius: 6px;
            border-left: 3px solid #0ea5e9;
          }
          .notes-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
          }
          .notes-text {
            color: #4b5563;
            line-height: 1.4;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          @media print {
            body { background: white; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Generated on ${date}</p>
        </div>
        
        <div class="technician-info">
          <h3>Technician Information</h3>
          <div class="info-grid">
            <div class="info-item">
              Name
              <span class="info-value">${technician.name || 'N/A'}</span>
            </div>
            <div class="info-item">
              Employee ID
              <span class="info-value">${technician.empId || 'N/A'}</span>
            </div>
            <div class="info-item">
              Department
              <span class="info-value">${technician.department || 'N/A'}</span>
            </div>
            <div class="info-item">
              Phone
              <span class="info-value">${technician.phone || 'N/A'}</span>
            </div>
            <div class="info-item">
              Email
              <span class="info-value">${technician.email || 'N/A'}</span>
            </div>
            <div class="info-item">
              Status
              <span class="info-value">${technician.availabilityStatus || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div class="summary">
          <h3>Task Assignment Summary</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-number">${totalTasks}</div>
              <div class="summary-label">Total Tasks</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${completedTasks}</div>
              <div class="summary-label">Completed</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${inProgressTasks}</div>
              <div class="summary-label">In Progress</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${assignedTasksCount}</div>
              <div class="summary-label">Assigned</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${pendingTasks}</div>
              <div class="summary-label">Pending</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${completionRate}%</div>
              <div class="summary-label">Completion Rate</div>
            </div>
          </div>
        </div>
        
        <div class="task-records">
    `;

    tasks.forEach((task) => {
      const getStatusClass = (status) => {
        switch (status?.toUpperCase()) {
          case 'COMPLETED': return 'status-completed';
          case 'IN_PROGRESS': return 'status-in-progress';
          case 'ASSIGNED': return 'status-assigned';
          case 'PENDING': return 'status-pending';
          default: return 'status-pending';
        }
      };

      const getPriorityClass = (priority) => {
        if (priority?.includes('High')) return 'priority-high';
        if (priority?.includes('Low')) return 'priority-low';
        return 'priority-normal';
      };

      const originalTask = assignedTasks.find(t => t.assignId === task.id);

      htmlContent += `
        <div class="task-record">
          <div class="record-header">
            <div class="task-title">${task.title}</div>
            <div class="task-badges">
              <span class="badge ${getPriorityClass(task.priority)}">${task.priority}</span>
              <span class="badge ${getStatusClass(task.status)}">${task.status?.replace('_', ' ')}</span>
            </div>
          </div>
          
          <div class="task-details">
            <div class="detail-row">
              <span class="detail-label">Task ID:</span>
              <span class="detail-value">${task.id || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Equipment ID:</span>
              <span class="detail-value">${task.equipmentId || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Start Date:</span>
              <span class="detail-value">${task.due !== 'Not scheduled' ? new Date(task.due).toLocaleDateString() : 'Not scheduled'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${task.duration || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time Schedule:</span>
              <span class="detail-value">${task.startTime ? `${task.startTime} - ${task.endTime || 'TBD'}` : 'Not specified'}</span>
            </div>
          </div>
          
          ${originalTask?.notes ? `
          <div class="notes-section">
            <div class="notes-title">Task Notes</div>
            <div class="notes-text">${originalTask.notes}</div>
          </div>
          ` : ''}
        </div>
      `;
    });

    htmlContent += `
        </div>
        <div class="footer">
          <p>ConstruxFlow Maintenance Management System</p>
          <p>Technician Task Report generated automatically on ${date}</p>
        </div>
        
        <div class="no-print" style="position: fixed; top: 10px; right: 10px; background: white; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
          <button onclick="window.print()" style="margin-right: 10px; padding: 5px 10px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
          <button onclick="window.close()" style="padding: 5px 10px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  };

  const downloadPDF = (htmlContent, fileName) => {
    console.log("🚀 Starting PDF download process...");
    console.log("📄 HTML content length:", htmlContent.length);
    
    try {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank', 'width=1200,height=800');
      
      if (!printWindow) {
        throw new Error('Pop-up blocked. Please allow pop-ups for this site.');
      }

      // Write the HTML content to the new window
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          try {
            printWindow.focus();
            printWindow.print();
            
            // Close the window after a delay (optional)
            setTimeout(() => {
              printWindow.close();
            }, 1000);
          } catch (printError) {
            console.error('Print error:', printError);
            alert('Error occurred while printing. Please try again.');
          }
        }, 500);
      };

      // Handle potential errors
      printWindow.onerror = (error) => {
        console.error('Window error:', error);
        alert('Error opening print window. Please check your browser settings.');
      };

    } catch (error) {
      console.error('PDF generation error:', error);
      alert(`Error generating PDF: ${error.message}`);
    }
  };

  // Get filtered tasks
  const displayTasks = mapAssignedTasksToDisplay(assignedTasks);
  const filteredTasks = displayTasks.filter((task) => {
    if (activeFilter === "All") return true;
    
    // Clean the task status by removing extra quotes
    const cleanStatus = task.status?.replace(/"/g, '');
    
    // Handle different filter values
    switch (activeFilter) {
      case "ASSIGNED":
        return cleanStatus === "Assigned" || cleanStatus === "ASSIGNED";
      case "IN_PROGRESS":
        return cleanStatus === "In Progress" || cleanStatus === "IN_PROGRESS";
      case "PENDING":
        return cleanStatus === "Pending" || cleanStatus === "PENDING";
      case "COMPLETED":
        return cleanStatus === "Completed" || cleanStatus === "COMPLETED";
      default:
        return cleanStatus === activeFilter;
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

      <div className="bg-purewhite min-h-screen">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-main_dark mb-2">
              Worker Profile
            </h1>
            <p className="text-slatebluegray text-base">
              View and manage technician profile and task assignments
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep_green mx-auto mb-4"></div>
                <p className="text-slatebluegray">Loading technician data...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center min-h-96">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-main_dark mb-2">
                  Error Loading Profile
                </h3>
                <p className="text-slatebluegray mb-4">{error}</p>
                <button
                  onClick={() => navigation("/maintenance/dashboard")}
                  className="bg-deep_green text-white px-4 py-2 rounded-lg hover:bg-deep_green/80"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Profile Content */}
          {!loading && !error && technicianData && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Profile & Details */}
              <div className="flex-1 max-w-md">
                {/* Profile Card */}
                <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex flex-col items-center">
                    {/* Profile Avatar */}
                    <div className="w-24 h-24 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-white text-2xl font-bold">
                        {technicianData.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")
                          ?.toUpperCase()
                          ?.slice(0, 2) || "T"}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-main_dark mb-2">
                      {technicianData.name || "Unknown"}
                    </h2>

                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                          technicianData.availabilityStatus === "AVAILABLE"
                            ? "bg-green-50 border-green-200"
                            : technicianData.availabilityStatus ===
                              "UNAVAILABLE"
                            ? "bg-red-50 border-red-200"
                            : technicianData.availabilityStatus === "ONTASK"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            technicianData.availabilityStatus === "AVAILABLE"
                              ? "bg-green-500"
                              : technicianData.availabilityStatus ===
                                "UNAVAILABLE"
                              ? "bg-red-500"
                              : technicianData.availabilityStatus === "ONTASK"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${
                            technicianData.availabilityStatus === "AVAILABLE"
                              ? "text-green-700"
                              : technicianData.availabilityStatus ===
                                "UNAVAILABLE"
                              ? "text-red-700"
                              : technicianData.availabilityStatus === "ONTASK"
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {technicianData.availabilityStatus === "ONTASK"
                            ? "On Task"
                            : technicianData.availabilityStatus || "Unknown"}
                        </span>
                      </div>

                      {/* Manual Status Change */}
                      <div className="flex gap-2">
                        <select
                          value={
                            selectedStatus ||
                            technicianData.availabilityStatus ||
                            "AVAILABLE"
                          }
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="text-xs px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-deep_green"
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="ONTASK">On Task</option>
                          <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                        <button
                          onClick={() =>
                            handleManualStatusChange(
                              selectedStatus ||
                                technicianData.availabilityStatus
                            )
                          }
                          className="text-xs px-3 py-1 bg-deep_green text-white rounded hover:bg-deep_green/80 transition-colors"
                          title="Update Status"
                        >
                          Update
                        </button>
                      </div>

                      {/* Status Update Message */}
                      {statusUpdateMessage && (
                        <div className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 mt-2">
                          {statusUpdateMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-deep_green" />
                    <h3 className="font-semibold text-main_dark">
                      Personal Details
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">
                        Employee ID:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.empId || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">Phone:</span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">Email:</span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">
                        Department:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.department || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">
                        Join Date:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.joinDate || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">
                        Gender:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.gender || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-slatebluegray text-sm">NIC:</span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.nic || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slatebluegray text-sm">
                        Experience:
                      </span>
                      <span className="font-medium text-main_dark text-sm">
                        {technicianData.experience || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="w-5 h-5 text-deep_green" />
                    <h3 className="font-semibold text-main_dark">
                      Specializations
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {technicianData.specializations &&
                    technicianData.specializations.length > 0 ? (
                      technicianData.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-deep_green/10 text-deep_green"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No specializations listed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Assigned Tasks */}
              <div className="flex-1 flex flex-col">
                {/* Tasks Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-main_dark">
                      Assigned Tasks
                    </h2>
                    <span className="bg-web_yellow text-main_dark text-xs font-bold px-3 py-1 rounded-full">
                      {tasksLoading ? "..." : assignedTasks.length}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold px-4 py-3 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md"
                  onClick={handleGetEquipment}
                  >
                    <Plus className="w-4 h-4" />
                    Assign New Task
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    "All",
                    "ASSIGNED",
                    "IN_PROGRESS",
                    "PENDING",
                    "COMPLETED",
                  ].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        activeFilter === filter
                          ? "bg-deep_green text-white shadow-md"
                          : "bg-gray-100 text-slatebluegray hover:bg-gray-200 hover:text-main_dark"
                      }`}
                    >
                      {filter === "All" ? filter : filter.replace("_", " ")}
                    </button>
                  ))}
                </div>

                {/* Task Cards Container */}
                <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6 flex-1">
                  {tasksLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep_green"></div>
                      <span className="ml-2 text-slatebluegray">
                        Loading tasks...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                          <div
                            key={task.id}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-main_dark">
                                {task.title}
                              </h3>
                              <div className="flex gap-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${task.priorityColor}`}
                                >
                                  {task.priority}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${task.statusColor}`}
                                >
                                  {task.status?.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-slatebluegray">
                              <div>
                                <span className="font-medium">
                                  Equipment ID:
                                </span>{" "}
                                {task.equipmentId}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span>{" "}
                                {task.duration || "Not specified"}
                              </div>
                              <div>
                                <span className="font-medium">Start Date:</span>{" "}
                                {task.due}
                              </div>
                              <div>
                                <span className="font-medium">Time:</span>{" "}
                                {task.startTime
                                  ? `${task.startTime} - ${
                                      task.endTime || "TBD"
                                    }`
                                  : "Not specified"}
                              </div>
                            </div>
                            {task.notes && (
                              <div className="mt-2 text-sm text-slatebluegray">
                                <span className="font-medium">Notes:</span>{" "}
                                {task.notes}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4">📋</div>
                          <h3 className="text-lg font-semibold text-main_dark mb-2">
                            No Tasks Found
                          </h3>
                          <p className="text-slatebluegray">
                            {assignedTasks.length === 0
                              ? "This technician has no assigned tasks."
                              : "No tasks match the selected filter."}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={generatePDF}
                    disabled={isGeneratingPDF || loading || assignedTasks.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-deep_green hover:bg-deep_green/80 text-white font-semibold py-3 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaDownload className="w-4 h-4" />
                        Export Report
                      </>
                    )}
                  </button>
                  {/* <button className="flex-1 flex items-center justify-center gap-2 bg-light_gray/40 hover:bg-light_gray/60 text-main_dark font-semibold py-3 rounded-lg transition-all duration-150">
                    <Phone className="w-4 h-4" />
                    Contact Technician
                  </button> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign New Task Modal */}
      {showAssignModal && (
        <>
          {/* Modal Overlay */}
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-all"
            onClick={() => setShowAssignModal(false)}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-deep_green text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Assign New Task</h2>
                  <p className="text-green-100 text-sm">Select from available accepted scheduling requests</p>
                </div>
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {modalLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep_green"></div>
                    <span className="ml-3 text-gray-600">Loading accepted schedules...</span>
                  </div>
                ) : acceptedSchedulingData.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Accepted Schedules</h3>
                    <p className="text-gray-500">There are no accepted scheduling requests available for assignment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Available Accepted Schedules ({acceptedSchedulingData.length})
                    </h3>
                    
                    {/* Schedule Cards */}
                    <div className="grid gap-4">
                      {acceptedSchedulingData.map((schedule, index) => (
                        <div 
                          key={schedule.id || index} 
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-deep_green"
                          onClick={() => {
                            // Navigate to assignment page with schedule data
                            handleStartMaintenance(schedule.id);
                            setShowAssignModal(false);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-800">
                                  {schedule.equipmentName || schedule.equipment || 'Equipment'}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  schedule.status === 'Accept' ? 'bg-green-100 text-green-800' :
                                  schedule.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {schedule.status}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Type:</span> {schedule.equipmentType || 'N/A'}
                                </div>
                                <div>
                                  <span className="font-medium">Date:</span> {
                                    schedule.date ? new Date(schedule.date).toLocaleDateString() : 'N/A'
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Time:</span> {schedule.time || 'N/A'}
                                </div>
                              </div>
                              
                              {schedule.description && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <span className="font-medium">Description:</span> {schedule.description}
                                </div>
                              )}
                            </div>
                            
                            <button className="ml-4 bg-deep_green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-deep_green/80 transition-colors">
                              Assign
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

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
