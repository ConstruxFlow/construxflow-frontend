import React, { useState } from "react";
import {
  FaEye,
  FaReply,
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

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations" },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments", active: true },
];

const payments = [
  {
    po: "PO-2024-001",
    invoice: "INV-1001",
    project: "Metro Bridge",
    amount: "RS 45,000",
    date: "12/22/2024",
    status: "Fully Paid",
  },
  {
    po: "PO-2024-002",
    invoice: "INV-1002",
    project: "Mall Phase 2",
    amount: "RS 28,500",
    date: "12/30/2024",
    status: "Advanced Paid",
  },
  {
    po: "PO-2024-003",
    invoice: "INV-1003",
    project: "Office Complex",
    amount: "RS 67,200",
    date: "--",
    status: "Pending",
  },
  {
    po: "PO-2024-004",
    invoice: "INV-1004",
    project: "Tower A",
    amount: "RS 125,000",
    date: "--",
    status: "Overdue",
  },
];

const statusBadge = {
  "Fully Paid": "bg-green-100 text-green-800",
  "Advanced Paid": "bg-yellow-100 text-yellow-800",
  Pending: "bg-gray-100 text-gray-800",
  Overdue: "bg-red-100 text-red-800",
};

const notifications = [
  {
    type: "success",
    message: "Payment received for PO-2024-002",
    time: "2 hours ago",
  },
  {
    type: "error",
    message: "Invoice INV-1012 overdue",
    time: "1 day ago",
  },
  {
    type: "warning",
    message: "Partial payment received for PO-2024-005",
    time: "3 days ago",
  },
];

// Notification styles for left border and background
const notificationStyle = {
  success: "border-l-4 border-deep_green bg-green-50",
  error: "border-l-4 border-red-500 bg-red-50",
  warning: "border-l-4 border-web_yellow bg-yellow-50",
};

// Notification icons as in your screenshot
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Filter logic
  const filtered = payments.filter(
    (p) =>
      (status === "All Status" || p.status === status) &&
      (search === "" ||
        p.po.toLowerCase().includes(search.toLowerCase()) ||
        p.invoice.toLowerCase().includes(search.toLowerCase()) ||
        p.project.toLowerCase().includes(search.toLowerCase())) &&
      (date === "" || p.date === date)
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Handle payment view click
  const handleViewClick = (paymentStatus) => {
    if (paymentStatus === "Advanced Paid") {
      navigate("/supplier/payments/receive-advanced");
    } else if (paymentStatus === "Fully Paid") {
      navigate("/supplier/payments/receive-full");
    }
  };

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
        <div className="bg-purewhite rounded-xl border border-light_gray p-4 sm:p-6 mb-8 flex flex-col md:flex-row md:items-center gap-4">
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
            <option>Fully Paid</option>
            <option>Advanced Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full md:w-48 text-sm border border-light_gray rounded-lg px-4 py-2 bg-purewhite text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
            placeholder="mm/dd/yyyy"
          />
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
                      <FaCalendarCheck className="inline mb-0.5" /> Payment Date
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
                {paginatedPayments.map((p, idx) => (
                  <tr key={p.po} className="bg-purewhite">
                    <td className="px-5 py-4 text-sm">{p.po}</td>
                    <td className="px-5 py-4 text-sm">{p.invoice}</td>
                    <td className="px-5 py-4 text-sm">{p.project}</td>
                    <td className="px-5 py-4 font-bold text-sm">{p.amount}</td>
                    <td className="px-5 py-4 text-sm">{p.date}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusBadge[p.status]
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 flex gap-2">
                      <button
                        onClick={() => handleViewClick(p.status)}
                        className="p-2 text-deep_green hover:bg-gray-100 rounded"
                      >
                        <FaEye />
                      </button>
                      <button className="p-2 text-web_yellow hover:bg-gray-100 rounded">
                        <FaReply />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-light_gray">
            {paginatedPayments.map((p, idx) => (
              <div key={p.po} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-main_dark text-sm">{p.po}</h3>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="font-semibold text-main_dark text-sm">{p.invoice}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{p.project}</p>
                    <div className="text-xs text-gray-500">
                      Payment Date: {p.date}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusBadge[p.status]
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <p><span className="font-medium">Amount:</span> {p.amount}</p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleViewClick(p.status)}
                    className="text-deep_green hover:text-deep_green/80 transition-colors"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button className="text-web_yellow hover:text-web_yellow/80 transition-colors">
                    <FaReply className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-light_gray">
            <div className="text-sm text-slatebluegray mb-2 sm:mb-0">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} results
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded"
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
                className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-purewhite rounded-xl shadow border border-light_gray p-4 sm:p-6">
          <div className="font-semibold text-main_dark mb-4">
            Recent Payment Notifications
          </div>
          <div className="space-y-3">
            {notifications.map((note, idx) => (
              <div
                key={idx}
                className={`flex items-start rounded ${
                  notificationStyle[note.type]
                } px-4 sm:px-6 py-4`}
              >
                {/* Icon */}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
