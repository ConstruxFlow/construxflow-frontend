import React, { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaCalendarAlt, FaUpload, FaDownload, FaPrint, FaEnvelope, FaInfoCircle, FaCreditCard } from "react-icons/fa";
import { MdPayment, MdCloudUpload } from "react-icons/md";
import { IoMdCheckmarkCircle, IoMdTime } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../../components/NavBar';

const PayRemainingBalance = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Order and payment data
  const [orderData] = useState({
    purchaseOrderId: 'PO-2024-0158',
    projectName: 'Metro Plaza Construction',
    supplier: 'BuildMart Supplies Ltd.',
    orderDate: 'March 15, 2024',
    totalAmount: 45750.00,
    advancePaid: 18300.00,
    remainingBalance: 27450.00,
    paymentDueDate: 'April 5, 2024',
    advancePaymentDate: 'March 16, 2024',
    advanceReference: 'TXN-2024-0892'
  });

  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: 'Bank Transfer',
    paymentReference: '',
    paymentDate: '',
    notes: ''
  });

  const handleInputChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handlePayNow = async () => {
    if (!paymentDetails.paymentDate) {
      toast.error('Please select payment date');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Payment processed successfully');
      navigate('/orders');
    } catch (error) {
      toast.error('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    toast.info('Email feature will be implemented');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Header Navigation */}
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

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <button onClick={() => navigate('/orders')} className="hover:text-blue-600">
              Orders
            </button>
            <span>›</span>
            <button onClick={() => navigate(`/orders/${orderId}`)} className="hover:text-blue-600">
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
                Complete payment for Purchase Order #{orderData.purchaseOrderId}
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
                        <span className="text-sm text-gray-500">Purchase Order ID</span>
                        <p className="font-medium text-gray-900">{orderData.purchaseOrderId}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Supplier</span>
                        <p className="font-medium text-gray-900">{orderData.supplier}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Project Name</span>
                        <p className="font-medium text-gray-900">{orderData.projectName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Order Date</span>
                        <p className="font-medium text-gray-900">{orderData.orderDate}</p>
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
                      RS {orderData.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-600">Advance Paid</span>
                      <p className="text-xs text-gray-500">
                        Paid on {orderData.advancePaymentDate} | Ref: {orderData.advanceReference}
                      </p>
                    </div>
                    <span className="font-medium text-green-600">
                      -RS {orderData.advancePaid.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Remaining Balance</span>
                      <span className="text-2xl font-bold text-gray-900">
                        RS {orderData.remainingBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                    <FaInfoCircle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Payment due within 14 days of delivery (Due: {orderData.paymentDueDate})
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Details
                </h2>

                <div className="space-y-6">
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentDetails.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Check">Check</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Wire Transfer">Wire Transfer</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Reference */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Reference
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.paymentReference}
                        onChange={(e) => handleInputChange('paymentReference', e.target.value)}
                        placeholder="Enter reference number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Payment Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        value={paymentDetails.paymentDate}
                        onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={paymentDetails.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Add any payment notes..."
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice & Documentation */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Invoice & Documentation
                </h2>

                {/* Invoice Download */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center">
                    <FaFileInvoiceDollar className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Final Invoice - INV-2024-0158</p>
                      <p className="text-sm text-gray-500">Generated on March 22, 2024</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    <FaDownload className="w-4 h-4" />
                  </button>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <MdCloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload payment confirmation documents
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload receipts, bank confirmations, or other payment proof
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <FaUpload className="w-4 h-4 mr-2" />
                    Browse Files
                  </label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</p>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <button
                            onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
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
                        <p className="font-medium text-gray-900">Advance Paid</p>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{orderData.advancePaymentDate}</p>
                    </div>
                  </div>

                  {/* Remaining Due */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <IoMdTime className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">Remaining Due</p>
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
                <button
                  onClick={handlePayNow}
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <MdPayment className="w-5 h-5 mr-2" />
                  {loading ? 'Processing...' : `Pay Now - RS ${orderData.remainingBalance.toLocaleString()}`}
                </button>

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
