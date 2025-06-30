// src/pages/Supplier/PaymentStatus.jsx
import React, { useState } from "react";
import { FaEye, FaReply } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import { HiCheckCircle, HiExclamationTriangle, HiOutlineClock } from "react-icons/hi2";
const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments", active: true },
];

const payments = [
  {
    po: "PO-2024-001",
    invoice: "INV-1001",
    project: "Metro Bridge",
    amount: "$45,000",
    date: "12/22/2024",
    status: "Fully Paid",
  },
  {
    po: "PO-2024-002",
    invoice: "INV-1002",
    project: "Mall Phase 2",
    amount: "$28,500",
    date: "12/30/2024",
    status: "Advanced Paid",
  },
  {
    po: "PO-2024-003",
    invoice: "INV-1003",
    project: "Office Complex",
    amount: "$67,200",
    date: "--",
    status: "Pending",
  },
  {
    po: "PO-2024-004",
    invoice: "INV-1004",
    project: "Tower A",
    amount: "$125,000",
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

  // Handle payment view click
  const handleViewClick = (paymentStatus) => {
    if (paymentStatus === "Advanced Paid") {
      navigate("/payments/receive-advanced");
    } else if (paymentStatus === "Fully Paid") {
      navigate("/payments/receive-full");
    }
  };

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-16 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Monitor Payment Status</h1>
        <p className="text-gray-500 mb-8">Track and manage payment details for all purchasing orders</p>

        {/* Search and Filter */}
        <div className="bg-purewhite rounded-xl shadow border border-light_gray p-6 mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by PO ID, Invoice Number, or Project..."
            className="flex-1 border border-light_gray rounded-lg px-5 py-2 text-main_dark bg-purewhite focus:outline-none focus:ring-2 focus:ring-web_yellow"
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-48 border border-light_gray rounded-lg px-4 py-2 bg-purewhite text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
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
            onChange={e => setDate(e.target.value)}
            className="w-48 border border-light_gray rounded-lg px-4 py-2 bg-purewhite text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
            placeholder="mm/dd/yyyy"
          />
        </div>

        {/* Payment Table */}
        <div className="rounded-lg shadow border border-light_gray overflow-hidden mb-10">
          <table className="w-full">
            <thead>
              <tr className="bg-web_yellow">
                <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                  PO ID
                </th>
                <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                  Invoice #
                </th>
                <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                  Project
                </th>
                <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                  Amount
                </th>
                <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                  Payment Date
                </th>
                <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-main_dark font-semibold text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light_gray">
              {filtered.map((p, idx) => (
                <tr key={p.po} className="bg-purewhite">
                  <td className="px-5 py-4 font-semibold">{p.po}</td>
                  <td className="px-5 py-4">{p.invoice}</td>
                  <td className="px-5 py-4">{p.project}</td>
                  <td className="px-5 py-4 font-bold">{p.amount}</td>
                  <td className="px-5 py-4">{p.date}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 flex gap-2">
                    <button onClick={() => handleViewClick(p.status)} className="p-2 text-deep_green hover:bg-gray-100 rounded">
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

        {/* Recent Notifications */}
        <div className="bg-purewhite rounded-xl shadow border border-light_gray p-6">
          <div className="font-semibold text-main_dark mb-4">
            Recent Payment Notifications
          </div>
          <div className="space-y-3">
            {notifications.map((note, idx) => (
              <div
                key={idx}
                className={`flex items-start rounded ${notificationStyle[note.type]} px-6 py-4`}
              >
                {/* Icon */}
                <div className="mt-1">{notificationIcon[note.type]}</div>
                <div>
                  <div className="text-main_dark text-sm font-medium">{note.message}</div>
                  <div className="text-xs text-slatebluegray mt-1">{note.time}</div>
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
