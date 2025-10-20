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
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import NavBar from "../../components/NavBar";

const AdvancePaymentApproval = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {};
  const poId = useParams().poId;

  const [poData, setPoData] = useState(orderData || null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");

  // Payment Gateway modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState("1234567890"); // autofill value
  const [bankName, setBankName] = useState("ABC Bank"); // autofill value
  const [accountName, setAccountName] = useState(poData?.supplier?.company_name || "Company Name"); // autofill from company
  const [paymentError, setPaymentError] = useState(null);

  console.log("PO Data:", poData?.poId);

  const fetchPOData = async (poId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/purchasingorder/ponumber/${poId}`
      );
      const data = await response.json();
      if (response.ok) {
        setPoData(data.data);
        // Update autofill accountName if poData updated
        setAccountName(data.data.supplier.company_name || "Company Name");
        console.log(data);
      } else {
        toast.error("Failed to fetch purchase order details");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poId]);

  const handleApprovalAction = async (action) => {
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

      const updateData = {
        status1: action === "approve" ? "Partially Paid" : "Rejected",
        status2: action === "approve" ? "Approved" : "Rejected",
      };

      setLoadingProgress(60);

      const response = await fetch(
        `http://localhost:8080/api/purchasingorder/${poData?.poId}/update-status?orderStatus=${updateData.status2}&paymentStatus=${updateData.status1}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoadingProgress(90);

      if (response.ok) {
        setLoadingProgress(100);
        setShowPaymentModal(false);
        setTimeout(() => {
          toast.success(
            `Payment ${
              action === "approve" ? "Partially Paid" : "Rejected"
            } successfully!`
          );
          setIsLoading(false);
          setLoadingProgress(0);
          setShowApprovalModal(false);
          setApprovalNotes("");
          // Update local state
          setPoData((prev) => ({
            ...prev,
            orderPayment: {
              ...prev.orderPayment,
              status: updateData.status2,
              // Notes updated with approvalNotes from modal
              notes: approvalNotes,
            },
          }));
        }, 800);
      } else {
        throw new Error(`Failed to ${action} payment`);
      }
    } catch (error) {
      setShowPaymentModal(true);
      toast.error(`Failed to ${action} payment: ` + error.message);
      setIsLoading(false);
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "partially paid":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
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
            No Purchase Order Data
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {isLoading && <LoadingOverlay progress={loadingProgress} />}

      <NavBar
        profileURL="/financial/profile"
        links={[
          { name: 'Dashboard', path: '/financial/dashboard' },
          { name: 'Payment Approvals', path: '/financial/payment-list' },
          { name: 'Purchase Orders', path: '/financial/purchase-order-list' },
          { name: 'Projects', path: '/financial/financial-projects' },
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
                Advance Payment Approval
              </h1>
              <p className="text-gray-600 text-sm">
                Review and approve advance payment for Purchase Order {poData.ponumber}
              </p>
            </div>
          </div>

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
                        {poData.orderPayment.referenceNumber}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Type
                      </label>
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <FaCreditCard className="text-gray-400" />
                        {poData.orderPayment.paymentType}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Details
                      </label>
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <FaBuilding className="text-gray-400" />
                        {poData.orderPayment.bankDetails}
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
                        Advance Payment
                      </label>
                      <p className="text-lg font-semibold text-web_yellow">
                        {formatCurrency(poData.orderPayment.paidAmount)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remaining Amount
                      </label>
                      <p className="text-lg font-semibold text-slatebluegray">
                        {formatCurrency(poData.orderPayment.remainingAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Date
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
                      PO Status
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
                        <p className="text-sm text-black cursor-pointer">View all</p>
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
                      <p className="text-sm text-gray-900">{poData.supplier.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier ID
                      </label>
                      <p className="text-sm text-gray-900 font-mono">
                        {poData.supplier.supplier_id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Materials */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Materials ({poData.materials.length} items)
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
                        {poData.materials.map((material, index) => (
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
                            <td className="px-4 py-2 text-center">{material.quantity}</td>
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
                  {poData.deliveries.map((delivery, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded mb-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <p className="text-sm text-gray-900">{delivery.location}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Required Date
                          </label>
                          <p className="text-sm text-gray-900">
                            {new Date(delivery.requiredDate).toLocaleDateString()}
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
                    Payment Approval
                  </h2>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-700 mb-3">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(poData.subTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advance Payment:</span>
                        <span className="font-medium text-web_yellow">
                          {formatCurrency(poData.orderPayment.paidAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-medium text-red-600">
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

                  {/* Action Buttons */}
                  {poData.orderPayment.status === "Pending" && (
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full px-4 py-3 bg-blue-600 text-purewhite rounded-md hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <FaCreditCard className="w-4 h-4" />
                        Make Payment
                      </button>
                    </div>
                  )}

                  {poData.orderPayment.status === "Pending" && (
                    <div className="space-y-3 mt-3">
                      {/* <button
                        onClick={() => {
                          setApprovalAction("approve");
                          setShowApprovalModal(true);
                        }}
                        className="w-full px-4 py-3 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <FaCheck className="w-4 h-4" />
                        Approve Payment
                      </button> */}
                      <button
                        onClick={() => {
                          setApprovalAction("reject");
                          setShowApprovalModal(true);
                        }}
                        className="w-full px-4 py-2  text-purewhite rounded-md bg-[#B85450] hover:bg-[#A0524E] transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <FaTimes className="w-4 h-4" />
                        Reject Payment
                      </button>
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
                    <h3 className="font-medium text-gray-700 mb-3">Status History</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Created</span>
                        <span className="text-gray-500">
                          {formatDate(poData.orderPayment.createdDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Status</span>
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

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-main_dark mb-4">
              {approvalAction === "approve" ? "Approve Payment" : "Reject Payment"}
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to {approvalAction} this advance payment of{" "}
              {formatCurrency(poData.orderPayment.paidAmount)}?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any notes or comments..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleApprovalAction(approvalAction)}
                className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  approvalAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {approvalAction === "approve" ? "Approve" : "Reject"}
              </button>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalNotes("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-main_dark mb-4">Make Payment</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                placeholder="1234567890"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                placeholder="ABC Bank"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                placeholder="Company Name"
              />
            </div>

            {paymentError && (
              <p className="text-red-600 mb-3">{paymentError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleApprovalAction("approve")}
                className="flex-1 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
              >
                Pay Now
              </button>

              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentError(null);
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

export default AdvancePaymentApproval;
