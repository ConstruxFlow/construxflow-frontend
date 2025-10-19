import React, { useState, useEffect } from "react";
import {
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaUpload,
  FaDownload,
  FaPrint,
  FaEnvelope,
  FaInfoCircle,
  FaCreditCard,
} from "react-icons/fa";
import { MdPayment, MdCloudUpload } from "react-icons/md";
import { IoMdCheckmarkCircle, IoMdTime } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../../components/NavBar";

const PayRemainingBalance = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [orderData1, setOrderData] = useState(null);

  // Order and payment data
  const [orderData] = useState({
    purchaseOrderId: "PO-2024-0158",
    projectName: "Metro Plaza Construction",
    supplier: "BuildMart Supplies Ltd.",
    orderDate: "March 15, 2024",
    totalAmount: 45750.0,
    advancePaid: 18300.0,
    remainingBalance: 27450.0,
    paymentDueDate: "April 5, 2024",
    advancePaymentDate: "March 16, 2024",
    advanceReference: "TXN-2024-0892",
  });

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
  console.log("Order Data:", orderData1);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: "Bank Transfer",
    paymentReference: "",
    paymentDate: "",
    notes: "",
  });

  const handleInputChange = (field, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handlePayNow = async () => {
    if (!paymentDetails.paymentDate) {
      toast.error("Please select payment date");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Payment processed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error("Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    toast.info("Email feature will be implemented");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header Navigation */}
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

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <button
              onClick={() => navigate("/orders")}
              className="hover:text-blue-600"
            >
              Orders
            </button>
            <span>›</span>
            <button
              onClick={() => navigate(`/orders/${id}`)}
              className="hover:text-blue-600"
            >
              Order Details
            </button>
            <span>›</span>
            <span className="text-gray-900">Payment</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Pay Remaining Balance
              </h1>
              <p className="text-gray-600">
                Complete payment for Purchase Order #{orderData1?.ponumber}
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                <IoMdTime className="w-4 h-4 mr-1" />
                Pending Payment
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order & Payment Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order & Payment Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">
                          Purchase Order ID
                        </span>
                        <p className="font-medium text-gray-900">
                          {orderData1?.ponumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Supplier</span>
                        <p className="font-medium text-gray-900">
                          {orderData1?.supplier?.company_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">
                          Project Name
                        </span>
                        <p className="font-medium text-gray-900">
                          {orderData.projectName}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Order Date
                        </span>
                        <p className="font-medium text-gray-900">
                          {orderData1?.orderDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Breakdown
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Order Amount</span>
                    <span className="font-semibold text-gray-900">
                      RS {orderData1?.orderPayment?.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-600">Advance Paid</span>
                      <p className="text-xs text-gray-500">
                        Paid on {orderData1?.orderPayment?.paidDate} | Ref:{" "}
                        {orderData1?.orderPayment?.referenceNumber}
                      </p>
                    </div>
                    <span className="font-medium text-green-600">
                      -RS{" "}
                      {orderData1?.orderPayment?.paidAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        Remaining Balance
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        RS{" "}
                        {orderData1?.orderPayment?.remainingAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                    <FaInfoCircle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Payment due within 14 days of delivery (Due:{" "}
                      {orderData.paymentDueDate})
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">
                          Payment Method
                        </span>
                        <p className="font-medium text-gray-900">
                          {orderData1?.orderPayment.paymentType}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Payment Status
                        </span>
                        <p className="font-medium">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              orderData1?.orderPayment.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : orderData1?.orderPayment.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {orderData1?.orderPayment.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Reference Number
                        </span>
                        <p className="font-medium text-gray-900">
                          {orderData1?.orderPayment.referenceNumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Payment ID
                        </span>
                        <p className="font-medium text-gray-900">
                          #{orderData1?.orderPayment.paymentId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">
                          Payment Date
                        </span>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            orderData1?.orderPayment.paymentDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Purchase Order
                        </span>
                        <p className="font-medium text-gray-900">
                          {orderData1?.ponumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Bank Details
                        </span>
                        <div className="font-medium text-gray-900">
                          <p className="font-semibold">
                            {orderData1?.supplier?.bank_account_name}
                          </p>
                          <p className="text-sm">
                            Account: {orderData1?.supplier?.bank_account_number}
                          </p>
                          <p className="text-sm">
                            Bank: {orderData1?.supplier?.bank_name}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Created Date
                        </span>
                        <p className="font-medium text-gray-900">
                          {new Date(
                            orderData1?.orderPayment.createdDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes section - full width if exists */}
                {orderData1?.orderPayment.notes && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div>
                      <span className="text-sm text-gray-500">Notes</span>
                      <p className="font-medium text-gray-900 mt-1">
                        {orderData1?.orderPayment.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Timeline
                </h3>

                <div className="space-y-4">
                  {/* Advance Paid */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <IoMdCheckmarkCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">
                          Advance Paid
                        </p>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {orderData.advancePaymentDate}
                      </p>
                    </div>
                  </div>

                  {/* Remaining Due */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <IoMdTime className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">
                          Remaining Due
                        </p>
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Current Status</p>
                    </div>
                  </div>

                  {/* Fully Paid */}
                  <div className="flex items-start opacity-50">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-500">Fully Paid</p>
                      <p className="text-sm text-gray-400">Awaiting Payment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Action */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handlePrint}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FaPrint className="w-4 h-4 mr-1" />
                    Print
                  </button>
                  <button
                    onClick={handleEmail}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FaEnvelope className="w-4 h-4 mr-1" />
                    Email
                  </button>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Terms
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Balance due within 14 days
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Late fee: 2% after due date
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Early payment discount: 1%
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

export default PayRemainingBalance;
