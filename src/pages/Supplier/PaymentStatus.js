import React, { useState, useEffect, useContext } from "react";
import {
  FaEye,
  FaRegCheckCircle,
  FaFileInvoice,
  FaProjectDiagram,
  FaMoneyBill,
  FaCalendarCheck,
} from "react-icons/fa";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import {
  HiCheckCircle,
  HiExclamationTriangle,
  HiOutlineClock,
} from "react-icons/hi2";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations" },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments", active: true },
];

const statusBadge = {
  "Completed": "bg-deep_green text-purewhite",
  "Partially Paid": "bg-orange-100 text-orange-800",
  "Pending": "bg-web_yellow text-main_dark",
  "Overdue": "bg-red-100 text-red-800",
};

const notificationStyle = {
  success: "border-l-4 border-deep_green bg-green-50",
  error: "border-l-4 border-red-500 bg-red-50", 
  warning: "border-l-4 border-web_yellow bg-yellow-50",
};

const notificationIcon = {
  success: (
    <HiCheckCircle className="w-6 h-6 text-deep_green mr-4 mt-1 flex-shrink-0" />
  ),
  error: (
    <HiExclamationTriangle className="w-6 h-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
  ),
  warning: (
    <HiOutlineClock className="w-6 h-6 text-web_yellow mr-4 mt-1 flex-shrink-0" />
  ),
};

const PaymentStatus = () => {
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const supplierId = authState?.user?.supplierId;

  useEffect(() => {
    if (!supplierId) {
      setError("Supplier ID not found");
      setLoading(false);
      return;
    }
    fetchPayments();
  }, [supplierId]);

  // Helper function to fetch project name by ID
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

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('=== FETCHING PAYMENT DATA ===');
      console.log('Supplier ID:', supplierId);

      const ordersRes = await axios.get(`http://localhost:8080/api/purchasingorder/all`);
      const allOrders = ordersRes.data.data || [];

      console.log('All Orders:', allOrders.length);

      const supplierOrders = allOrders.filter(order => {
        const orderSupplierId = order.supplier?.supplierId || order.supplier?.supplier_id;
        return String(orderSupplierId).trim() === String(supplierId).trim();
      }).filter(order => order.orderPayment || order.order_payment);

      console.log('Supplier Orders with Payments:', supplierOrders.length);

      const paymentsWithProjects = await Promise.all(
        supplierOrders.map(async (order) => {
          const payment = order.orderPayment || order.order_payment;
          
          const projectId = order.projectId || 
                           order.project_id || 
                           order.project?.projectId ||
                           order.project?.project_id;
          
          const projectName = projectId 
            ? await fetchProjectName(projectId)
            : 'N/A';

          return {
            po: order.ponumber || 'N/A',
            invoice: payment.reference_number || payment.referenceNumber || `INV-${order.po_id || order.poId}`,
            project: projectName,
            amount: parseFloat(payment.amount || 0),
            paidAmount: parseFloat(payment.paidAmount || payment.paid_amount || 0),
            remainingAmount: parseFloat(payment.remainingAmount || payment.remaining_amount || 0),
            date: payment.payment_date 
              ? new Date(payment.payment_date).toLocaleDateString('en-US')
              : '--',
            status: payment.Status || payment.status || 'Pending',
            paymentType: payment.payment_type || payment.paymentType || 'N/A',
            bankDetails: payment.bank_details || 'N/A',
            notes: payment.notes || '',
            createdDate: payment.created_date,
            poId: order.po_id || order.poId
          };
        })
      );

      console.log('Supplier Payments with Project Names:', paymentsWithProjects.length);
      setPayments(paymentsWithProjects);
      generateNotifications(paymentsWithProjects);

    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (paymentsData) => {
    const notifs = [];

    const recentCompleted = paymentsData
      .filter(p => p.status?.toLowerCase() === 'completed')
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
      .slice(0, 1);

    if (recentCompleted.length > 0) {
      notifs.push({
        type: 'success',
        message: `Payment received for ${recentCompleted[0].po}`,
        time: getRelativeTime(recentCompleted[0].createdDate)
      });
    }

    const overdue = paymentsData.filter(p => p.status?.toLowerCase() === 'overdue');
    if (overdue.length > 0) {
      notifs.push({
        type: 'error',
        message: `${overdue.length} payment${overdue.length > 1 ? 's' : ''} overdue`,
        time: 'Requires attention'
      });
    }

    const partial = paymentsData
      .filter(p => p.status?.toLowerCase() === 'partially paid')
      .slice(0, 1);

    if (partial.length > 0) {
      notifs.push({
        type: 'warning',
        message: `Partial payment received for ${partial[0].po}`,
        time: getRelativeTime(partial[0].createdDate)
      });
    }

    setNotifications(notifs);
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Filter logic - removed date filter
  const filtered = payments.filter(
    (p) =>
      (status === "All Status" || p.status === status) &&
      (search === "" ||
        p.po.toLowerCase().includes(search.toLowerCase()) ||
        p.invoice.toLowerCase().includes(search.toLowerCase()) ||
        p.project.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleViewClick = (paymentStatus, poNumber) => {
    navigate(`/supplier/payments/receive-advanced/${poNumber}`);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("All Status");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchPayments}
              className="px-4 py-2 bg-web_yellow text-main_dark rounded-lg hover:bg-web_yellow/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <h1 className="text-2xl font-bold text-main_dark mb-1">
          Monitor Payment Status
        </h1>
        <p className="text-gray-600 text-base mb-8">
          Track and manage payment details for all purchasing orders
        </p>

        {/* Search and Filter */}
        <div className="bg-purewhite rounded-xl border border-light_gray p-4 sm:p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by PO ID, Invoice Number, or Project..."
              className="flex-1 text-sm border border-light_gray rounded-lg px-5 py-2 text-main_dark bg-purewhite focus:outline-none focus:ring-2 focus:ring-web_yellow"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-48 text-sm border border-light_gray rounded-lg px-4 py-2 bg-purewhite text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Partially Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
            
            {/* Clear Filters Button */}
            {(search || status !== "All Status") && (
              <button
                onClick={clearFilters}
                className="text-sm text-deep_green hover:text-deep_green/80 font-medium underline whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filtered.length} of {payments.length} payment{payments.length !== 1 ? 's' : ''}
        </div>

        {/* Payment Table */}
        <div className="rounded-lg border border-light_gray overflow-hidden mb-10">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-light_brown/35">
                  <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                    PO ID
                  </th>
                  <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                    <span className="flex items-center gap-2">
                      <FaFileInvoice className="inline mb-0.5" /> Invoice #
                    </span>
                  </th>
                  <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                    <span className="flex items-center gap-2">
                      <FaProjectDiagram className="inline mb-0.5" /> Project
                    </span>
                  </th>
                  <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                    <span className="flex items-center gap-2">
                      <FaMoneyBill className="inline mb-0.5" /> Amount
                    </span>
                  </th>
                  <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                    <span className="flex items-center gap-2">
                      <FaCalendarCheck className="inline mb-0.5" /> Payment Type
                    </span>
                  </th>
                  <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                    <span className="flex items-center gap-2">
                      <FaRegCheckCircle className="inline mb-0.5" /> Status
                    </span>
                  </th>
                  <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light_gray">
                {paginatedPayments.length > 0 ? (
                  paginatedPayments.map((p, idx) => (
                    <tr key={idx} className="bg-purewhite hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-medium">{p.po}</td>
                      <td className="px-5 py-4 text-sm">{p.invoice}</td>
                      <td className="px-5 py-4 text-sm">{p.project}</td>
                      <td className="px-5 py-4 font-bold text-sm">
                        RS {p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 text-sm">{p.paymentType}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusBadge[p.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 flex gap-2">
                        <button
                          onClick={() => handleViewClick(p.status, p.po)}
                          className="p-2 text-deep_green hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-8 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-light_gray">
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((p, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-main_dark text-sm">{p.po}</h3>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="font-semibold text-main_dark text-sm">{p.invoice}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Project: {p.project}</p>
                      <div className="text-xs text-gray-500">
                        Payment Type: {p.paymentType}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusBadge[p.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <p><span className="font-medium">Amount:</span> RS {p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleViewClick(p.status, p.po)}
                      className="text-deep_green hover:text-deep_green/80 transition-colors"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No payments found
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-light_gray">
              <div className="text-sm text-slatebluegray mb-2 sm:mb-0">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} results
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 text-sm ${
                      currentPage === page + 1
                        ? "bg-web_yellow text-main_dark rounded font-medium"
                        : "text-slatebluegray hover:bg-gray-100 rounded"
                    }`}
                    onClick={() => setCurrentPage(page + 1)}
                  >
                    {page + 1}
                  </button>
                ))}
                <button 
                  className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="bg-purewhite rounded-xl shadow border border-light_gray p-4 sm:p-6">
          <div className="font-semibold text-main_dark mb-4">
            Recent Payment Notifications
          </div>
          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((note, idx) => (
                <div
                  key={idx}
                  className={`flex items-start rounded ${
                    notificationStyle[note.type]
                  } px-4 sm:px-6 py-4`}
                >
                  <div className="mt-1">{notificationIcon[note.type]}</div>
                  <div>
                    <div className="text-main_dark text-sm font-medium">
                      {note.message}
                    </div>
                    <div className="text-xs text-slatebluegray mt-1">
                      {note.time}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No recent notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
