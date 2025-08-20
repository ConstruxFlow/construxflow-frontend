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
                  <button className="flex items-center gap-2 bg-web_yellow hover:bg-web_yellow/80 text-main_dark text-sm font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-150">
                    <FaDownload className="w-4 h-4" />
                    Download PDF
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
