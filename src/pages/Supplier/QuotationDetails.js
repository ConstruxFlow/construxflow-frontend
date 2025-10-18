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

  // Function to check if quotation can be updated
  const canUpdateQuotation = () => {
    if (!quotation) return false;
    
    // Cannot update if status is Approved, Accepted, or Rejected
    const nonEditableStatuses = ['Approved', 'Accepted', 'Rejected'];
    if (nonEditableStatuses.includes(quotation.status)) {
      return false;
    }
    
    // Check if 24 hours have passed since creation
    if (quotation.createdAt) {
      const createdTime = new Date(quotation.createdAt).getTime();
      const currentTime = new Date().getTime();
      const hoursPassed = (currentTime - createdTime) / (1000 * 60 * 60);
      
      // Cannot update if more than 24 hours have passed
      if (hoursPassed > 24) {
        return false;
      }
    }
    
    return true;
  };

  // Calculate time remaining for update
  const getTimeRemaining = () => {
    if (!quotation || !quotation.createdAt) return null;
    
    const createdTime = new Date(quotation.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursPassed = (currentTime - createdTime) / (1000 * 60 * 60);
    const hoursRemaining = 24 - hoursPassed;
    
    if (hoursRemaining <= 0) return null;
    
    if (hoursRemaining < 1) {
      const minutesRemaining = Math.floor(hoursRemaining * 60);
      return `${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`;
    }
    
    return `${Math.floor(hoursRemaining)} hour${Math.floor(hoursRemaining) !== 1 ? 's' : ''}`;
  };

  if (!quotation) {
    return (
      <div className="min-h-screen bg-[#f7fafa] font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotation details...</p>
        </div>
      </div>
    );
  }

  const items = quotation.items || [];
  const deliveryInfos = quotation.deliveryInfos || [];
  const attachments = quotation.attachments || [];
  const canUpdate = canUpdateQuotation();
  const timeRemaining = getTimeRemaining();

  return (
    <div className="bg-[#f7fafa] min-h-screen font-poppins">
      <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />
      
      {/* Breadcrumb */}
      <div className="max-w-full mx-auto pt-8 pb-0 px-4 sm:px-12 md:px-16 text-sm text-slatebluegray">
        <a href="/supplier/dashboard" className="text-deep_green font-semibold hover:underline">Dashboard</a> /{" "}
        <a href="/supplier/quotations" className="text-deep_green font-semibold hover:underline">Quotations</a> /
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
                      <th className="py-2 text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-light_gray/50 transition">
                        <td className="py-2 font-medium">{item.material?.materialName || "-"}</td>
                        <td className="py-2">{item.material?.materialType || "-"}</td>
                        <td className="py-2">{item.quantity}</td>
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
              {quotation.advancedPaymentPercentage && (
                <span className="text-sm text-gray-500">
                  ({quotation.advancedPaymentPercentage}%)
                </span>
              )}
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
                    {/* <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-xl">
                      {att.fileType?.includes("pdf") ? "" : ""}
                    </div> */}
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
                <span className="font-extrabold text-main_dark text-lg">RS {Number(quotation.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-3 text-sm">
                <span className="text-slatebluegray">Advanced Payment:</span>
                <span className="font-bold text-web_yellow">RS {quotation.advancedPayment?.toFixed(2) || "0.00"}</span>
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

            {/* Update Button - Conditional Rendering */}
            {canUpdate ? (
              <div className="mb-4">
                <button
                  onClick={() => navigate(`/supplier/quotations/update/${quotation.id}`)}
                  className="w-full bg-web_yellow text-main_dark font-semibold py-3 rounded-lg shadow hover:bg-web_yellow/80 border border-web_yellow transition"
                >
                  Update Quotation
                </button>
                
                {/* Show time remaining if within 24 hours */}
                {timeRemaining && (
                  <div className="mt-2 text-xs text-center text-gray-500">
                    Can update for {timeRemaining} more
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Update Not Available</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {quotation.status === 'Approved' || quotation.status === 'Accepted' ? (
                    <span>Quotation has been {quotation.status.toLowerCase()} and cannot be modified.</span>
                  ) : quotation.status === 'Rejected' ? (
                    <span>Quotation has been rejected and cannot be modified.</span>
                  ) : (
                    <span>The 24-hour update window has expired.</span>
                  )}
                </div>
              </div>
            )}

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
