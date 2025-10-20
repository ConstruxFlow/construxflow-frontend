import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaEye,
  FaDownload,
  FaCreditCard,
  FaBuilding,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaUser,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import NavBar from "../../components/NavBar";

const FullPaymentCompletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {};
  const { poId } = useParams();

  const [poData, setPoData] = useState(orderData || null);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("Bank Transfer");
  const [bankDetails, setBankDetails] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  console.log("PO ID:", poId);
  console.log("PO Data:", poData);

  const fetchPOData = async (poNumber) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/purchasingorder/ponumber/${poNumber}`
      );
      const data = await response.json();

      if (response.ok && data.status === "success") {
        setPoData(data.data);
        console.log("Fetched PO Data:", data.data);
      } else {
        toast.error(data.message || "Failed to fetch purchase order details");
      }
    } catch (error) {
      toast.error("Network error: Failed to fetch purchase order details");
      console.error("Error fetching PO details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (poId) {
      fetchPOData(poId);
    }
  }, [poId]);

  // Generate reference number
  useEffect(() => {
    if (poData) {
      setReferenceNumber(`${poData.ponumber}-FULL-${Date.now()}`);
    }
  }, [poData]);

  // Auto-fill supplier bank details when modal opens
  useEffect(() => {
    if (showPaymentModal && poData?.supplier) {
      const supplierBankDetails = `Account: ${poData.supplier.bank_account_number || 'N/A'}, Name: ${poData.supplier.bank_account_name || 'N/A'}, Bank: ${poData.supplier.bank_name || 'N/A'}`;
      setBankDetails(supplierBankDetails);
    }
  }, [showPaymentModal, poData]);

  const handleFullPayment = async () => {
    // Validation
    if (!paymentType) {
      toast.error("Please select a payment type");
      return;
    }
    if (!bankDetails.trim()) {
      toast.error("Please enter bank details");
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

      // Calculate the new paid amount and remaining amount
      const totalAmount = poData.orderPayment.amount;

      // Prepare payment data - matching backend field names
      const paymentUpdateData = {
        paymentType: paymentType,
        bankDetails: bankDetails,
        referenceNumber: referenceNumber,
        paidAmount: totalAmount, // Full amount now paid
        remainingAmount: 0, // No remaining amount
        notes: paymentNotes || "Full payment completed",
      };

      console.log("Sending payment update:", paymentUpdateData);

      setLoadingProgress(50);

      // Step 1: Update payment details first
      const paymentResponse = await fetch(
        `http://localhost:8080/api/purchasingorder/${poData.poId}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentUpdateData),
        }
      );

      const paymentResult = await paymentResponse.json();
      console.log("Payment update response:", paymentResult);

      if (!paymentResponse.ok || paymentResult.status !== "success") {
        throw new Error(
          paymentResult.message || "Failed to update payment details"
        );
      }

      setLoadingProgress(75);

      // Step 2: Update order and payment status
      // orderStatus: Approved, paymentStatus: Completed
      const statusResponse = await fetch(
        `http://localhost:8080/api/purchasingorder/${poData.poId}/update-status?orderStatus=Delivered&paymentStatus=Completed`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const statusResult = await statusResponse.json();
      console.log("Status update response:", statusResult);

      setLoadingProgress(90);

      if (statusResponse.ok && statusResult.status === "success") {
        setLoadingProgress(100);
        setTimeout(() => {
          toast.success("Full payment completed successfully!");
          setIsLoading(false);
          setLoadingProgress(0);
          setShowPaymentModal(false);

          // Reset form fields
          setPaymentNotes("");
          setBankDetails("");

          // Refresh data to show updated status
          fetchPOData(poId);
        }, 800);
      } else {
        throw new Error(
          statusResult.message || "Failed to update order status"
        );
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Failed to process full payment: " + error.message);
      setIsLoading(false);
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "partially paid":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-blue-100 text-blue-800";
      case "dispatch":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!poData) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {isLoading ? "Loading..." : "No Purchase Order Data"}
          </h2>
          {!isLoading && (
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // Check if order is ready for full payment
  // Order Status: "Delivered" AND Payment Status: "Partially Paid"
  const isReadyForFullPayment =
    poData.status === "Delivered" &&
    poData.orderPayment.status === "Partially Paid" &&
    poData.orderPayment.remainingAmount > 0;

  // Check if payment is completed
  const isPaymentCompleted = poData.orderPayment.status === "Completed";

  // Check if payment is still pending (advance payment not made yet)
  const isPaymentPending = poData.orderPayment.status === "Pending";

  // Check if order is not delivered yet
  const isOrderNotDelivered =
    poData.status === "Pending" ||
    poData.status === "Approved" ||
    poData.status === "Dispatch";

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {isLoading && <LoadingOverlay progress={loadingProgress} />}

      <NavBar
        profileURL="/financial/profile"
        links={[
          { name: "Dashboard", path: "/financial/dashboard" },
          { name: "Payment Approvals", path: "/financial/payment-list" },
          { name: "Purchase Orders", path: "/financial/purchase-order-list" },
          { name: "Projects", path: "/financial/financial-projects" },
        ]}
      />

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Full Payment Completion
              </h1>
              <p className="text-gray-600 text-sm">
                Complete remaining payment for Purchase Order {poData.ponumber}
              </p>
            </div>
          </div>

          {/* Status Banners */}
          {isPaymentCompleted && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 text-2xl mr-3" />
                <div>
                  <h3 className="text-green-800 font-semibold">
                    Payment Completed
                  </h3>
                  <p className="text-green-700 text-sm">
                    This order has been fully paid and approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isPaymentPending && (
            <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-orange-500 text-2xl mr-3" />
                <div>
                  <h3 className="text-orange-800 font-semibold">
                    Advance Payment Pending
                  </h3>
                  <p className="text-orange-700 text-sm">
                    The advance payment has not been made yet. Please complete
                    the advance payment before proceeding with full payment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isOrderNotDelivered && !isPaymentPending && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-center">
                <FaTruck className="text-blue-500 text-2xl mr-3" />
                <div>
                  <h3 className="text-blue-800 font-semibold">
                    Order Not Delivered Yet
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Current order status: <strong>{poData.status}</strong>. Full
                    payment can only be processed when the order status is
                    "Delivered".
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isReadyForFullPayment &&
            !isPaymentCompleted &&
            !isPaymentPending &&
            !isOrderNotDelivered && (
              <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaTimes className="text-yellow-500 text-2xl mr-3" />
                  <div>
                    <h3 className="text-yellow-800 font-semibold">
                      Unable to Process Full Payment
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      Order Status: <strong>{poData.status}</strong> | Payment
                      Status: <strong>{poData.orderPayment.status}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Payment Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-main_dark flex items-center gap-2">
                    <FaFileInvoiceDollar className="text-web_yellow" />
                    Payment Details
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      poData.orderPayment.status
                    )}`}
                  >
                    {poData.orderPayment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Reference
                      </label>
                      <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                        {poData.orderPayment.referenceNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Type
                      </label>
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <FaCreditCard className="text-gray-400" />
                        {poData.orderPayment.paymentType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Details
                      </label>
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <FaBuilding className="text-gray-400" />
                        {poData.orderPayment.bankDetails || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Amount
                      </label>
                      <p className="text-lg font-semibold text-main_dark">
                        {formatCurrency(poData.orderPayment.amount)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Already Paid
                      </label>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(poData.orderPayment.paidAmount)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remaining Amount
                      </label>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(poData.orderPayment.remainingAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Payment Date
                      </label>
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        {formatDate(poData.orderPayment.paymentDate)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created Date
                      </label>
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-500" />
                        {formatDate(poData.orderPayment.createdDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {poData.orderPayment.notes && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Notes
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                      {poData.orderPayment.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Purchase Order Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                  <FaBox className="text-web_yellow" />
                  Purchase Order Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PO Number
                    </label>
                    <p className="text-sm font-mono bg-gray-50 px-3 py-2 rounded">
                      {poData.ponumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(poData.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        poData.status
                      )}`}
                    >
                      {poData.status}
                    </span>
                  </div>
                </div>

                {/* Supplier Information */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        Supplier Information
                      </div>
                      <div
                        onClick={() =>
                          navigate("/financial/supplier-details", {
                            state: { id: poData.supplier.supplier_id },
                          })
                        }
                        className="text-sm cursor-pointer bg-gray-300 hover:bg-gray-400 text-white px-2 py-1 rounded transition-all duration-500"
                      >
                        <p className="text-sm text-black cursor-pointer">
                          View all
                        </p>
                      </div>
                    </div>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {poData.supplier.company_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person
                      </label>
                      <p className="text-sm text-gray-900">
                        {poData.supplier.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier ID
                      </label>
                      <p className="text-sm text-gray-900 font-mono">
                        {poData.supplier.supplier_id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Account
                      </label>
                      <p className="text-sm text-gray-900">
                        {poData.supplier.bank_account_number || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {poData.supplier.bank_account_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {poData.supplier.bank_name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Materials */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Materials ({poData.materials?.length || 0} items)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700">
                            Material
                          </th>
                          <th className="px-4 py-2 text-center text-gray-700">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-center text-gray-700">
                            Unit Price
                          </th>
                          <th className="px-4 py-2 text-center text-gray-700">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {poData.materials?.map((material, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="px-4 py-2">
                              <div>
                                <p className="font-medium">
                                  {material.material.materialName}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {material.material.materialType}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center">
                              {material.quantity}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {formatCurrency(material.unitPrice)}
                            </td>
                            <td className="px-4 py-2 text-center font-medium">
                              {formatCurrency(material.cost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FaTruck className="text-gray-400" />
                    Delivery Information
                  </h3>
                  {poData.deliveries?.map((delivery, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded mb-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <p className="text-sm text-gray-900">
                            {delivery.location}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Required Date
                          </label>
                          <p className="text-sm text-gray-900">
                            {new Date(
                              delivery.requiredDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shipping Cost
                          </label>
                          <p className="text-sm text-gray-900">
                            {formatCurrency(delivery.shippingCost)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {poData.additionalInfo && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                      {poData.additionalInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Action Panel */}
            <div>
              <div className="bg-white border border-gray-200 rounded-lg sticky top-10">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-main_dark mb-4">
                    Full Payment
                  </h2>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Payment Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">
                          {formatCurrency(poData.subTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Already Paid:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(poData.orderPayment.paidAmount)}
                        </span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between">
                        <span className="font-medium text-red-600">
                          Amount Due:
                        </span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(poData.orderPayment.remainingAmount)}
                        </span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold text-main_dark">
                          {formatCurrency(poData.orderPayment.amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Conditional Rendering */}
                  {isReadyForFullPayment && (
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full px-4 py-3 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <FaCheck className="w-4 h-4" />
                        Complete Full Payment
                      </button>
                    </div>
                  )}

                  {isPaymentCompleted && (
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-2" />
                      <p className="text-green-800 font-semibold">
                        Payment Completed
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        This order has been fully paid
                      </p>
                    </div>
                  )}

                  {isPaymentPending && (
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <FaExclamationTriangle className="text-orange-500 text-3xl mx-auto mb-2" />
                      <p className="text-orange-800 font-semibold">
                        Advance Payment Required
                      </p>
                      <p className="text-orange-700 text-sm mt-1">
                        Please complete advance payment first
                      </p>
                    </div>
                  )}

                  {isOrderNotDelivered && !isPaymentPending && (
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <FaTruck className="text-blue-500 text-3xl mx-auto mb-2" />
                      <p className="text-blue-800 font-semibold">
                        Awaiting Delivery
                      </p>
                      <p className="text-blue-700 text-sm mt-1">
                        Status: {poData.status}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <FaEye className="w-4 h-4" />
                      View Documents
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <FaDownload className="w-4 h-4" />
                      Download Report
                    </button>
                  </div>

                  {/* Status History */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Status History
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Created</span>
                        <span className="text-gray-500">
                          {formatDate(poData.orderPayment.createdDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Order Status</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            poData.status
                          )}`}
                        >
                          {poData.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Status</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            poData.orderPayment.status
                          )}`}
                        >
                          {poData.orderPayment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-main_dark mb-4">
              Complete Full Payment
            </h3>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800 mb-2">
                You are about to complete the remaining payment for this order.
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Amount:</span>
                  <span className="font-semibold text-blue-900">
                    {formatCurrency(poData.orderPayment.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Already Paid:</span>
                  <span className="font-semibold text-green-700">
                    {formatCurrency(poData.orderPayment.paidAmount)}
                  </span>
                </div>
                <hr className="my-2 border-blue-200" />
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">
                    Amount to Pay:
                  </span>
                  <span className="font-bold text-red-600 text-lg">
                    {formatCurrency(poData.orderPayment.remainingAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Supplier Bank Details Display */}
            <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                <FaBuilding className="text-green-600" />
                Supplier Bank Account Details
              </h4>
              <div className="text-sm space-y-1 text-green-700">
                <div className="flex justify-between">
                  <span>Account Number:</span>
                  <span className="font-mono font-semibold">
                    {poData.supplier.bank_account_number || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Account Name:</span>
                  <span className="font-semibold">
                    {poData.supplier.bank_account_name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bank Name:</span>
                  <span className="font-semibold">
                    {poData.supplier.bank_name || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Details / Account Information{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  placeholder="Bank account details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-filled with supplier's bank account details
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Notes (Optional)
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Add any notes or comments about this payment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleFullPayment}
                disabled={!bankDetails.trim()}
                className={`flex-1 px-4 py-3 rounded-md text-white font-semibold transition-colors flex items-center justify-center gap-2 ${
                  !bankDetails.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-deep_green hover:bg-deep_green/90"
                }`}
              >
                <FaCheck className="w-4 h-4" />
                Confirm Payment
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentNotes("");
                  setBankDetails("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullPaymentCompletion;
