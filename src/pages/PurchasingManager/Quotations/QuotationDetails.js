import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaDownload,
  FaEdit,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaDollarSign,
  FaTruck,
  FaFileAlt,
} from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const QuotationDetail = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("Pending");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [quotationData1, setQuotationData] = useState(null);
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [quotationRequestDetails, setQuotationRequestDetails] = useState(null);

  const fetchQuotation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/quotations/find/${id}`
      );
      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        setQuotationData(data);
        const supplierResponse = await fetch(
          `http://localhost:8080/api/supplier/find/${data?.supplierId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const supplierData = await supplierResponse.json();
        if (!supplierResponse.ok) {
          throw new Error("Failed to fetch supplier");
        }
        setSupplierDetails(supplierData.data);
        const quotationReqResponse = await fetch(
          `http://localhost:8080/api/quotationrequest/find/${data?.quotationRequestId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const quotationReqData = await quotationReqResponse.json();
        if (!quotationReqResponse.ok) {
          throw new Error("Failed to fetch quotation request");
        }
        setQuotationRequestDetails(quotationReqData.data);
      } else {
        toast.error("Failed to fetch quotation details");
      }
    } catch (error) {
      toast.error("Network error: Failed to fetch quotation details");
      console.error("Error fetching quotation details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
  }, []);

  console.log(supplierDetails);
  console.log("Quotation Data:", quotationData1);
  console.log("Quotation Request Details:", quotationRequestDetails);

  // Sample quotation data based on the form structure
  const quotationData = {
    id: "RFQ-2024-001",
    requestSummary: {
      company: "TechCorp Industries",
      contact: "Sarah Johnson",
      deadline: "Dec 22, 2024",
      itemsRequested: "Steel Pipes (6mm)",
      quantity: "500 units",
    },
    pricingInformation: {
      unitPrice: 4.5,
      totalPrice: 2250.0,
      tax: 225.0,
      advancedPayment: 450.0,
      finalTotal: 2475.0,
    },
    deliveryInformation: {
      requiredDate: "2024-12-25",
      deliveryLocation: "Warehouse A - Building 2",
      shippingCost: 150.0,
    },
    termsAndConditions: {
      paymentTerms: "Net 30 days",
      warrantyPeriod: "12 months",
      validityPeriod: "2024-12-31",
    },
    additionalNotes:
      "Special instructions: Bulk discount applied. Free installation and setup included. Quality certification required.",
    attachments: [
      { name: "Technical_Specifications.pdf", size: "2.3 MB" },
      { name: "Product_Catalog.pdf", size: "1.8 MB" },
    ],
    submittedDate: "2024-12-18",
    submittedBy: "Global Office Solutions",
    status: "Pending",
  };

  const updateStatus = async (newStatus) => {
    const response = await fetch(
      `http://localhost:8080/api/quotations/${quotationData1?.id || id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body:newStatus
      }
    );
  };

  const handleStatusChange = (newStatus) => {
    // http://localhost:8080/api/quotations/{id}/status
    // status

    updateStatus(newStatus);
    setStatus(newStatus);
    navigate(`/purchasing/orders/create`, {
      state: { id: quotationData1?.id },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Quotation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
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
                Back to Quotations
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Quotation Details
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-gray-600 text-sm sm:text-base">
                  Quotation ID:{" "}
                  <span className="font-semibold text-main_dark">
                    {quotationData1?.id}
                  </span>
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Main Details */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Request Summary */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">
                  Request Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Company
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {supplierDetails?.company_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Contact
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {supplierDetails?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Quotation Request Deadline
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {quotationRequestDetails?.quotationDeadline || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Contact Number
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {supplierDetails?.userDetails.phone_number1 || "N/A"}
                    </p>
                  </div>
                  {/* <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Quantity
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {quotationData.requestSummary.quantity}
                    </p>
                  </div> */}
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                  <FaDollarSign className="text-web_yellow" />
                  Pricing Information
                </h3>

                {quotationData1 &&
                quotationData1.items &&
                quotationData1.items.length > 0 ? (
                  quotationData1.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-3"
                    >
                      <div className="bg-light_gray/30 p-3 sm:p-4 rounded-lg">
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Item
                        </label>
                        <p className="font-medium text-main_dark text-lg">
                          {item.material?.materialName || "N/A"}
                        </p>
                      </div>
                      <div className="bg-light_gray/30 p-3 sm:p-4 rounded-lg">
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Unit Price
                        </label>
                        <p className="font-medium text-main_dark text-lg">
                          LKR
                          {item.material ? item.unitPrice.toFixed(2) : "0.00"}
                        </p>
                      </div>
                      <div className="bg-light_gray/30 p-3 sm:p-4 rounded-lg">
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Total Price
                        </label>
                        <p className="font-medium text-main_dark">
                          $
                          {item.totalPrice
                            ? item.totalPrice.toFixed(2)
                            : "0.00"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">
                    {quotationData1 === null
                      ? "Loading items..."
                      : "No items found in this quotation."}
                  </div>
                )}

                {/* wdqs */}
                <div className="bg-light_gray/30 p-3 sm:p-4 rounded-lg sm:col-span-2 lg:col-span-1 mt-5">
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Advanced Payment
                  </label>
                  <p className="font-medium text-web_yellow">
                    LKR
                    {quotationData1?.advancedPayment || "0.00"}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-lg font-semibold text-main_dark">
                      Total Amount
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-main_dark">
                      ${quotationData1?.totalAmount || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                  <FaTruck className="text-deep_green" />
                  Delivery Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Required Date
                    </label>
                    <p className="font-medium text-main_dark flex items-center gap-2 text-sm sm:text-base">
                      <FaCalendarAlt className="text-web_yellow w-4 h-4" />
                      {new Date(
                        quotationRequestDetails?.quotationReqDelivery[0]
                          .deliveryDate || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Delivery Date
                    </label>
                    <p className="font-medium text-main_dark flex items-center gap-2 text-sm sm:text-base">
                      <FaCalendarAlt className="text-web_yellow w-4 h-4" />
                      {new Date(
                        quotationData?.deliveryInformation.requiredDate || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Shipping Cost
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      LKR
                      {quotationData1?.deliveryInfos[0]?.shippingCost || "0.00"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Delivery Location
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {quotationData1?.deliveryInfos[0]?.location || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                  <FaFileAlt className="text-slatebluegray" />
                  Terms & Conditions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Payment Terms
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {quotationData1?.paymentTerms || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Warranty Period
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {quotationData.termsAndConditions.warrantyPeriod || "N/A"}
                    </p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                      Validity Period
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {new Date(
                        quotationData1?.notes || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">
                  Additional Notes
                </h3>
                <div className="bg-light_brown/30 p-3 sm:p-4 rounded-lg">
                  <p className="text-main_dark text-sm sm:text-base">
                    {quotationData1?.notes || ""}
                  </p>
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">
                  Attachments
                </h3>
                <div className="space-y-3">
                  {quotationData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                          <FaFileAlt className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-main_dark text-sm truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <button className="text-deep_green hover:text-deep_green/80 transition-colors flex-shrink-0 ml-2">
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quotation Summary */}
              <div className=" border rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Quotation Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold text-main_dark">
                      ${quotationData1?.totalAmount.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-700">Shipping:</span>
                    <span className="font-semibold text-main_dark">
                      $
                      {quotationData1?.deliveryInfos[0]?.shippingCost.toFixed(
                        2
                      ) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-web_yellow text-sm sm:text-base">
                    <span className="font-medium">Advanced Payment:</span>
                    <span className="font-semibold">
                      -$
                      {quotationData1?.advancedPayment.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  {/* <hr className="border-gray-400" />
                  <div className="flex justify-between">
                    <span className="font-bold text-main_dark text-base sm:text-lg">
                      Total:
                    </span>
                    <span className="font-bold text-web_yellow text-lg sm:text-xl">
                      ${quotationData.pricingInformation.finalTotal.toFixed(2)}
                    </span>
                  </div> */}
                </div>
              </div>

              {/* Supplier Information */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">
                  Supplier Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block">
                      Submitted By
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {supplierDetails?.company_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block">
                      Submitted Date
                    </label>
                    <p className="font-medium text-main_dark text-sm sm:text-base">
                      {new Date(
                        quotationData1?.createdAt || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block">
                      Current Status
                    </label>
                    <p
                      className={`font-medium text-sm sm:text-base ${
                        quotationData1?.status === "Approved"
                          ? "text-green-600"
                          : quotationData1?.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {quotationData1?.status || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleStatusChange("Approved")}
                    className="w-full px-4 py-3 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <FaCheck className="w-4 h-4" />
                    Approve Quotation
                  </button>
                  <button
                    onClick={() => handleStatusChange("Rejected")}
                    className="w-full px-4 py-3 bg-[#B85450] hover:bg-[#A0524E] text-purewhite rounded-md transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <FaTimes className="w-4 h-4" />
                    Reject Quotation
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                    <FaEdit className="w-4 h-4" />
                    Request Negotiation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuotationDetail;
