// src/pages/Supplier/RequestDetails.jsx
import React from "react";
import { FaCalendarAlt, FaUserTie } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests", active: true },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
  { name: "Profile", href: "/profile" }
];

const request = {
  id: "#REQ-2024-0156",
  title: "High-Precision Industrial Sensors",
  status: "Pending",
  priority: "High Priority",
  materialType: "Industrial Sensors",
  quantity: "250 units",
  deliveryDeadline: "March 15, 2024",
  requestedBy: "Construction Manager",
  quotationDeadline: "February 17, 2024",
  budget: "$15,000 - $20,000",
  description:
    "We require high-precision industrial sensors for our smart building automation system. The sensors must be compatible with IoT protocols and capable of monitoring temperature, humidity, and air quality. They should have wireless connectivity and battery life of at least 2 years. Certification for industrial environments is mandatory.",
  deliverySchedule: [
    {
      location: "Warehouse A",
      date: "02/24/2024",
      quantity: "100",
    },
  ],
  technical: {
    temperature: "-20°C to +70°C",
    accuracy: "±0.1°C",
    connectivity: "LoRaWAN, WiFi",
    power: "3.6V Lithium Battery",
  },
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
            <h2 className="text-purewhite text-2xl font-bold mb-1">{request.title}</h2>
            <div className="text-web_yellow text-sm font-medium">Request ID: {request.id}</div>
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
            {/* Material Type */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Material Type</div>
              <div className="flex items-center gap-2 text-main_dark">
                <FaUserTie className="text-deep_green" />
                <span>{request.materialType}</span>
              </div>
            </div>
            {/* Quantity Required */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Quantity Required</div>
              <div className="flex items-center gap-2 text-main_dark font-bold text-lg">
                <span className="text-lg">{request.quantity}</span>
              </div>
            </div>
            {/* Delivery Deadline */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Delivery Deadline</div>
              <div className="flex items-center gap-2 text-main_dark">
                <FaCalendarAlt className="text-deep_green" />
                <span>{request.deliveryDeadline}</span>
              </div>
            </div>
            {/* Requested By */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Requested By</div>
              <div className="flex items-center gap-2 text-main_dark">
                <FaUserTie className="text-deep_green" />
                <span>{request.requestedBy}</span>
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
            {/* Budget Range */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Budget Range</div>
              <div className="flex items-center gap-2 text-main_dark font-semibold">
                <span className="text-deep_green">$</span>
                <span>{request.budget}</span>
              </div>
            </div>
          </div>

          {/* Description & Requirements */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Description & Requirements</div>
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 text-main_dark text-sm">
              {request.description}
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

          {/* Technical Specifications */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Technical Specifications</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-main_dark text-sm border border-light_gray bg-purewhite rounded-lg px-4 py-3">
              <div>
                <span className="font-medium">Operating Temperature:</span>
                <span className="ml-1">{request.technical.temperature}</span>
              </div>
              <div>
                <span className="font-medium">Accuracy:</span>
                <span className="ml-1">{request.technical.accuracy}</span>
              </div>
              <div>
                <span className="font-medium">Connectivity:</span>
                <span className="ml-1">{request.technical.connectivity}</span>
              </div>
              <div>
                <span className="font-medium">Power Supply:</span>
                <span className="ml-1">{request.technical.power}</span>
              </div>
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
          <a
            href="/requests"
            className="flex-1 flex items-center justify-center bg-deep_green text-purewhite font-medium py-3 rounded-lg hover:opacity-90 transition"
          >
            &larr; Back to Requests
          </a>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;



