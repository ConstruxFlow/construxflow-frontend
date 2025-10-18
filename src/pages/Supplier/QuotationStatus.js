import React, { useContext, useEffect, useState } from "react";
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
  FaBoxOpen,
  FaSortNumericUp,
  FaMoneyBill,
  FaRegCheckCircle,
} from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations", active: true },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments" },
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
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch quotations on page load
  useEffect(() => {
    const supplierId = authState?.user?.supplierId;
    if (!supplierId) {
      setQuotations([]);
      return;
    }

    axios
      .get("http://localhost:8080/api/quotations/all")
      .then((res) => {
        setQuotations(
          res.data.filter((q) => q.supplierId === supplierId)
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch quotations", err);
      });
  }, [authState?.user?.supplierId]);

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

  // Pagination
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotations = filteredQuotations.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Quotations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-16 py-8">
        <h1 className="text-xxl md:text-2xl font-bold text-main_dark mb-2">
          Monitor Quotation Status
        </h1>
        <p className="text-gray-600 text-base mb-8">
          Track and manage all your submitted quotations
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <SummaryCard
            icon={<FaClipboard />}
            title="Total Quotations"
            value={quotations.length}
            subtitle="This month"
            type="total"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            title="Approved"
            value={quotations.filter((q) => q.status === "Approved").length}
            subtitle="Approved by client"
            type="approved"
          />
          <SummaryCard
            icon={<FaClock />}
            title="Pending Review"
            value={quotations.filter((q) => q.status === "Pending").length}
            subtitle="Awaiting feedback"
            type="pending"
          />
        </div>

        {/* Filters */}
        <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotations..."
              className="w-full text-sm pl-10 pr-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-48 text-sm px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow appearance-none bg-white"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full md:w-48 text-sm px-4 py-2 border border-light_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-purewhite rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-light_brown/35">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    Quotation ID
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
                      <FaMoneyBill className="inline mb-0.5" /> Quoted Price
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaClock className="inline mb-0.5" /> Submitted
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    <span className="flex items-center gap-2">
                      <FaRegCheckCircle className="inline mb-0.5" /> Status
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light_gray">
                {paginatedQuotations.map((q) => {
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
                    ? `RS ${q.totalAmount.toLocaleString()}`
                    : "-";
                  const submitted = new Date(q.createdAt).toLocaleDateString();

                  return (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-main_dark font-medium text-sm">{`QT-${q.id}`}</td>
                      <td className="px-6 py-4 text-sm">{material}</td>
                      <td className="px-6 py-4 text-sm">{quantity}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-main_dark">
                        {price}
                      </td>
                      <td className="px-6 py-4 text-sm">{submitted}</td>
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
                          onClick={() => navigate(`/supplier/quotations/${q.id}`)}
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

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-light_gray">
            {paginatedQuotations.map((q) => {
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
                ? `RS ${q.totalAmount.toLocaleString()}`
                : "-";
              const submitted = new Date(q.createdAt).toLocaleDateString();

              return (
                <div key={q.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-main_dark text-sm">QT-{q.id}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{material}</p>
                      <div className="text-xs text-gray-500">
                        Submitted: {submitted}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[q.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <p><span className="font-medium">Quantity:</span> {quantity}</p>
                    <p><span className="font-medium">Price:</span> {price}</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/supplier/quotations/${q.id}`)}
                      className="text-deep_green hover:text-deep_green/80 transition-colors"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-light_gray bg-purewhite">
            <div className="text-sm text-slatebluegray">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredQuotations.length)} of{" "}
              {filteredQuotations.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {[
                ...Array(
                  Math.ceil(filteredQuotations.length / itemsPerPage)
                ).keys(),
              ].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 text-sm ${
                    currentPage === page + 1
                      ? "bg-web_yellow text-main_dark font-medium"
                      : "text-slatebluegray hover:bg-gray-100 rounded"
                  }`}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 text-sm text-slatebluegray hover:bg-gray-100 rounded"
                disabled={
                  currentPage ===
                  Math.ceil(filteredQuotations.length / itemsPerPage)
                }
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(
                      Math.ceil(filteredQuotations.length / itemsPerPage),
                      p + 1
                    )
                  )
                }
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

// Summary card component
const SummaryCard = ({ icon, title, value, subtitle, type }) => {
  // Choose color mapping and gradients based on 'type'
  const cardStyles = {
    total: {
      bg: "bg-gradient-to-bl from-light_gray to-purewhite",
      border: "border-web_yellow",
      iconBg: "bg-web_yellow",
      iconColor: "text-purewhite",
    },
    accepted: {
      bg: "bg-gradient-to-br from-purewhite to-deep_green/10",
      border: "border-deep_green",
      iconBg: "bg-deep_green",
      iconColor: "text-purewhite",
    },
    pending: {
      bg: "bg-gradient-to-tr from-purewhite to-web_yellow/20",
      border: "border-web_yellow",
      iconBg: "bg-web_yellow",
      iconColor: "text-main_dark",
    },
    rejected: {
      bg: "bg-gradient-to-tl from-purewhite to-light_brown",
      border: "border-light_brown",
      iconBg: "bg-light_brown",
      iconColor: "text-main_dark",
    },
  };
  const style = cardStyles[type] || cardStyles.total;

  return (
    <div
      className={`bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150`}
    >
      <div className="flex-1">
        <div className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
          {title}
        </div>
        <div className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
          {value}
        </div>
        <div className="text-deep_green text-xs">{subtitle}</div>
      </div>
      <div
        className={`flex items-center justify-center h-10 w-10 rounded-xl shadow 
        ${style.iconBg} ${style.iconColor} group-hover:scale-110 transition-all text-lg`}
      >
        {icon}
      </div>
    </div>
  );
};

export default QuotationStatus;
