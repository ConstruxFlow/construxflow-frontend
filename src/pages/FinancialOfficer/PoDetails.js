import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaDownload,
  FaEdit,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaTruck,
  FaDollarSign,
  FaFileAlt,
  FaClock,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar";

const PoDetails = () => {
  const { id } = useParams();

  // const poId="PO-2025-0002";
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // console.log(poId);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      console.log(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/purchasingorder/ponumber/${id}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setOrderData(data.data);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Network error: Failed to fetch order details");
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Order Data:", orderData);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderStatusSteps = () => {
    const steps = [
      { id: "placed", label: "Placed", icon: FaFileAlt },
      { id: "approved", label: "Approved", icon: FaCheck },
      { id: "shipped", label: "Shipped", icon: FaTruck },
      { id: "delivered", label: "Delivered", icon: FaMapMarkerAlt },
      { id: "completed", label: "Completed", icon: FaCheck },
    ];

    const currentStatusIndex = steps.findIndex(
      (step) => step.id.toLowerCase() === orderData?.status?.toLowerCase()
    );

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentStatusIndex,
      isCurrent: index === currentStatusIndex,
    }));
  };

  const calculatePaymentProgress = (orderPayment) => {
    if (!orderPayment || !orderPayment.amount) return 0;
    return ((orderPayment.paidAmount || 0) / orderPayment.amount) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <NavBar
          links={[
            { name: 'Dashboard', path: '/financial/dashboard' },
          { name: 'Payment Approvals', path: '/financial/payment-list' },
          { name: 'Purchase Orders', path: '/financial/purchase-order-list' },
          { name: 'Projects', path: '/financial/financial-projects' },
          ]}
        />
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  const statusSteps = getOrderStatusSteps();

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
        links={[
          { name: 'Dashboard', path: '/financial/dashboard' },
          { name: 'Payment Approvals', path: '/financial/payment-list' },
          { name: 'Purchase Orders', path: '/financial/purchase-order-list' },
          { name: 'Reports', path: '/financial/reports' },
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/purchasing/purchaseorders/overview")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                Orders
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark">
                Order Details
              </h1>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            Purchase Order #{orderData.ponumber}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Summary & Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Order Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Project Name
                      </label>
                      <p className="font-semibold text-main_dark">
                        {orderData.additionalInfo || "Construction Project"}
                      </p>
                    </div>
                    <div>
                      +<label className="text-sm text-gray-600">Supplier</label>
                      <p className="font-semibold text-main_dark">
                        {orderData.supplier.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {orderData.supplier.company_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Order Date
                      </label>
                      <p className="font-semibold text-main_dark">
                        {formatDate(orderData.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Delivery Location
                      </label>
                      <p className="font-semibold text-main_dark">
                        {orderData.deliveries?.[0]?.location || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Expected Delivery
                      </label>
                      <p className="font-semibold text-main_dark">
                        {formatDate(orderData.deliveries?.[0]?.requiredDate)}
                      </p>
                    </div>
                    <div className="bg-light_brown/20 p-4 rounded-lg">
                      <label className="text-sm text-gray-600">
                        Total Amount
                      </label>
                      <p className="text-2xl font-bold text-main_dark">
                        ${orderData.subTotal?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status Flow */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-6">
                  Order Status Flow
                </h2>
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            step.isCompleted
                              ? "bg-web_yellow text-main_dark"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`mt-2 text-xs font-medium ${
                            step.isCompleted
                              ? "text-main_dark"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`absolute h-0.5 w-16 mt-6 ${
                              step.isCompleted ? "bg-web_yellow" : "bg-gray-200"
                            }`}
                            style={{
                              left: `${
                                (index * 100) / (statusSteps.length - 1)
                              }%`,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Materials Ordered */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Materials Ordered
                </h2>
                <div className="space-y-4">
                  {orderData.materials?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-main_dark">
                          {item.material.materialName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.material.materialType} •{" "}
                          {item.material.unitOfMeasurement}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} • Unit Price: $
                          {item.unitPrice?.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-deep_green text-purewhite rounded-full text-xs">
                          Direct Purchase
                        </span>
                        <p className="font-semibold text-main_dark mt-2">
                          ${(item.quantity * item.unitPrice)?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Payment & Shipping */}
            <div className="space-y-6">
              {/* Payment Details */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Payment Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-light_brown/20 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Payment Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        orderData.orderPayment?.status
                      )}`}
                    >
                      {orderData.orderPayment?.status || "Processing"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Payment Method
                    </span>
                    <span className="font-semibold text-main_dark">
                      {orderData.orderPayment?.paymentType || "Bank Transfer"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Deposit (30%)
                      </span>
                      <div className="text-right">
                        <p className="font-semibold text-main_dark">
                          $
                          {(
                            orderData.orderPayment?.paidAmount || 0
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">Paid - May 15</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Progress Payment (50%)
                      </span>
                      <div className="text-right">
                        <p className="font-semibold text-main_dark">
                          $
                          {(
                            (orderData.orderPayment?.amount || 0) * 0.5
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-orange-600">Due</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Final Payment (20%)
                      </span>
                      <div className="text-right">
                        <p className="font-semibold text-main_dark">
                          $
                          {(
                            orderData.orderPayment?.remainingAmount || 0
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Payment Progress
                      </span>
                      <span className="text-sm font-semibold">
                        {calculatePaymentProgress(
                          orderData.orderPayment
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${calculatePaymentProgress(
                            orderData.orderPayment
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button className="flex-1 px-4 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors">
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping & Delivery */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Shipping & Delivery
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">
                      Shipping Address
                    </label>
                    <p className="font-semibold text-main_dark">
                      {orderData.deliveries?.[0]?.location || "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Shipping Method
                      </label>
                      <p className="font-semibold text-main_dark">
                        Standard Freight
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Estimated Delivery
                      </label>
                      <p className="font-semibold text-main_dark">
                        {formatDate(orderData.deliveries?.[0]?.requiredDate)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Tracking Number
                    </label>
                    <p className="font-semibold text-main_dark">
                      TRK-789456123
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Delivery Status
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        In Transit
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Order Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-web_yellow rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-main_dark">
                        1
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-main_dark">
                        Order Created
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(orderData.createdDate)} by John Smith
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-web_yellow rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-main_dark">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-main_dark">
                        Approved by Manager
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(orderData.createdDate)} by Sarah Johnson
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-web_yellow rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-main_dark">
                        3
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-main_dark">
                        Deposit Payment Processed
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(orderData.orderPayment?.createdDate)} -
                        9:00 AM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-web_yellow rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-main_dark">
                        4
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-main_dark">
                        Payment Processing
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(orderData.orderPayment?.createdDate)} -
                        11:45 AM
                      </p>
                    </div>
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

export default PoDetails;
