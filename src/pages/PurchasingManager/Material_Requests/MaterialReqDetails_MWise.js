import React, { useState } from "react";
import {
  FaDownload,
  FaUser,
  FaPlus,
  FaCheck,
  FaTimes,
  FaComment,
} from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { RiInformationLine } from "react-icons/ri";
import { BsBag } from "react-icons/bs";
import NavBar from "../../../components/NavBar";

const MaterialReqDetails_MWise = () => {
  const [internalNote, setInternalNote] = useState("");

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar
        links={
            [
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Orders', path: '/orders' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Reports', path: '/reports' }
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
                Material Request #Steel-2024-001
              </h1>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-3">
              {/* Material Details */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Material Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Material Name
                    </label>
                    <p className="text-main_dark font-medium">Steel Rebar</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Requested By
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-main_dark font-medium">
                        Sarah Johnson
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Specification
                    </label>
                    <p className="text-main_dark font-medium">12mm diameter</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Total Quantity Needed
                    </label>
                    <p className="text-main_dark font-medium">500 units</p>
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
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center justify-center gap-2">
                    <IoMdCheckmark />
                    Approve Request
                  </button>
                  <button className="w-full px-4 py-3 bg-red-500 text-purewhite rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <IoMdClose />
                    Reject Request
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-3">
            <div className="lg:col-span-4 space-y-3">
              {/* Project Breakdown */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Project Breakdown
                </h2>
                <div className="block md:hidden">
                  {/* Mobile Card Layout */}
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold">Downtown Office Complex</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Requested by:</span>{" "}
                          Sarah Johnson
                        </p>
                        <p>
                          <span className="font-medium">Date:</span> March 15,
                          2024
                        </p>
                        <p>
                          <span className="font-medium">Location:</span> Site A
                          - Building 2
                        </p>
                        <p>
                          <span className="font-medium">Quantity:</span> 300
                          units
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold">Downtown Office Complex</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Requested by:</span>{" "}
                          Sarah Johnson
                        </p>
                        <p>
                          <span className="font-medium">Date:</span> March 15,
                          2024
                        </p>
                        <p>
                          <span className="font-medium">Location:</span> Site A
                          - Building 2
                        </p>
                        <p>
                          <span className="font-medium">Quantity:</span> 300
                          units
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full">
                    <thead className="bg-light_brown/30">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                          Project Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                          Requested By
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                          Required Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                          Delivery Location
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-slatebluegray">
                          Downtown Office Complex
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p className="text-slatebluegray font-medium">
                              Sarah Johnson
                            </p>
                            <p className="text-gray-500 text-xs">
                              Site Manager
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          March 15, 2024
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Site A - Building 2
                        </td>
                        <td className="px-4 py-3 text-sm text-main_dark font-medium">
                          300 units
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-slatebluegray">
                          Riverside Mall Extension
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p className="text-slatebluegray font-medium">
                              Mike Chen
                            </p>
                            <p className="text-gray-500 text-xs">
                              Site Manager
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          March 18, 2024
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Site B - Phase 1
                        </td>
                        <td className="px-4 py-3 text-sm text-main_dark font-medium">
                          200 units
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MaterialReqDetails_MWise;
