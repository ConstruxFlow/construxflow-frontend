import { useEffect, useState } from "react";
import { Calendar, ChevronDown, Upload, Plus, Settings, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import TeamSection from "../../components/MaintenanceHead/TeamSection";
import LoadingOverlay from "../../components/LoadingOverlay";
import { toast } from "react-toastify";

const navLinks = [
  { name: "Dashboard", href: "/maintenance/dashboard" },
  { name: "Task", href: "/maintenance/scheduling" },
  { name: "Schedule", href: "/maintenance/update-equipment-maintenance" },
  { name: "Team", href: "#" },
  { name: "Equipment", href: "/maintenance/equipment" },
  { name: "Add Technician", href: "/maintenance/add-member" },
];

export default function ScheduleMaintenanceAndRequestMaterials() {
  // Schedule Maintenance Form State
  const [equipmentType, setEquipmentType] = useState("");
  const [equipment, setEquipment] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [priority, setPriority] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");

  // Request Materials Form State
  const [materialItems, setMaterialItems] = useState([
    {
      id: 1, // Simple numeric ID for frontend tracking only
      name: "",
      qty: "",
      measurement: "",
    },
  ]);
  const [justification, setJustification] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("");

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Simple counter for frontend item tracking (not used for backend IDs)
  const [itemCounter, setItemCounter] = useState(2);

  const [showTeam, setShowTeam] = useState(false);
  const navigation = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [equipdata, setEquipmentData] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Unit options
  const unitOptions = [
    { value: "qty", label: "Qty" },
    { value: "liter", label: "Liter" },
    { value: "m3", label: "m³" },
    { value: "cm3", label: "cm³" },
    { value: "packet", label: "Packet" },
    { value: "kg", label: "Kg" },
    { value: "g", label: "g" },
  ];

  const addMaterialItem = () => {
    const newItem = {
      id: itemCounter,
      name: "",
      qty: "",
      measurement: "",
    };
    setMaterialItems([...materialItems, newItem]);
    setItemCounter((prev) => prev + 1);
  };

  const updateMaterialItem = (index, field, value) => {
    const updated = materialItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setMaterialItems(updated);
  };

  const removeMaterialItem = (index) => {
    if (materialItems.length > 1) {
      const updated = materialItems.filter((_, i) => i !== index);
      setMaterialItems(updated);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!equipmentType || !equipment || !scheduleDate || !scheduleTime) {
      setError("Please fill in all required maintenance fields");
      return false;
    }

    if (
      materialItems.some((item) => !item.name || !item.qty || !item.measurement)
    ) {
      setError("Please fill in all material items including quantity and unit");
      return false;
    }

    if (!justification || !urgencyLevel) {
      setError("Please fill in justification and urgency level");
      return false;
    }

    setError("");
    return true;
  };

  // API call function
  const submitToBackend = async (requestBody) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/schedule-maintenance-materials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress((p) => (p >= 90 ? p : p + Math.random() * 5));
    }, 200);

    try {
      setLoadingProgress(10);

      const selectedEquipmentObj = equipdata.find(
        (eq) => eq.id === parseInt(equipment)
      );

      setLoadingProgress(25);

      const requestBody = {
        equipmentType: equipmentType,
        equipmentId: parseInt(equipment),
        equipmentName: selectedEquipmentObj?.name || "",
        maintenanceType: maintenanceType,
        priority: priority,
        scheduleDate: scheduleDate,
        scheduleTime: scheduleTime + ":00",
        scheduleNotes: scheduleNotes,
        materialItems: materialItems.map((item) => ({
          itemName: item.name,
          quantity: parseFloat(item.qty),
          measurement: item.measurement,
        })),
        justification: justification,
        urgencyLevel: urgencyLevel.toUpperCase(),
      };

      console.log("Sending Request Body:", JSON.stringify(requestBody, null, 2));

      setLoadingProgress(50);

      const result = await submitToBackend(requestBody);

      setLoadingProgress(90);

      console.log("Success Response:", result);
      resetForm();
      setLoadingProgress(100);
      toast.success("Request submitted successfully!");
      navigation("/maintenance/update-equipment-maintenance");
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
      console.error("Submission Error:", error);
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
      setLoadingProgress(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/equipment/all");
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        const result = await response.json();
        setEquipmentData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  // Reset form function
  const resetForm = () => {
    setEquipmentType("");
    setEquipment("");
    setMaintenanceType("");
    setPriority("");
    setScheduleDate("");
    setScheduleTime("");
    setScheduleNotes("");
    setMaterialItems([{ id: 1, name: "", qty: "", measurement: "" }]);
    setJustification("");
    setUrgencyLevel("");
    setError("");
    setItemCounter(2);
  };

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

  const uniqueTypes = Array.from(new Set(equipdata.map((item) => item.type)));

  const filteredEquipment = equipdata.filter(
    (item) => item.type === equipmentType
  );

  return (
    <>
      <NavBar
        profileURL="/maintenance/profile"
        links={navLinks.map(link => ({
          ...link,
          onClick: link.name === "Team" ? () => setShowTeam(true) : () => navigation(link.href)
        }))}

      />
      
      {isLoading && (
        <LoadingOverlay
          progress={loadingProgress}
          message="Processing..."
        />
      )}

      <div className="bg-purewhite min-h-screen">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-main_dark mb-2">
              Schedule Maintenance and Request Materials
            </h1>
            <p className="text-slatebluegray text-base">
              Manage equipment maintenance schedules and request inventory materials
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Schedule Maintenance */}
            <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-main_dark">Schedule Maintenance</h2>
              </div>

              <form className="space-y-6">
                {/* Equipment Type */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Select Equipment Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={equipmentType}
                      onChange={(e) => {
                        setEquipmentType(e.target.value);
                        setEquipment(""); // reset selected equipment on type change
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark appearance-none focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Choose equipment type...</option>
                      {uniqueTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                  </div>
                </div>

                {/* Select Equipment */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Select Equipment <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark appearance-none focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      required
                      disabled={isLoading || !equipmentType}
                    >
                      <option value="">Choose equipment...</option>
                      {filteredEquipment.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.model})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                  </div>
                </div>

                {/* Maintenance Type */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Maintenance Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={maintenanceType}
                      onChange={(e) => setMaintenanceType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark appearance-none focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Choose Maintenance Type</option>
                      <option value="Preventive">Preventive</option>
                      <option value="Corrective">Corrective</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                  </div>
                </div>

                {/* Priority Level */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark appearance-none focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select priority...</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                  </div>
                </div>

                {/* Select Date */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Select Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg bg-white text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      required
                      disabled={isLoading}
                    />
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                  </div>
                </div>

                {/* Select Time */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Select Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg bg-white text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      required
                      disabled={isLoading}
                    />
                    <Settings className="absolute left-4 top-3.5 w-4 h-4 text-deep_green" />
                  </div>
                </div>

                {/* Add Notes */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Add Notes
                  </label>
                  <textarea
                    value={scheduleNotes}
                    onChange={(e) => setScheduleNotes(e.target.value)}
                    placeholder="Describe the maintenance requirements..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent resize-none transition-all duration-150"
                    disabled={isLoading}
                  />
                </div>
              </form>
            </div>

            {/* Right Column - Request Inventory Materials */}
            <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Upload className="w-5 h-5 text-main_dark" />
                </div>
                <h2 className="text-lg font-semibold text-main_dark">Request Inventory Materials</h2>
              </div>

              <form className="space-y-6">
                {/* Items Needed */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-3">
                    Items Needed <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-4">
                    {materialItems.map((item, index) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-slatebluegray font-medium mb-2">
                          Item #{item.id}
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              updateMaterialItem(index, "name", e.target.value)
                            }
                            placeholder="Item name (e.g., Oil)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                            required
                            disabled={isLoading}
                          />

                          <div className="flex gap-3">
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) =>
                                updateMaterialItem(index, "qty", e.target.value)
                              }
                              placeholder="Amount"
                              min="0"
                              step="0.1"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                              required
                              disabled={isLoading}
                            />

                            <div className="relative flex-1">
                              <select
                                value={item.measurement}
                                onChange={(e) =>
                                  updateMaterialItem(
                                    index,
                                    "measurement",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark appearance-none focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                                required
                                disabled={isLoading}
                              >
                                <option value="">Select unit</option>
                                {unitOptions.map((unit) => (
                                  <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                            </div>

                            {materialItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMaterialItem(index)}
                                className="px-3 py-3 text-red-500 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                disabled={isLoading}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addMaterialItem}
                    className="mt-4 flex items-center text-deep_green hover:text-deep_green/80 font-medium text-sm disabled:opacity-50 transition-colors"
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add another item
                  </button>
                </div>

                {/* Justification */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Justification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Explain why these materials are needed..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent resize-none transition-all duration-150"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Urgency Level <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={urgencyLevel}
                      onChange={(e) => setUrgencyLevel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-main_dark appearance-none focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select urgency...</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slatebluegray pointer-events-none" />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={resetForm}
              className="px-8 py-3 border border-gray-300 text-slatebluegray rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-web_yellow hover:bg-web_yellow/80 text-main_dark rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
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
