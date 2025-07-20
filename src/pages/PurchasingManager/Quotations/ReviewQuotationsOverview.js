import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaCheckCircle,
  FaChevronLeft,
  FaDownload,
  FaSearch,
} from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// http://localhost:8080/api/supplier/find/S007
const ReviewQuotations = () => {
  const [selected, setSelected] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const reqId = location.state?.reqId || null;
  const [isLoading, setIsLoading] = useState(false);
  const [quotationList, setQuotationList] = useState([]);
  const [supplierDetails, setSupplierDetails] = useState(null);

  const fetchQuotations = async () => {
    if (!reqId) {
      toast.error("Quotation Request ID is missing.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/quotations/byquotationreq/${reqId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch quotations");
      }
      // const supplierResponse = await fetch(`http://localhost:8080/api/supplier/find/${data?.supplierId}`,{
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const supplierData = await supplierResponse.json();
      // if (!supplierResponse.ok) {
      //   throw new Error(supplierData.message || "Failed to fetch supplier");
      // }
      // setSupplierDetails(supplierData);
      setQuotationList(data);
    } catch (error) {
      toast.error("Error fetching quotations: " + error.message);
      console.error("Error fetching quotations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [reqId]);

  console.log(supplierDetails);
  
  // Add supplier information to each quotation
  const suppliers = quotationList.map(quotation => ({
    ...quotation,
    // Use data from API response or fallback to defaults
    name: quotation.name || "Global Office Solutions",
    subtitle: quotation.subtitle || "Premium office supplies & equipment",
    rating: quotation.rating || 4.9,
    onTime: quotation.onTime || 98,
    orders: quotation.orders || 247,
    avgDelivery: quotation.avgDelivery || 2.1,
    // Map the correct field names
    price: quotation.totalAmount || 0,
    delivery: quotation.deliveryInfos?.[0]?.estimatedDeliveryTime || "2-3 days",
    warranty: quotation.warranty || "1 year",
    paymentTerms: quotation.paymentTerms || "Net 30",
    notes: quotation.notes || "-"
  }));

  console.log("Enriched Quotation List:", suppliers);

  const selectedSupplier = suppliers.find((s) => s.id === selected);

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading supplier details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header */}
      <NavBar
        links={[
          { name: "Dashboard", path: "/purchasing/dashboard" },
          {
            name: "Material Requests",
            path: "/purchasing/materialrequests/overview",
          },
          { name: "Suppliers", path: "/purchasing/supplier/dashboard" },
          {
            name: "Quotation Requests",
            path: "/purchasing/quotationrequest/overview",
          },
          { name: "Purchasing Orders", path: "/purchasing/orders/overview" },
        ]}
      />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10 flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1">
            {/* Back Button and Title */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-slatebluegray text-sm mb-4 hover:underline"
                >
                  <FaChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <h1 className="text-2xl font-bold text-main_dark mb-1">
                  Review Quotations
                </h1>
                <div className="text-slatebluegray">
                  Purchase Order{" "}
                  <span className="font-semibold text-main_dark">
                    #PO-2024-001
                  </span>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-light_gray bg-purewhite text-main_dark text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                />
              </div>
              <select className="px-4 py-2 rounded-md border border-light_gray bg-purewhite text-main_dark text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow">
                <option>All Categories</option>
                <option>Office Supplies</option>
                <option>Technology</option>
              </select>
              <select className="px-4 py-2 rounded-md border border-light_gray bg-purewhite text-main_dark text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow">
                <option>All Ratings</option>
                <option>5 Stars</option>
                <option>4+ Stars</option>
                <option>3+ Stars</option>
              </select>
            </div>

            {/* Supplier Cards */}
            <div className="space-y-6">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className={`border rounded-lg p-6 bg-purewhite relative transition-all duration-200 cursor-pointer ${
                      selected === supplier.id
                        ? "border-web_yellow shadow-lg"
                        : "border-light_gray hover:border-gray-300"
                    }`}
                    onClick={() => setSelected(supplier.id)}
                  >
                    {/* Selected Badge */}
                    {selected === supplier.id && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-web_yellow text-main_dark px-3 py-1 rounded-full text-xs font-semibold">
                        <FaCheckCircle className="w-3 h-3" />
                        Selected
                      </div>
                    )}

                    {/* Supplier Header */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-main_dark text-lg mb-1">
                        {supplier.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{supplier.subtitle}</p>
                    </div>

                    {/* Metrics Row */}
                    <div className="flex flex-wrap gap-6 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 mb-1">
                          <FaStar className="w-4 h-4 text-web_yellow" />
                          <span className="font-medium text-main_dark">
                            {supplier.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">Rating</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-main_dark mb-1">
                          {supplier.onTime}%
                        </span>
                        <span className="text-xs text-gray-600">On-time</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-main_dark mb-1">
                          {supplier.orders}
                        </span>
                        <span className="text-xs text-gray-600">Orders</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-main_dark mb-1">
                          {supplier.avgDelivery} days
                        </span>
                        <span className="text-xs text-gray-600">
                          Avg Delivery
                        </span>
                      </div>
                    </div>

                    {/* Quotation Details */}
                    <div
                      className={`rounded-lg p-4 ${
                        selected === supplier.id
                          ? "bg-light_brown/30"
                          : "bg-light_gray/50"
                      }`}
                    >
                      <h4 className="font-medium text-main_dark mb-3">
                        Quotation Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="mb-3">
                            <span className="text-xs text-gray-600 block">
                              Total Price
                            </span>
                            <span className="font-bold text-main_dark text-lg">
                              ${supplier.price?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div className="mb-3">
                            <span className="text-xs text-gray-600 block">
                              Payment Terms
                            </span>
                            <span className="font-medium text-main_dark">
                              {supplier.paymentTerms}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600 block">
                              Notes
                            </span>
                            <span className="text-sm text-gray-700">
                              {supplier.notes || "-"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="mb-3">
                            <span className="text-xs text-gray-600 block">
                              Delivery Time
                            </span>
                            <span className="font-medium text-main_dark">
                              {supplier.delivery}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600 block">
                              Warranty
                            </span>
                            <span className="font-medium text-main_dark">
                              {supplier.warranty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No quotations found matching your search.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="sticky top-6">
              {/* Quotation Comparison */}
              <div className="mb-6">
                <button
                  onClick={() => navigate(`/purchasing/quotations/best`)}
                  className="w-full px-4 py-2 bg-web_yellow text-main_dark font-medium rounded-md hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                >
                  <FaEye className="w-4 h-4" />
                  View Best Quotations
                </button>
              </div>

              {/* Selected Supplier */}
              {selectedSupplier && (
                <div className="bg-yellow-50 border border-web_yellow rounded-lg p-6">
                  <h2 className="font-semibold text-main_dark mb-4">
                    Selected Supplier
                  </h2>
                  <div className="mb-4">
                    <h3 className="font-semibold text-main_dark">
                      {selectedSupplier.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {selectedSupplier.subtitle}
                    </p>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-semibold text-main_dark">
                        ${selectedSupplier.price?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-semibold text-main_dark">
                        {selectedSupplier.delivery}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Terms</span>
                      <span className="font-semibold text-main_dark">
                        {selectedSupplier.paymentTerms}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-semibold text-main_dark">
                        {selectedSupplier.rating}/5
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/purchasing/quotations/details/${selectedSupplier.id}`)}
                      className="w-full px-4 py-2 bg-web_yellow text-main_dark font-medium rounded-md hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewQuotations;
