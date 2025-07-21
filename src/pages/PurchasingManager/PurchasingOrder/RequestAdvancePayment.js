import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaFileInvoice,
  FaCreditCard,
} from "react-icons/fa";
import NavBar from "../../../components/NavBar";
// import { useFormValidation } from "./functions/UseformValidation";
import { toast } from "react-toastify";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useLocation, useNavigate } from "react-router-dom";

const RequestAdvancePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData, quotationId } = location.state || {};
  const [orderDetails, setOrderDetails] = useState(null);
  const [quotationData, setQuotationData] = useState(null);
  useEffect(() => {
    setOrderDetails(orderData);
  }, [orderData]);
  
  const [paymentRequest, setPaymentRequest] = useState({
    requestId: "#ADV-2024-001",
    orderReference: "",
    orderDate: "",
    totalOrderValue: "",
    requestedAmount: "",
    reason: "",
    additionalDetails: "",
    supportingDocs: [],
  });
  console.log(quotationId);

  const fetchQuotation = async () => {
      if (!quotationId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/quotations/find/${quotationId}`
        );
        const data = await response.json();
  
        if (response.ok) {
          setQuotationData(data);
          setPaymentRequest((prev) => ({
            ...prev,
            requestedAmount:data.advancedPayment || "",
          }));
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
      if (quotationId) {
        fetchQuotation();
      }
    }, [quotationId]);

    console.log(quotationData);
    



  useEffect(() => {
    if (orderDetails) {
      setPaymentRequest((prev) => ({
        ...prev,
        orderReference: orderDetails.ponumber,
        orderDate: orderDetails.order_date,
        totalOrderValue: orderDetails.subTotal,
      }));
    }
  }, [orderDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentRequest(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculatePendingBalance = () => {
    const total = parseFloat(paymentRequest.totalOrderValue) || 0;
    const paid = parseFloat(paymentRequest.requestedAmount) || 0;
    return total - paid;
  };

  const calculateCompletionPercentage = () => {
    const total = parseFloat(paymentRequest.totalOrderValue) || 0;
    const paid = parseFloat(paymentRequest.requestedAmount) || 0;
    if (total === 0) return 0;
    return (paid / total) * 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      setLoadingProgress(30);
      
      const submitData = {
        ...orderData,
        order_payment:{
            "amount": paymentRequest.totalOrderValue,
            "paid_amount": paymentRequest.requestedAmount,
            "remaining_amount": calculatePendingBalance(),
            "payment_type": "Bank Transfer",
            "status": "Pending",
            "reference_number": paymentRequest.orderReference + "-ADV",
            "notes": paymentRequest.additionalDetails,
            "bank_details": "Account: 1234567890, Bank: ABC Bank"
        }
      };
        console.log("Submit Data:", submitData);
      setLoadingProgress(60);

      const response = await fetch("http://localhost:8080/api/purchasingorder/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      setLoadingProgress(90);

      if (response.ok) {
        setLoadingProgress(100);
        setTimeout(() => {
          toast.success("Advance payment request submitted successfully!");
          setIsLoading(false);
          setLoadingProgress(0);
          navigate("/purchasing/orders/overview");
        }, 800);
      } else {
        throw new Error("Failed to submit advance payment request");
      }
    } catch (error) {
      toast.error("Failed to submit request: " + error.message);
      setIsLoading(false);
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
      profileURL="/purchasing/profile"
        links={[
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
        ]}
      />

      {isLoading && (
        <LoadingOverlay
          progress={loadingProgress}
          message="Submitting advance payment request..."
        />
      )}

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
              <h1 className="text-2xl font-bold text-main_dark">Request Advance Payment</h1>
              <p className="text-gray-600 text-sm">
                Submit a request for advance payment on your order
              </p>
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Request ID: </span>
              <span className="font-bold text-main_dark">{paymentRequest.requestId}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Request Details */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-web_yellow/20 rounded-lg">
                    <FaCreditCard className="w-5 h-5 text-web_yellow" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-main_dark">Payment Request Details</h2>
                    <p className="text-sm text-gray-600">Fill in the required information for your advance payment</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Reference
                    </label>
                    <input
                      type="text"
                      name="orderReference"
                      value={paymentRequest.orderReference}
                      onChange={handleChange}
                      placeholder="ORD-2024-5678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Date
                    </label>
                    <input
                      type="date"
                      name="orderDate"
                      value={paymentRequest.orderDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Order Value
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="totalOrderValue"
                      value={paymentRequest.totalOrderValue}
                      onChange={handleChange}
                      placeholder="25000.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Advances
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="previousAdvances"
                      value={paymentRequest.previousAdvances}
                      onChange={handleChange}
                      placeholder="5000.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div> */}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Advance Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="requestedAmount"
                      value={paymentRequest.requestedAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Advance Payment *
                  </label>
                  <select
                    name="reason"
                    value={paymentRequest.reason}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                  >
                    <option value="">Select a reason</option>
                    <option value="Material Purchase">Material Purchase</option>
                    <option value="Equipment Rental">Equipment Rental</option>
                    <option value="Labor Costs">Labor Costs</option>
                    <option value="Urgent Procurement">Urgent Procurement</option>
                    <option value="Cash Flow Management">Cash Flow Management</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    name="additionalDetails"
                    value={paymentRequest.additionalDetails}
                    onChange={handleChange}
                    placeholder="Provide additional context for your advance payment request..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                  />
                </div>
              </div>

              {/* Supporting Documents */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Supporting Documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-web_yellow transition-colors cursor-pointer">
                  <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
                  <button className="px-4 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors">
                    Choose Files
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-semibold"
                >
                  Submit Request
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Save Draft
                </button>
              </div>
            </div>

            {/* Right Column - Payment Status & Workflow */}
            <div className="space-y-6">
              {/* Payment Status */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Payment Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Order Value</span>
                    <span className="font-medium text-main_dark">
                      ${parseFloat(paymentRequest.totalOrderValue || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Advance Amount</span>
                    <span className="font-medium text-main_dark">
                      ${parseFloat(paymentRequest.requestedAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Balance</span>
                    <span className="font-bold text-web_yellow">
                      ${calculatePendingBalance().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {calculateCompletionPercentage().toFixed(0)}% completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-deep_green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateCompletionPercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Workflow */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Approval Workflow</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <FaUser className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-main_dark">Request Submitted</p>
                      <p className="text-sm text-gray-600">Pending submission</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <FaClock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">Manager Review</p>
                      <p className="text-sm text-gray-400">2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <FaCheckCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">Finance Approval</p>
                      <p className="text-sm text-gray-400">1-2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <FaFileInvoice className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">Payment Processing</p>
                      <p className="text-sm text-gray-400">1-3 business days</p>
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

export default RequestAdvancePayment;
