import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarAlt, FaUserTie, FaMoneyCheckAlt, FaFileInvoiceDollar,
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations", active: true },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments" },
];

const SectionTitle = ({ children }) => (
  <h2 className="text-lg md:text-xl font-bold text-main_dark mb-1 border-b border-light_gray pb-1">{children}</h2>
);

const MetaLine = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-main_dark text-sm">
    {icon}
    <span className="font-semibold">{label}:</span>
    <span className="text-slatebluegray">{value}</span>
  </div>
);

const QuotationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/quotations/find/${id}`)
      .then((res) => setQuotation(res.data))
      .catch((err) => {
        console.error("Failed to fetch quotation details", err);
      });
  }, [id]);

  if (!quotation) {
    return <div className="text-center text-main_dark/70 mt-16 text-lg">Loading...</div>;
  }

  const items = quotation.items || [];
  const deliveryInfos = quotation.deliveryInfos || [];
  const attachments = quotation.attachments || [];

  return (
    <div className="bg-[#f7fafa] min-h-screen font-poppins">
      <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />
      {/* Breadcrumb */}
      <div className="max-w-full mx-auto pt-8 pb-0 px-4 sm:px-12 md:px-16 text-sm text-slatebluegray">
        <a href="/supplier/dashboard" className=" text-deep_green font-semibold">Dashboard</a> /{" "}
        <a href="/supplier/quotations" className=" text-deep_green font-semibold">Quotations</a> /
        <span className="font-bold text-main_dark"> Quotation Details</span>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-12 md:px-16 my-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Main (left) content */}
        <main className="flex-1 min-w-0 space-y-10">
          <header className="mb-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-main_dark">
                  Quotation <span className="text-web_yellow">QTN-{quotation.id}</span>
                </h1>
                <div className="text-gray-600 mt-2 text-sm">
                  For Request <span className="text-gray-600">REQ-{quotation.quotationRequestId}</span>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <span className={`rounded-md border border-web_yellow px-5 py-1 text-base font-medium bg-web_yellow text-main_dark`}>
                  {quotation.status}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6 text-main_dark/90">
              <MetaLine
                icon={<FaUserTie className="text-deep_green" />}
                label="Submitted By"
                value={quotation.supplierId || "N/A"}
              />
              <MetaLine
                icon={<FaCalendarAlt className="text-deep_green" />}
                label="Submitted Date"
                value={quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString() : "-"}
              />
            </div>
          </header>

          {/* Main details */}
          <section>
            <SectionTitle>Quoted Items</SectionTitle>
            {items.length === 0 ? (
              <div className="text-slatebluegray py-2">No items quoted.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm mt-2 min-w-max">
                  <thead>
                    <tr className="text-left border-b border-light_gray text-slatebluegray font-semibold">
                      <th className="py-2">Material</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Quantity</th>
                      {/* <th className="py-2">Unit</th> */}
                      <th className="py-2 text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-light_gray/50 transition">
                        <td className="py-2 font-medium">{item.material?.materialName || "-"}</td>
                        <td className="py-2">{item.material?.materialType || "-"}</td>
                        <td className="py-2">{item.quantity}</td>
                        {/* <td className="py-2">{item.unit}</td> */}
                        <td className="py-2 text-right text-main_dark">RS {item.unitPrice?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <SectionTitle>Advanced Payment</SectionTitle>
            <div className="flex items-center gap-3 text-main_dark font-medium text-lg mt-3 mb-2">
              <FaMoneyCheckAlt className="text-deep_green" />
              <span>RS {quotation.advancedPayment?.toFixed(2) || "0.00"}</span>
            </div>
          </section>

          <section>
            <SectionTitle>Delivery Information</SectionTitle>
            {deliveryInfos.length === 0 ? (
              <div className="text-slatebluegray py-2">No delivery info.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm mt-2 min-w-max">
                  <thead>
                    <tr className="text-left border-b border-light_gray text-slatebluegray font-semibold">
                      <th className="py-2">Location</th>
                      <th className="py-2">Delivery Date</th>
                      <th className="py-2">Shipping Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryInfos.map((d, idx) => (
                      <tr key={idx} className="hover:bg-light_gray/50">
                        <td className="py-2">{d.location}</td>
                        <td className="py-2">{d.deliveryDate}</td>
                        <td className="py-2">RS {d.shippingCost?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <SectionTitle>Payment Terms</SectionTitle>
            <div className="flex items-center gap-3 text-main_dark text-base mt-3 mb-2">
              <FaFileInvoiceDollar className="text-deep_green" />
              <span>{quotation.paymentTerms || "-"}</span>
            </div>
          </section>

          <section>
            <SectionTitle>Additional Notes</SectionTitle>
            <div className="text-main_dark text-sm mt-2">{quotation.notes || "—"}</div>
          </section>

          <section>
            <SectionTitle>Attachments</SectionTitle>
            {attachments.length === 0 ? (
              <div className="text-slatebluegray py-2">No attachments.</div>
            ) : (
              <ul className="divide-y divide-light_gray mt-2">
                {attachments.map((att, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 py-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-xl">
                      {att.fileType?.includes("pdf") ? "📄" : "🖼️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-main_dark">{att.fileName}</div>
                      <div className="text-xs text-gray-500 truncate">{att.fileUrl}</div>
                    </div>
                    <a href={att.fileUrl} download className="p-2 rounded hover:bg-light_gray transition" title="Download">
                      <FiDownload className="text-lg text-deep_green" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
        {/* Right sidebar summary */}
        <aside className="w-full lg:w-72 flex-shrink-0 mt-6 lg:mt-0 lg:pl-6">
          <div className="sticky top-8">
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-bold text-main_dark border-b border-light_gray pb-1">Quotation Summary</h2>
              <div className="flex justify-between mt-4">
                <span className="text-gray-700 font-medium">Total Amount:</span>
                <span className="font-extrabold text-main_dark text-lg">Rs {Number(quotation.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-3 text-sm">
                <span className="text-slatebluegray">Advanced Payment:</span>
                <span className="font-bold text-web_yellow">Rs {quotation.advancedPayment?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-bold text-main_dark border-b border-light_gray pb-1">Supplier Info</h2>
              <div className="flex flex-col gap-2 mt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slatebluegray">Supplier ID</span>
                  <span className="text-main_dark">{quotation.supplierId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slatebluegray">Submitted At</span>
                  <span className="text-main_dark">{quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString() : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slatebluegray">Status</span>
                  <span className="text-main_dark font-semibold">{quotation.status}</span>
                </div>
              </div>
            </div>
            {/* --- UPDATE BUTTON ADDED HERE --- */}
            <button
              onClick={() => navigate(`/supplier/quotations/update/${quotation.id}`)}
              className="w-full bg-web_yellow text-main_dark font-semibold py-3 mb-2 rounded-lg shadow hover:bg-web_yellow/80 border border-web_yellow transition"
            >
              Update Quotation
            </button>
            <button
              onClick={() => navigate("/supplier/quotations")}
              className="w-full bg-deep_green text-white py-3 rounded-lg font-medium hover:bg-main_dark transition"
            >
              ← Back to Quotations
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuotationDetails;
