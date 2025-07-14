import React, { useState } from "react";
import { FaDownload, FaUser, FaPlus } from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";
import { BsBag } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const MaterialReqDetails = () => {
  const [internalNote, setInternalNote] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar
        links={
            [
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Orders', path: '/orders' },
        ]
        }
      />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/purchasing/materialrequests/overview" className="hover:text-main_dark">
              Material Requests
            </a>
            <span>›</span>
            <span className="text-main_dark font-medium">MR-2024-001</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-main_dark">
                Material Request #MR-2024-001
              </h1>
              <span className="text-gray-600 text-xs">Created 2 hours ago</span>
            </div>
            <div className="flex gap-3 mt-4 lg:mt-0">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Pending Approval
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
                      Downtown Office Complex
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Requested By
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <FaUser className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slatebluegray font-medium">
                        Sarah Johnson
                      </span>
                      <span className="text-gray-500 text-sm">
                        (Site Manager)
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Required Date
                    </label>
                    <p className="text-slatebluegray font-medium">March 15, 2024</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Delivery Location
                    </label>
                    <p className="text-slatebluegray font-medium">
                      Site A - Building 2
                    </p>
                  </div>
                </div>
              </div>

              {/* Requested Materials */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Requested Materials
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-light_brown/20 rounded-lg">
                    {/* <div className="w-10 h-10 bg-deep_green rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div> */}
                    <div className="flex-1">
                      <h3 className="font-medium text-slatebluegray">
                        Steel Rebar - Grade 60
                      </h3>
                      <p className="text-sm text-gray-600">SKU: STL-RB-60-12</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slatebluegray">
                        500 units
                      </p>
                      <p className="text-sm text-gray-600">12mm diameter</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-light_brown/20 rounded-lg">
                    {/* <div className="w-10 h-10 bg-deep_green rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div> */}
                    <div className="flex-1">
                      <h3 className="font-medium text-slatebluegray">
                        Concrete Mix - Type II
                      </h3>
                      <p className="text-sm text-gray-600">SKU: CON-MX-T2-50</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slatebluegray">25 bags</p>
                      <p className="text-sm text-gray-600">50kg each</p>
                    </div>
                  </div>
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
                        Today at 2:30 PM by Sarah Johnson
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-web_yellow rounded-full flex items-center justify-center flex-shrink-0">
                      <RiInformationLine />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slatebluegray">
                        Pending Approval
                      </h3>
                      <p className="text-sm text-gray-600">
                        Awaiting purchasing manager review
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 opacity-50">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <IoMdCheckmark />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-500">Approved</h3>
                      <p className="text-sm text-gray-400">Pending</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 opacity-50">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <BsBag />
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
            <div className="lg:col-span-1 space-y-3 ">
              {/* Quick Actions */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button onClick={()=>navigate('/purchasing/materialrequests/create')} className="w-full px-4 py-3 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center justify-center gap-2">
                    <IoMdCheckmark/>
                    Approve Request
                  </button>
                  <button className="w-full px-4 py-3 bg-red-500 text-purewhite rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <IoMdClose />
                    Reject Request
                  </button>
                </div>
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
                          MC
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-slatebluegray text-sm">
                          Mike Chen
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                          1 hour ago
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Steel rebar prices have increased 5% this week. Consider
                      bulk ordering.
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

              {/* Attachments */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Attachments
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-main_dark text-sm">
                          Material Specifications.pdf
                        </p>
                      </div>
                    </div>
                    <button className="text-deep_green hover:text-deep_green/80">
                      <FaDownload className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-main_dark text-sm">
                          Site Layout.jpg
                        </p>
                        <p className="text-xs text-gray-500">1.8 MB</p>
                      </div>
                    </div>
                    <button className="text-deep_green hover:text-deep_green/80">
                      <FaDownload className="w-4 h-4" />
                    </button>
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
