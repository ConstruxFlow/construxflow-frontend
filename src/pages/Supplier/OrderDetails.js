// src/pages/Supplier/OrderDetails.jsx
import React from "react";
import { FaMapMarkerAlt, FaUser, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaTruck, FaRegCircle } from "react-icons/fa";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders", active: true },
  { name: "Payments", href: "/payments" },
];

// Mock data
const order = {
  id: "PO-2024-0156",
  project: "Downtown Office Complex",
  supplier: "BuildTech Materials Inc.",
  address: "123 Construction Ave, Downtown District, City 12345",
  orderDate: "March 15, 2024",
  deliveryDate: "March 22, 2024",
  items: [
    {
      name: "Steel Rebar Grade 60",
      type: "Reinforcement",
      quantity: "500 tons",
      unitPrice: 850,
      total: 425000,
    },
    {
      name: "Concrete Mix C25/30",
      type: "Concrete",
      quantity: "200 m³",
      unitPrice: 120,
      total: 24000,
    },
    {
      name: "Structural Steel Beams",
      type: "Steel",
      quantity: "150 units",
      unitPrice: 320,
      total: 48000,
    },
  ],
  total: 497000,
  paymentTimeline: [
    { label: "Advance Paid", date: "March 16, 2024", status: "completed" },
    { label: "Remaining Due", date: "Current Status", status: "pending" },
    { label: "Fully Paid", date: "Awaiting Payment", status: "upcoming" },
  ],
  status: "Ordered",
  statusTimeline: [
    { label: "Ordered", date: "Mar 15, 2024", icon: <FaCheckCircle />, completed: true },
    { label: "Dispatched", date: "Pending", icon: <FaTruck />, completed: false },
    { label: "Delivered", date: "Pending", icon: <FaRegCircle />, completed: false },
  ],
  contact: {
    name: "John Anderson",
    role: "Project Manager",
    phone: "+1 (555) 123-4567",
    email: "j.anderson@buildtech.com",
  },
};

const statusColors = {
  completed: "bg-deep_green text-purewhite",
  pending: "bg-web_yellow text-main_dark",
  upcoming: "bg-light_gray text-slatebluegray",
};

const OrderDetails = () => (
  <div className="bg-purewhite min-h-screen font-poppins">
    <NavBar links={navLinks} logoSrc="/logo1.png" />
    <div className="max-w-full mx-auto px-16 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-main_dark mb-1">Order Details</h1>
      <p className="text-gray-500 mb-8">Complete information about your received purchase order</p>

      {/* Top Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Order Card */}
        <div className="col-span-2 bg-[#f5f4f3] rounded-lg p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-web_yellow text-main_dark font-bold px-3 py-1 rounded text-sm">{order.id}</span>
            <span className="text-main_dark font-medium">{order.project}</span>
          </div>
          <div className="text-slatebluegray text-sm font-semibold mb-1">Project Name</div>
          <div className="flex items-center gap-2 text-slatebluegray text-sm mb-1">
            <FaUser className="text-deep_green" />
            <span>{order.supplier}</span>
          </div>
          <div className="flex items-center gap-2 text-slatebluegray text-sm mb-1">
            <FaMapMarkerAlt className="text-deep_green" />
            <span>{order.address}</span>
          </div>
          <div className="flex gap-8 mt-2">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-deep_green" />
              <span className="text-main_dark text-sm">{order.orderDate}</span>
              <span className="text-slatebluegray text-xs">Order Date</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTruck className="text-web_yellow" />
              <span className="text-main_dark text-sm">{order.deliveryDate}</span>
              <span className="text-slatebluegray text-xs">Delivery Date</span>
            </div>
          </div>
        </div>
        {/* Payment Timeline */}
        <div className="bg-purewhite border border-light_gray rounded-lg p-6 flex flex-col gap-4">
          <div className="font-semibold text-main_dark mb-1">Payment Timeline</div>
          <div className="flex flex-col gap-3">
            {order.paymentTimeline.map((pt, idx) => (
              <div key={pt.label} className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${pt.status === "completed"
                  ? "bg-deep_green"
                  : pt.status === "pending"
                    ? "bg-web_yellow"
                    : "bg-light_gray"
                  }`} />
                <div className="flex-1">
                  <span className="text-main_dark text-sm">{pt.label}</span>
                  <span className="ml-2 text-slatebluegray text-xs">{pt.date}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[pt.status]}`}>
                  {pt.status === "completed" && "Completed"}
                  {pt.status === "pending" && "Pending"}
                  {pt.status === "upcoming" && "Awaiting"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="rounded-lg overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-deep_green text-purewhite">
              <th className="px-6 py-4 text-left font-semibold">Item Name</th>
              <th className="px-6 py-4 text-left font-semibold">Type</th>
              <th className="px-6 py-4 text-left font-semibold">Quantity</th>
              <th className="px-6 py-4 text-left font-semibold">Unit Price</th>
              <th className="px-6 py-4 text-left font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={item.name} className={idx === 1 ? "bg-[#f5f4f3]" : "bg-purewhite"}>
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.type}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 font-semibold">${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-light_gray">
              <td colSpan={4} className="px-6 py-4 text-right font-bold">Total Amount:</td>
              <td className="px-6 py-4 text-right font-bold text-red-600 text-lg">
                ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Order Status */}
      <div className="bg-purewhite border border-light_gray rounded-lg p-6 mb-8">
        <div className="font-semibold text-main_dark mb-4">Order Status</div>
        <div className="flex items-center justify-between gap-2">
          {/* Timeline */}
          {order.statusTimeline.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center">
                <span className={`text-2xl mb-1 ${step.completed ? "text-deep_green" : "text-light_gray"}`}>
                  {step.icon}
                </span>
                <span className="text-main_dark text-sm font-semibold">{step.label}</span>
                <span className="text-slatebluegray text-xs">{step.date}</span>
              </div>
              {idx < order.statusTimeline.length - 1 && (
                <div className="flex-1 h-1 bg-light_gray mx-2 rounded" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button className="bg-web_yellow text-main_dark font-semibold px-6 py-2 rounded hover:opacity-90 transition">
            Mark as Dispatched
          </button>
        </div>
      </div>

      {/* Contact & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-purewhite border border-light_gray rounded-lg p-6 flex flex-col gap-3">
          <div className="font-semibold text-main_dark mb-2">Contact Information</div>
          <div className="flex items-center gap-2 text-main_dark">
            <FaUser className="text-deep_green" />
            <span className="font-semibold">{order.contact.name}</span>
            <span className="text-slatebluegray ml-2">{order.contact.role}</span>
          </div>
          <div className="flex items-center gap-2 text-main_dark">
            <FaPhoneAlt className="text-deep_green" />
            <span>{order.contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-main_dark">
            <FaEnvelope className="text-deep_green" />
            <span>{order.contact.email}</span>
          </div>
        </div>
        {/* Actions */}
        <div className="bg-purewhite border border-light_gray rounded-lg p-6 flex flex-col gap-4 justify-center">
          <button className="bg-web_yellow text-main_dark font-medium py-3 rounded-lg hover:opacity-90 transition">
            Download Invoice
          </button>
          <button className="bg-deep_green text-purewhite font-medium py-3 rounded-lg hover:opacity-90 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default OrderDetails;
