import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaUser,
  FaCheckCircle,
  FaTruck,
  FaRegCircle,
  FaArrowLeft,
  FaExclamationTriangle,
  FaBoxOpen,
  FaCalendarAlt,
  FaPrint,
  FaTimes,
} from "react-icons/fa";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations" },
  { name: "Orders", href: "/supplier/orders", active: true },
  { name: "Payments", href: "/supplier/payments" },
];

const statusColors = {
  completed: "bg-deep_green text-purewhite",
  pending: "bg-web_yellow text-main_dark",
  upcoming: "bg-light_gray text-slatebluegray",
  "partially paid": "bg-blue-100 text-blue-800",
};

const OrderDetails = () => {
  const { ponumber } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [projectName, setProjectName] = useState("N/A");
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [managerId, setManagerId] = useState("N/A");

  useEffect(() => {
    if (ponumber) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      setError("No order number provided");
    }

    // Add print styles
    const printStyle = document.createElement("style");
    printStyle.textContent = `
      @media print {
        nav, footer, .no-print {
          display: none !important;
        }
        
        body * {
          visibility: hidden;
        }
        
        .print-area, .print-area * {
          visibility: visible;
        }
        
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20px;
        }
        
        .print-area::before {
          content: "PURCHASE ORDER";
          display: block;
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #000;
        }
        
        .bg-deep_green {
          background-color: #2d5f3f !important;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        .bg-\\[\\#f5f4f3\\], .bg-gray-50 {
          background-color: #f9f9f9 !important;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        .border {
          border: 1px solid #ddd !important;
        }
        
        .print-footer {
          display: block !important;
        }
      }
    `;
    document.head.appendChild(printStyle);

    return () => {
      document.head.removeChild(printStyle);
    };
  }, [ponumber]);

  const fetchProjectName = async (projectId) => {
    if (!projectId) return "N/A";

    try {
      const response = await fetch(
        `http://localhost:8080/api/projects/${projectId}`
      );
      const data = await response.json();
      setManagerId(data.managerId || "N/A");
      return data.projectName || data.project_name || "N/A";
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error);
      return projectId;
    }
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching order details for PO:", ponumber);
      const response = await fetch(
        `http://localhost:8080/api/purchasingorder/ponumber/${ponumber}`
      );
      const data = await response.json();

      console.log("API Response:", data);

      if (data.status === "success" && data.data) {
        setOrderData(data.data);
        console.log("Order data loaded:", data.data);
        const projectId = data.data.projectId || data.data.project_id;
        if (projectId) {
          const fetchedProjectName = await fetchProjectName(projectId);
          setProjectName(fetchedProjectName);
          console.log("Project Name:", fetchedProjectName);
        }
      } else {
        setError("Order not found");
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      setError("Network error: Failed to fetch order details");
      toast.error("Network error: Failed to fetch order details");
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentTimeline = () => {
    if (!orderData?.orderPayment) {
      return [
        {
          label: "Payment Not Initiated",
          date: "Awaiting Setup",
          status: "upcoming",
          amount: orderData?.subTotal || 0,
          description: "Payment record not created yet",
        },
      ];
    }

    const timeline = [];
    const payment = orderData.orderPayment;
    const totalAmount = payment.amount || 0;
    const paidAmount = payment.paidAmount || 0;
    const remainingAmount = payment.remainingAmount || 0;

    const paymentStatus = payment.status?.toLowerCase().trim() || "pending";

    if (paymentStatus === "pending") {
      timeline.push({
        label: "Payment Pending",
        date: formatDate(payment.createdDate) || "Order Created",
        status: "pending",
        amount: totalAmount,
        description: "Awaiting advance payment",
      });

      timeline.push({
        label: "Advance Payment",
        date: "Not Yet Paid",
        status: "upcoming",
        amount: totalAmount * 0.3,
        description: "30% of total amount",
      });

      timeline.push({
        label: "Full Payment",
        date: "Not Yet Paid",
        status: "upcoming",
        amount: totalAmount,
        description: "Complete payment pending",
      });

      return timeline;
    }

    if (paymentStatus === "completed") {
      const advanceAmount = totalAmount * 0.3;
      const remainingAmountPaid = totalAmount - advanceAmount;

      timeline.push({
        label: "Advance Payment",
        date: formatDate(payment.createdDate),
        status: "completed",
        amount: advanceAmount,
        description: "30% advance paid ✓",
      });

      timeline.push({
        label: "Remaining Payment",
        date:
          formatDate(payment.paymentDate) || formatDate(payment.updatedDate),
        status: "completed",
        amount: remainingAmountPaid,
        description: "70% balance paid ✓",
      });

      timeline.push({
        label: "Fully Paid",
        date:
          formatDate(payment.paymentDate) || formatDate(payment.updatedDate),
        status: "completed",
        amount: totalAmount,
        description: "Payment complete ✓",
      });

      return timeline;
    }

    if (paymentStatus === "partially paid" || paymentStatus === "partial") {
      const percentage = ((paidAmount / totalAmount) * 100).toFixed(0);

      timeline.push({
        label: "Advance Payment",
        date:
          formatDate(payment.paymentDate) || formatDate(payment.updatedDate),
        status: "completed",
        amount: paidAmount,
        description: `${percentage}% paid ✓`,
      });

      const remainingPercentage = (
        (remainingAmount / totalAmount) *
        100
      ).toFixed(0);
      timeline.push({
        label: "Remaining Payment",
        date: "Pending",
        status: "pending",
        amount: remainingAmount,
        description: `${remainingPercentage}% due`,
      });

      timeline.push({
        label: "Full Payment",
        date: "Awaiting",
        status: "upcoming",
        amount: totalAmount,
        description: "Complete payment pending",
      });

      return timeline;
    }

    return [
      {
        label: "Payment Status Unknown",
        date: formatDate(payment.createdDate),
        status: "pending",
        amount: totalAmount,
        description: `Status: "${paymentStatus}" - Contact support`,
      },
    ];
  };

  const getStatusTimeline = () => {
    const statuses = [
      { label: "Ordered", icon: <FaCheckCircle />, status: "ordered" },
      { label: "Dispatched", icon: <FaTruck />, status: "dispatched" },
      { label: "Delivered", icon: <FaCheckCircle />, status: "delivered" },
    ];

    const currentStatus = orderData?.status?.toLowerCase() || "";

    return statuses.map((step) => {
      let completed = false;

      if (step.status === "ordered") {
        completed = true;
      } else if (step.status === "dispatched") {
        completed = ["dispatched", "delivered", "completed"].includes(
          currentStatus
        );
      } else if (step.status === "delivered") {
        completed = ["delivered", "completed"].includes(currentStatus);
      }

      return { ...step, completed };
    });
  };

  const handleMarkAsDispatched = async () => {
    setShowDispatchModal(false);
    setUpdating(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/purchasingorder/${orderData.poId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Dispatched" }),
        }
      );

      if (response.ok) {
        // Fetch user by managerId to get their email before sending email
        const userResponse = await fetch(
          `http://localhost:8080/api/user/by-manager/${managerId}`
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user by manager");
        }

        const userData = await userResponse.json();
        const recipientEmail = userData.email;

        // Compose professional email content with all order details
        const emailContent = `
Purchase Order Dispatched Notification

Order Number: ${orderData.ponumber || "N/A"}
Project Name: ${projectName || "N/A"}
Supplier: ${
          orderData.supplier?.company_name || orderData.supplier?.name || "N/A"
        }
Delivery Location: ${orderData.deliveries?.[0]?.location || "N/A"}
Order Date: ${formatDate(orderData.orderDate || orderData.order_date)}
Delivery Date: ${formatDate(
          orderData.deliveries?.[0]?.required_date ||
            orderData.deliveries?.[0]?.requiredDate
        )}

Order Items:
${
  orderData.materials && orderData.materials.length > 0
    ? orderData.materials
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.material?.materialName || "N/A"} - ${
              item.material?.materialType || "N/A"
            } - Quantity: ${item.quantity} ${
              item.material?.unitOfMeasurement || ""
            } - Unit Price: RS ${(item.unitPrice || 0).toFixed(
              2
            )} - Total: RS ${(
              (item.quantity || 0) * (item.unitPrice || 0)
            ).toFixed(2)}`
        )
        .join("\n")
    : "No items found"
}

Total Amount: RS ${(orderData.subTotal || 0).toFixed(2)}
Current Status: ${orderData.status || "N/A"}

This is to inform you that the above purchase order has been marked as dispatched. Please track the delivery accordingly.

Thank you,
ConstruxFlow Team
      `;

        await fetch("http://localhost:8080/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            to: recipientEmail,
            subject: `Purchase Order ${orderData.ponumber} Dispatched`,
            content: emailContent,
          }),
        });

        toast.success("Order marked as dispatched and email sent!");
        await fetchOrderDetails();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    } finally {
      setUpdating(false);
    }
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

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          links={navLinks}
          profileURL="/supplier/profile"
          logoSrc="/logo1.png"
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaExclamationTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold mb-2">
              {error || "Order not found"}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/supplier/orders")}
              className="px-6 py-2 bg-web_yellow text-main_dark rounded-lg hover:bg-web_yellow/90 font-semibold transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const paymentTimeline = getPaymentTimeline();
  const statusTimeline = getStatusTimeline();

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar
        links={navLinks}
        profileURL="/supplier/profile"
        logoSrc="/logo1.png"
      />
      <div className="max-w-full mx-auto px-4 sm:px-12 md:px-16 py-10">
        {/* Back Button and Print Button */}
        <div className="flex items-center justify-between mb-6 no-print">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/supplier/orders")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Orders
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-main_dark">
              Order Details
            </h1>
          </div>
          <button
            onClick={handlePrint}
            className="bg-web_yellow text-main_dark font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
          >
            <FaPrint className="w-4 h-4" />
            Print Order
          </button>
        </div>

        <p className="text-gray-500 mb-8 no-print">
          Complete information about your received purchase order
        </p>

        {/* Printable Area */}
        <div className="print-area">
          {/* Top Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Order Card */}
            <div className="md:col-span-2 bg-[#f5f4f3] rounded-lg p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-web_yellow text-main_dark font-bold px-3 py-1 rounded text-sm">
                  {orderData.ponumber}
                </span>
              </div>
              <div className="text-slatebluegray text-sm font-semibold mb-1">
                Project Name
              </div>
              <div className="text-main_dark font-bold text-lg mb-2">
                {projectName}
              </div>
              <div className="flex items-center gap-2 text-slatebluegray text-sm mb-1">
                <FaUser className="text-deep_green" />
                <span>
                  {orderData.supplier?.company_name ||
                    orderData.supplier?.name ||
                    "Supplier"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slatebluegray text-sm mb-1">
                <FaMapMarkerAlt className="text-deep_green" />
                <span>
                  {orderData.deliveries?.[0]?.location || "Delivery Location"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-deep_green" />
                  <span className="text-main_dark text-sm font-medium">
                    {formatDate(orderData.orderDate || orderData.order_date)}
                  </span>
                  <span className="text-slatebluegray text-xs">Order Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTruck className="text-web_yellow" />
                  <span className="text-main_dark text-sm font-medium">
                    {formatDate(
                      orderData.deliveries?.[0]?.required_date ||
                        orderData.deliveries?.[0]?.requiredDate
                    ) || "N/A"}
                  </span>
                  <span className="text-slatebluegray text-xs">
                    Delivery Date
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Timeline */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-6 flex flex-col gap-4">
              <div className="font-semibold text-main_dark mb-1">
                Payment Timeline
              </div>
              <div className="flex flex-col gap-3">
                {paymentTimeline.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span
                      className={`h-3 w-3 rounded-full mt-1 flex-shrink-0 ${
                        statusColors[pt.status]
                      }`}
                    ></span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="text-main_dark text-sm font-semibold">
                          {pt.label}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            statusColors[pt.status]
                          }`}
                        >
                          {pt.status === "completed" && "✓ Paid"}
                          {pt.status === "pending" && "Pending"}
                          {pt.status === "upcoming" && "Awaiting"}
                        </span>
                      </div>
                      <div className="text-slatebluegray text-xs mb-1">
                        {pt.date}
                      </div>
                      {pt.amount > 0 && (
                        <div className="text-xs text-gray-700 font-medium">
                          RS{" "}
                          {pt.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      )}
                      {pt.description && (
                        <div className="text-xs text-gray-500 mt-0.5 italic">
                          {pt.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="rounded-lg overflow-hidden mb-8 border border-light_gray">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-max">
                <thead>
                  <tr className="bg-deep_green text-purewhite">
                    <th className="px-6 py-4 text-left font-semibold">
                      Item Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Type</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Unit Price
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.materials && orderData.materials.length > 0 ? (
                    orderData.materials.map((item, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 1 ? "bg-[#f5f4f3]" : "bg-purewhite"
                        }
                      >
                        <td className="px-6 py-4 font-medium">
                          {item.material?.materialName || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          {item.material?.materialType || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          {item.quantity}{" "}
                          {item.material?.unitOfMeasurement || ""}
                        </td>
                        <td className="px-6 py-4">
                          RS{" "}
                          {(item.unitPrice || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          RS{" "}
                          {(
                            (item.quantity || 0) * (item.unitPrice || 0)
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <FaBoxOpen className="mx-auto text-gray-300 text-4xl mb-2" />
                        No items found in this order
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-light_gray">
                    <td colSpan={4} className="px-6 py-4 text-right font-bold">
                      Total Amount:
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-deep_green text-lg">
                      RS{" "}
                      {(orderData.subTotal || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-purewhite border border-light_gray rounded-lg p-6 mb-8">
            <div className="font-semibold text-main_dark mb-4">
              Order Status
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
              {statusTimeline.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center text-center">
                    <span
                      className={`text-2xl mb-1 ${
                        step.completed ? "text-deep_green" : "text-light_gray"
                      }`}
                    >
                      {step.icon}
                    </span>
                    <span className="text-main_dark text-sm font-semibold">
                      {step.label}
                    </span>
                  </div>
                  {idx < statusTimeline.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded hidden sm:block ${
                        step.completed ? "bg-deep_green" : "bg-light_gray"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            {(orderData.status?.toLowerCase() === "ordered" ||
              orderData.status?.toLowerCase() === "approved") && (
              <div className="flex justify-center mt-6 no-print">
                <button
                  onClick={() => setShowDispatchModal(true)}
                  disabled={updating}
                  className={`bg-web_yellow text-main_dark font-semibold px-6 py-2 rounded hover:opacity-90 transition ${
                    updating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {updating ? "Updating..." : "Mark as Dispatched"}
                </button>
              </div>
            )}
          </div>

          {/* Delivery & Actions - Same Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Delivery Locations */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-6 flex flex-col gap-3">
              <div className="font-semibold text-main_dark mb-2">
                Delivery Locations
              </div>
              {orderData.deliveries && orderData.deliveries.length > 0 ? (
                orderData.deliveries.map((delivery, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-main_dark mb-1">
                      <FaMapMarkerAlt className="text-deep_green" />
                      <span className="font-semibold">{delivery.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="text-deep_green w-3 h-3" />
                      <span>
                        Required:{" "}
                        {formatDate(
                          delivery.required_date || delivery.requiredDate
                        )}
                      </span>
                    </div>
                    {(delivery.shipping_cost || delivery.shippingCost) && (
                      <div className="text-sm text-gray-600 mt-1">
                        Shipping Cost: RS{" "}
                        {(
                          delivery.shipping_cost || delivery.shippingCost
                        ).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No delivery locations specified
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-6 flex flex-col gap-4 justify-center no-print">
              <button
                onClick={handlePrint}
                className="bg-web_yellow text-main_dark font-medium py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <FaPrint />
                Print Purchase Order
              </button>
              <button
                onClick={() => navigate(`/supplier/contact-support`)}
                className="bg-deep_green text-purewhite font-medium py-3 rounded-lg hover:opacity-90 transition"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate("/supplier/orders")}
                className="bg-gray-200 text-main_dark font-medium py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Back to All Orders
              </button>
            </div>
          </div>

          {/* Print Footer - Only visible on print */}
          <div className="print-footer" style={{ display: "none" }}>
            <p className="text-xs text-gray-600 text-center mt-8">
              This is a computer-generated purchase order. No signature
              required.
            </p>
            <p className="text-xs text-gray-600 text-center mt-2">
              Generated on:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Dispatch Confirmation Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 no-print">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm Dispatch
              </h3>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <FaTruck className="w-12 h-12 text-web_yellow" />
                </div>
                <div>
                  <p className="text-gray-700 mb-2">
                    Are you sure you want to mark this order as{" "}
                    <span className="font-semibold">dispatched</span>?
                  </p>
                  <p className="text-sm text-gray-500">
                    Order:{" "}
                    <span className="font-medium">{orderData.ponumber}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    This action will update the order status and notify relevant
                    parties.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200">
              <button
                onClick={() => setShowDispatchModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsDispatched}
                disabled={updating}
                className="px-5 py-2.5 text-sm font-medium text-main_dark bg-web_yellow rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {updating ? "Processing..." : "Confirm Dispatch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
