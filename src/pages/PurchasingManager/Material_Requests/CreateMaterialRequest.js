import React, { useState } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaSave,
  FaEye,
} from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import { useFormValidation } from "./functions/UseformValidation";
import { toast } from "react-toastify";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useNavigate } from "react-router-dom";

const CreateMaterialRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { validateForm, validateField, isSubmitting, setIsSubmitting } =
    useFormValidation();

  const navigate = useNavigate();
  const [Requestdata, setRequestdata] = useState({
    requesterName: "",
    request_date: "",
    quotation_deadline: "",
    priority_level: "",
    quotation_type: "",
    status: "Pending",
    additional_info: "",
    quotationReqMaterials: [],
    quotationReqDelivery: [],
    quotationReqDocs: [],
  });
  const [reqDocs, setreqDocs] = useState([]);

  //   "estimated_cost": 25000.00,

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      [
        "requesterName",
        "request_date",
        "quotation_deadline",
        "priority_level",
        "quotation_type",
      ].includes(name)
    ) {
      const errors = validateField(name, value, Requestdata);
      if (errors.length > 0) {
        toast.error(errors[0], { duration: 2000 });
      }
    }

    setRequestdata((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [materials, setMaterials] = useState([
    {
      id: 1,
      material: {
        material_id: null,
      },
      quantity: "",
    },
  ]);

  const addMaterial = () => {
    const newMaterial = {
      id: Date.now(), // For React key and internal operations
      material: {
        material_id: null, // This will store the selected material ID
      },
      quantity: "",
    };
    setMaterials([...materials, newMaterial]);
  };

  const removeMaterial = (id) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  const updateMaterial = (id, field, value) => {
    setMaterials(
      materials.map((material) => {
        if (material.id === id) {
          if (field === "material_id") {
            return {
              ...material,
              material: {
                ...material.material,
                material_id: parseInt(value), // Ensure it's a number
              },
            };
          } else if (field === "quantity") {
            return {
              ...material,
              quantity: parseFloat(value) || 0.0,
            };
          }
        }
        return material;
      })
    );
  };

  const [deliverySchedule, setDeliverySchedule] = useState([
    {
      id: 1,
      location: "",
      deliveryDate: "",
      quantitySplit: "",
    },
  ]);

  const addLocation = () => {
    const newLocation = {
      id: Date.now(),
      location: "",
      deliveryDate: "",
      quantitySplit: 0.0,
    };
    setDeliverySchedule([...deliverySchedule, newLocation]);
  };

  const updateDeliverySchedule = (id, field, value) => {
    setDeliverySchedule(
      deliverySchedule.map((item) => {
        if (item.id === id) {
          if (field === "quantitySplit") {
            return { ...item, [field]: parseFloat(value) || 0.0 };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(Requestdata, materials, deliverySchedule)) {
      return;
    }

    // Initialize loading state
    setIsLoading(true);
    setLoadingProgress(0);

    // Progress tracking interval for smooth animation
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev; // Stop at 90% until completion
        return prev + Math.random() * 5;
      });
    }, 200);

    try{
       // Step 1: Data preparation (10% progress)
      setLoadingProgress(10);
    // Transform the data first
    const transformedMaterials = materials
      .filter(
        (material) =>
          material.material.material_id !== null && material.quantity
      )
      .map((material) => ({
        material: {
          material_id: material.material.material_id, // Note: changed to materialId to match your API
        },
        quantity: parseFloat(material.quantity),
      }));

      // Step 2: Validation (20% progress)
      setLoadingProgress(20);

    const transformedDelivery = deliverySchedule
      .filter((item) => item.location && item.deliveryDate)
      .map((item) => ({
        location: item.location,
        deliveryDate: item.deliveryDate,
        quantitySplit: parseFloat(item.quantitySplit),
      }));

    const updatedRequestData = {
      ...Requestdata,
      quotationReqMaterials: transformedMaterials,
      quotationReqDelivery: transformedDelivery,
      quotationReqDocs: [],
    };
    // Step 3: Final data assembly (40% progress)
    setLoadingProgress(40);
    // Log the data you're about to set
    console.log("Submitting data:", updatedRequestData);

    setLoadingProgress(50);

    // Update state
    setRequestdata(updatedRequestData);

    setLoadingProgress(60);
    
    // submitToAPI(updatedRequestData);
    const response = await fetch("http://localhost:8080/api/quotationrequest/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRequestData),
    });

    // Step 7: Process response (95% progress)
    setLoadingProgress(95);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Request creation failed with status: ${response.status}`
      );
    }

    setLoadingProgress(100);
    const responseData = await response.json();

    // Show completion briefly before hiding overlay
    setTimeout(() => {
      if (responseData.status === "success" || response.ok) {
        toast.success("Quotation request created successfully!");
        
        // Optional: Reset form or redirect
        // resetForm();
        // navigate('/purchasing/materialrequests/overview');
      } else {
        toast.error(
          "Failed to create request: " + (responseData.message || "Unknown error")
        );
      }

      // Hide loading overlay
      setIsLoading(false);
      setLoadingProgress(0);
    }, 800);

    }catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      toast.error("Network error: Please check your internet connection");
    } else if (error.message.includes('timeout')) {
      toast.error("Request timeout: Please try again");
    } else {
      toast.error("Submission failed: " + error.message);
    }
    setIsLoading(false);
    setLoadingProgress(0);
  }finally {
    clearInterval(progressInterval);
  }
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* <Toaster position="top-right" toastOptions={toastConfig} /> */}
      {/* Header Navigation */}
      <NavBar
        links={[
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Orders', path: '/orders' },
        ]}
      />
      {isLoading && (
        <LoadingOverlay
          progress={loadingProgress}
          message="Registering supplier details..."
        />
      )}
      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Back Button and Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-main_dark mb-4">
                <FaArrowLeft />
                <span className="text-sm">Back</span>
              </button>
              <h1 className="text-2xl font-bold text-main_dark">
                Create Quotation Request
              </h1>
              <p className="text-gray-600 text-sm">
                Submit a new material request with multiple locations and
                delivery schedules
              </p>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Request Information */}
              <div className="bg-light_brown/30 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Request Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requester Name
                    </label>
                    <input
                      type="text"
                      name="requesterName"
                      value={Requestdata.requesterName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Date
                    </label>
                    <input
                      type="date"
                      name="request_date"
                      value={Requestdata.request_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quotation Deadline
                    </label>
                    <input
                      type="date"
                      name="quotation_deadline"
                      value={Requestdata.quotation_deadline}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      name="priority_level"
                      value={Requestdata.priority_level}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Type
                    </label>
                    <select
                      name="quotation_type"
                      value={Requestdata.quotation_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    >
                      <option>Material</option>
                      <option>Service</option>
                      <option>Equipment</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Material Selection */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-main_dark">
                    Material Selection
                  </h2>
                  <button
                    onClick={addMaterial}
                    className="px-4 py-2 bg-web_yellow text-sm text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors flex items-center gap-2 font-medium"
                  >
                    <FaPlus />
                    Add Material
                  </button>
                </div>

                <div className="space-y-4">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4  items-center"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Material
                        </label>
                        <select
                          value={material.material.material_id || ""}
                          onChange={(e) =>
                            updateMaterial(
                              material.id,
                              "material_id",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        >
                          <option value="">Select Material</option>
                          <option value="1">Steel Rods - 12mm</option>
                          <option value="2">Cement Bags</option>
                          <option value="3">Concrete Blocks</option>
                          <option value="4">Steel Beams</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={material.quantity}
                          onChange={(e) =>
                            updateMaterial(
                              material.id,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit
                        </label>
                        <select
                          value={material.unit}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        >
                          <option>Pieces</option>
                          <option>Tons</option>
                          <option>Bags</option>
                          <option>Cubic Meters</option>
                        </select>
                      </div>
                      <div>
                        {materials.length > 1 && (
                          <button
                            onClick={() => removeMaterial(material.id)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                          >
                            <FaTrash className="w-3 h-3" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Schedule */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-main_dark">
                    Delivery Schedule
                  </h2>
                  <button
                    onClick={addLocation}
                    className="px-4 py-2 bg-deep_green text-purewhite text-sm rounded-md hover:bg-deep_green/90 transition-colors flex items-center gap-2"
                  >
                    <FaPlus />
                    Add Location
                  </button>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-deep_green/10">
                      <tr>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-main_dark">
                          Location
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-main_dark">
                          Required Date
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-main_dark">
                          Quantity Split
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliverySchedule.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="px-2 sm:px-4 py-3">
                            <select
                              value={item.location}
                              onChange={(e) =>
                                updateDeliverySchedule(
                                  item.id,
                                  "location",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                            >
                              <option value="">Select Location</option>
                              <option value="Construction Site A, Downtown">
                                Construction Site A, Downtown
                              </option>
                              <option value="Construction Site B, Uptown">
                                Construction Site B, Uptown
                              </option>
                              <option value="Warehouse A">Warehouse A</option>
                              <option value="Warehouse B">Warehouse B</option>
                              <option value="Site Office">Site Office</option>
                              <option value="Main Storage">Main Storage</option>
                            </select>
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <input
                              type="date"
                              value={item.deliveryDate} // Changed from requiredDate
                              onChange={(e) =>
                                updateDeliverySchedule(
                                  item.id,
                                  "deliveryDate",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                            />
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              value={item.quantitySplit}
                              onChange={(e) =>
                                updateDeliverySchedule(
                                  item.id,
                                  "quantitySplit",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comments and Attachments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purewhite border border-gray-200 rounded-lg p-6">
                {/* Comments */}
                <div>
                  <h3 className="text-lg font-semibold text-main_dark mb-4">
                    Comments
                  </h3>
                  <textarea
                    name="additional_info"
                    value={Requestdata.additional_info}
                    onChange={handleChange}
                    placeholder="Additional requirements or specifications..."
                    rows={6}
                    className="w-full resize-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                  />
                </div>

                {/* Attachments */}
                <div>
                  <h3 className="text-lg font-semibold text-main_dark mb-4">
                    Attachments
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-web_yellow transition-colors cursor-pointer">
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Drag files here or click to upload
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Request Summary */}
            <div>
              <div className="bg-purewhite border border-gray-200 overflow-hidden rounded-lg sticky top-10">
                <h2 className="text-lg font-semibold bg-web_yellow/10 p-6 text-main_dark mb-4">
                  Request Summary
                </h2>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Materials:</span>
                      <span className="font-medium text-main_dark">1 Item</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Locations:</span>
                      <span className="font-medium text-main_dark">
                        1 location
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                        Medium
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Cost:</span>
                      <span className="font-bold text-main_dark">$2,450</span>
                    </div>

                    <hr className="border-gray-300" />

                    <div>
                      <h4 className="font-semibold text-main_dark mb-2">
                        Materials:
                      </h4>
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Steel Rods - 12mm</span>
                          <span>100 pcs</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-main_dark mb-2">
                        Delivery:
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>Warehouse A</p>
                        <p>Required: Jun 25, 2024</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleOnSubmit}
                      className="w-full px-4 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Submit Request
                    </button>

                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <FaEye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateMaterialRequest;
