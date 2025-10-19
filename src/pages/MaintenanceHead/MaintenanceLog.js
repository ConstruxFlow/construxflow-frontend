import { useState, useEffect } from "react";
import { FaDownload, FaCalendarAlt, FaUser, FaTools } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import NavBar from "../../components/NavBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import TeamSection from "../../components/MaintenanceHead/TeamSection";

export default function ServiceHistoryContainer() {
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get("equipmentId");

  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipmentInfo, setEquipmentInfo] = useState(null);
  const [openIndexes, setOpenIndexes] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Fetch equipment maintenance history
  useEffect(() => {
    if (!equipmentId) {
      setError("No equipment ID provided");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:8080/api/equipment-scheduling/equipment?equipmentId=${equipmentId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch equipment maintenance history");
        }
        return response.json();
      })
      .then((data) => {
        setServiceHistory(data);
        // Set equipment info from first record
        if (data.length > 0) {
          setEquipmentInfo({
            name: data[0].equipmentName,
            type: data[0].equipmentType,
            id: data[0].equipmentId,
          });
        }
        // Initialize all items as closed
        setOpenIndexes(new Array(data.length).fill(false));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [equipmentId]);

  const toggleOpen = (idx) => {
    setOpenIndexes((prev) => prev.map((open, i) => (i === idx ? !open : open)));
  };

  // PDF Export Functions
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      console.log("🔄 Generating Maintenance History PDF...");
      console.log("📊 Service history data:", serviceHistory.length, "records");
      
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const fileName = `Maintenance_History_${equipmentInfo?.name?.replace(/\s/g, "_") || `Equipment_${equipmentId}`}_${currentDate.replace(/\s/g, "_")}.pdf`;
      const title = `Maintenance History - ${equipmentInfo?.name || `Equipment ${equipmentId}`}`;

      if (serviceHistory.length === 0) {
        alert("No maintenance history available to export. Please ensure data has loaded properly.");
        return;
      }

      // Generate PDF content
      const pdfContent = generatePDFContent(serviceHistory, title, currentDate, equipmentInfo);
      console.log("PDF content generated successfully");
      
      downloadPDF(pdfContent, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Failed to generate PDF: ${error.message}. Please try again.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generatePDFContent = (data, title, date, equipment) => {
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
          .equipment-info {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #f59e0b;
          }
          .equipment-info h3 {
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
          .maintenance-record { 
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
          .record-date {
            font-weight: bold;
            font-size: 18px;
            color: #1f2937;
          }
          .record-badges {
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
          .priority-medium { background-color: #fed7aa; color: #ea580c; }
          .priority-low { background-color: #fef3c7; color: #d97706; }
          .priority-default { background-color: #f3f4f6; color: #6b7280; }
          .type-badge { background-color: #dbeafe; color: #2563eb; }
          .status-completed { background-color: #dcfce7; color: #16a34a; }
          .status-pending { background-color: #fef3c7; color: #ca8a04; }
          .record-details {
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
          .materials-section {
            margin-top: 15px;
            padding: 10px;
            background-color: #f9fafb;
            border-radius: 6px;
          }
          .materials-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }
          .material-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            font-size: 12px;
          }
          .description-section {
            margin-top: 15px;
            padding: 10px;
            background-color: #f8fafc;
            border-radius: 6px;
            border-left: 3px solid #0ea5e9;
          }
          .description-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
          }
          .description-text {
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
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Generated on ${date}</p>
        </div>
        
        ${equipment ? `
        <div class="equipment-info">
          <h3>Equipment Information</h3>
          <div class="info-grid">
            <div class="info-item">
              Equipment Name
              <span class="info-value">${equipment.name || 'N/A'}</span>
            </div>
            <div class="info-item">
              Equipment Type
              <span class="info-value">${equipment.type || 'N/A'}</span>
            </div>
            <div class="info-item">
              Equipment ID
              <span class="info-value">${equipment.id || 'N/A'}</span>
            </div>
          </div>
        </div>
        ` : ''}
        
        <div class="summary">
          <h3>Maintenance Summary</h3>
          <p><strong>Total Records:</strong> ${data.length}</p>
          <p><strong>Completed Services:</strong> ${data.filter(item => item.status === "Completed").length}</p>
          <p><strong>High Priority Services:</strong> ${data.filter(item => item.priority?.toLowerCase() === "high").length}</p>
        </div>
        
        <div class="maintenance-records">
    `;

    data.forEach((item) => {
      const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const getPriorityClass = (priority) => {
        switch (priority?.toLowerCase()) {
          case "high": return "priority-high";
          case "medium": return "priority-medium";
          case "low": return "priority-low";
          default: return "priority-default";
        }
      };

      const getStatusClass = (status) => {
        return status === "Completed" ? "status-completed" : "status-pending";
      };

      htmlContent += `
        <div class="maintenance-record">
          <div class="record-header">
            <div class="record-date">📅 ${formattedDate}</div>
            <div class="record-badges">
              <span class="badge ${getPriorityClass(item.priority)}">${item.priority || 'Normal'} Priority</span>
              <span class="badge type-badge">${item.maintenanceType || 'General'}</span>
              <span class="badge ${getStatusClass(item.status)}">${item.status || 'Unknown'}</span>
            </div>
          </div>
          
          <!-- Main Description (Always Visible) -->
          <div class="description-section" style="margin-top: 0; margin-bottom: 15px;">
            <div class="description-title">🔧 Maintenance Description</div>
            <div class="description-text">${item.description || 'No description provided'}</div>
          </div>
          
          <!-- Expanded Details Section (Like Opened Accordion) -->
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 15px; border-left: 4px solid #0ea5e9;">
            <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px; font-weight: 600;">📋 Detailed Information</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
              <div>
                <div style="font-weight: 600; color: #374151; font-size: 12px; margin-bottom: 4px;">⏰ Status</div>
                <div style="display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; ${
                  item.status === "Completed" 
                    ? "background-color: #dcfce7; color: #16a34a;" 
                    : "background-color: #fef3c7; color: #ca8a04;"
                }">${item.status || 'Unknown'}</div>
              </div>
              <div>
                <div style="font-weight: 600; color: #374151; font-size: 12px; margin-bottom: 4px;">🕒 Time</div>
                <div style="font-weight: 600; color: #1f2937;">${item.time || 'Not specified'}</div>
              </div>
            </div>
            
            <!-- Materials Section (Always Expanded) -->
            <div style="background-color: white; border-radius: 6px; padding: 12px; border: 1px solid #e5e7eb; margin-bottom: 15px;">
              <div style="font-weight: 600; color: #374151; margin-bottom: 8px; display: flex; align-items: center;">
                🔩 Materials/Parts Used
              </div>
              ${item.maintenanceRequests && item.maintenanceRequests.length > 0 ? 
                item.maintenanceRequests.map((request, partIdx) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; ${
                    partIdx !== item.maintenanceRequests.length - 1 ? 'border-bottom: 1px solid #f3f4f6;' : ''
                  }">
                    <div>
                      <span style="font-weight: 500; color: #1f2937;">${request.itemName || 'Unknown Item'}</span>
                      <div style="font-size: 11px; color: #6b7280;">
                        Urgency: <span style="font-weight: 500; color: ${
                          request.urgency?.toLowerCase() === 'high' ? '#dc2626' : 
                          request.urgency?.toLowerCase() === 'medium' ? '#ea580c' : '#059669'
                        };">${request.urgency || 'Normal'}</span>
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <span style="font-weight: 600; color: #374151;">
                        Qty: ${request.quantity || 0} ${request.measurement || ''}
                      </span>
                    </div>
                  </div>
                `).join('') 
                : 
                '<div style="color: #6b7280; font-style: italic; text-align: center; padding: 10px;">No materials recorded for this maintenance</div>'
              }
            </div>
            
            <!-- Additional Technical Details -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; font-size: 12px;">
              <div>
                <div style="color: #6b7280; font-weight: 500;">Maintenance Type</div>
                <div style="font-weight: 600; color: #1f2937; margin-top: 2px;">${item.maintenanceType || 'General'}</div>
              </div>
              <div>
                <div style="color: #6b7280; font-weight: 500;">Priority Level</div>
                <div style="font-weight: 600; margin-top: 2px; color: ${
                  item.priority?.toLowerCase() === 'high' ? '#dc2626' : 
                  item.priority?.toLowerCase() === 'medium' ? '#ea580c' : '#059669'
                };">${item.priority || 'Normal'}</div>
              </div>
              <div>
                <div style="color: #6b7280; font-weight: 500;">Record ID</div>
                <div style="font-weight: 600; color: #1f2937; margin-top: 2px;">#${item.id || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    htmlContent += `
        </div>
        <div class="footer">
          <p>ConstruxFlow Equipment Management System</p>
          <p>Maintenance History Report generated automatically on ${date}</p>
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
            @media print {
              body { margin: 10px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="position: fixed; top: 10px; right: 10px; background: white; padding: 10px; border: 1px solid #ccc; border-radius: 5px; z-index: 1000;">
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

  const [showTeam, setShowTeam] = useState(false);
  const navigation = useNavigate();

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
              Equipment Service History
            </h1>
            <p className="text-slatebluegray text-base">
              Complete maintenance and repair history for{" "}
              {equipmentInfo?.name || `Equipment ID: ${equipmentId}`}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep_green"></div>
              <p className="text-slatebluegray text-sm ml-3">
                Loading maintenance history...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">Error: {error}</p>
            </div>
          ) : serviceHistory.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <p className="text-slatebluegray">
                No maintenance history found for this equipment.
              </p>
            </div>
          ) : (
            <>
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
                        Equipment ID: {equipmentId}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={generatePDF}
                    disabled={isGeneratingPDF || loading || serviceHistory.length === 0}
                    className="flex items-center gap-2 bg-web_yellow hover:bg-web_yellow/80 text-main_dark text-sm font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaDownload className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>

                {/* Equipment Information */}
                {equipmentInfo && (
                  <div className="border-b border-gray-200 px-6 py-5">
                    <h3 className="font-semibold text-main_dark mb-4">
                      Equipment Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slatebluegray">Name:</span>
                        <div className="font-semibold text-main_dark">
                          {equipmentInfo.name}
                        </div>
                      </div>
                      <div>
                        <span className="text-slatebluegray">Type:</span>
                        <div className="font-semibold text-main_dark">
                          {equipmentInfo.type}
                        </div>
                      </div>
                      <div>
                        <span className="text-slatebluegray">
                          Equipment ID:
                        </span>
                        <div className="font-semibold text-main_dark">
                          {equipmentInfo.id}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Maintenance History */}
                <div className="px-6 py-5">
                  <h3 className="font-semibold text-main_dark mb-6">
                    Maintenance History
                  </h3>
                  <div className="space-y-4">
                    {serviceHistory.map((item, idx) => {
                      // Format date
                      const formattedDate = new Date(
                        item.date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });

                      // Get priority color
                      const getTypeColor = (priority) => {
                        switch (priority?.toLowerCase()) {
                          case "high":
                            return "bg-red-100 text-red-600";
                          case "medium":
                            return "bg-orange-100 text-orange-600";
                          case "low":
                            return "bg-web_yellow/10 text-web_yellow";
                          default:
                            return "bg-gray-100 text-gray-600";
                        }
                      };

                      return (
                        <div
                          key={item.id}
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
                                  {formattedDate}
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                      item.priority
                                    )}`}
                                  >
                                    {item.priority} Priority
                                  </span>
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                    {item.maintenanceType}
                                  </span>
                                </div>
                                <div className="text-sm text-slatebluegray">
                                  {item.description}
                                </div>
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
                                    <div className="text-sm font-medium text-slatebluegray mb-1">
                                      Status
                                    </div>
                                    <div
                                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                        item.status === "Completed"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {item.status}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-slatebluegray mb-1">
                                      Time
                                    </div>
                                    <div className="font-semibold text-main_dark">
                                      {item.time}
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <div className="text-sm font-medium text-slatebluegray mb-2">
                                    Materials/Parts Used
                                  </div>
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    {item.maintenanceRequests &&
                                    item.maintenanceRequests.length > 0 ? (
                                      item.maintenanceRequests.map(
                                        (request, partIdx) => (
                                          <div
                                            key={request.id}
                                            className={`flex justify-between items-center py-2 ${
                                              partIdx !==
                                              item.maintenanceRequests.length -
                                                1
                                                ? "border-b border-gray-100"
                                                : ""
                                            }`}
                                          >
                                            <div>
                                              <span className="text-sm text-main_dark font-medium">
                                                {request.itemName}
                                              </span>
                                              <div className="text-xs text-slatebluegray">
                                                Urgency: {request.urgency}
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <span className="text-sm text-slatebluegray font-medium">
                                                Qty: {request.quantity}{" "}
                                                {request.measurement}
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <p className="text-sm text-slatebluegray">
                                        No materials recorded
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-sm font-medium text-slatebluegray mb-2">
                                    Description
                                  </div>
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <p className="text-sm text-main_dark leading-relaxed">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
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
