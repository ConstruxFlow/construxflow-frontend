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

const CreateMaterialRequest = () => {
  const [requesterName, setRequesterName] = useState("John Smith");
  const [requestDate, setRequestDate] = useState("2024-06-18");
  const [quotationDeadline, setQuotationDeadline] = useState("2024-06-18");
  const [priorityLevel, setPriorityLevel] = useState("Medium");
  const [comments, setComments] = useState("");

  const [materials, setMaterials] = useState([
    {
      id: 1,
      material: "Steel Rods - 12mm",
      quantity: "100",
      unit: "Pieces",
    },
  ]);

  const [deliverySchedule, setDeliverySchedule] = useState([
    {
      id: 1,
      location: "Warehouse A",
      requiredDate: "",
      quantitySplit: "100",
    },
  ]);

  const addMaterial = () => {
    const newMaterial = {
      id: Date.now(),
      material: "",
      quantity: "",
      unit: "Pieces",
    };
    setMaterials([...materials, newMaterial]);
  };

  const removeMaterial = (id) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  const updateMaterial = (id, field, value) => {
    setMaterials(
      materials.map((material) =>
        material.id === id ? { ...material, [field]: value } : material
      )
    );
  };

  const addLocation = () => {
    const newLocation = {
      id: Date.now(),
      location: "Warehouse A",
      requiredDate: "",
      quantitySplit: "",
    };
    setDeliverySchedule([...deliverySchedule, newLocation]);
  };

  const updateDeliverySchedule = (id, field, value) => {
    setDeliverySchedule(
      deliverySchedule.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar
        links={
          [
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Orders', path: '/orders' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Reports', path: '/reports' }
        ]
        }
      />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Back Button and Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button className="flex items-center gap-2 text-gray-600 hover:text-main_dark mb-4">
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
                      value={requesterName}
                      onChange={(e) => setRequesterName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Date
                    </label>
                    <input
                      type="date"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quotation Deadline
                    </label>
                    <input
                      type="date"
                      value={quotationDeadline}
                      onChange={(e) => setQuotationDeadline(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={priorityLevel}
                      onChange={(e) => setPriorityLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
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
                          value={material.material}
                          onChange={(e) =>
                            updateMaterial(
                              material.id,
                              "material",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        >
                          <option>Steel Rods - 12mm</option>
                          <option>Cement Bags</option>
                          <option>Concrete Blocks</option>
                          <option>Steel Beams</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
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
                          onChange={(e) =>
                            updateMaterial(material.id, "unit", e.target.value)
                          }
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
                    <FaPlus/>
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
                              <option>Warehouse A</option>
                              <option>Warehouse B</option>
                              <option>Site Office</option>
                              <option>Main Storage</option>
                            </select>
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <input
                              type="date"
                              value={item.requiredDate}
                              onChange={(e) =>
                                updateDeliverySchedule(
                                  item.id,
                                  "requiredDate",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                            />
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <input
                              type="number"
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
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
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
                  <button className="w-full px-4 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-semibold flex items-center justify-center gap-2">
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
