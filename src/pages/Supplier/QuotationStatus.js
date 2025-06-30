// src/pages/Supplier/QuotationStatus.jsx
import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import { FaClipboard, FaCheckCircle, FaClock, FaSearch, FaChevronDown } from "react-icons/fa";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations", active: true },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" }
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const quotations = [
  {
    id: "QT-2024-001",
    project: "Metro Bridge Construction",
    material: "Steel Reinforcement Bars",
    quantity: "500 tons",
    price: "$45,000",
    submitted: "Jan 15, 2024",
    status: "Pending",
  },
  {
    id: "QT-2024-002",
    project: "Shopping Mall Phase 2",
    material: "Concrete Mix",
    quantity: "200 m³",
    price: "$18,500",
    submitted: "Jan 12, 2024",
    status: "Accepted",
  },
  {
    id: "QT-2024-003",
    project: "Office Complex Downtown",
    material: "Electrical Cables",
    quantity: "2,000 meters",
    price: "$12,300",
    submitted: "Jan 10, 2024",
    status: "Rejected",
  },
  {
    id: "QT-2024-004",
    project: "Residential Tower A",
    material: "Plumbing Pipes",
    quantity: "800 units",
    price: "$22,750",
    submitted: "Jan 8, 2024",
    status: "Pending",
  },
  {
    id: "QT-2024-005",
    project: "Highway Extension Project",
    material: "Asphalt",
    quantity: "1,500 tons",
    price: "$67,200",
    submitted: "Jan 5, 2024",
    status: "Accepted",
  },
];

const QuotationStatus = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [date, setDate] = useState("");

  // Filter logic (basic)
  const filteredQuotations = quotations.filter(
    (q) =>
      (status === "All Status" || q.status === status) &&
      (search === "" ||
        q.id.toLowerCase().includes(search.toLowerCase()) ||
        q.project.toLowerCase().includes(search.toLowerCase()) ||
        q.material.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-16 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Monitor Quotation Status</h1>
        <p className="text-gray-500 mb-8">Track and manage all your submitted quotations</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Quotations */}
            <div className="flex items-center gap-4 bg-purewhite border border-light_gray rounded-xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-deep_green/10">
                <FaClipboard className="text-deep_green text-2xl" />
                </div>
                <div>
                <div className="text-sm text-slatebluegray font-semibold">Total Quotations</div>
                <div className="text-2xl font-bold text-main_dark">24</div>
                <div className="text-xs text-slatebluegray mt-1">This month</div>
                </div>
            </div>
            {/* Accepted */}
            <div className="flex items-center gap-4 bg-purewhite border border-web_yellow rounded-xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-web_yellow/10">
                <FaCheckCircle className="text-web_yellow text-2xl" />
                </div>
                <div>
                <div className="text-sm text-slatebluegray font-semibold">Accepted</div>
                <div className="text-2xl font-bold text-main_dark">8</div>
                <div className="text-xs text-slatebluegray mt-1">Approved by client</div>
                </div>
            </div>
            {/* Pending Review */}
            <div className="flex items-center gap-4 bg-purewhite border border-light_gray rounded-xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slatebluegray/10">
                <FaClock className="text-slatebluegray text-2xl" />
                </div>
                <div>
                <div className="text-sm text-slatebluegray font-semibold">Pending Review</div>
                <div className="text-2xl font-bold text-main_dark">12</div>
                <div className="text-xs text-slatebluegray mt-1">Awaiting feedback</div>
                </div>
            </div>
            </div>


        {/* Filters */}
        <div className="bg-purewhite border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search quotations..."
              className="w-full pl-10 pr-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
            />
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-48 px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow appearance-none bg-white"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-48 px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-purewhite rounded-lg shadow border border-light_gray">
          <table className="min-w-full">
            <thead>
              <tr className="bg-web_yellow">
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Quotation ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Project Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Material</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Quoted Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Submitted</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light_gray">
              {filteredQuotations.map((q, idx) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-main_dark font-medium text-sm">{q.id}</td>
                  <td className="px-6 py-4 ">{q.project}</td>
                  <td className="px-6 py-4">{q.material}</td>
                  <td className="px-6 py-4">{q.quantity}</td>
                  <td className="px-6 py-4 font-semibold text-main_dark">{q.price}</td>
                  <td className="px-6 py-4">{q.submitted}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[q.status]}`}>
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuotationStatus;
