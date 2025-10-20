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
import { useLocation, useNavigate } from "react-router-dom";

const CreatePurchaseOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  console.log(id);
  const [quotationData, setQuotationData] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const [quotationRequestDetails, setQuotationRequestDetails] = useState(null);

  const [orderData, setOrderData] = useState({
    ponumber: "",
    order_date: new Date().toISOString().split("T")[0],
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

  // Get Latest PO Number
  const getLatestPONumber = async () => {
    const currentYear = new Date().getFullYear();
    const response = await fetch(
      "http://localhost:8080/api/purchasingorder/latest",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data.data.ponumber);

      const latestPO = data.data.ponumber;
      if (latestPO) {
        const latestNumber = parseInt(latestPO.split("-")[2]);
        setOrderData((prev) => ({
          ...prev,
          ponumber: `PO-${currentYear}-${String(latestNumber + 1).padStart(
            4,
            "0"
          )}`,
        }));
      }
    } else {
      setOrderData((prev) => ({
        ...prev,
        ponumber: `PO-${currentYear}-0001`,
      }));
    }
  };

  useEffect(() => {
    getLatestPONumber();
  }, []);

  const fetchQuotation = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/quotations/find/${id}`
      );
      const data = await response.json();

      if (response.ok) {
        setQuotationData(data);

        // Fetch supplier data using the supplier ID from quotation
        const supplierResponse = await fetch(
          `http://localhost:8080/api/supplier/find/${data?.supplierId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const supplierResponseData = await supplierResponse.json();

        if (supplierResponse.ok) {
          setSupplierData(supplierResponseData.data);
          const quotationReqResponse = await fetch(
            `http://localhost:8080/api/quotationrequest/find/${data?.quotationRequestId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const quotationReqData = await quotationReqResponse.json();
          if (!quotationReqResponse.ok) {
            throw new Error("Failed to fetch quotation request");
          }
          setQuotationRequestDetails(quotationReqData.data);
        } else {
          toast.error("Failed to fetch supplier details");
        }
      } else {
        toast.error("Failed to fetch quotation details");
      }
    } catch (error) {
      toast.error("Network error: Failed to fetch quotation details");
      console.error("Error fetching quotation details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuotation();
    }
  }, [id]);

  console.log("Supplier Data:", supplierData);
  console.log("Quotation Data:", quotationData);
  console.log("Quotation Request Details:", quotationRequestDetails);

  // Auto-fill form when quotation data and supplier data are available
  useEffect(() => {
    if (quotationData && supplierData) {
      // Auto-fill supplier information using actual supplier data
      setOrderData((prev) => ({
        ...prev,
        supplier: {
          supplier_id: supplierData.supplierId,
          supplier: supplierData.company_name,
          contactPerson: supplierData.name,
          email: supplierData.userDetails?.email || "",
          phone: supplierData.userDetails?.phone_number1 || "",
        },
        additional_info: "",
        status: quotationData.status || "Pending",
      }));

      // Auto-fill order items from quotation items
      const autoFilledItems = quotationData.items.map((item, index) => ({
        id: index + 1,
        material: {
          material_id: item.material.materialId,
          materialName: item.material.materialName,
          materialType: item.material.materialType,
        },
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
        cost: item.totalPrice,
      }));
      setOrderItems(autoFilledItems);

      // Auto-fill delivery schedule from quotation delivery info
      const autoFilledDeliveries = quotationData.deliveryInfos.map(
        (delivery, index) => ({
          id: index + 1,
          location: delivery.location,
          requiredDate: delivery.deliveryDate,
          shippingCost: delivery.shippingCost,
        })
      );
      setDeliverySchedule(autoFilledDeliveries);
    }
  }, [quotationData, supplierData]);

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

  const validateForm = () => {
    let isValid = true;

    // Validate supplier information
    if (!orderData.supplier.supplier) {
      toast.error("Supplier company name is required");
      isValid = false;
    }
    if (!orderData.supplier.contactPerson) {
      toast.error("Supplier contact person is required");
      isValid = false;
    }
    if (!orderData.supplier.email || !/\S+@\S+\.\S+/.test(orderData.supplier.email)) {
      toast.error("Valid supplier email is required");
      isValid = false;
    }
    if (!orderData.supplier.phone) {
      toast.error("Supplier phone number is required");
      isValid = false;
    }

    // Validate order details
   

    // Validate order items
    const validMaterials = orderItems.filter(
      (item) => item.material.material_id && parseFloat(item.quantity) > 0 && parseFloat(item.unitPrice) > 0
    );
    if (validMaterials.length === 0) {
      toast.error("At least one valid order item is required (with material, quantity > 0, and unit price > 0)");
      isValid = false;
    }
    orderItems.forEach((item) => {
      if (item.material.material_id && (parseFloat(item.quantity) <= 0 || parseFloat(item.unitPrice) <= 0)) {
        toast.error(`Invalid quantity or unit price for material ${item.material.material_id}`);
        isValid = false;
      }
    });

    // Validate delivery schedule
    const validDeliveries = deliverySchedule.filter(
      (item) => item.location && item.requiredDate && parseFloat(item.shippingCost) >= 0
    );
    if (validDeliveries.length === 0) {
      toast.error("At least one valid delivery schedule is required (with location, required date, and shipping cost >= 0)");
      isValid = false;
    }
    deliverySchedule.forEach((item) => {
      if (item.location && item.requiredDate && parseFloat(item.shippingCost) < 0) {
        toast.error(`Shipping cost cannot be negative for location ${item.location}`);
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
        required_date: orderData.deliveries?.[0]?.requiredDate,
        status: orderData.status,
        additional_info: orderData.additional_info,
        subTotal: calculateTotal(),
        items: validMaterials.length,
        material_req_id: quotationData.material_req_id,
        projectId: quotationRequestDetails?.projectId,
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
        state: { orderData: submitData, quotationId: id },
      });

      setLoadingProgress(100);
      setTimeout(() => {
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
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="supplier.supplier"
                      value={orderData.supplier.supplier}
                      onChange={handleChange}
                      placeholder="Company Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
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
                      placeholder="Contact Person"
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
                      placeholder="Email"
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
                      placeholder="Phone Number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Supplier Information Display */}
                {supplierData && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Additional Supplier Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <strong>Supplier ID:</strong> {supplierData.supplierId}
                      </div>
                      <div>
                        <strong>Business Reg. No:</strong>{" "}
                        {supplierData.business_Registration_Number}
                      </div>
                      <div>
                        <strong>Address:</strong>{" "}
                        {supplierData.userDetails?.address}
                      </div>
                      <div>
                        <strong>Phone 2:</strong>{" "}
                        {supplierData.userDetails?.phone_number2}
                      </div>
                    </div>
                  </div>
                )}
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
                      readOnly
                      value={new Date().toISOString().split("T")[0]}
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
                      <option value="Pending">Pending</option>
                      <option value="Draft">Draft</option>
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
                              {/* Show current material from quotation if available */}
                              {item.material.materialName && (
                                <option value={item.material.material_id}>
                                  {item.material.materialName} (
                                  {item.material.materialType})
                                </option>
                              )}
                              {/* Other predefined options */}
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
                              RS {item.cost.toFixed(2)}
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
                          {/* Show current location from quotation if it's not in predefined options */}
                          {item.location &&
                            ![
                              "Warehouse A",
                              "Warehouse B",
                              "Construction Site A",
                              "Main Storage",
                            ].includes(item.location) && (
                              <option value={item.location}>
                                {item.location}
                              </option>
                            )}
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
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          value={item.DeliveryDate}
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
                      RS {calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium text-main_dark">
                      RS{" "}
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
                      RS {calculateTotal().toFixed(2)}
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
                        { new Date().toISOString().split("T")[0] || "Not set"}
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
