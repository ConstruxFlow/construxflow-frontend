import React, { useEffect, useState } from "react";
import { FaDownload, FaUser, FaPlus } from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";
import { BsBag } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const MaterialReqDetails = () => {
  const { id } = useParams();
  const [internalNote, setInternalNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      RequestDate();
    }
  }, [id]);

  const RequestDate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/material-requests/find/${id}`
      );
      const data = await response.json();

      if (response.ok) {
        setRequestData(data);
        console.log(data);
      } else {
        toast.error("Failed to fetch material request details");
      }
    } catch (error) {
      toast.error("Network error: Failed to fetch material request");
      console.error("Error fetching material request:", error);
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handleApproveRequest = (status) => async () => {
    if (requestData.status?.toLowerCase() !== "pending") {
      toast.error("Only pending requests can be approved");
      return;
    }else{
      handleApproveRequest1(status);
    }
  };

  const handleApproveRequest1 = async (status) => {
    if (requestData.status?.toLowerCase() !== "pending") {
      toast.error("Only pending requests can be approved");
      return;
    }
    setIsLoadingStatus(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/material-requests/${id}/status?status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedRequest = await response.json();
        setRequestData(updatedRequest);
        setIsLoadingStatus(false);
        toast.success(`Material request ${status} successfully`);
        if(status=="APPROVED"){
          navigate("/purchasing/materialrequests/create", { state: { id: updatedRequest.requestId } });
        }else{
          navigate('/purchasing/materialrequests/overview');
        }
      } else {
          toast.error("Failed to approve material request");
          setIsLoadingStatus(false);
      }
    } catch (error) {
      toast.error("Network error: Failed to approve material request");
      console.error("Error approving material request:", error);
      setIsLoadingStatus(false);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading material request details...</p>
        </div>
      </div>
    );
  }
  if (isLoadingStatus) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Updating material request status...</p>
        </div>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No request data found</p>
          <button
            onClick={() => navigate("/purchasing/materialrequests/overview")}
            className="mt-4 px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors"
          >
            Back to Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
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
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a
              href="/purchasing/materialrequests/overview"
              className="hover:text-main_dark"
            >
              Material Requests
            </a>
            <span>›</span>
            <span className="text-main_dark font-medium">
              MR-{requestData.requestId}
            </span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-main_dark">
                Material Request #{requestData.requestId}
              </h1>
              <span className="text-gray-600 text-xs">
                Created on {formatDate(requestData.requestDate)}
              </span>
            </div>
            <div className="flex gap-3 mt-4 lg:mt-0">
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                    requestData.status
                  )}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      requestData.status?.toLowerCase() === "pending"
                        ? "bg-yellow-500"
                        : requestData.status?.toLowerCase() === "approved"
                        ? "bg-green-500"
                        : requestData.status?.toLowerCase() === "rejected"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  {requestData.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    requestData.priority
                  )}`}
                >
                  {requestData.priority} Priority
                </span>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-3">
              {/* Request Details */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Request Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Project Name
                    </label>
                    <p className="text-slatebluegray font-medium">
                      {requestData.projectName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {requestData.projectId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Project Phase
                    </label>
                    <p className="text-slatebluegray font-medium">
                      {requestData.phaseName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Request Date
                    </label>
                    <p className="text-slatebluegray font-medium">
                      {formatDate(requestData.requestDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Priority Level
                    </label>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        requestData.priority
                      )}`}
                    >
                      {requestData.priority}
                    </span>
                  </div>
                  {requestData.additionalInfo && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Additional Information
                      </label>
                      <p className="text-slatebluegray font-medium bg-gray-50 p-3 rounded-md">
                        {requestData.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Requested Materials */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Requested Materials (
                  {requestData.requestedMaterials?.length || 0} items)
                </h2>
                <div className="space-y-4">
                  {requestData.requestedMaterials?.map((material, index) => (
                    <div
                      key={material.requestedMaterialId}
                      className="flex items-center gap-4 p-4 bg-light_brown/20 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-slatebluegray">
                          {material.materialName}
                        </h3>
                        {material.materialType && (
                          <p className="text-sm text-gray-600">
                            Type: {material.materialType}
                          </p>
                        )}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium mt-1 inline-block ${getStatusColor(
                            material.status
                          )}`}
                        >
                          {material.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slatebluegray">
                          {material.quantity} {material.unitOfMeasurement}
                        </p>
                        <p className="text-sm text-gray-600">
                          ID: {material.requestedMaterialId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Status Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-deep_green rounded-full flex items-center justify-center flex-shrink-0">
                      <FaPlus className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slatebluegray">
                        Request Created
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(requestData.requestDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        requestData.status?.toLowerCase() === "pending"
                          ? "bg-web_yellow"
                          : "bg-gray-300"
                      }`}
                    >
                      <RiInformationLine
                        className={
                          requestData.status?.toLowerCase() === "pending"
                            ? "text-main_dark"
                            : "text-gray-500"
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          requestData.status?.toLowerCase() === "pending"
                            ? "text-slatebluegray"
                            : "text-gray-500"
                        }`}
                      >
                        {requestData.status === "PENDING"
                          ? "Pending Approval"
                          : requestData.status}
                      </h3>
                      <p
                        className={`text-sm ${
                          requestData.status?.toLowerCase() === "pending"
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {requestData.status?.toLowerCase() === "pending"
                          ? "Awaiting purchasing manager review"
                          : `Status: ${requestData.status}`}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start gap-4 ${
                      requestData.status?.toLowerCase() === "approved"
                        ? "opacity-100"
                        : "opacity-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        requestData.status?.toLowerCase() === "approved"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <IoMdCheckmark
                        className={
                          requestData.status?.toLowerCase() === "approved"
                            ? "text-white"
                            : "text-gray-500"
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          requestData.status?.toLowerCase() === "approved"
                            ? "text-slatebluegray"
                            : "text-gray-500"
                        }`}
                      >
                        Approved
                      </h3>
                      <p
                        className={`text-sm ${
                          requestData.status?.toLowerCase() === "approved"
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {requestData.status?.toLowerCase() === "approved"
                          ? "Request approved"
                          : "Pending"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 opacity-50">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <BsBag className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-500">Ordered</h3>
                      <p className="text-sm text-gray-400">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-3">
              {/* Quick Actions */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Quick Actions
                </h2>
                {requestData.status?.toLowerCase() === "pending" ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleApproveRequest("APPROVED")}
                      disabled={requestData.status?.toLowerCase() !== "pending"}
                      className={`w-full px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
                        requestData.status?.toLowerCase() === "pending"
                          ? "bg-deep_green text-purewhite hover:bg-deep_green/90"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <IoMdCheckmark />
                      Approve Request
                    </button>
                    <button
                      onClick={handleApproveRequest("REJECTED")}
                      disabled={requestData.status?.toLowerCase() !== "pending"}
                      className={`w-full px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
                        requestData.status?.toLowerCase() === "pending"
                          ? "bg-red-500 text-purewhite hover:bg-red-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <IoMdClose />
                      Reject Request
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    This request has been {requestData.status?.toLowerCase()}.
                  </p>
                )}
              </div>

              {/* Internal Notes */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Internal Notes
                </h2>
                <div className="space-y-4">
                  <div className="p-3 bg-light_brown/30 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-white">
                          SY
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-slatebluegray text-sm">
                          System
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                          {formatDate(requestData.requestDate)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Material request created for {requestData.projectName} -{" "}
                      {requestData.phaseName}
                    </p>
                  </div>

                  <div>
                    <textarea
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add internal note..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                      rows={3}
                    />
                    <button className="w-full mt-2 px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-medium">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Request Summary */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Request Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Total Materials
                    </span>
                    <span className="font-semibold text-main_dark">
                      {requestData.requestedMaterials?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Status
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        requestData.status
                      )}`}
                    >
                      {requestData.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Priority
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        requestData.priority
                      )}`}
                    >
                      {requestData.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MaterialReqDetails;
