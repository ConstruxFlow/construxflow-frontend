import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaSave,
  FaEye,
  FaPaperPlane,
} from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import { toast } from "react-toastify";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useNavigate } from "react-router-dom";

const CreatePurchaseOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState({
    ponumber: "",
    order_date: "",
    supplier: {
      supplier_id: "",
      supplier: "",
      contactPerson: "",
      email: "",
      phone: "",
    },
    additional_info: "",
    status: "Pending",
  });

  //   Get Latest PO Number
  const getLatestPONumber = async () => {
    const currentYear = new Date().getFullYear();
    const responce = await fetch(
      "http://localhost:8080/api/purchasingorder/latest",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (responce.ok) {
      const data = await responce.json();
      console.log(data.data.ponumber);
      
      const latestPO = data.data.ponumber;
      if (latestPO) {
        const latestNumber = parseInt(latestPO.split("-")[2]);
        setOrderData((prev) => ({
          ...prev,
          ponumber: `PO-${currentYear}-${String(latestNumber + 1).padStart(4, "0")}`,
        }));
      }
    }else{
        // hadanna ona
    }
  };
  useEffect(() => {
    getLatestPONumber();
  },[])

  

  const [orderItems, setOrderItems] = useState([
    {
      id: 1,
      material: {
        material_id: 1,
      },
      quantity: "",
      unitPrice: "",
      cost: 0,
    },
  ]);

  const [deliverySchedule, setDeliverySchedule] = useState([
    {
      id: 1,
      location: "",
      requiredDate: "",
      shippingCost: 0,
    },
  ]);

  // Add documents state
  const [documents, setDocuments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setOrderData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setOrderData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addOrderItem = () => {
    const newItem = {
      id: Date.now(),
      material: {
        material_id: Date.now(),
      },
      quantity: "",
      unitPrice: "",
      cost: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateOrderItem = (id, field, value) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item };

          if (field === "material_id") {
            updatedItem.material = { material_id: parseInt(value) };
          } else {
            updatedItem[field] = value;
          }

          // Calculate cost when quantity or unitPrice changes
          if (field === "quantity" || field === "unitPrice") {
            const quantity = parseFloat(updatedItem.quantity) || 0;
            const unitPrice = parseFloat(updatedItem.unitPrice) || 0;
            updatedItem.cost = quantity * unitPrice;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const updateDeliverySchedule = (id, field, value) => {
    setDeliverySchedule(
      deliverySchedule.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const addlocation = () => {
    const newlocation = {
      id: Date.now(),
      location: "",
      requiredDate: "",
      shippingCost: 0,
    };
    setDeliverySchedule([...deliverySchedule, newlocation]);
  };

  const removeLocation = (id) => {
    if (deliverySchedule.length > 1) {
      setDeliverySchedule(deliverySchedule.filter((item) => item.id !== id));
    }
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.cost || 0), 0);
  };

  const calculateTotal = () => {
    const shippingTotal = deliverySchedule.reduce(
      (sum, delivery) => sum + (parseFloat(delivery.shippingCost) || 0),
      0
    );
    return calculateSubtotal() + shippingTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      setLoadingProgress(30);

      // Filter valid items and deliveries
      const validMaterials = orderItems.filter(
        (item) => item.material.material_id && item.quantity && item.unitPrice
      );

      const validDeliveries = deliverySchedule.filter(
        (item) => item.location && item.requiredDate
      );

      const submitData = {
        ponumber: orderData.ponumber,
        order_date: orderData.order_date,
        status: orderData.status,
        additional_info: orderData.additional_info,
        subTotal: calculateTotal(),
        items: validMaterials.length,
        supplier: {
          supplier_id: orderData.supplier.supplier_id,
        },
        materials: validMaterials.map((item) => ({
          material: {
            material_id: item.material.material_id,
          },
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          cost: item.cost,
        })),
        deliveries: validDeliveries.map((delivery) => ({
          requiredDate: delivery.requiredDate,
          location: delivery.location,
          shippingCost: parseFloat(delivery.shippingCost) || 0,
        })),
        docs: documents,
      };

      setLoadingProgress(60);
      console.log("Submit Data:", submitData);
      navigate("/purchasing/orders/advance-payment", {
        state: { orderData: submitData },
      });

      // Uncomment when ready to submit to API
      // const response = await fetch("http://localhost:8080/api/purchaseorder/create", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(submitData),
      // });

      setLoadingProgress(90);

      // if (response.ok) {
      //   setLoadingProgress(100);
      //   setTimeout(() => {
      //     toast.success("Purchase Order created successfully!");
      //     setIsLoading(false);
      //     setLoadingProgress(0);
      //   }, 800);
      // } else {
      //   throw new Error("Failed to create purchase order");
      // }

      // For testing - simulate success
      setLoadingProgress(100);
      setTimeout(() => {
        toast.success("Purchase Order created successfully!");
        setIsLoading(false);
        setLoadingProgress(0);
      }, 800);
    } catch (error) {
      toast.error("Failed to create purchase order: " + error.message);
      setIsLoading(false);
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {isLoading && <LoadingOverlay progress={loadingProgress} />}

      <NavBar
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
          { name: "Orders", path: "/orders" },
        ]}
      />

      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-main_dark mb-4"
              >
                <FaArrowLeft />
                <span className="text-sm">Back</span>
              </button>
              <h1 className="text-2xl font-bold text-main_dark">
                Create Purchase Order
              </h1>
              <p className="text-gray-600 text-sm">
                Generate and send purchase orders to suppliers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Supplier Information */}
              <div className="bg-light_brown/30 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Supplier Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Supplier
                    </label>
                    <select
                      name="supplier.supplier"
                      value={orderData.supplier.supplier}
                      onChange={(e) => {
                        handleChange(e);
                        // Set supplier_id based on selection
                        const supplierIds = {
                          "ABC Manufacturing Co.": "S001",
                          "XYZ Industrial Supply": "S002",
                          "BuildTech Materials": "S003",
                        };
                        setOrderData((prev) => ({
                          ...prev,
                          supplier: {
                            ...prev.supplier,
                            supplier: e.target.value,
                            supplier_id: supplierIds[e.target.value] || "",
                          },
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    >
                      <option value="">Select Supplier</option>
                      <option value="ABC Manufacturing Co.">
                        ABC Manufacturing Co.
                      </option>
                      <option value="XYZ Industrial Supply">
                        XYZ Industrial Supply
                      </option>
                      <option value="BuildTech Materials">
                        BuildTech Materials
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      name="supplier.contactPerson"
                      value={orderData.supplier.contactPerson}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="supplier.email"
                      value={orderData.supplier.email}
                      onChange={handleChange}
                      placeholder="john@abcmanufacturing.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="supplier.phone"
                      value={orderData.supplier.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Order Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PO Number
                    </label>
                    <input
                      type="text"
                      name="ponumber"
                      value={orderData.ponumber}
                      onChange={handleChange}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Date
                    </label>
                    <input
                      type="date"
                      name="order_date"
                      value={orderData.order_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={orderData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Sent">Sent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-main_dark">
                    Order Items
                  </h2>
                  <button
                    onClick={addOrderItem}
                    className="px-4 py-2 bg-web_yellow text-sm text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors flex items-center gap-2 font-medium"
                  >
                    <FaPlus />
                    Add Item
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Material
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Cost
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="px-4 py-3">
                            <select
                              value={item.material.material_id}
                              onChange={(e) =>
                                updateOrderItem(
                                  item.id,
                                  "material_id",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            >
                              <option value="">Select Material</option>
                              <option value="1">Steel Bolts M6</option>
                              <option value="2">Washers M6</option>
                              <option value="3">Nuts M6</option>
                              <option value="4">Steel Rods</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateOrderItem(
                                  item.id,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              placeholder="100.00"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateOrderItem(
                                  item.id,
                                  "unitPrice",
                                  e.target.value
                                )
                              }
                              placeholder="250.00"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-main_dark">
                              ${item.cost.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {orderItems.length > 1 && (
                              <button
                                onClick={() => removeOrderItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Delivery Schedule */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-main_dark">
                    Delivery Schedule
                  </h2>
                  <button
                    onClick={addlocation}
                    className="px-4 py-2 bg-deep_green text-purewhite text-sm rounded-md hover:bg-deep_green/90 transition-colors flex items-center gap-2"
                  >
                    <FaPlus />
                    Add Location
                  </button>
                </div>

                <div className="space-y-4">
                  {deliverySchedule.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <select
                          value={item.location}
                          onChange={(e) =>
                            updateDeliverySchedule(
                              item.id,
                              "location",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        >
                          <option value="">Select Location</option>
                          <option value="Warehouse A">Warehouse A</option>
                          <option value="Warehouse B">Warehouse B</option>
                          <option value="Construction Site A">
                            Construction Site A
                          </option>
                          <option value="Main Storage">Main Storage</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Required Date
                        </label>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Cost
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.shippingCost}
                          onChange={(e) =>
                            updateDeliverySchedule(
                              item.id,
                              "shippingCost",
                              e.target.value
                            )
                          }
                          placeholder="500.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        />
                      </div>
                      <div>
                        {deliverySchedule.length > 1 && (
                          <button
                            onClick={() => removeLocation(item.id)}
                            className="px-3 py-2 text-red-500 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </h3>
                  <textarea
                    name="additional_info"
                    value={orderData.additional_info}
                    onChange={handleChange}
                    placeholder="Any special delivery notes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-purewhite border border-gray-200 rounded-lg sticky top-10">
                <h2 className="text-lg font-semibold bg-web_yellow/10 p-6 text-main_dark">
                  Order Summary
                </h2>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-main_dark">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium text-main_dark">
                      $
                      {deliverySchedule
                        .reduce(
                          (sum, delivery) =>
                            sum + (parseFloat(delivery.shippingCost) || 0),
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-700">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-web_yellow">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-6 bg-light_brown/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Order Status
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        {orderData.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <strong>PO Number:</strong> {orderData.ponumber}
                      </div>
                      <div>
                        <strong>Supplier:</strong>{" "}
                        {orderData.supplier.supplier || "Not selected"}
                      </div>
                      <div>
                        <strong>Items:</strong>{" "}
                        {
                          orderItems.filter(
                            (item) => item.material.material_id && item.quantity
                          ).length
                        }{" "}
                        items
                      </div>
                      <div>
                        <strong>Order Date:</strong>{" "}
                        {orderData.order_date || "Not set"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleSubmit}
                      className="w-full px-4 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <FaPaperPlane className="w-4 h-4" />
                      Send Purchase Order
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <FaEye className="w-4 h-4" />
                      Preview Order
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <FaSave className="w-4 h-4" />
                      Save as Draft
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

export default CreatePurchaseOrder;
