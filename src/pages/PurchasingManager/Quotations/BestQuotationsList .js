import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaDownload,
  FaDollarSign,
  FaTruck,
  FaCalendarAlt,
  FaStar,
  FaFileAlt
} from 'react-icons/fa';
import NavBar from '../../../components/NavBar';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const BestQuotationsList = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [quotationData, setQuotationData] = useState(null);
  const [bestQuotations, setBestQuotations] = useState([]);

  // Demo data with multiple quotations for each material
  const demoQuotationData = {
    requestId: 602,
    requestDetails: {
      requesterName: "John Smith",
      requestDate: "2025-01-15",
      quotationDeadline: "2025-01-25",
      priorityLevel: "High",
      status: "Best Quotations Selected"
    },
    requestedMaterials: [
      { materialId: 1, materialName: "Cement", requestedQuantity: 20, unit: "Bags" },
      { materialId: 2, materialName: "Steel 32mm", requestedQuantity: 25, unit: "Kg" },
      { materialId: 3, materialName: "Sand", requestedQuantity: 2, unit: "Tons" }
    ],
    // All available quotations
    allQuotations: [
      {
        quotationId: 101,
        supplierId: 1,
        supplierName: "BuildMart Supplies",
        supplierRating: 4.5,
        totalPrice: 250.00,
        deliveryDays: 3,
        deliveryDate: "2025-01-18",
        warranty: "6 months",
        paymentTerms: "Net 30",
        notes: "Premium quality cement with fast delivery",
        status: "Active",
        submittedDate: "2025-01-16",
        materials: [
          {
            materialId: 1,
            materialName: "Cement",
            requestedQuantity: 20,
            unit: "Bags",
            unitPrice: 12.50,
            totalPrice: 250.00
          }
        ]
      },
      {
        quotationId: 102,
        supplierId: 4,
        supplierName: "Cement Plus Ltd",
        supplierRating: 4.2,
        totalPrice: 280.00,
        deliveryDays: 5,
        deliveryDate: "2025-01-20",
        warranty: "3 months",
        paymentTerms: "Net 15",
        notes: "Standard quality cement",
        status: "Active",
        submittedDate: "2025-01-16",
        materials: [
          {
            materialId: 1,
            materialName: "Cement",
            requestedQuantity: 20,
            unit: "Bags",
            unitPrice: 14.00,
            totalPrice: 280.00
          }
        ]
      },
      {
        quotationId: 103,
        supplierId: 2,
        supplierName: "Steel Masters Ltd",
        supplierRating: 4.8,
        totalPrice: 2125.00,
        deliveryDays: 5,
        deliveryDate: "2025-01-20",
        warranty: "12 months",
        paymentTerms: "Net 45",
        notes: "High-grade steel with quality certification",
        status: "Active",
        submittedDate: "2025-01-16",
        materials: [
          {
            materialId: 2,
            materialName: "Steel 32mm",
            requestedQuantity: 25,
            unit: "Kg",
            unitPrice: 85.00,
            totalPrice: 2125.00
          }
        ]
      },
      {
        quotationId: 104,
        supplierId: 3,
        supplierName: "Iron Works Pro",
        supplierRating: 4.2,
        totalPrice: 2050.00,
        deliveryDays: 7,
        deliveryDate: "2025-01-22",
        warranty: "9 months",
        paymentTerms: "Net 30",
        notes: "Competitive pricing with reliable delivery",
        status: "Active",
        submittedDate: "2025-01-17",
        materials: [
          {
            materialId: 2,
            materialName: "Steel 32mm",
            requestedQuantity: 25,
            unit: "Kg",
            unitPrice: 82.00,
            totalPrice: 2050.00
          }
        ]
      },
      {
        quotationId: 105,
        supplierId: 5,
        supplierName: "Premium Steel Co",
        supplierRating: 4.6,
        totalPrice: 2200.00,
        deliveryDays: 4,
        deliveryDate: "2025-01-19",
        warranty: "18 months",
        paymentTerms: "Net 60",
        notes: "Premium steel with extended warranty",
        status: "Active",
        submittedDate: "2025-01-17",
        materials: [
          {
            materialId: 2,
            materialName: "Steel 32mm",
            requestedQuantity: 25,
            unit: "Kg",
            unitPrice: 88.00,
            totalPrice: 2200.00
          }
        ]
      },
      {
        quotationId: 106,
        supplierId: 6,
        supplierName: "Sand & Aggregates Ltd",
        supplierRating: 4.3,
        totalPrice: 90.00,
        deliveryDays: 2,
        deliveryDate: "2025-01-17",
        warranty: "N/A",
        paymentTerms: "Net 30",
        notes: "Fine quality sand suitable for construction",
        status: "Active",
        submittedDate: "2025-01-16",
        materials: [
          {
            materialId: 3,
            materialName: "Sand",
            requestedQuantity: 2,
            unit: "Tons",
            unitPrice: 45.00,
            totalPrice: 90.00
          }
        ]
      },
      {
        quotationId: 107,
        supplierId: 7,
        supplierName: "Quality Sand Co",
        supplierRating: 4.0,
        totalPrice: 95.00,
        deliveryDays: 3,
        deliveryDate: "2025-01-18",
        warranty: "N/A",
        paymentTerms: "Net 15",
        notes: "Premium washed sand",
        status: "Active",
        submittedDate: "2025-01-16",
        materials: [
          {
            materialId: 3,
            materialName: "Sand",
            requestedQuantity: 2,
            unit: "Tons",
            unitPrice: 47.50,
            totalPrice: 95.00
          }
        ]
      }
    ]
  };

  useEffect(() => {
    fetchQuotationData();
  }, [requestId]);

  const fetchQuotationData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setQuotationData(demoQuotationData);
        const bestQuots = findBestQuotations(demoQuotationData);
        setBestQuotations(bestQuots);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to fetch quotation data');
      setIsLoading(false);
    }
  };

  // Algorithm to find best quotations for each material
  const findBestQuotations = (data) => {
    const bestQuotations = [];
    
    // Group quotations by material
    const materialQuotations = {};
    data.allQuotations.forEach(quotation => {
      quotation.materials.forEach(material => {
        if (!materialQuotations[material.materialId]) {
          materialQuotations[material.materialId] = [];
        }
        materialQuotations[material.materialId].push({
          ...quotation,
          materialSpecific: material
        });
      });
    });

    // Find best quotation for each material based on multiple criteria
    data.requestedMaterials.forEach(requestedMaterial => {
      const quotationsForMaterial = materialQuotations[requestedMaterial.materialId] || [];
      
      if (quotationsForMaterial.length > 0) {
        // Score each quotation based on price, delivery time, and rating
        const scoredQuotations = quotationsForMaterial.map(quotation => {
          const priceScore = 1 / quotation.materialSpecific.totalPrice; // Lower price = higher score
          const deliveryScore = 1 / quotation.deliveryDays; // Faster delivery = higher score
          const ratingScore = quotation.supplierRating / 5; // Rating out of 5
          
          // Weighted scoring: 50% price, 30% delivery, 20% rating
          const totalScore = (priceScore * 0.5) + (deliveryScore * 0.3) + (ratingScore * 0.2);
          
          return {
            ...quotation,
            score: totalScore
          };
        });

        // Sort by score and get the best one
        scoredQuotations.sort((a, b) => b.score - a.score);
        bestQuotations.push(scoredQuotations[0]);
      }
    });

    return bestQuotations;
  };

  const getTotalCost = () => {
    return bestQuotations.reduce((total, quotation) => {
      return total + quotation.materialSpecific.totalPrice;
    }, 0);
  };

  const getBestQuotationBadge = (quotation, materialId) => {
    // Find all quotations for this material to compare
    const materialQuotations = quotationData.allQuotations.filter(q => 
      q.materials.some(m => m.materialId === materialId)
    );
    
    const lowestPrice = Math.min(...materialQuotations.map(q => 
      q.materials.find(m => m.materialId === materialId).totalPrice
    ));
    const fastestDelivery = Math.min(...materialQuotations.map(q => q.deliveryDays));
    const highestRating = Math.max(...materialQuotations.map(q => q.supplierRating));

    if (quotation.materialSpecific.totalPrice === lowestPrice) {
      return { label: "Best Price", color: "bg-green-100 text-green-800" };
    }
    if (quotation.deliveryDays === fastestDelivery) {
      return { label: "Fastest", color: "bg-blue-100 text-blue-800" };
    }
    if (quotation.supplierRating === highestRating) {
      return { label: "Top Rated", color: "bg-yellow-100 text-yellow-800" };
    }
    return { label: "Best Match", color: "bg-purple-100 text-purple-800" };
  };

  const handleFinalizeSelection = async () => {
    try {
      const selectedData = bestQuotations.map(quotation => ({
        quotationId: quotation.quotationId,
        supplierId: quotation.supplierId,
        materialId: quotation.materialSpecific.materialId
      }));

      console.log('Finalizing best quotations:', selectedData);
      toast.success('Best quotations finalized successfully!');
    } catch (error) {
      toast.error('Failed to finalize quotations');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Quotations details...</p>
        </div>
      </div>
    );
  }

  if (!quotationData) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          links={[
            { name: "Dashboard", path: "/purchasing/dashboard" },
            { name: "Requests", path: "/purchasing/materialrequests/overview" },
            { name: "Orders", path: "/orders" },
            { name: "Suppliers", path: "/purchasing/supplier/dashboard" },
            { name: "Reports", path: "/reports" },
          ]}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotations Found</h3>
            <p className="text-gray-600">No quotations available for this request.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
        links={[
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Orders', path: '/orders' },
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div className="flex-1">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slatebluegray text-sm mb-4 hover:underline"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Request Details
              </button>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                    Best Quotations - Request #{quotationData.requestId}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-gray-600 text-sm">
                      Requested by: <span className="font-semibold text-main_dark">{quotationData.requestDetails.requesterName}</span>
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium w-fit">
                      {quotationData.requestDetails.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button 
                onClick={handleFinalizeSelection}
                className="px-4 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <FaCheck className="w-4 h-4" />
                Accept Best Quotations
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
                <FaDownload className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{quotationData.requestedMaterials.length}</div>
              <div className="text-sm text-gray-600">Materials Requested</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-deep_green">{bestQuotations.length}</div>
              <div className="text-sm text-gray-600">Best Quotations</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-web_yellow">{quotationData.allQuotations.length}</div>
              <div className="text-sm text-gray-600">Total Received</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">${getTotalCost().toFixed(2)}</div>
              <div className="text-sm text-gray-600">Best Total Cost</div>
            </div>
          </div>

          {/* Best Quotations List */}
          <div className="space-y-6">
            {bestQuotations.map((quotation) => {
              const badge = getBestQuotationBadge(quotation, quotation.materialSpecific.materialId);
              
              return (
                <div
                    onClick={()=>navigate(`/purchasing/quotations/details`)}
                  key={quotation.quotationId}
                  className="border-2 border-web_yellow bg-yellow-50 rounded-lg p-6 shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-main_dark text-lg">{quotation.supplierName}</h3>
                        <div className="flex items-center gap-1">
                          <FaStar className="w-4 h-4 text-web_yellow" />
                          <span className="text-sm font-medium">{quotation.supplierRating}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-web_yellow text-main_dark">
                          SELECTED
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{quotation.notes}</p>
                    </div>
                    <div className="w-8 h-8 bg-web_yellow rounded-full flex items-center justify-center">
                      <FaCheck className="w-4 h-4 text-main_dark" />
                    </div>
                  </div>

                  {/* Material Details */}
                  <div className="mb-4">
                    <h4 className="font-medium text-main_dark mb-2">Material:</h4>
                    <div className="bg-light_brown/30 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Material Name</label>
                          <div className="font-semibold text-main_dark">{quotation.materialSpecific.materialName}</div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Quantity</label>
                          <div className="font-semibold text-main_dark">
                            {quotation.materialSpecific.requestedQuantity} {quotation.materialSpecific.unit}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Unit Price</label>
                          <div className="font-semibold text-main_dark">${quotation.materialSpecific.unitPrice}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quotation Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Total Price</label>
                      <div className="font-bold text-main_dark text-lg">${quotation.materialSpecific.totalPrice}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Delivery</label>
                      <div className="font-semibold text-main_dark flex items-center gap-1">
                        <FaTruck className="w-3 h-3" />
                        {quotation.deliveryDays} days
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Payment Terms</label>
                      <div className="font-semibold text-main_dark">{quotation.paymentTerms}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Warranty</label>
                      <div className="font-semibold text-main_dark">{quotation.warranty}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Delivery Date: </span>
                      <span className="font-medium">{new Date(quotation.deliveryDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted: </span>
                      <span className="font-medium">{new Date(quotation.submittedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Summary */}
          <div className="mt-8 bg-light_brown rounded-lg p-6">
            <h3 className="text-lg font-semibold text-main_dark mb-4">Best Quotations Summary</h3>
            <div className="space-y-3">
              {bestQuotations.map((quotation) => (
                <div key={quotation.quotationId} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-main_dark">{quotation.materialSpecific.materialName}</span>
                    <span className="text-gray-600 ml-2">
                      ({quotation.materialSpecific.requestedQuantity} {quotation.materialSpecific.unit})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-main_dark">${quotation.materialSpecific.totalPrice}</div>
                    <div className="text-sm text-gray-600">{quotation.supplierName}</div>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-main_dark text-lg">Total Best Cost:</span>
                  <span className="font-bold text-web_yellow text-xl">${getTotalCost().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BestQuotationsList;
