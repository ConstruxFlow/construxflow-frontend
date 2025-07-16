// src/pages/Supplier/QuotationDetails.jsx
import React from "react";
import { FaCalendarAlt, FaUserTie, FaMoneyCheckAlt, FaFileInvoiceDollar } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import { FiDownload } from "react-icons/fi";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations", active: true },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" }
];

// Example quotation details (replace with real data from your API/store)
const quotation = {
  id: "#QTN-2024-0102",
  submittedBy: "Supplier Pvt Ltd",
  submittedDate: "July 14, 2025",
  status: "Submitted",
  requestId: "#REQ-2024-0156",
  contact: "Sarah Johnson",
  deadline: "Dec 22, 2024",
  items: [
    { name: "Steel Pipes (6mm)", quantity: 500, unitPrice: 12.5 },
    { name: "Concrete Mix", quantity: 25, unitPrice: 8.0 },
    { name: "Industrial Sensors", quantity: 250, unitPrice: 22.0 }
  ],
  advancedPayment: 1000.0,
  delivery: [
    { location: "Warehouse A", date: "12/30/2024", shippingCost: 150.0 }
  ],
  paymentTerms: "Net 30 Days",
  notes: "Bulk discount applied for steel pipes. Delivery within 10 days of order confirmation.",
  attachments: [
    { name: "Quotation.pdf", size: "1.2 MB" },
    { name: "ProductCertificates.jpg", size: "900 KB" }
  ],
  summary: {
    subtotal: 8750.0,
    shipping: 150.0,
    tax: 900.0,
    total: 9800.0
  }
};

const QuotationDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f7f9] min-h-screen font-poppins">
      {/* NavBar */}
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto pt-8 pb-2 px-4 text-sm text-slatebluegray">
        <a href="/dashboard1" className="hover:underline text-deep_green">Dashboard</a> &nbsp;/&nbsp;
        <a href="/quotations" className="hover:underline text-deep_green">Quotations</a> &nbsp;/&nbsp;
        <span className="font-semibold">Quotation Details</span>
      </div>

      {/* Main Card */}
      <div className="max-w-3xl mx-auto bg-purewhite rounded-md border border-light_gray mt-2 shadow p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-deep_green px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-purewhite text-lg font-semibold mb-1">Quotation ID: {quotation.id}</div>
            <div className="text-purewhite text-sm">For Request: {quotation.requestId}</div>
          </div>
          <div className="mt-3 md:mt-0 flex gap-2">
            <span className="bg-main_dark text-purewhite px-4 py-1 rounded-full text-sm font-medium">
              {quotation.status}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-8 pt-8 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Submitted By */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Submitted By</div>
              <div className="flex items-center gap-2 text-main_dark">
                <FaUserTie className="text-deep_green" />
                <span>{quotation.submittedBy}</span>
              </div>
            </div>
            {/* Submitted Date */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Submitted Date</div>
              <div className="flex items-center gap-2 text-main_dark">
                <FaCalendarAlt className="text-deep_green" />
                <span>{quotation.submittedDate}</span>
              </div>
            </div>
            {/* Contact */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Contact</div>
              <div className="flex items-center gap-2 text-main_dark">
                <span>{quotation.contact}</span>
              </div>
            </div>
            {/* Deadline */}
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex flex-col gap-1">
              <div className="text-slatebluegray text-sm font-medium mb-1">Deadline</div>
              <div className="flex items-center gap-2 text-main_dark">
                <FaCalendarAlt className="text-deep_green" />
                <span>{quotation.deadline}</span>
              </div>
            </div>
          </div>

          {/* Quotation Items */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Quoted Items</div>
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 text-main_dark text-sm">
              {quotation.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{item.name}</div>
                  </div>
                  <div className="flex gap-8">
                    <div>{item.quantity} units</div>
                    <div>${item.unitPrice.toFixed(2)} / unit</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Payment */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Advanced Payment</div>
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex items-center gap-3 text-main_dark text-sm">
              <FaMoneyCheckAlt className="text-deep_green" />
              <span>${quotation.advancedPayment.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Delivery Information</div>
            <div className="bg-light_gray rounded-lg p-4 flex flex-col md:flex-row gap-4">
              {quotation.delivery.map((d, idx) => (
                <div key={idx} className="flex-1">
                  <label className="block text-xs font-medium text-slatebluegray mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-light_gray rounded-md bg-white text-main_dark text-sm focus:outline-none"
                    value={d.location}
                    disabled
                  />
                  <label className="block text-xs font-medium text-slatebluegray mb-1 mt-2">Required Date</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-light_gray rounded-md bg-white text-main_dark text-sm focus:outline-none"
                    value={d.date}
                    disabled
                  />
                  <label className="block text-xs font-medium text-slatebluegray mb-1 mt-2">Shipping Cost</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-light_gray rounded-md bg-white text-main_dark text-sm focus:outline-none"
                    value={`$${d.shippingCost.toFixed(2)}`}
                    disabled
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Payment Terms</div>
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 flex items-center gap-3 text-main_dark text-sm">
              <FaFileInvoiceDollar className="text-deep_green" />
              <span>{quotation.paymentTerms}</span>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Additional Notes</div>
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 text-main_dark text-sm min-h-[48px]">
              {quotation.notes}
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <div className="text-slatebluegray text-sm font-semibold mb-1">Attachments</div>
            <div className="bg-purewhite border border-light_gray rounded-lg p-5 text-main_dark text-sm flex flex-col gap-3">
              {quotation.attachments.map((file, idx) => (
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

        {/* Quotation Summary */}
        <div className="px-8 py-6 bg-light_gray border-t border-light_gray">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div className="text-main_dark font-medium text-lg">Quotation Summary</div>
            <div className="text-main_dark text-sm">
              <div>Subtotal: <span className="font-semibold">${quotation.summary.subtotal.toFixed(2)}</span></div>
              <div>Shipping: <span className="font-semibold">${quotation.summary.shipping.toFixed(2)}</span></div>
              <div>Tax: <span className="font-semibold">${quotation.summary.tax.toFixed(2)}</span></div>
              <div className="text-lg mt-2">Total: <span className="font-bold">${quotation.summary.total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 px-8 py-8 bg-purewhite border-t border-light_gray">
          <button
            className="flex-1 flex items-center justify-center bg-deep_green text-purewhite font-medium py-3 rounded-lg hover:opacity-90 transition"
            onClick={() => navigate("/quotations")}
          >
            &larr; Back to Quotations
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetails;
