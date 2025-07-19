// src/pages/Supplier/PurchasingOrders.jsx
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
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders", active: true },
  { name: "Payments", href: "/payments" },
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
    amount: "$45,000",
  },
  {
    id: "PO-2024-002",
    project: "Mall Phase 2",
    orderDate: "2024-06-03",
    deliveryDate: "2024-06-17",
    materials: "Concrete, Rebar",
    quantity: 800,
    status: "Dispatched",
    amount: "$28,500",
  },
  {
    id: "PO-2024-003",
    project: "Tower A",
    orderDate: "2024-06-05",
    deliveryDate: "2024-06-20",
    materials: "Glass Panels",
    quantity: 300,
    status: "Pending",
    amount: "$125,000",
  },
  {
    id: "PO-2024-004",
    project: "Office Complex",
    orderDate: "2024-06-07",
    deliveryDate: "2024-06-22",
    materials: "Electrical Cables",
    quantity: 2000,
    status: "Cancelled",
    amount: "$12,000",
  },
  {
    id: "PO-2024-005",
    project: "Residential Block",
    orderDate: "2024-06-08",
    deliveryDate: "2024-06-25",
    materials: "Bricks, Mortar",
    quantity: 5000,
    status: "Pending",
    amount: "$35,750",
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

  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-16 py-8">
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
        <div className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6 shadow-sm">
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
          {/* Table Header */}
          {/* <div className="flex justify-between items-center p-6 border border-light_gray rounded-t-lg">
            <h2 className="text-lg font-semibold text-main_dark">
              Purchasing Orders ({filteredOrders.length})
            </h2>
            <div className="flex items-center gap-2">
              <MdFilterList className="text-gray-400" />
              <FaChevronDown className="text-gray-400" />
            </div>
          </div> */}
          <div className="overflow-x-auto">
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
                {filteredOrders.map((order, index) => (
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
                        onClick={() => navigate(`/orders/${order.id}`)}
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

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-light_gray">
            <div className="text-sm text-slatebluegray">
              Showing 1 to {filteredOrders.length} of {orders.length} results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-web_yellow text-main_dark rounded font-medium">
                1
              </button>
              <button className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded">
                2
              </button>
              <button className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded">
                3
              </button>
              <button className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded">
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
