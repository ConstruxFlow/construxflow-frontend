import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaTruck,
  FaFileAlt,
  FaClock,
  FaCheck,
  FaExclamationTriangle,
  FaBox,
  FaClipboardCheck,
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaStar,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar";

const SiteManagerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [supplierperformance, setSupplierPerformance] = useState({
    on_time_delivery_rate: "",
    past_orders_completed: "",
    avg_delay_days: "",
    rating_by_site_manager: "",
  });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
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
        console.log(data.data);
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

  const handleConfirmDelivery = async () => {
    // Show rating modal first before confirming delivery
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async () => {
    setConfirmingDelivery(true);
    try {
      // First, update order status to "Delivered"
      const orderResponse = await fetch(
        `http://localhost:8080/api/purchasingorder/${orderData.poId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Delivered" }),
        }
      );

      if (true) {
        // Calculate and update supplier performance metrics
        await updateSupplierPerformance();
        console.log(supplierperformance);
        
        
        toast.success("Delivery confirmed and supplier rated successfully!");
        setOrderData((prev) => ({ ...prev, status: "Delivered" }));
        setShowRatingModal(false);
      } else {
        toast.error("Failed to confirm delivery");
      }
    } catch (error) {
      toast.error("Network error: Failed to confirm delivery");
      console.error("Error confirming delivery:", error);
    } finally {
      setConfirmingDelivery(false);
    }
  };

  const updateSupplierPerformance = async () => {
    try {

      if (rating !== null) {
        // Use nullish coalescing operator (??) to treat null as 0
        const currentRating = orderData.supplier.rating_by_site_manager ?? 0;
        const existingRatings = orderData.supplier.number_of_existing_ratings ?? 0;
        const pastOrders = orderData.supplier.past_orders_completed ?? 0;
        const currentOnTimeRate = orderData.supplier.on_time_delivery_rate ?? 0;
        const currentAvgDelay = orderData.supplier.avg_delay_days ?? 0;

        // Calculate new rating
        const newRating = (((currentRating * existingRatings) + rating) / (existingRatings + 1)).toFixed(2).toString();
        const newNumberOfRatings = (existingRatings + 1).toString();
        const newPastOrdersCompleted = (pastOrders + 1).toString();
        
        let newOnTimeDeliveryRate = currentOnTimeRate;
        let newAvgDelayDays = currentAvgDelay;

        // Check if delivery is on time (compare with current date)
        const deliveryDate = new Date(orderData.deliveries[0]?.requiredDate);
        const currentDate = new Date();
        
        if (deliveryDate >= currentDate) {
          // Delivery is on time or early
          newOnTimeDeliveryRate = (((currentOnTimeRate / 100 * pastOrders) + 1) / (pastOrders + 1) * 100).toFixed(2).toString();
        } else {
          // Delivery is late - calculate delay
          const delayInMs = currentDate.getTime() - deliveryDate.getTime();
          const delayInDays = Math.ceil(delayInMs / (1000 * 60 * 60 * 24));
          
          // Update average delay days
          newAvgDelayDays = (((currentAvgDelay * pastOrders) + delayInDays) / (pastOrders + 1)).toFixed(2).toString();
          
          // On-time delivery rate remains the same (no increment for late delivery)
          newOnTimeDeliveryRate = ((currentOnTimeRate / 100 * pastOrders) / (pastOrders + 1) * 100).toFixed(2).toString();
        }
        
        // Create object matching your DTO structure
        const supplierPerformanceUpdateDTO = {
          "on_time_delivery_rate": newOnTimeDeliveryRate,
          "past_orders_completed": newPastOrdersCompleted,
          "avg_delay_days": newAvgDelayDays,
          "rating_by_site_manager": newRating,
          "number_of_existing_ratings": newNumberOfRatings
        };
        console.log(supplierPerformanceUpdateDTO);
        
        //   // Update supplier performance
          const performanceResponse = await fetch(
            `http://localhost:8080/api/supplier/update-performance/${orderData.supplier.supplier_id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(supplierPerformanceUpdateDTO),
            }
          );
  
          if (!performanceResponse.ok) {
            console.error("Failed to update supplier performance");
          }
        
      }
      
    } catch (error) {
      console.error("Error updating supplier performance:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "dispatch":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
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

  const isDeliveryOverdue = (requiredDate) => {
    if (!requiredDate) return false;
    return new Date(requiredDate) < new Date();
  };

  const navLinks = [
    { name: "Dashboard", href: "/site-manager" },
    { name: "Projects", href: "/site-manager/projects-list" },
    { name: "Materials", href: "/site-manager/materials" },
    { name: "Inventory", href: "/site-manager/site-inventory" },
  ];

  // Rating Modal Component
  const RatingModal = () => {
    if (!showRatingModal || !orderData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-purewhite rounded-lg shadow-xl max-w-md w-full mx-4">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-main_dark flex items-center gap-2">
              <FaCheckCircle className="w-5 h-5 text-green-600" />
              Confirm Delivery & Rate Supplier
            </h3>
            <button
              onClick={() => setShowRatingModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaTruck className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-main_dark text-lg mb-2">
                Delivery Confirmation
              </h4>
              <p className="text-gray-600 text-sm">
                Please confirm that you have received all materials for this order and rate the supplier's performance.
              </p>
            </div>

            {/* Order Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Purchase Order:</span>
                <span className="font-semibold text-main_dark">{orderData.ponumber}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Supplier:</span>
                <span className="font-semibold text-main_dark">{orderData.supplier.company_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="font-semibold text-main_dark">RS {orderData.subTotal?.toLocaleString()}</span>
              </div>
            </div>

            {/* Rating Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate Supplier Performance (1-5 stars)
              </label>
              <div className="flex justify-center items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-3xl transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } hover:text-yellow-400`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
              <div className="text-center text-sm text-gray-600">
                {rating === 0 && "No rating selected"}
                {rating === 1 && "Poor - Needs significant improvement"}
                {rating === 2 && "Fair - Below expectations"}
                {rating === 3 && "Good - Meets expectations"}
                {rating === 4 && "Very Good - Exceeds expectations"}
                {rating === 5 && "Excellent - Outstanding performance"}
              </div>
            </div>

            {/* Performance Update Info */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Confirming delivery will automatically update the supplier's performance metrics including on-time delivery rate, completed orders count, and average delay days.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={() => setShowRatingModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRatingSubmit}
              disabled={rating === 0 || confirmingDelivery}
              className="px-6 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCheckCircle className="w-4 h-4" />
              {confirmingDelivery ? "Confirming..." : "Confirm Delivery"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Contact Modal Component (unchanged)
  const ContactSupplierModal = () => {
    if (!showContactModal || !orderData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-purewhite rounded-lg shadow-xl max-w-md w-full mx-4">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-main_dark flex items-center gap-2">
              <FaUser className="w-5 h-5 text-web_yellow" />
              Contact Supplier
            </h3>
            <button
              onClick={() => setShowContactModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Supplier Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-web_yellow/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaBuilding className="w-8 h-8 text-web_yellow" />
                </div>
                <h4 className="font-semibold text-main_dark text-lg">
                  {orderData.supplier.company_name}
                </h4>
                <p className="text-gray-600">{orderData.supplier.name}</p>
                <p className="text-sm text-gray-500">
                  Supplier ID: {orderData.supplier.supplier_id}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">
                      Email Address
                    </label>
                    <p className="font-semibold text-main_dark">
                      {orderData.supplier.email || "supplier@company.com"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      window.open(
                        `mailto:${
                          orderData.supplier.email || "supplier@company.com"
                        }`,
                        "_blank"
                      )
                    }
                    className="px-3 py-1 bg-deep_green text-purewhite rounded text-sm hover:bg-deep_green/90 transition-colors"
                  >
                    Send Email
                  </button>
                </div>

                {/* Phone Number 1 */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaPhone className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">
                      Primary Phone
                    </label>
                    <p className="font-semibold text-main_dark">
                      {orderData.supplier.phone_number1 || "+94 11 234 5678"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      window.open(
                        `tel:${
                          orderData.supplier.phone_number1 || "+94112345678"
                        }`,
                        "_blank"
                      )
                    }
                    className="px-3 py-1 bg-web_yellow text-main_dark rounded text-sm hover:bg-web_yellow/90 transition-colors"
                  >
                    Call Now
                  </button>
                </div>

                {/* Phone Number 2 (if available) */}
                {orderData.supplier.phone_number2 && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaPhone className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">
                        Secondary Phone
                      </label>
                      <p className="font-semibold text-main_dark">
                        {orderData.supplier.phone_number2}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        window.open(
                          `tel:${orderData.supplier.phone_number2}`,
                          "_blank"
                        )
                      }
                      className="px-3 py-1 bg-web_yellow text-main_dark rounded text-sm hover:bg-web_yellow/90 transition-colors"
                    >
                      Call Now
                    </button>
                  </div>
                )}

                {/* Address (if available) */}
                {orderData.supplier.address && (
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <label className="text-sm text-gray-600">Address</label>
                      <p className="font-semibold text-main_dark">
                        {orderData.supplier.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Reference */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Reference:</strong> Purchase Order #
                  {orderData.ponumber}
                </p>
                <p className="text-sm text-blue-600">
                  Project ID: {orderData.projectId}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => setShowContactModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
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
          links={navLinks}
          showButton={true}
          logoSrc="/logo1.png"
          profileURL="profile"
        />
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
        links={navLinks}
        showButton={true}
        logoSrc="/logo1.png"
        profileURL="profile"
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/sitemanager/orders/overview")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                Orders
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark">
                Order Details
              </h1>
            </div>

            {/* Delivery Confirmation Button */}
            {orderData.status?.toLowerCase() === "dispatch" && (
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDelivery}
                  disabled={confirmingDelivery}
                  className="px-6 py-3 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCheckCircle className="w-4 h-4" />
                  {confirmingDelivery ? "Confirming..." : "Confirm Delivery"}
                </button>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600 mb-6">
            Purchase Order #{orderData.ponumber} • Project ID:{" "}
            {orderData.projectId}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order & Delivery Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status Card */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-main_dark">
                    Order Status
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      orderData.status
                    )}`}
                  >
                    {orderData.status}
                  </span>
                </div>

                {orderData.status?.toLowerCase() === "delivered" && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <FaCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Delivery Confirmed
                    </span>
                  </div>
                )}
              </div>

              {/* Delivery Information */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                  <FaTruck className="w-5 h-5 text-web_yellow" />
                  Delivery Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Delivery Address
                      </label>
                      <p className="font-semibold text-main_dark flex items-start gap-2">
                        <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-1" />
                        {orderData.deliveries?.[0]?.location || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Expected Date
                      </label>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                        <p
                          className={`font-semibold ${
                            isDeliveryOverdue(
                              orderData.deliveries?.[0]?.requiredDate
                            )
                              ? "text-red-600"
                              : "text-main_dark"
                          }`}
                        >
                          {formatDate(orderData.deliveries?.[0]?.requiredDate)}
                        </p>
                        {isDeliveryOverdue(
                          orderData.deliveries?.[0]?.requiredDate
                        ) && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Order Date
                      </label>
                      <p className="font-semibold text-main_dark">
                        {formatDate(orderData.orderDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Shipping Cost
                      </label>
                      <p className="font-semibold text-main_dark">
                        RS{" "}
                        {orderData.deliveries?.[0]?.shippingCost?.toLocaleString() ||
                          "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials to Receive */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                  <FaBox className="w-5 h-5 text-web_yellow" />
                  Materials to Receive ({orderData.materials?.length || 0}{" "}
                  items)
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
                          Type: {item.material.materialType || "N/A"}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">
                            Quantity:{" "}
                            <strong>
                              {item.quantity} {item.material.unitOfMeasurement}
                            </strong>
                          </span>
                          <span className="text-sm text-gray-600">
                            Unit Price:{" "}
                            <strong>
                              RS {item.unitPrice?.toLocaleString()}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-main_dark text-lg">
                          RS{" "}
                          {(item.quantity * item.unitPrice)?.toLocaleString()}
                        </p>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mt-1">
                          Pending Receipt
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Supplier & Summary */}
            <div className="space-y-6">
              {/* Supplier Information */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                  <FaBuilding className="w-5 h-5 text-web_yellow" />
                  Supplier Details
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Company</label>
                    <p className="font-semibold text-main_dark">
                      {orderData.supplier.company_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Contact Person
                    </label>
                    <p className="font-semibold text-main_dark">
                      {orderData.supplier.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Supplier ID</label>
                    <p className="font-semibold text-main_dark">
                      {orderData.supplier.supplier_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Materials Cost</span>
                    <span className="font-semibold">
                      RS{" "}
                      {(
                        orderData.subTotal -
                        (orderData.deliveries?.[0]?.shippingCost || 0)
                      )?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Cost</span>
                    <span className="font-semibold">
                      RS{" "}
                      {orderData.deliveries?.[0]?.shippingCost?.toLocaleString() ||
                        "0"}
                    </span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-700">
                      Total Amount
                    </span>
                    <span className="text-lg font-bold text-web_yellow">
                      RS {orderData.subTotal?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Quick Actions
                </h2>

                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <FaClipboardCheck className="w-4 h-4" />
                    Report Issue
                  </button>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaUser className="w-4 h-4" />
                    Contact Supplier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rating Modal */}
      <RatingModal />

      {/* Contact Supplier Modal */}
      <ContactSupplierModal />
    </div>
  );
};

export default SiteManagerOrderDetails;
