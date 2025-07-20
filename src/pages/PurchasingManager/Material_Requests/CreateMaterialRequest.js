import React, { useState, useEffect, useContext } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaEye,
} from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import { useFormValidation } from "./functions/UseformValidation";
import { toast } from "react-toastify";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";

const CreateMaterialRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [projectData, setProjectData] = useState();
  const {authState} = useContext(AuthContext);
  const { validateForm, validateField, isSubmitting, setIsSubmitting } =
    useFormValidation();

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  // Raw fetched data (if you ever need it)
  const [requestData, setRequestData] = useState(null);

  // Your form state
  const [Requestdata, setRequestdata] = useState({
    requesterName: "",
    request_date: "",
    quotation_deadline: "",
    priority_level: "",
    quotation_type: "",
    status: "Pending",
    additional_info: "",
    estimated_cost: 0,
    material_req_id: id || null,
    projectId: null,
    quotationReqMaterials: [],
    quotationReqDelivery: [],
    quotationReqDocs: [],
  });

  // Materials lines
  const [materials, setMaterials] = useState([
    {
      id: Date.now(),
      material: { material_id: null },
      quantity: "",
      unitPrice: "",
      estimatedCost: 0,
    },
  ]);

  // Delivery schedule lines
  const [deliverySchedule, setDeliverySchedule] = useState([
    {
      id: Date.now(),
      location: "",
      deliveryDate: "",
      quantitySplit: 0.0,
    },
  ]);

  // Fetch & autofill when `id` is present
  useEffect(() => {
    if (!id) return;

    const fetchRequest = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8080/api/material-requests/find/${id}`
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error("Failed to fetch material request details");
          return;
        } else {
          const projectdataResponse = await fetch(`http://localhost:8080/api/projects/${data.projectId}`);
          const projectdata1 = await projectdataResponse.json();
          if (!projectdataResponse.ok) {
            toast.error("Failed to fetch project details");
            return;
          }
          console.log("Project data:", projectdata1);
          setProjectData(projectdata1);
          
          // Set the initial delivery schedule with project location
          setDeliverySchedule([
            { 
              id: Date.now(), 
              location: projectdata1.location || "", 
              deliveryDate: "", 
              quantitySplit: 0.0 
            }
          ]);
        }

        // 1) store raw data
        setRequestData(data);

        // 2) map top‐level fields into your form
        setRequestdata((prev) => ({
          ...prev,
          requesterName: data.projectName || "",
          request_date: data.requestDate || "",
          priority_level: data.priority || "",
          additional_info: data.additionalInfo || "",
          projectId: data.projectId,
        }));

        // 3) map requestedMaterials into your materials array
        if (Array.isArray(data.requestedMaterials) && data.requestedMaterials.length) {
          setMaterials(
            data.requestedMaterials.map((rm) => ({
              id: rm.requestedMaterialId,
              material: { 
                material_id: rm.materialId, 
                material_name: rm.materialName || "", 
                material_type: rm.materialType || "" 
              },
              quantity: rm.quantity,
              unitPrice: rm.unitPrice || "",
              estimatedCost: (rm.quantity || 0) * (rm.unitPrice || 0),
            }))
          );
        }

      } catch (err) {
        toast.error("Network error: Failed to fetch material request");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  // Auto‐recalculate form's total estimated cost
  useEffect(() => {
    const total = materials.reduce(
      (sum, m) => sum + (m.estimatedCost || 0),
      0
    );
    setRequestdata((prev) => ({
      ...prev,
      estimated_cost: total,
    }));
  }, [materials]);

  // Check if we should show quantity split (only when there's exactly one material)
  const shouldShowQuantitySplit = materials.length === 1;

  // Field change for top‐level form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      ["requesterName", "request_date", "quotation_deadline", "priority_level", "quotation_type"].includes(
        name
      )
    ) {
      const errs = validateField(name, value, Requestdata);
      if (errs.length) toast.error(errs[0], { duration: 2000 });
    }
    setRequestdata((prev) => ({ ...prev, [name]: value }));
  };

  // Material line handlers
  const addMaterial = () =>
    setMaterials((prev) => [
      ...prev,
      {
        id: Date.now(),
        material: { material_id: null },
        quantity: "",
        unitPrice: "",
        estimatedCost: 0,
      },
    ]);
  const removeMaterial = (mid) =>
    setMaterials((prev) => prev.filter((m) => m.id !== mid));
  const updateMaterial = (mid, field, val) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== mid) return m;
        const updated = { ...m };
        if (field === "material_id") {
          updated.material.material_id = parseInt(val, 10) || null;
        } else if (field === "quantity") {
          updated.quantity = parseFloat(val) || 0;
        } else if (field === "unitPrice") {
          updated.unitPrice = parseFloat(val) || 0;
        }
        // recalc cost
        const q = field === "quantity" ? parseFloat(val) || 0 : updated.quantity || 0;
        const u = field === "unitPrice" ? parseFloat(val) || 0 : updated.unitPrice || 0;
        updated.estimatedCost = q * u;
        return updated;
      })
    );
  };

  // Delivery schedule handlers
  const addLocation = () =>
    setDeliverySchedule((prev) => [
      ...prev,
      { id: Date.now(), location: "", deliveryDate: "", quantitySplit: 0 },
    ]);
  
  const removeLocation = (sid) =>
    setDeliverySchedule((prev) => prev.filter((s) => s.id !== sid));
  
  const updateDeliverySchedule = (sid, field, val) =>
    setDeliverySchedule((prev) =>
      prev.map((s) =>
        s.id !== sid
          ? s
          : {
              ...s,
              [field]:
                field === "quantitySplit"
                  ? parseFloat(val) || 0
                  : val,
            }
      )
    );

  // Submit handler
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(Requestdata, materials, deliverySchedule)) return;

    setIsLoading(true);
    setLoadingProgress(0);
    const progressInterval = setInterval(() => {
      setLoadingProgress((p) => (p >= 90 ? p : p + Math.random() * 5));
    }, 200);

    try {
      setLoadingProgress(10);
      const transformedMaterials = materials
        .filter((m) => m.material.material_id && m.quantity)
        .map((m) => ({
          material: { material_id: m.material.material_id },
          quantity: m.quantity,
          unitPrice: m.unitPrice || 0,
          estimatedCost: m.estimatedCost || 0,
        }));
      setLoadingProgress(30);
      const transformedDelivery = deliverySchedule
        .filter((s) => s.location && s.deliveryDate)
        .map((s) => ({
          location: s.location,
          deliveryDate: s.deliveryDate,
          quantitySplit: shouldShowQuantitySplit ? s.quantitySplit : 0,
        }));

      const payload = {
        ...Requestdata,
        quotationReqMaterials: transformedMaterials,
        quotationReqDelivery: transformedDelivery,
        manager_id: authState?.user?.managerId || null,
        quotationReqDocs: [],
        estimated_cost: Requestdata.estimated_cost,
      };

      console.log("Submitting payload:", payload);
      
      setLoadingProgress(50);
      const res = await fetch(
        "http://localhost:8080/api/quotationrequest/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      setLoadingProgress(90);
      const result = await res.json();
      if (!res.ok || result.status !== "success") {
        throw new Error(result.message || `Status ${res.status}`);
      }

      setLoadingProgress(100);
      toast.success("Quotation request created successfully!");
      navigate("/purchasing/quotationrequest/overview");
    } catch (err) {
      toast.error(err.message.includes("Network") ? 
        "Network error: check connectivity" : 
        "Submission failed: " + err.message
      );
      console.error(err);
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
      setLoadingProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
      profileURL="/purchasing/profile"
        links={[
          { name: "Dashboard", path: "/purchasing/dashboard" },
          {
            name: "Material Requests",
            path: "/purchasing/materialrequests/overview",
          },
          { name: "Suppliers", path: "/purchasing/supplier/dashboard" },
          {
            name: "Quotation Requests",
            path: "/purchasing/quotationrequest/overview",
          },
          { name: "Purchasing Orders", path: "/purchasing/orders/overview" },
        ]}
      />
      {isLoading && (
        <LoadingOverlay
          progress={loadingProgress}
          message="Processing..."
        />
      )}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          <div className="flex items-center gap-5 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-main_dark"
            >
              <FaArrowLeft />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-2xl font-bold text-main_dark">
              Create Quotation Request
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    >
                      <option value="">Select Priority</option>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    >
                      <option value="">Select Type</option>
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
                    className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 flex items-center gap-2"
                  >
                    <FaPlus />
                    Add Material
                  </button>
                </div>
                <div className="space-y-4">
                  {materials.map((m) => (
                    <div
                      key={m.id}
                      className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Material
                        </label>
                        <select
                          value={m.material.material_id || ""}
                          onChange={(e) =>
                            updateMaterial(m.id, "material_id", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-web_yellow"
                        >
                          <option value="">Select Material</option>
                          {m.material.material_id && (
                            <option value={m.material.material_id}>
                              {m.material.material_name || ""} - {m.material.material_type || ""}
                            </option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={m.quantity}
                          onChange={(e) =>
                            updateMaterial(m.id, "quantity", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-web_yellow"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={m.unitPrice}
                          onChange={(e) =>
                            updateMaterial(m.id, "unitPrice", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-web_yellow"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated Cost
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={`$${(m.estimatedCost || 0).toFixed(2)}`}
                          className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-600"
                        />
                      </div>
                      <div className="flex items-end">
                        {materials.length > 1 && (
                          <button
                            onClick={() => removeMaterial(m.id)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 pb-2"
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
                  {/* Only show Add Location button if there's exactly one material */}
                  {shouldShowQuantitySplit && (
                    <button
                      onClick={addLocation}
                      className="px-4 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 flex items-center gap-2"
                    >
                      <FaPlus />
                      Add Location
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-deep_green/10">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-main_dark">
                          Location
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-main_dark">
                          Required Date
                        </th>
                        {/* Only show Quantity Split column if there's exactly one material */}
                        {shouldShowQuantitySplit && (
                          <th className="px-4 py-2 text-left text-sm font-semibold text-main_dark">
                            Quantity Split
                          </th>
                        )}
                        <th className="px-4 py-2 text-left text-sm font-semibold text-main_dark">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliverySchedule.map((s) => (
                        <tr key={s.id} className="border-b border-gray-200">
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={s.location}
                              onChange={(e) =>
                                updateDeliverySchedule(
                                  s.id,
                                  "location",
                                  e.target.value
                                )
                              }
                              placeholder="Enter location"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-web_yellow"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="date"
                              value={s.deliveryDate}
                              onChange={(e) =>
                                updateDeliverySchedule(
                                  s.id,
                                  "deliveryDate",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-web_yellow"
                            />
                          </td>
                          {/* Only show Quantity Split input if there's exactly one material */}
                          {shouldShowQuantitySplit && (
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                step="0.01"
                                value={s.quantitySplit}
                                onChange={(e) =>
                                  updateDeliverySchedule(
                                    s.id,
                                    "quantitySplit",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-web_yellow"
                              />
                            </td>
                          )}
                          <td className="px-4 py-2">
                            {/* Only show remove button if there's exactly one material AND more than one location */}
                            {shouldShowQuantitySplit && deliverySchedule.length > 1 && (
                              <button
                                onClick={() => removeLocation(s.id)}
                                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                              >
                                <FaTrash className="w-3 h-3" />
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comments & Attachments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purewhite border border-gray-200 rounded-lg p-6">
                <div>
                  <h3 className="text-lg font-semibold text-main_dark mb-4">
                    Comments
                  </h3>
                  <textarea
                    name="additional_info"
                    value={Requestdata.additional_info}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Additional requirements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-web_yellow"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-main_dark mb-4">
                    Attachments
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-web_yellow cursor-pointer">
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Drag files here or click to upload
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              <div className="bg-purewhite border border-gray-200 rounded-lg sticky top-10">
                <h2 className="text-lg font-semibold bg-web_yellow/10 p-6 text-main_dark mb-4">
                  Request Summary
                </h2>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Materials:</span>
                    <span className="font-medium text-main_dark">
                      {materials.length} Item
                      {materials.length !== 1 && "s"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Locations:</span>
                    <span className="font-medium text-main_dark">
                      {deliverySchedule.length} location
                      {deliverySchedule.length !== 1 && "s"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                      {Requestdata.priority_level || "Not Selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="font-bold text-main_dark text-lg">
                      ${Requestdata.estimated_cost.toFixed(2)}
                    </span>
                  </div>
                  <hr className="border-gray-300" />

                  <div>
                    <h4 className="font-semibold text-main_dark mb-2">
                      Materials:
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {materials.map((m) => (
                        <div key={m.id} className="flex justify-between">
                          <span>
                            {m.material?.material_name || "Not Selected"} - {m.material?.material_type || "Type not specified"}
                          </span>
                          <span>{m.quantity || 0} pcs</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-main_dark mb-2">
                      Delivery:
                    </h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      {deliverySchedule.map((s) => (
                        <div key={s.id}>
                          <p>{s.location || "Location not selected"}</p>
                          <p>Required: {s.deliveryDate || "Date not set"}</p>
                          {shouldShowQuantitySplit && (
                            <p>Quantity: {s.quantitySplit || 0}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleOnSubmit}
                      className="w-full px-4 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 flex items-center justify-center gap-2 font-semibold"
                    >
                      Submit Request
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2">
                      <FaEye />
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
