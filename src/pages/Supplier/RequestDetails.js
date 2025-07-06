// src/pages/Supplier/RequestDetails.jsx
import React from "react";
import { FaCalendarAlt, FaUserTie } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import { FiDownload } from "react-icons/fi";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests", active: true },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" }
];

const request = {
  id: "#REQ-2024-0156",
  requestedBy: "John Smith",
  requestedDate: "March 15, 2024",
  quotationDeadline: "February 17, 2024",
  priority: "High Priority",
  status: "Pending",
  materials: [
    { name: "Steel Pipes", type: "Grade 60", quantity: "500 units" },
    { name: "Concrete Mix", type: "Type II", quantity: "25 bags" }
  ],
  deliverySchedule: [
    { location: "Warehouse A", date: "02/24/2024", quantity: "100" }
  ],
  description: "",
  attachments: [
    { name: "Material Specifications.pdf", size: "2.3 MB" },
    { name: "Site Layout.jpg", size: "1.8 MB" }
  ]
};

const RequestDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f7f9] min-h-screen font-poppins">
      {/* NavBar */}
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto pt-8 pb-2 px-4 text-sm text-slatebluegray">
        <a href="/dashboard1" className="hover:underline text-deep_green">Dashboard</a> &nbsp;/&nbsp;
        <a href="/requests" className="hover:underline text-deep_green">Request</a> &nbsp;/&nbsp;
        <span className="font-semibold">Request Details</span>
      </div>

      {/* Main Card */}
      <div className="max-w-3xl mx-auto bg-purewhite rounded-md border border-light_gray mt-2 shadow p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-deep_green px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-purewhite text-lg font-semibold mb-1">Request ID: {request.id}</div>
          </div>
          <div className="mt-3 md:mt-0 flex gap-2">
            <span className="bg-main_dark text-purewhite px-4 py-1 rounded-full text-sm font-medium">
              {request.status}
            </span>
            <span className="bg-web_yellow text-main_dark px-4 py-1 rounded-full text-sm font-medium">
              {request.priority}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-8 pt-8 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Requested By */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Requested By</div>
              <div className="flex items-center gap-2 text-main_dark">
                <FaUserTie className="text-deep_green" />
                <span>{request.requestedBy}</span>
              </div>
            </div>
            {/* Requested Date */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Requested Date</div>
              <div className="flex items-center gap-2 text-main_dark">
                <FaCalendarAlt className="text-deep_green" />
                <span>{request.requestedDate}</span>
              </div>
            </div>
            {/* Quotation Deadline */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Quotation Deadline</div>
              <div className="flex items-center gap-2 text-main_dark">
                <FaCalendarAlt className="text-deep_green" />
                <span>{request.quotationDeadline}</span>
              </div>
            </div>
            {/* Priority Level */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Priority Level</div>
              <div className="flex items-center gap-2 text-main_dark">
                <span>{request.priority}</span>
              </div>
            </div>
          </div>

          {/* Requested Materials */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Requested Materials</div>
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 text-main_dark text-sm">
              {request.materials.map((mat, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{mat.name}</div>
                    <div className="text-xs text-slatebluegray">Type : {mat.type}</div>
                  </div>
                  <div className="font-semibold">{mat.quantity}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Schedule */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Delivery Schedule</div>
            <div className="bg-light_gray rounded-lg p-4 flex flex-col md:flex-row gap-4">
              {/* Location */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-slatebluegray mb-1">Location</label>
                <select
                  className="w-full px-3 py-2 border border-light_gray rounded-md bg-white text-main_dark text-sm focus:outline-none"
                  value={request.deliverySchedule[0].location}
                  disabled
                >
                  <option>{request.deliverySchedule[0].location}</option>
                </select>
              </div>
              {/* Required Date */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-slatebluegray mb-1">Required Date</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-light_gray rounded-md bg-white text-main_dark text-sm focus:outline-none"
                  value={request.deliverySchedule[0].date}
                  disabled
                />
              </div>
              {/* Quantity Split */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-slatebluegray mb-1">Quantity Split</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-light_gray rounded-md bg-white text-main_dark text-sm focus:outline-none"
                  value={request.deliverySchedule[0].quantity}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Description & Requirements */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Description & Requirements</div>
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 text-main_dark text-sm min-h-[48px]">
              Additional Requirements or specifications…..
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Attachments</div>
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 text-main_dark text-sm flex flex-col gap-3">
              {request.attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded bg-${file.name.endsWith('.pdf') ? 'red-100' : 'blue-100'}`}>
                    {file.name.endsWith('.pdf') ? (
                      <span className="text-red-600 text-xl">📄</span>
                    ) : (
                      <span className="text-blue-600 text-xl">🖼️</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-slatebluegray">{file.size}</div>
                  </div>
                  <button className="p-2 rounded hover:bg-light_gray transition">
                    <FiDownload className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 px-8 py-8 bg-purewhite border-t border-light_gray">
          <button
            className="flex-1 bg-web_yellow text-main_dark font-medium py-3 rounded-lg hover:opacity-90 transition"
            onClick={() => navigate("/quotations/submit")}
          >
            Send Quotation
          </button>
          <button
            className="flex-1 flex items-center justify-center bg-deep_green text-purewhite font-medium py-3 rounded-lg hover:opacity-90 transition"
            onClick={() => navigate("/requests")}
          >
            &larr; Back to Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;




