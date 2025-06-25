// src/pages/Supplier/RequestDetails.jsx
import React from "react";
import { FaCalendarAlt, FaUserTie } from "react-icons/fa";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests", active: true },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" }
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

const RequestDetails = () => (
  <div className="bg-purewhite min-h-screen font-poppins">
    {/* NavBar */}
    <NavBar links={navLinks} logoSrc="/logo1.png" />

    {/* Breadcrumb */}
    <div className="max-w-3xl mx-auto pt-8 pb-2 px-4 text-base text-slatebluegray">
      <a href="/dashboard1" className="hover:underline text-deep_green">Dashboard</a> &nbsp;/&nbsp;
      <a href="/requests" className="hover:underline text-deep_green">Request</a> &nbsp;/&nbsp;
      <span className="font-semibold">Request Details</span>
    </div>

    {/* Main Card */}
    <div className="max-w-3xl mx-auto bg-purewhite rounded-xl border border-gray-200 mt-2 p-0 overflow-hidden">
      {/* Header */}
      <div className="bg-deep_green px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-purewhite text-2xl font-bold mb-1">{request.title}</h2>
          <div className="text-web_yellow text-sm font-medium">Request ID: {request.id}</div>
        </div>
        <div className="mt-3 md:mt-0 flex gap-2">
          <span className="bg-light_gray text-slatebluegray px-4 py-1 rounded-full text-sm font-semibold">
            {request.status}
          </span>
          <span className="bg-web_yellow text-main_dark px-4 py-1 rounded-full text-sm font-semibold">
            {request.priority}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-light_gray">
        <div>
          <div className="text-slatebluegray text-sm mb-1">Material Type</div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-main_dark font-medium flex items-center gap-2">
            <FaUserTie className="text-deep_green" /> {request.materialType}
          </div>
        </div>
        <div>
          <div className="text-slatebluegray text-sm mb-1">Quantity Required</div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-main_dark font-bold">
            {request.quantity}
          </div>
        </div>
        <div>
          <div className="text-slatebluegray text-sm mb-1">Delivery Deadline</div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-main_dark font-medium flex items-center gap-2">
            <FaCalendarAlt className="text-deep_green" /> {request.deliveryDeadline}
          </div>
        </div>
        <div>
          <div className="text-slatebluegray text-sm mb-1">Requested By</div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-main_dark font-medium">
            {request.requestedBy}
          </div>
        </div>
        <div>
          <div className="text-slatebluegray text-sm mb-1">Quotation Deadline</div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-main_dark font-medium flex items-center gap-2">
            <FaCalendarAlt className="text-deep_green" /> {request.quotationDeadline}
          </div>
        </div>
        <div>
          <div className="text-slatebluegray text-sm mb-1">Budget Range</div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-main_dark font-medium">
            {request.budget}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-8 pt-8 pb-2">
        <div className="text-slatebluegray text-sm mb-1 font-semibold">Description & Requirements</div>
        <textarea
          className="w-full bg-gray-100 rounded-lg px-4 py-3 text-main_dark text-sm resize-none"
          rows={4}
          value={request.description}
          readOnly
        />
      </div>

      {/* Delivery Schedule */}
      <div className="px-8 pt-6 pb-2">
        <div className="text-slatebluegray text-sm mb-1 font-semibold">Delivery Schedule</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-gray-100 rounded-lg">
            <thead>
              <tr className="text-slatebluegray">
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Required Date</th>
                <th className="p-3 text-left">Quantity Split</th>
              </tr>
            </thead>
            <tbody>
              {request.deliverySchedule.map((sch, idx) => (
                <tr key={idx} className="bg-purewhite">
                  <td className="p-3">{sch.location}</td>
                  <td className="p-3">{sch.date}</td>
                  <td className="p-3">{sch.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="px-8 pt-6 pb-2">
        <div className="text-slatebluegray text-sm mb-1 font-semibold">Technical Specifications</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-main_dark text-sm bg-gray-100 rounded-lg px-4 py-3">
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

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 px-8 py-8 bg-purewhite border-t border-light_gray">
        <button className="flex-1 bg-web_yellow text-main_dark font-semibold py-3 rounded-lg hover:opacity-90 transition">
          Send Quotation
        </button>
        <a
          href="/requests"
          className="flex-1 flex items-center justify-center bg-deep_green text-purewhite font-semibold py-3 rounded-lg hover:opacity-90 transition"
        >
          &larr; Back to Requests
        </a>
      </div>
    </div>
  </div>
);

export default RequestDetails;
