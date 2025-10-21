import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Bell,
  Calendar,
  List,
  Grid,
  Download,
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
  Wrench,
} from "lucide-react";
import EquipmentLogCard from "../../components/MaintenanceHead/EquipmentLogCard";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

export default function EquipmentLogContainer() {
  const [showTeam, setShowTeam] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Equipment Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipmentDetails, setEquipmentDetails] = useState([]);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [upcomingSchedulesCount, setUpcomingSchedulesCount] = useState(0);
  const [nearestScheduleDate, setNearestScheduleDate] = useState(null);
  const navigation = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/nextschedule/all")
      .then((response) => {
        if (response.status === 404) {
          throw new Error("No schedules found");
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSchedules(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log("Fetched Schedules:", schedules);

  // Function to merge equipment with schedule data
  const getEquipmentWithSchedule = () => {
    console.log("Equipment Details:", equipmentDetails);
    console.log("Schedules:", schedules);

    // Ensure equipmentDetails is a valid array
    if (!Array.isArray(equipmentDetails)) {
      return [];
    }

    return equipmentDetails.map((equipment) => {
      // Find matching schedule for this equipment - fix the matching logic
      const matchingSchedule = schedules.find((schedule) => {
        const equipmentIdMatch =
          String(schedule.equipmentId) === String(equipment.id) ||
          String(schedule.equipmentId) === String(equipment.equipmentId);
        console.log(
          `Checking equipment ${equipment.id} vs schedule equipmentId ${schedule.equipmentId}:`,
          equipmentIdMatch
        );
        return equipmentIdMatch;
      });

      console.log(
        `Equipment ${equipment.id} matched with schedule:`,
        matchingSchedule
      );

      // Merge equipment data with schedule data
      return {
        ...equipment,
        // Schedule-related fields - updated to match API response
        nextService:
          matchingSchedule?.nextDate ||
          equipment.nextService ||
          "Not scheduled",
        lastMaintenance:
          matchingSchedule?.lastMaintenanceDate ||
          equipment.lastMaintenance ||
          "Not available",
        maintenanceType:
          matchingSchedule?.nextMaintenanceType ||
          equipment.maintenanceType ||
          "General",
        priority: matchingSchedule?.priority || equipment.priority || "Normal",
        technician:
          matchingSchedule?.technicianName ||
          matchingSchedule?.technicianId ||
          equipment.technician ||
          "Not assigned",
        scheduledBy:
          matchingSchedule?.scheduledBy || equipment.scheduledBy || "System",
        estimateDuration:
          matchingSchedule?.estimateDuration ||
          equipment.estimateDuration ||
          "Not specified",
        assignId: matchingSchedule?.assignId || equipment.assignId,
        nextScheduleId:
          matchingSchedule?.nextScheduleId || equipment.nextScheduleId,
        // Determine next service color based on schedule status
        nextServiceColor: matchingSchedule
          ? new Date(matchingSchedule.nextDate) < new Date()
            ? "text-red-500 font-semibold"
            : "text-web_yellow font-semibold"
          : "text-slatebluegray",
        // Add schedule status
        scheduleStatus: matchingSchedule?.status || "No Schedule",
        hasSchedule: !!matchingSchedule,
      };
    });
  };

  const mergedEquipmentData = getEquipmentWithSchedule();

  // Ensure we have a valid array to work with
  const safeEquipmentData = Array.isArray(mergedEquipmentData) ? mergedEquipmentData : [];

  // Filter data based on search term, type, and status
  const filteredData = safeEquipmentData.filter((equipment) => {
    if (!equipment) return false;
    
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (equipment.equipmentName || '').toLowerCase().includes(term) ||
      (equipment.name || '').toLowerCase().includes(term) ||
      (equipment.equipmentType || '').toLowerCase().includes(term) ||
      (equipment.type || '').toLowerCase().includes(term) ||
      String(equipment.equipmentId || '').toLowerCase().includes(term) ||
      String(equipment.id || '').toLowerCase().includes(term);

    const matchesType =
      selectedType === "All Equipment Types" ||
      equipment.equipmentType === selectedType ||
      equipment.type === selectedType;

    const matchesStatus =
      selectedStatus === "All Statuses" ||
      equipment.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedStatus]);

  // Calculate upcoming schedules and nearest date
  useEffect(() => {
    const calculateUpcomingSchedules = () => {
      const currentDate = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(currentDate.getDate() + 7); // Next 7 days

      let upcomingCount = 0;
      let nearestDate = null;
      let nearestDiff = Infinity;

      schedules.forEach(schedule => {
        if (schedule.nextDate) {
          const scheduleDate = new Date(schedule.nextDate);
          
          // Check if schedule is within next 7 days
          if (scheduleDate >= currentDate && scheduleDate <= nextWeek) {
            upcomingCount++;
            
            // Find the nearest upcoming date
            const timeDiff = scheduleDate.getTime() - currentDate.getTime();
            if (timeDiff < nearestDiff && timeDiff > 0) {
              nearestDiff = timeDiff;
              nearestDate = scheduleDate;
            }
          }
        }
      });

      setUpcomingSchedulesCount(upcomingCount);
      setNearestScheduleDate(nearestDate);
      
      console.log("Upcoming schedules in next 7 days:", upcomingCount);
      console.log("Nearest schedule date:", nearestDate);
    };

    if (schedules.length > 0) {
      calculateUpcomingSchedules();
    }
  }, [schedules]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportDropdown && !event.target.closest('.relative')) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportDropdown]);

  useEffect(() => {
    fetch("http://localhost:8080/api/equipment/all")
      .then((response) => {
        if (response.status === 404) {
          throw new Error("No equipment found");
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEquipmentDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log("Fetched Equipment Details:", equipmentDetails);

  // Generate unique equipment types and statuses for dropdown filters
  const uniqueEquipmentTypes = Array.from(
    new Set(
      safeEquipmentData
        .map((item) => item.equipmentType || item.type)
        .filter(Boolean)
    )
  ).sort(); // Sort alphabetically for better UX

  const uniqueEquipmentStatuses = Array.from(
    new Set(
      safeEquipmentData
        .map((item) => item.status)
        .filter(Boolean)
    )
  ).sort(); // Sort alphabetically for better UX

  console.log("Unique Equipment Types:", uniqueEquipmentTypes);
  console.log("Unique Equipment Statuses:", uniqueEquipmentStatuses);

  // Handle View Logs navigation
  const handleViewLogs = (equipmentId) => {
    navigation(`/maintenance/log?equipmentId=${equipmentId}`);
  };

  // Handle Schedule Service navigation
  const handleScheduleService = (equipmentId) => {
    navigation(`/maintenance/scheduling/${equipmentId}`);
  };

  // PDF Export Functions
  const generatePDF = async (dataType) => {
    setIsGeneratingPDF(true);
    
    try {
      console.log(`🔄 Generating PDF for type: ${dataType}`);
      console.log(`📊 Filtered data length: ${filteredData.length}`);
      console.log(`📄 Sample equipment data:`, filteredData.slice(0, 2));
      
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let dataToExport = [];
      let fileName = "";
      let title = "";

      switch (dataType) {
        case "all":
          dataToExport = filteredData;
          fileName = `All_Equipment_${currentDate.replace(/\s/g, "_")}.pdf`;
          title = "All Equipment Report";
          break;
        case "scheduled":
          dataToExport = filteredData.filter((eq) => eq.hasSchedule);
          fileName = `Scheduled_Equipment_${currentDate.replace(/\s/g, "_")}.pdf`;
          title = "Scheduled Equipment Report";
          break;
        case "pending":
          dataToExport = filteredData.filter(
            (eq) => 
              eq.status?.toLowerCase() === "pending" ||
              eq.status?.toLowerCase() === "needs service" ||
              eq.scheduleStatus?.toLowerCase() === "pending"
          );
          fileName = `Pending_Maintenance_${currentDate.replace(/\s/g, "_")}.pdf`;
          title = "Pending Maintenance Report";
          break;
        case "completed":
          dataToExport = filteredData.filter(
            (eq) =>
              eq.status?.toLowerCase() === "completed" ||
              eq.status?.toLowerCase() === "operational" ||
              eq.scheduleStatus?.toLowerCase() === "completed"
          );
          fileName = `Completed_Maintenance_${currentDate.replace(/\s/g, "_")}.pdf`;
          title = "Completed Maintenance Report";
          break;
        default:
          dataToExport = filteredData;
          fileName = `Equipment_Report_${currentDate.replace(/\s/g, "_")}.pdf`;
          title = "Equipment Report";
      }

      console.log(`Data to export length: ${dataToExport.length}`);
      console.log(`Title: ${title}`);

      if (dataToExport.length === 0) {
        alert(`No equipment found for ${title.toLowerCase()}. Please adjust your filters and try again.`);
        return;
      }

      // Generate PDF content
      const pdfContent = generatePDFContent(dataToExport, title, currentDate);
      console.log("PDF content generated successfully");
      
      downloadPDF(pdfContent, fileName);
      setShowExportDropdown(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Failed to generate PDF: ${error.message}. Please try again.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generatePDFContent = (data, title, date) => {
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
          .summary {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #f59e0b;
          }
          .equipment-grid { 
            display: grid; 
            gap: 15px;
          }
          .equipment-card { 
            border: 1px solid #e5e7eb; 
            border-radius: 8px;
            padding: 15px;
            background-color: #ffffff;
            page-break-inside: avoid;
          }
          .equipment-card h3 { 
            margin: 0 0 10px 0; 
            color: #1f2937;
            font-size: 16px;
          }
          .equipment-info { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 8px;
            font-size: 12px;
          }
          .info-item { 
            display: flex; 
            justify-content: space-between;
            padding: 4px 0;
          }
          .info-label { 
            font-weight: bold; 
            color: #4b5563;
          }
          .info-value { 
            color: #1f2937;
          }
          .status-operational { color: #059669; font-weight: bold; }
          .status-pending { color: #d97706; font-weight: bold; }
          .status-service { color: #dc2626; font-weight: bold; }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Generated on ${date}</p>
        </div>
        
        <div class="summary">
          <h3>Summary</h3>
          <p><strong>Total Equipment:</strong> ${data.length}</p>
          <p><strong>With Schedules:</strong> ${data.filter(eq => eq.hasSchedule).length}</p>
          <p><strong>Pending Maintenance:</strong> ${data.filter(eq => 
            eq.status?.toLowerCase() === "pending" ||
            eq.status?.toLowerCase() === "needs service" ||
            eq.scheduleStatus?.toLowerCase() === "pending"
          ).length}</p>
        </div>
        
        <div class="equipment-grid">
    `;

    data.forEach((equipment) => {
      const statusClass = 
        equipment.status?.toLowerCase() === "operational" ? "status-operational" :
        equipment.status?.toLowerCase() === "pending" || equipment.status?.toLowerCase() === "needs service" ? "status-pending" :
        "status-service";

      htmlContent += `
        <div class="equipment-card">
          <h3>${equipment.equipmentName || equipment.name || "Unknown Equipment"}</h3>
          <div class="equipment-info">
            <div class="info-item">
              <span class="info-label">ID:</span>
              <span class="info-value">${equipment.equipmentId || equipment.id || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Type:</span>
              <span class="info-value">${equipment.equipmentType || equipment.type || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value ${statusClass}">${equipment.status || "Unknown"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Location:</span>
              <span class="info-value">${equipment.location || "Not specified"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Maintenance:</span>
              <span class="info-value">${equipment.lastMaintenance || "Not available"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Next Service:</span>
              <span class="info-value">${equipment.nextService || "Not scheduled"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Priority:</span>
              <span class="info-value">${equipment.priority || "Normal"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Technician:</span>
              <span class="info-value">${equipment.technician || "Not assigned"}</span>
            </div>
          </div>
        </div>
      `;
    });

    htmlContent += `
        </div>
        <div class="footer">
          <p>ConstruxFlow Equipment Management System</p>
          <p>Report generated automatically on ${date}</p>
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
      // Create a clean HTML document for printing
      const printableHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${fileName}</title>
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
            .summary {
              background-color: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #f59e0b;
            }
            .equipment-card { 
              border: 1px solid #e5e7eb; 
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
              background-color: #ffffff;
              page-break-inside: avoid;
            }
            .equipment-card h3 { 
              margin: 0 0 10px 0; 
              color: #1f2937;
            }
            .info-item { 
              display: flex; 
              justify-content: space-between;
              padding: 4px 0;
              border-bottom: 1px dotted #e5e7eb;
            }
            .info-label { 
              font-weight: bold; 
              color: #4b5563;
              width: 40%;
            }
            .info-value { 
              color: #1f2937;
              width: 60%;
              text-align: right;
            }
            .status-operational { color: #059669; font-weight: bold; }
            .status-pending { color: #d97706; font-weight: bold; }
            .status-service { color: #dc2626; font-weight: bold; }
            @media print {
              body { margin: 10px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="position: fixed; top: 10px; right: 10px; background: white; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">🖨️ Print PDF</button>
            <button onclick="window.close()" style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">✖️ Close</button>
          </div>
          ${htmlContent.replace(/<\/?(!DOCTYPE|html|head|body|title)[^>]*>/gi, '').replace(/<style>[\s\S]*?<\/style>/gi, '')}
        </body>
        </html>
      `;

      // Try to open new window
      console.log("🔄 Opening new window...");
      const newWindow = window.open("", "_blank", "width=900,height=700,scrollbars=yes,resizable=yes");
      
      if (!newWindow) {
        console.log("⚠️ Popup blocked, using fallback method");
        // Fallback: Create and download HTML file
        const blob = new Blob([printableHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.replace('.pdf', '.html');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert("✅ Report downloaded as HTML file!\n\n📝 Instructions:\n1. Open the downloaded file\n2. Press Ctrl+P (or Cmd+P on Mac)\n3. Select 'Save as PDF' as destination\n4. Click Save");
        return;
      }
      
      console.log("✅ Window opened successfully");
      
      // Write content to new window
      newWindow.document.open();
      newWindow.document.write(printableHTML);
      newWindow.document.close();
      
      console.log("📝 Content written to window");
      
      // Focus and print
      newWindow.focus();
      
      // Wait a bit for content to render, then show print dialog
      setTimeout(() => {
        console.log("🖨️ Showing print dialog");
        newWindow.print();
      }, 1000);
      
    } catch (error) {
      console.error("❌ Error in downloadPDF:", error);
      alert(`Failed to generate PDF report: ${error.message}\n\nPlease try again or check your browser settings.`);
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-main_dark mb-2">
                Equipment Log & Maintenance History
              </h1>
              <p className="text-slatebluegray text-base">
                Track, manage and analyze maintenance records
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-slatebluegray" onClick={()=>navigation("/maintenance/inventory-request")} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-2 text-slatebluegray bg-purewhite border border-gray-200 rounded-lg px-3 py-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Alert Banner - Show only when there are upcoming schedules */}
          {upcomingSchedulesCount > 0 && (
            <div className="bg-gradient-to-r from-web_yellow/15 via-web_yellow/8 to-transparent border-l-4 border-web_yellow rounded-lg p-4 mb-8 flex items-start gap-4 shadow-md">
              <div className="text-yellow-600 text-2xl mt-1">📅</div>
              <div>
                <h3 className="font-semibold text-base text-gray-800 mb-1 tracking-wide">
                  Upcoming Maintenance Alert
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  {upcomingSchedulesCount} maintenance schedule{upcomingSchedulesCount > 1 ? 's are' : ' is'} coming soon in the next 7 days.
                  {nearestScheduleDate && (
                    <span className="block mt-1 text-gray-600 font-semibold">
                      Next schedule: {nearestScheduleDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })} at {nearestScheduleDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </span>
                  )}
                </p>
              </div>
              <button 
                className="ml-auto bg-main_dark text-white px-4 py-2 rounded-lg hover:bg-slatebluegray text-sm transition-colors"
                onClick={() => {
                  // Find the equipment ID with the nearest upcoming schedule
                  const nearestSchedule = schedules.find(schedule => 
                    schedule.nextDate && new Date(schedule.nextDate).getTime() === nearestScheduleDate?.getTime()
                  );
                  const equipmentId = nearestSchedule?.equipmentId;
                  if (equipmentId) {
                    handleScheduleService(equipmentId);
                  } else {
                    // Fallback to general schedules page if no specific equipment found
                    navigation("/maintenance/update-equipment-maintenance");
                  }
                }}
              >
                View Schedules
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Total Equipment
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {filteredData.length}
                </h3>
                <span className="text-deep_green text-xs">
                  {filteredData.filter((eq) => eq.hasSchedule).length}{" "}
                  with schedules
                </span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <ClipboardCheck className="text-purewhite text-lg" />
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Pending Maintenance
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {
                    filteredData.filter(
                      (eq) =>
                        eq.status?.toLowerCase() === "pending" ||
                        eq.status?.toLowerCase() === "needs service" ||
                        eq.scheduleStatus?.toLowerCase() === "pending"
                    ).length
                  }
                </h3>
                <span className="text-web_yellow text-xs">
                  {
                    filteredData.filter(
                      (eq) => eq.priority?.toLowerCase() === "high"
                    ).length
                  }{" "}
                  urgent
                </span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <Wrench className="text-main_dark text-lg" />
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Recent Breakdowns
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {filteredData.reduce(
                    (total, eq) => total + (eq.breakdowns || 0),
                    0
                  )}
                </h3>
                <span className="text-red-600 text-xs">↑2 in last 24h</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <AlertTriangle className="text-purewhite text-lg" />
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                  Maintenance Completed
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {
                    filteredData.filter(
                      (eq) =>
                        eq.status?.toLowerCase() === "completed" ||
                        eq.status?.toLowerCase() === "operational" ||
                        eq.scheduleStatus?.toLowerCase() === "completed"
                    ).length
                  }
                </h3>
                <span className="text-deep_green text-xs">↑12% this month</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                <CheckCircle className="text-purewhite text-lg" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-slatebluegray" />
              <h2 className="text-lg font-semibold text-main_dark">
                Search & Filter Equipment
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Search Equipment
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Equipment Type Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Equipment Type
                </label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full lg:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm appearance-none"
                  >
                    <option value="All Equipment Types">All Equipment Types</option>
                    {uniqueEquipmentTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full lg:w-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm appearance-none"
                  >
                    <option value="All Statuses">All Statuses</option>
                    {uniqueEquipmentStatuses.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                </div>
              </div>

              {/* Advanced Filters Button */}
              <div>
                <button className="bg-deep_green hover:bg-deep_green/80 text-white px-6 py-3 rounded-lg font-medium transition-all duration-150 shadow-sm hover:shadow-md">
                  Advanced Filters
                </button>
              </div>
            </div>
          </div>

          {/* Equipment Logs Section */}
          <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-lg font-semibold text-main_dark">
                Equipment Logs
              </h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center px-3 py-2 bg-light_gray/40 text-slatebluegray rounded-lg text-sm font-medium hover:bg-light_gray/60 transition-colors">
                  <List className="w-4 h-4 mr-1" /> Table View
                </button>
                <button className="flex items-center px-3 py-2 bg-web_yellow text-main_dark rounded-lg text-sm font-medium shadow-sm">
                  <Grid className="w-4 h-4 mr-1" /> Card View
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="flex items-center px-3 py-2 bg-light_gray/40 text-slatebluegray rounded-lg text-sm font-medium hover:bg-light_gray/60 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" /> Export
                    <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Export Dropdown */}
                  {showExportDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-800">Export Equipment Data</h3>
                        <p className="text-xs text-gray-600 mt-1">Choose what data to download as PDF</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => generatePDF("all")}
                          disabled={isGeneratingPDF}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div>
                            <span className="font-medium">All Equipment</span>
                            <span className="text-xs text-gray-500 block">Complete equipment list ({filteredData.length} items)</span>
                          </div>
                          {isGeneratingPDF ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-web_yellow"></div>
                          ) : (
                            <Download className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => generatePDF("scheduled")}
                          disabled={isGeneratingPDF}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div>
                            <span className="font-medium">Scheduled Equipment</span>
                            <span className="text-xs text-gray-500 block">Equipment with maintenance schedules ({filteredData.filter(eq => eq.hasSchedule).length} items)</span>
                          </div>
                          {isGeneratingPDF ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-web_yellow"></div>
                          ) : (
                            <Download className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => generatePDF("pending")}
                          disabled={isGeneratingPDF}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div>
                            <span className="font-medium">Pending Maintenance</span>
                            <span className="text-xs text-gray-500 block">Equipment needing maintenance ({filteredData.filter(eq => 
                              eq.status?.toLowerCase() === "pending" ||
                              eq.status?.toLowerCase() === "needs service" ||
                              eq.scheduleStatus?.toLowerCase() === "pending"
                            ).length} items)</span>
                          </div>
                          {isGeneratingPDF ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-web_yellow"></div>
                          ) : (
                            <Download className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => generatePDF("completed")}
                          disabled={isGeneratingPDF}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div>
                            <span className="font-medium">Completed Maintenance</span>
                            <span className="text-xs text-gray-500 block">Equipment with completed maintenance ({filteredData.filter(eq =>
                              eq.status?.toLowerCase() === "completed" ||
                              eq.status?.toLowerCase() === "operational" ||
                              eq.scheduleStatus?.toLowerCase() === "completed"
                            ).length} items)</span>
                          </div>
                          {isGeneratingPDF ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-web_yellow"></div>
                          ) : (
                            <Download className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Equipment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow"></div>
                  <p className="text-slatebluegray text-sm ml-3">
                    Loading equipment details...
                  </p>
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-red-600 text-sm">Error: {error}</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-slatebluegray text-sm">
                    No equipment found matching your search criteria.
                  </p>
                </div>
              ) : (
                paginatedData.map((eq) => (
                  <EquipmentLogCard
                    key={eq.equipmentId || eq.id}
                    name={eq.equipmentName || eq.name}
                    type={eq.equipmentType || eq.type || "Equipment"}
                    status={eq.status || "Unknown"}
                    statusColor="bg-light_gray"
                    id={eq.equipmentId || eq.id}
                    location={eq.location || "Location not specified"}
                    lastMaintenance={eq.lastMaintenance}
                    nextService={eq.nextService}
                    nextServiceColor={eq.nextServiceColor}
                    breakdowns={eq.breakdowns || 0}
                    actions={["View Logs", "Schedule Service"]}
                    onViewLogs={handleViewLogs}
                    onScheduleService={handleScheduleService}
                    // Additional schedule-related props
                    maintenanceType={eq.maintenanceType}
                    priority={eq.priority}
                    technician={eq.technician}
                    scheduleStatus={eq.scheduleStatus}
                    hasSchedule={eq.hasSchedule}
                    {...eq}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                      currentPage === index + 1
                        ? "bg-web_yellow text-main_dark"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
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
