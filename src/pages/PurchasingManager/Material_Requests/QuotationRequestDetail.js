import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaDownload,
  FaCalendarAlt,
  FaDollarSign,
  FaTruck,
  FaFileAlt,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import { RiNewspaperLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import NavBar from "../../../components/NavBar";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const QuotationRequestDetail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchQuotationRequest();
    }
  }, [id]);

  const fetchQuotationRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/quotationrequest/find/${id}`
      );
      const data = await response.json();
      // console.log(data);

      if (data.status === "success") {
        setRequestData(data.data);
      } else {
        toast.error("Failed to fetch quotation request details");
      }
    } catch (error) {
      toast.error("Network error: Failed to fetch quotation request");
      console.error("Error fetching quotation request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isWithinOneHour = () => {
    const createdAt = new Date(requestData.createdDate);
    const now = new Date();
    const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

    return now - createdAt <= oneHourInMs;
  };

  const handleStatusUpdate = async (newStatus) => {
    // try {
    //   const response = await fetch(`http://localhost:8080/api/quotationrequest/${id}/status`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ status: newStatus }),
    //   });
    //   if (response.ok) {
    //     setRequestData(prev => ({ ...prev, status: newStatus }));
    //     toast.success(`Request ${newStatus.toLowerCase()} successfully`);
    //   } else {
    //     toast.error('Failed to update status');
    //   }
    // } catch (error) {
    //   toast.error('Network error: Failed to update status');
    // }
  };

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

  if (!requestData) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          links={[
            { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
          ]}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Request Not Found
            </h3>
            <p className="text-gray-600">
              The quotation request you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
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
          { name: "Orders", path: "/orders" },
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
                Back to Quotation Requests
              </button>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                    Quotation Request #{requestData.id}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-gray-600 text-sm">
                      Requested by:{" "}
                      <span className="font-semibold text-main_dark">
                        {requestData.requesterName}
                      </span>
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(
                        requestData.status
                      )}`}
                    >
                      {requestData.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getPriorityColor(
                        requestData.priorityLevel
                      )}`}
                    >
                      {requestData.priorityLevel} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/purchasing/quotations/dashboard",{ state: { reqId: requestData.id } })}
                className="px-4 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RiNewspaperLine className="w-4 h-4" />
                Applied Quotations
              </button>
              {/* {requestData.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleStatusUpdate("Approved")}
                    className="px-4 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaCheck className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("Rejected")}
                    className="px-4 py-2 bg-red-500 text-purewhite rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaTimes className="w-4 h-4" />
                    Reject
                  </button>
                  </>
                  )} */}
              {isWithinOneHour() && (
                <button
                  onClick={() =>
                    navigate(
                      `/purchasing/quotationrequest/edit/${requestData.id}`
                    )
                  }
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate("Rejected")}
                className="px-4 py-2 bg-red-500 text-purewhite rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <MdDelete className="w-4 h-4" />
                Delete Request
              </button>

              {/* <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
                <FaDownload className="w-4 h-4" />
                Export
              </button> */}
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="w-4 h-4 text-web_yellow" />
                <span className="text-sm font-medium text-gray-600">
                  Request Date
                </span>
              </div>
              <div className="text-lg font-bold text-main_dark">
                {formatDate(requestData.requestDate)}
              </div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="w-4 h-4 text-deep_green" />
                <span className="text-sm font-medium text-gray-600">
                  Deadline
                </span>
              </div>
              <div className="text-lg font-bold text-main_dark">
                {formatDate(requestData.quotationDeadline)}
              </div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaFileAlt className="w-4 h-4 text-slatebluegray" />
                <span className="text-sm font-medium text-gray-600">
                  Materials
                </span>
              </div>
              <div className="text-lg font-bold text-main_dark">
                {requestData.quotationReqMaterials?.length || 0}
              </div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaDollarSign className="w-4 h-4 text-web_yellow" />
                <span className="text-sm font-medium text-gray-600">
                  Est. Cost
                </span>
              </div>
              <div className="text-lg font-bold text-main_dark">
                {requestData.estimatedCost
                  ? `$${requestData.estimatedCost.toLocaleString()}`
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-purewhite border border-gray-200 rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "materials", label: "Materials" },
                  { id: "delivery", label: "Delivery" },
                  { id: "documents", label: "Documents" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-web_yellow text-web_yellow"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Request Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                      <FaUser className="w-5 h-5 text-deep_green" />
                      Request Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Requester Name
                        </label>
                        <p className="font-semibold text-main_dark">
                          {requestData.requesterName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Request Type
                        </label>
                        <p className="font-semibold text-main_dark">
                          {requestData.quotationType}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Priority Level
                        </label>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                            requestData.priorityLevel
                          )}`}
                        >
                          {requestData.priorityLevel}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Current Status
                        </label>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            requestData.status
                          )}`}
                        >
                          {requestData.status}
                        </span>
                      </div>
                      {requestData.managerid && (
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1">
                            Manager ID
                          </label>
                          <p className="font-semibold text-main_dark">
                            {requestData.managerid}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                      <FaCalendarAlt className="w-5 h-5 text-web_yellow" />
                      Timeline
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Request Date
                        </label>
                        <p className="font-semibold text-main_dark">
                          {formatDate(requestData.requestDate)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Quotation Deadline
                        </label>
                        <p className="font-semibold text-main_dark">
                          {formatDate(requestData.quotationDeadline)}
                        </p>
                      </div>
                      {requestData.createdDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1">
                            Created Date
                          </label>
                          <p className="font-semibold text-main_dark">
                            {new Date(requestData.createdDate).toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                          Estimated Cost
                        </label>
                        <p className="font-semibold text-main_dark text-lg">
                          {requestData.estimatedCost
                            ? `$${requestData.estimatedCost.toLocaleString()}`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-main_dark mb-4">
                      Additional Information
                    </h3>
                    <div className="bg-light_brown/30 p-4 rounded-lg">
                      <p className="text-main_dark">
                        {requestData.additionalInfo ||
                          "No additional information provided."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Materials Tab */}
              {activeTab === "materials" && (
                <div>
                  <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                    <FaFileAlt className="w-5 h-5 text-deep_green" />
                    Requested Materials
                  </h3>

                  {requestData.quotationReqMaterials &&
                  requestData.quotationReqMaterials.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-light_brown/30">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                              Material ID
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                              Material Name
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                              Type
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                              Unit
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                              unit Price
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                              Estimated Cost
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {requestData.quotationReqMaterials.map(
                            (item, index) => (
                              <tr
                                key={item.quotationReqMaterialId || index}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 text-sm font-medium text-main_dark">
                                  #{item.material.materialId}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-main_dark">
                                  {item.material.materialName}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {item.material.materialType}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {item.material.unitOfMeasurement}
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-main_dark">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-main_dark">
                                  {item.unitPrice}
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-main_dark">
                                  {item.estimatedCost}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        No materials specified for this request
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Tab */}
              {activeTab === "delivery" && (
                <div>
                  <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                    <FaTruck className="w-5 h-5 text-deep_green" />
                    Delivery Schedule
                  </h3>

                  {requestData.quotationReqDelivery &&
                  requestData.quotationReqDelivery.length > 0 ? (
                    <div className="space-y-4">
                      {requestData.quotationReqDelivery.map(
                        (delivery, index) => (
                          <div
                            key={delivery.quotationReqDeliveryId || index}
                            className="bg-light_gray/30 rounded-lg p-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600 block mb-1">
                                  <FaMapMarkerAlt className="inline w-4 h-4 mr-1" />
                                  Delivery Location
                                </label>
                                <p className="font-semibold text-main_dark">
                                  {delivery.location}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600 block mb-1">
                                  <FaCalendarAlt className="inline w-4 h-4 mr-1" />
                                  Delivery Date
                                </label>
                                <p className="font-semibold text-main_dark">
                                  {formatDate(delivery.deliveryDate)}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600 block mb-1">
                                  <FaFileAlt className="inline w-4 h-4 mr-1" />
                                  Quantity Split
                                </label>
                                <p className="font-semibold text-main_dark">
                                  {delivery.quantitySplit == null
                                    ? "Not specified"
                                    : delivery.quantitySplit}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaTruck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        No delivery schedule specified for this request
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div>
                  <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                    <FaFileAlt className="w-5 h-5 text-slatebluegray" />
                    Attached Documents
                  </h3>

                  {requestData.quotationReqDocs &&
                  requestData.quotationReqDocs.length > 0 ? (
                    <div className="space-y-4">
                      {requestData.quotationReqDocs.map((document, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FaFileAlt className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-main_dark">
                                {document.documentName}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{document.documentType}</span>
                                <span>
                                  Request ID: {document.quotationReqId}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="text-deep_green hover:text-deep_green/80 transition-colors">
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button className="text-deep_green hover:text-deep_green/80 transition-colors">
                              <FaDownload className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        No documents attached to this request
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuotationRequestDetail;
