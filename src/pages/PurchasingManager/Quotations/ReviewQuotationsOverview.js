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

const ReviewQuotations = () => {
  const [selected, setSelected] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const reqId = location.state?.reqId || null;
  const [isLoading, setIsLoading] = useState(false);
  const [quotationList, setQuotationList] = useState([]);
  const [supplierDetails, setSupplierDetails] = useState([]);

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

  // FIXED: Proper async/await with Promise.all
  const fetchAllSupplierDetails = async () => {
    if (!quotationList.length) return;
    
    try {
      setIsLoading(true);
      
      // Create array of fetch promises
      const supplierPromises = quotationList.map(async (quotation) => {
        try {
          const supplierResponse = await fetch(
            `http://localhost:8080/api/supplier/find/${quotation.supplierId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const supplierData = await supplierResponse.json();

          if (!supplierResponse.ok) {
            throw new Error(
              supplierData.message ||
              `Failed to fetch supplier ${quotation.supplierId}`
            );
          }

          // Return enriched quotation data
          return {
            ...quotation,
            id: quotation.id,
            name: supplierData?.data?.company_name || "Global Office Solutions",
            subtitle: quotation.subtitle || "Premium office supplies & equipment",
            rating: supplierData?.data?.rating_by_site_manager || 4.9,
            onTime: supplierData?.data?.on_time_delivery_rate || 98,
            orders: supplierData?.data?.past_orders_completed || 247,
            avgDelivery: supplierData?.data?.avg_delay_days || 2.1,
            price: quotation.totalAmount || 0,
            delivery: quotation.deliveryInfos?.[0]?.estimatedDeliveryTime || "2-3 days",
            warranty: quotation.warranty || "1 year",
            paymentTerms: quotation.paymentTerms || "Net 30",
            notes: quotation.notes || "-",
          };
        } catch (error) {
          console.error(`Error fetching supplier ${quotation.supplierId}:`, error);
          // Return quotation with default supplier data if fetch fails
          return {
            ...quotation,
            id: quotation.id,
            name: "Unknown Supplier",
            subtitle: "Supplier information unavailable",
            rating: 0,
            onTime: 0,
            orders: 0,
            avgDelivery: 0,
            price: quotation.totalAmount || 0,
            delivery: quotation.deliveryInfos?.[0]?.estimatedDeliveryTime || "Unknown",
            warranty: quotation.warranty || "Unknown",
            paymentTerms: quotation.paymentTerms || "Unknown",
            notes: quotation.notes || "-",
          };
        }
      });

      // Wait for all promises to resolve
      const allSupplierDetails = await Promise.all(supplierPromises);
      
      // Set all supplier details at once
      setSupplierDetails(allSupplierDetails);
      
      // Set default selection to first supplier if none selected
      if (allSupplierDetails.length > 0 && !selected) {
        setSelected(allSupplierDetails[0].id);
      }
      
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      toast.error("Error loading supplier information");
    } finally {
      setIsLoading(false);
    }
  };

  // Call this function in useEffect when quotationList changes
  useEffect(() => {
    if (quotationList.length > 0) {
      fetchAllSupplierDetails();
    }
  }, [quotationList]);

  // BEST QUOTATION ALGORITHM
  const calculateBestQuotation = (supplierDetails) => {
    if (!supplierDetails || supplierDetails.length === 0) return null;

    // Define weights for each criterion (totaling 100%)
    const weights = {
      onTime: 0.25,        // 25% - On-time delivery rate
      rating: 0.20,        // 20% - Supplier rating
      orders: 0.15,        // 15% - Past orders completed (experience)
      avgDelivery: 0.10,   // 10% - Average delivery time (lower is better)
      deliveryDate: 0.10,  // 10% - How soon delivery is promised
      shippingCost: 0.08,  // 8% - Shipping cost (lower is better)
      totalPrice: 0.07,    // 7% - Total price (lower is better)
      unitPrice: 0.05      // 5% - Unit price efficiency
    };

    const scoredSuppliers = supplierDetails.map(supplier => {
      // Extract values with fallbacks
      const onTimeRate = parseFloat(supplier.onTime) || 0;
      const rating = parseFloat(supplier.rating) || 0;
      const pastOrders = parseInt(supplier.orders) || 0;
      const avgDelivery = parseFloat(supplier.avgDelivery) || 999; // High default for penalty
      const totalPrice = supplier.totalAmount || supplier.price || 0;
      const shippingCost = supplier.deliveryInfos?.[0]?.shippingCost || 0;
      const unitPrice = supplier.items?.[0]?.unitPrice || 0;
      
      // Calculate delivery date score (sooner is better)
      const deliveryDate = new Date(supplier.deliveryInfos?.[0]?.deliveryDate || supplier.delivery);
      const currentDate = new Date();
      const daysUntilDelivery = Math.max(1, Math.ceil((deliveryDate - currentDate) / (1000 * 60 * 60 * 24)));

      // Normalize scores (0-100 scale)
      const scores = {
        onTime: Math.min(100, onTimeRate), // Already percentage
        rating: (rating / 5) * 100, // Convert 5-star to percentage
        orders: Math.min(100, (pastOrders / 50) * 100), // Normalize based on reasonable max
        avgDelivery: Math.max(0, 100 - (avgDelivery * 10)), // Lower delivery time = higher score
        deliveryDate: Math.max(0, 100 - (daysUntilDelivery * 2)), // Sooner delivery = higher score
        shippingCost: Math.max(0, 100 - (shippingCost / 1000) * 10), // Lower cost = higher score
        totalPrice: 0, // Will be calculated relative to others
        unitPrice: 0   // Will be calculated relative to others
      };

      return {
        ...supplier,
        rawScores: scores,
        totalPrice,
        shippingCost,
        unitPrice,
        daysUntilDelivery
      };
    });

    // Calculate relative price scores (best price gets 100, others scaled down)
    const prices = scoredSuppliers.map(s => s.totalPrice).filter(p => p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const shippingCosts = scoredSuppliers.map(s => s.shippingCost).filter(c => c > 0);
    const minShipping = shippingCosts.length > 0 ? Math.min(...shippingCosts) : 0;
    const maxShipping = shippingCosts.length > 0 ? Math.max(...shippingCosts) : 0;

    const unitPrices = scoredSuppliers.map(s => s.unitPrice).filter(p => p > 0);
    const minUnitPrice = unitPrices.length > 0 ? Math.min(...unitPrices) : 0;
    const maxUnitPrice = unitPrices.length > 0 ? Math.max(...unitPrices) : 0;

    // Calculate final weighted scores
    const finalScores = scoredSuppliers.map(supplier => {
      // Calculate relative price scores
      const priceScore = minPrice > 0 && maxPrice > minPrice ? ((maxPrice - supplier.totalPrice) / (maxPrice - minPrice)) * 100 : 50;
      const shippingScore = minShipping > 0 && maxShipping > minShipping ? ((maxShipping - supplier.shippingCost) / (maxShipping - minShipping)) * 100 : 50;
      const unitPriceScore = minUnitPrice > 0 && maxUnitPrice > minUnitPrice ? ((maxUnitPrice - supplier.unitPrice) / (maxUnitPrice - minUnitPrice)) * 100 : 50;

      supplier.rawScores.totalPrice = priceScore;
      supplier.rawScores.shippingCost = shippingScore;
      supplier.rawScores.unitPrice = unitPriceScore;

      // Calculate weighted total score
      const weightedScore = 
        (supplier.rawScores.onTime * weights.onTime) +
        (supplier.rawScores.rating * weights.rating) +
        (supplier.rawScores.orders * weights.orders) +
        (supplier.rawScores.avgDelivery * weights.avgDelivery) +
        (supplier.rawScores.deliveryDate * weights.deliveryDate) +
        (supplier.rawScores.shippingCost * weights.shippingCost) +
        (supplier.rawScores.totalPrice * weights.totalPrice) +
        (supplier.rawScores.unitPrice * weights.unitPrice);

      return {
        ...supplier,
        finalScore: Math.round(weightedScore * 100) / 100,
        breakdown: {
          onTimeScore: Math.round(supplier.rawScores.onTime * weights.onTime * 100) / 100,
          ratingScore: Math.round(supplier.rawScores.rating * weights.rating * 100) / 100,
          ordersScore: Math.round(supplier.rawScores.orders * weights.orders * 100) / 100,
          deliveryScore: Math.round(supplier.rawScores.avgDelivery * weights.avgDelivery * 100) / 100,
          dateScore: Math.round(supplier.rawScores.deliveryDate * weights.deliveryDate * 100) / 100,
          shippingScore: Math.round(supplier.rawScores.shippingCost * weights.shippingCost * 100) / 100,
          priceScore: Math.round(supplier.rawScores.totalPrice * weights.totalPrice * 100) / 100,
          unitPriceScore: Math.round(supplier.rawScores.unitPrice * weights.unitPrice * 100) / 100
        }
      };
    });

    // Sort by final score (highest first)
    return finalScores.sort((a, b) => b.finalScore - a.finalScore);
  };

  // Add this function to handle the best quotation button
  const handleViewBestQuotations = () => {
    const rankedSuppliers = calculateBestQuotation(supplierDetails);
    
    // Navigate to best quotations page with data
    navigate('/purchasing/quotations/best', { 
      state: { 
        rankedSuppliers,
        originalData: supplierDetails,
        reqId 
      } 
    });
  };

  // Add this function to show quick best recommendation
  const getBestRecommendation = () => {
    const rankedSuppliers = calculateBestQuotation(supplierDetails);
    return rankedSuppliers?.[0] || null;
  };

  // FIXED: Use supplierDetails array instead of undefined suppliers
  const selectedSupplier = supplierDetails.find((s) => s.id === selected);

  // Filter suppliers based on search term
  const filteredSuppliers = supplierDetails.filter(
    (supplier) =>
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
        profileURL="/purchasing/profile"
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
                  Request ID{" "}
                  <span className="font-semibold text-main_dark">
                    #{reqId}
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
                      <p className="text-gray-600 text-sm">
                        {supplier.subtitle}
                      </p>
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
                              RS {supplier.price?.toLocaleString() || "0"}
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
                  <p className="text-gray-600">
                    {quotationList.length === 0 
                      ? "No quotations available for this request."
                      : "No quotations found matching your search."
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="sticky top-6">
              {/* Enhanced Best Quotations Button */}
              <div className="mb-6 mt-4 space-y-3">
                {/* <button
                  onClick={handleViewBestQuotations}
                  disabled={supplierDetails.length === 0}
                  className="w-full px-4 py-2 bg-web_yellow text-main_dark font-medium rounded-md hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaEye className="w-4 h-4" />
                  View Best Quotations (AI Ranked)
                </button> */}
                
                {/* Quick Best Recommendation */}
                {(() => {
                  const bestSupplier = getBestRecommendation();
                  return bestSupplier && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaStar className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-800 text-sm">AI Recommendation</span>
                      </div>
                      <div className="text-sm text-green-700">
                        <div className="font-medium">{bestSupplier.name}</div>
                        <div className="text-xs">Score: {bestSupplier.finalScore}/100</div>
                        <div className="text-xs">
                          Best for: {bestSupplier.onTime > 90 ? 'Reliability' : ''} 
                          {bestSupplier.rating > 4 ? ' • Quality' : ''} 
                          {bestSupplier.daysUntilDelivery <= 3 ? ' • Fast Delivery' : ''}
                        </div>
                      </div>
                    </div>
                  );
                })()}
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
                        RS {selectedSupplier.price?.toLocaleString() || "0"}
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
                      onClick={() =>
                        navigate(
                          `/purchasing/quotations/details/${selectedSupplier.id}`
                        )
                      }
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
