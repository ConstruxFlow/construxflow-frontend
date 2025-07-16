import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarAlt, FaUserTie, FaMoneyCheckAlt, FaFileInvoiceDollar
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations", active: true },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" }
];

const QuotationDetails = () => {
  const { id } = useParams(); // Get ID from route
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/quotations/find/${id}`)
      .then(res => setQuotation(res.data))
      .catch(err => {
        console.error("Failed to fetch quotation details", err);
      });
  }, [id]);

  if (!quotation) {
    return <div className="text-center text-gray-700 mt-10">Loading...</div>;
  }

  const items = quotation.items || [];
  const deliveryInfos = quotation.deliveryInfos || [];
  const attachments = quotation.attachments || [];

  return (
    <div className="bg-[#f6f7f9] min-h-screen font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-3xl mx-auto pt-8 pb-2 px-4 text-sm text-slatebluegray">
        <a href="/dashboard1" className="hover:underline text-deep_green">Dashboard</a> &nbsp;/&nbsp;
        <a href="/quotations" className="hover:underline text-deep_green">Quotations</a> &nbsp;/&nbsp;
        <span className="font-semibold">Quotation Details</span>
      </div>

      <div className="max-w-3xl mx-auto bg-purewhite rounded-md border border-light_gray mt-2 shadow overflow-hidden">
        {/* Header */}
        <div className="bg-deep_green px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-purewhite text-lg font-semibold mb-1">Quotation ID: QTN-{quotation.id}</h2>
            <div className="text-purewhite text-sm">Request ID: REQ-{quotation.quotationRequestId}</div>
          </div>
          <div className="mt-3 md:mt-0">
            <span className="bg-main_dark text-purewhite px-4 py-1 rounded-full text-sm font-medium">
              {quotation.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="px-8 pt-8 pb-2">
          {/* Parties & Meta */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <DetailCard label="Submitted By" value={quotation.supplierId || "N/A"} icon={<FaUserTie />} />
            <DetailCard label="Submitted Date" value={new Date(quotation.createdAt).toLocaleDateString()} icon={<FaCalendarAlt />} />
          </div>
          {/* Quoted Items */}
          <DetailSection title="Quoted Items">
            <div className="text-sm text-main_dark divide-y">
              {items.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span className="font-semibold">{item.material?.materialName || "-"}</span>
                  <div className="text-right">
                    <div>{item.quantity} {item.unit}</div>
                    <div>${item.unitPrice.toFixed(2)} / unit</div>
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>

          {/* Advanced Payment */}
          <DetailSection title="Advanced Payment">
            <div className="flex items-center gap-3 text-main_dark text-sm">
              <FaMoneyCheckAlt className="text-deep_green" />
              <span>${quotation.advancedPayment?.toFixed(2) || "0.00"}</span>
            </div>
          </DetailSection>

          {/* Delivery Info */}
          <DetailSection title="Delivery Information">
            <div className="grid gap-4 text-sm">
              {deliveryInfos.map((d, idx) => (
                <div key={idx} className="border border-light_gray p-4 rounded-lg bg-white">
                  <div><strong>Location:</strong> {d.location}</div>
                  <div><strong>Date:</strong> {d.deliveryDate}</div>
                  <div><strong>Shipping Cost:</strong> ${d.shippingCost?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </DetailSection>

          {/* Payment Terms */}
          <DetailSection title="Payment Terms">
            <div className="flex items-center gap-3 text-main_dark text-sm">
              <FaFileInvoiceDollar className="text-deep_green" />
              <span>{quotation.paymentTerms}</span>
            </div>
          </DetailSection>

          {/* Notes */}
          <DetailSection title="Additional Notes">
            <div className="text-sm text-main_dark">{quotation.notes || "—"}</div>
          </DetailSection>

          {/* Attachments */}
          <DetailSection title="Attachments">
            {attachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm border-b py-2 last:border-0">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                  {att.fileType?.includes("pdf") ? "📄" : "🖼️"}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{att.fileName}</div>
                  <div className="text-xs text-gray-500">{att.fileUrl}</div>
                </div>
                <a href={att.fileUrl} download className="p-1 rounded hover:bg-light_gray transition">
                  <FiDownload className="text-lg" />
                </a>
              </div>
            ))}
          </DetailSection>
        </div>

        {/* Summary & Back */}
        <div className="px-8 py-6 bg-light_gray border-t border-light_gray">
          {quotation.totalAmount && (
            <>
              <div className="font-semibold text-main_dark text-lg mb-2">Quotation Summary</div>
              <div className="text-sm text-main_dark">
                <div>Subtotal: <span className="font-bold">${Number(quotation.totalAmount).toFixed(2)}</span></div>
              </div>
            </>
          )}
        </div>
        <div className="px-8 py-6">
          <button
            onClick={() => navigate("/quotations")}
            className="w-full bg-deep_green text-white py-3 rounded-lg font-semibold hover:opacity-90"
          >
            ← Back to Quotations
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ label, value, icon }) => (
  <div className="bg-white border border-light_gray rounded-lg p-5 flex flex-col gap-1">
    <div className="text-slatebluegray text-sm font-medium mb-1">{label}</div>
    <div className="flex items-center gap-2 text-main_dark">
      {icon}
      <span>{value}</span>
    </div>
  </div>
);

const DetailSection = ({ title, children }) => (
  <div className="mb-6">
    <div className="text-slatebluegray text-sm font-semibold mb-2">{title}</div>
    <div className="bg-white border border-light_gray rounded-lg p-5">{children}</div>
  </div>
);

export default QuotationDetails;
