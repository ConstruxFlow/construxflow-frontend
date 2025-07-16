import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import {
  FaClipboard,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaChevronDown,
  FaEye,
} from "react-icons/fa";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations", active: true },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const QuotationStatus = () => {
  const [quotations, setQuotations] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  // Fetch quotations on page load
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/quotations/all")
      .then((res) => {
        setQuotations(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch quotations", err);
      });
  }, []);

  // Processed list
  const filteredQuotations = quotations.filter((q) => {
    const materialName = q.items?.[0]?.material?.materialName || "";
    const submittedDate = new Date(q.createdAt).toISOString().split("T")[0]; // format to yyyy-mm-dd

    return (
      (status === "All Status" || q.status === status) &&
      (search === "" ||
        q.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
        materialName.toLowerCase().includes(search.toLowerCase())) &&
      (date === "" || submittedDate === date)
    );
  });

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-16 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Monitor Quotation Status
        </h1>
        <p className="text-gray-500 mb-8">
          Track and manage all your submitted quotations
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            icon={<FaClipboard />}
            title="Total Quotations"
            value={quotations.length}
            subtitle="This month"
            color="deep_green"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            title="Accepted"
            value={quotations.filter((q) => q.status === "Accepted").length}
            subtitle="Approved by client"
            color="web_yellow"
          />
          <SummaryCard
            icon={<FaClock />}
            title="Pending Review"
            value={quotations.filter((q) => q.status === "Pending").length}
            subtitle="Awaiting feedback"
            color="slatebluegray"
          />
        </div>

        {/* Filters */}
        <div className="bg-purewhite border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotations..."
              className="w-full pl-10 pr-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
            />
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
              onChange={(e) => setDate(e.target.value)}
              className="w-48 px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-purewhite rounded-lg shadow border border-light_gray">
          <table className="min-w-full">
            <thead>
              <tr className="bg-web_yellow">
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                  Quotation ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                  Material
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                  Quoted Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light_gray">
              {filteredQuotations.map((q) => {
                const material =
                  q.items && q.items.length
                    ? q.items
                        .map((item) => item.material?.materialName)
                        .filter(Boolean)
                        .join(", ")
                    : "-";

                const quantity =
                  q.items && q.items.length
                    ? q.items.map((item) => item.quantity).join(", ")
                    : "-";

                const price = q.totalAmount
                  ? `$${q.totalAmount.toLocaleString()}`
                  : "-";
                const submitted = new Date(q.createdAt).toLocaleDateString();

                return (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-main_dark font-medium text-sm">{`QT-${q.id}`}</td>
                    <td className="px-6 py-4">{material}</td>
                    <td className="px-6 py-4">{quantity}</td>
                    <td className="px-6 py-4 font-semibold text-main_dark">
                      {price}
                    </td>
                    <td className="px-6 py-4">{submitted}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[q.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/quotations/${q.id}`)}
                        className="p-2 text-deep_green hover:bg-gray-100 rounded"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Summary card component
const SummaryCard = ({ icon, title, value, subtitle, color }) => (
  <div className="flex items-center gap-4 bg-purewhite border border-light_gray rounded-xl shadow-sm p-5 hover:shadow-md transition">
    <div
      className={`flex items-center justify-center h-12 w-12 rounded-lg bg-${color}/10`}
    >
      {icon}
    </div>
    <div>
      <div className="text-sm text-slatebluegray font-semibold">{title}</div>
      <div className="text-2xl font-bold text-main_dark">{value}</div>
      <div className="text-xs text-slatebluegray mt-1">{subtitle}</div>
    </div>
  </div>
);

export default QuotationStatus;
