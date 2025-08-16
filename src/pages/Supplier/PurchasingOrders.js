import React, { useState } from "react";
import {
  FaSearch,
  FaEye,
  FaChevronDown,
  FaReply,
  FaBoxOpen,
  FaProjectDiagram,
  FaCalendarAlt,
  FaTruck,
  FaMoneyBill,
  FaSortNumericUp,
  FaRegCheckCircle,
} from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations" },
  { name: "Orders", href: "/supplier/orders", active: true },
  { name: "Payments", href: "/supplier/payments" },
];

const orders = [
  {
    id: "PO-2024-001",
    project: "Metro Bridge",
    orderDate: "2024-06-01",
    deliveryDate: "2024-06-15",
    materials: "Steel Bars, Cement",
    quantity: 1200,
    status: "Delivered",
    amount: "RS 45,000",
  },
  {
    id: "PO-2024-002",
    project: "Mall Phase 2",
    orderDate: "2024-06-03",
    deliveryDate: "2024-06-17",
    materials: "Concrete, Rebar",
    quantity: 800,
    status: "Dispatched",
    amount: "RS 28,500",
  },
  {
    id: "PO-2024-003",
    project: "Tower A",
    orderDate: "2024-06-05",
    deliveryDate: "2024-06-20",
    materials: "Glass Panels",
    quantity: 300,
    status: "Pending",
    amount: "RS 125,000",
  },
  {
    id: "PO-2024-004",
    project: "Office Complex",
    orderDate: "2024-06-07",
    deliveryDate: "2024-06-22",
    materials: "Electrical Cables",
    quantity: 2000,
    status: "Cancelled",
    amount: "RS 12,000",
  },
  {
    id: "PO-2024-005",
    project: "Residential Block",
    orderDate: "2024-06-08",
    deliveryDate: "2024-06-25",
    materials: "Bricks, Mortar",
    quantity: 5000,
    status: "Pending",
    amount: "RS 35,750",
  },
];

const getStatusBadge = (status) => {
  const base = "px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case "Delivered":
      return `${base} bg-green-100 text-green-800`;
    case "Dispatched":
      return `${base} bg-gray-100 text-gray-800`;
    case "Pending":
      return `${base} bg-yellow-100 text-yellow-800`;
    case "Cancelled":
      return `${base} bg-red-100 text-red-800`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
  }
};

const PurchasingOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Filtered data
  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "All Status" || order.status === statusFilter) &&
      (searchTerm === "" ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.materials.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-main_dark mb-2">
              Purchasing Orders
            </h1>
            <p className="text-gray-600 text-base">
              Manage and track all your purchase orders
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-purewhite border border-light_gray rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-main_dark mb-2">
                Search
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by PO ID, Project, or Material..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
                />
              </div>
            </div>
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-sm px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow appearance-none bg-white"
                >
                  <option>All Status</option>
                  <option>Delivered</option>
                  <option>Dispatched</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Date Range (optional, for symmetry) */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">
                Order Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full text-sm px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
                />
              </div>
            </div>
            {/* Placeholder for future filter */}
            <div>
              <label className="block text-sm font-medium text-main_dark mb-2">
                Delivery Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full text-sm px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-purewhite rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light_brown/35">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    PO ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaProjectDiagram className="inline mb-0.5" /> Project
                      Name
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="inline mb-0.5" /> Order Date
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaTruck className="inline mb-0.5" /> Delivery Date
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaBoxOpen className="inline mb-0.5" /> Materials
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaSortNumericUp className="inline mb-0.5" /> Quantity
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaRegCheckCircle className="inline mb-0.5" /> Status
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaMoneyBill className="inline mb-0.5" /> Amount
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light_gray">
                {paginatedOrders.map((order, index) => (
                  <tr key={index} className="bg-purewhite hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-main_dark">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm">{order.project}</td>
                    <td className="px-6 py-4 text-sm">{order.orderDate}</td>
                    <td className="px-6 py-4 text-sm">{order.deliveryDate}</td>
                    <td className="px-6 py-4 text-sm">{order.materials}</td>
                    <td className="px-6 py-4 text-sm">{order.quantity}</td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 text-deep_green hover:bg-gray-100 rounded"
                        onClick={() => navigate(`/supplier/orders/${order.id}`)}
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
            {paginatedOrders.map((order, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-main_dark text-sm">{order.id}</h3>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="font-semibold text-main_dark text-sm">{order.project}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{order.materials}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FaCalendarAlt className="w-3 h-3" />
                      {order.orderDate}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={getStatusBadge(order.status)}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
                  <p><span className="font-medium">Amount:</span> {order.amount}</p>
                  <p><span className="font-medium">Delivery:</span> {order.deliveryDate}</p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    className="text-deep_green hover:text-deep_green/80 transition-colors"
                    onClick={() => navigate(`/supplier/orders/${order.id}`)}
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
              {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
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
      </div>
    </div>
  );
};

export default PurchasingOrders;
