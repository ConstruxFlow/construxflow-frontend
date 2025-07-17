import { useState } from "react";
import { Calendar, ChevronDown, Upload, Plus } from "lucide-react";

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
    setItemCounter(prev => prev + 1);
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

  // Equipment type mapping
  const getEquipmentTypeName = (value) => {
    const mapping = {
      hvac: "HVAC System",
      electrical: "Electrical Equipment",
      plumbing: "Plumbing System",
      mechanical: "Mechanical Equipment",
    };
    return mapping[value] || value;
  };

  // Equipment name mapping
  const getEquipmentName = (value) => {
    const mapping = {
      "unit-1": "HVAC Unit 1",
      "unit-2": "HVAC Unit 2",
      generator: "Generator",
      pump: "Water Pump",
    };
    return mapping[value] || value;
  };

  // Form validation
  const validateForm = () => {
    if (!equipmentType || !equipment || !scheduleDate || !scheduleTime) {
      setError("Please fill in all required maintenance fields");
      return false;
    }

    if (materialItems.some((item) => !item.name || !item.qty || !item.measurement)) {
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

    try {
      const requestBody = {
        equipmentType: getEquipmentTypeName(equipmentType),
        equipmentName: getEquipmentName(equipment),
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

      console.log(
        "Sending Request Body:",
        JSON.stringify(requestBody, null, 2)
      );

      const result = await submitToBackend(requestBody);

      console.log("Success Response:", result);
      alert("Maintenance scheduled and materials requested successfully!");

      resetForm();
    } catch (error) {
      setError(`Failed to submit request: ${error.message}`);
      console.error("Submission Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Schedule Maintenance and Request Materials
          </h1>
          <p className="text-gray-600">
            Manage equipment maintenance schedules and request inventory materials
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Schedule Maintenance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-[#236571] rounded-full p-2 mr-3">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Schedule Maintenance
              </h2>
            </div>

            <form className="space-y-4">
              {/* Equipment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Equipment Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={equipmentType}
                    onChange={(e) => setEquipmentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Choose equipment type...</option>
                    <option value="hvac">HVAC System</option>
                    <option value="electrical">Electrical Equipment</option>
                    <option value="plumbing">Plumbing System</option>
                    <option value="mechanical">Mechanical Equipment</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Select Equipment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Equipment <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Choose equipment...</option>
                    <option value="unit-1">HVAC Unit 1</option>
                    <option value="unit-2">HVAC Unit 2</option>
                    <option value="generator">Generator</option>
                    <option value="pump">Water Pump</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

              </div>
              {/* Maintenance Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={maintenanceType}
                    onChange={(e) => setMaintenanceType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Choose Maintenance Type</option>
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                    <option value="Emergancy">Emergancy</option>

                    </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {/* Priority Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select priority...</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {/* Select Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Select Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Add Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Notes
                </label>
                <textarea
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  placeholder="Describe the maintenance requirements..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent resize-none"
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>

          {/* Right Column - Request Inventory Materials */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-[#236571] rounded-full p-2 mr-3">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Request Inventory Materials
              </h2>
            </div>

            <form className="space-y-4">
              {/* Items Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items Needed <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {materialItems.map((item, index) => (
                    <div key={item.id} className="space-y-2">
                      {/* Item Number Display (for user reference only) */}
                      <div className="text-xs text-gray-500 font-mono">
                        Item #{item.id}
                      </div>

                      {/* Item Input Row */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateMaterialItem(index, "name", e.target.value)
                          }
                          placeholder="Item name (e.g., Oil)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent"
                          required
                          disabled={isLoading}
                        />

                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            updateMaterialItem(index, "qty", e.target.value)
                          }
                          placeholder="Amount"
                          min="0"
                          step="0.1"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent"
                          required
                          disabled={isLoading}
                        />

                        <div className="relative">
                          <select
                            value={item.measurement}
                            onChange={(e) =>
                              updateMaterialItem(index, "measurement", e.target.value)
                            }
                            className="w-20 px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent text-sm"
                            required
                            disabled={isLoading}
                          >
                            <option value="">Unit</option>
                            {unitOptions.map((unit) => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-1 top-2.5 h-3 w-3 text-gray-400 pointer-events-none" />
                        </div>

                        {materialItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMaterialItem(index)}
                            className="px-3 py-2 text-red-500 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                            disabled={isLoading}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addMaterialItem}
                  className="mt-3 flex items-center text-[#236571] hover:text-[#17484b] font-medium text-sm disabled:opacity-50 transition-colors"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add another item
                </button>
              </div>

              {/* Justification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Explain why these materials are needed..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent resize-none"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={urgencyLevel}
                    onChange={(e) => setUrgencyLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select urgency...</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={resetForm}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#EFC11A] hover:bg-yellow-400 text-yellow-900 rounded-md font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-900"></div>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
