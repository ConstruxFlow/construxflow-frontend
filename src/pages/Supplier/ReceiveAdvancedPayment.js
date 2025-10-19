import React, { useState, useEffect } from "react";
import { FaRegCalendarAlt, FaArrowLeft, FaPrint } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import axios from "axios";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations" },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments", active: true },
];

const statusBadge = {
  "Pending": "bg-web_yellow text-main_dark",
  "Partially Paid": "bg-orange-100 text-orange-800",
  "Completed": "bg-deep_green text-purewhite",
};

const ReceiveAdvancedPayment = () => {
  const { ponumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [projectName, setProjectName] = useState('N/A');

  useEffect(() => {
    if (ponumber) {
      fetchPaymentDetails();
    }

    // Add print styles
    const style = document.createElement('style');
    style.textContent = `
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
        
        .bg-gray-200 {
          background-color: #f5f5f5 !important;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        
        .border {
          border: 1px solid #ddd !important;
        }
        
        .print-area::before {
          content: "PAYMENT RECEIPT";
          display: block;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #000;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [ponumber]);

  const fetchProjectName = async (projectId) => {
    if (!projectId) return 'N/A';
    
    try {
      const response = await axios.get(`http://localhost:8080/api/projects/${projectId}`);
      return response.data.projectName || response.data.project_name || 'N/A';
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error);
      return projectId;
    }
  };

  const fetchPaymentDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('=== FETCHING PAYMENT DETAILS ===');
      console.log('PO Number:', ponumber);

      const orderRes = await axios.get(`http://localhost:8080/api/purchasingorder/ponumber/${ponumber}`);
      const order = orderRes.data.data || orderRes.data;

      console.log('Order Data:', order);

      if (!order) {
        setError('Order not found');
        setLoading(false);
        return;
      }

      if (!order.order_payment && !order.orderPayment) {
        setError('No payment information available for this order');
        setLoading(false);
        return;
      }

      const projectId = order.projectId || order.project_id;
      if (projectId) {
        const fetchedProjectName = await fetchProjectName(projectId);
        setProjectName(fetchedProjectName);
        console.log('Project Name:', fetchedProjectName);
      }

      setOrderData(order);
    } catch (err) {
      console.error('Error fetching payment details:', err);
      setError('Failed to load payment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get payment details based on status
  const getPaymentDetails = () => {
    const payment = orderData.order_payment || orderData.orderPayment;
    const totalAmount = parseFloat(payment?.amount || 0);
    const paidAmount = parseFloat(payment?.paidAmount || payment?.paid_amount || 0);
    const remainingAmount = parseFloat(payment?.remainingAmount || payment?.remaining_amount || 0);
    const status = (payment?.Status || payment?.status || 'Pending').toLowerCase();

    if (status === 'pending') {
      return {
        status: 'Pending',
        statusDescription: 'No payment made yet',
        advanceAmount: 0,
        remainingAmount: totalAmount,
        isPaid: false,
        showAdvance: false
      };
    } else if (status === 'partially paid' || status === 'partial') {
      return {
        status: 'Partially Paid',
        statusDescription: 'Advanced payment received',
        advanceAmount: paidAmount,
        remainingAmount: remainingAmount,
        isPaid: false,
        showAdvance: true
      };
    } else if (status === 'completed') {
      return {
        status: 'Completed',
        statusDescription: 'Fully paid',
        advanceAmount: paidAmount,
        remainingAmount: 0,
        isPaid: true,
        showAdvance: true
      };
    }

    return {
      status: status,
      statusDescription: 'Unknown payment status',
      advanceAmount: paidAmount,
      remainingAmount: remainingAmount,
      isPaid: false,
      showAdvance: paidAmount > 0
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
            <button
              onClick={() => navigate('/supplier/payments')}
              className="px-4 py-2 bg-web_yellow text-main_dark rounded-lg hover:bg-web_yellow/90"
            >
              Back to Payments
            </button>
          </div>
        </div>
      </div>
    );
  }

  const payment = orderData.order_payment || orderData.orderPayment;
  
  // ✅ Use created_date instead of payment_date
  const paymentCreatedDate = payment?.created_date || payment?.createdDate
    ? formatDate(payment.created_date || payment.createdDate)
    : 'N/A';

  const paymentDetails = getPaymentDetails();
  
  // Get order date - handle both snake_case and camelCase
  const orderDate = formatDate(orderData.order_date || orderData.orderDate);

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-20 py-10">
        {/* Back Button - Hidden on print */}
        <button
          onClick={() => navigate('/supplier/payments')}
          className="flex items-center gap-2 text-deep_green hover:underline mb-4 no-print"
        >
          <FaArrowLeft /> Back to Payments
        </button>

        <h1 className="text-xl md:text-2xl font-bold text-main_dark mb-2 no-print">
          Payment Receipt
        </h1>
        <p className="text-gray-600 mb-8 no-print">
          View and print payment details for this purchase order
        </p>

        {/* Printable Area */}
        <div className="print-area">
          {/* Payment Summary Card */}
          <div className="bg-gray-200 rounded-xl p-4 sm:p-7 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-8">
            <div className="flex-1">
              <div className="mb-2">
                <span className="text-sm text-slatebluegray">Payment Reference</span>
                <div className="font-bold text-deep_green text-base">
                  {payment?.reference_number || payment?.referenceNumber || 'N/A'}
                </div>
              </div>
              <div className="mb-2">
                <span className="text-sm text-slatebluegray">Order ID</span>
                <div className="font-bold text-main_dark">{orderData.ponumber}</div>
              </div>
              <div className="mb-2">
                <span className="text-sm text-slatebluegray">Project Name</span>
                <div className="font-bold text-deep_green">{projectName}</div>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaRegCalendarAlt className="text-slatebluegray" />
                <span className="text-sm text-slatebluegray">Order Date</span>
                <span className="font-medium text-main_dark ml-2">{orderDate}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaRegCalendarAlt className="text-slatebluegray" />
                <span className="text-sm text-slatebluegray">Payment Created</span>
                <span className="font-medium text-main_dark ml-2">{paymentCreatedDate}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-slatebluegray">Supplier</span>
                <div className="font-medium text-main_dark">
                  {orderData.supplier?.name || orderData.supplier?.company_name || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end min-w-[220px]">
              <div className="text-sm text-slatebluegray mb-1">Total Amount</div>
              <div className="text-3xl font-extrabold text-yellow-500 mb-2">
                RS {payment?.amount 
                  ? parseFloat(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })
                  : '0.00'}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusBadge[paymentDetails.status] || 'bg-gray-100 text-gray-800'
              }`}>
                {paymentDetails.status}
              </span>
              <div className="text-xs text-gray-600 mt-1">{paymentDetails.statusDescription}</div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-purewhite border border-light_gray rounded-xl p-4 sm:p-6 mb-6">
            <div className="font-semibold text-main_dark mb-3">Payment Breakdown</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-slatebluegray">Total Amount</div>
                <div className="font-bold text-main_dark text-lg">
                  RS {payment?.amount 
                    ? parseFloat(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })
                    : '0.00'}
                </div>
              </div>
              
              {paymentDetails.showAdvance && (
                <div>
                  <div className="text-slatebluegray">Advanced Amount Paid</div>
                  <div className="font-bold text-deep_green text-lg">
                    RS {paymentDetails.advanceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((paymentDetails.advanceAmount / parseFloat(payment?.amount || 1)) * 100).toFixed(0)}% paid
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-slatebluegray">Remaining Amount</div>
                <div className={`font-bold text-lg ${
                  paymentDetails.remainingAmount > 0 ? 'text-orange-600' : 'text-deep_green'
                }`}>
                  RS {paymentDetails.remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                {paymentDetails.remainingAmount === 0 && (
                  <div className="text-xs text-deep_green mt-1">✓ Fully Paid</div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-purewhite border border-light_gray rounded-xl p-4 sm:p-6 mb-6">
            <div className="font-semibold text-main_dark mb-3">Payment Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-main_dark text-sm">
              <div>
                <div className="text-slatebluegray">Bank Details</div>
                <div className="font-medium">
                  {payment?.bank_details || payment?.bankDetails || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-slatebluegray">Payment Type</div>
                <div className="font-medium">
                  {payment?.payment_type || payment?.paymentType || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-slatebluegray">Reference Number</div>
                <div className="font-medium">
                  {payment?.reference_number || payment?.referenceNumber || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-slatebluegray">Payment Created</div>
                <div className="font-medium">{paymentCreatedDate}</div>
              </div>
            </div>
          </div>

          {/* Payment Notes */}
          {payment?.notes && (
            <div className="bg-light_gray rounded-xl p-4 sm:p-6 mb-6">
              <div className="font-semibold text-main_dark mb-2">Payment Notes</div>
              <div className="text-main_dark text-sm">{payment.notes}</div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-purewhite border border-light_gray rounded-xl p-4 sm:p-6 mb-8">
            <div className="font-semibold text-main_dark mb-3">Order Summary</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slatebluegray">Order Date</div>
                <div className="font-medium text-main_dark">{orderDate}</div>
              </div>
              <div>
                <div className="text-slatebluegray">Order Status</div>
                <div className="font-medium text-main_dark">{orderData.status || 'N/A'}</div>
              </div>
              <div>
                <div className="text-slatebluegray">Total Order Value</div>
                <div className="font-bold text-main_dark">
                  RS {orderData.subTotal 
                    ? parseFloat(orderData.subTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })
                    : '0.00'}
                </div>
              </div>
              <div>
                <div className="text-slatebluegray">Number of Materials</div>
                <div className="font-medium text-main_dark">
                  {orderData.materials?.length || 0} items
                </div>
              </div>
            </div>
          </div>

          {/* Print Footer */}
          <div style={{ display: 'none' }} className="print-only mt-8 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-600 text-center">
              This is a computer-generated receipt. No signature required.
            </p>
            <p className="text-xs text-gray-600 text-center mt-2">
              Generated on: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Print Receipt Button - Hidden on print */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 no-print">
          <button 
            onClick={handlePrintReceipt}
            className="bg-web_yellow text-main_dark font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow hover:opacity-90 transition text-base sm:text-lg flex items-center gap-2"
          >
            <FaPrint className="w-5 h-5" />
            Print Receipt
          </button>
          <button 
            onClick={() => navigate('/supplier/payments')}
            className="text-deep_green hover:underline text-sm font-medium"
          >
            Back to Payments List
          </button>
        </div>
      </div>

      {/* Footer - Hidden on print */}
      <footer className="bg-main_dark text-purewhite px-4 sm:px-8 py-8 mt-10 no-print">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-bold mb-2 flex items-center gap-2">
              <span className="bg-web_yellow w-6 h-6 rounded flex items-center justify-center text-main_dark font-bold text-lg">C</span>
              ConstruxFlow
            </div>
            <div className="text-light_gray">Streamlining construction supply chain management.</div>
          </div>
          <div>
            <div className="font-semibold mb-2">Platform</div>
            <div className="text-light_gray space-y-1">
              <div>Dashboard</div>
              <div>Orders</div>
              <div>Payments</div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Support</div>
            <div className="text-light_gray space-y-1">
              <div>Help Center</div>
              <div>Contact Us</div>
              <div>Documentation</div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Legal</div>
            <div className="text-light_gray space-y-1">
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-light_gray mt-8">
          © 2025 ConstruxFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ReceiveAdvancedPayment;
