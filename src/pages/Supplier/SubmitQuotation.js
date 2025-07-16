// src/pages/Supplier/SubmitQuotation.jsx
import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import { FaPaperclip, FaTrash } from "react-icons/fa";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations", active: true },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
];

const itemsRequested = [
  { name: "Steel Pipes (6mm)", quantity: "500 units" },
  { name: "Concrete Mix", quantity: "25 bags" },
  { name: "Industrial Sensors", quantity: "250 units" },
];

const SubmitQuotation = () => {
  const [pricing, setPricing] = useState([
    { item: "", quantity: "", unitPrice: "" },
  ]);
  const [advancedPayment, setAdvancedPayment] = useState("");
  const [deliveries, setDeliveries] = useState([
    { requiredDate: "", deliveryLocation: "", shippingCost: "" },
  ]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Pricing handlers
  const handlePricingChange = (idx, e) => {
    const { name, value } = e.target;
    setPricing((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, [name]: value } : row
      )
    );
  };
  const handleAddPricing = () => {
    setPricing((prev) => [...prev, { item: "", quantity: "", unitPrice: "" }]);
  };
  const handleDeletePricing = (idx) => {
    setPricing((prev) => prev.filter((_, i) => i !== idx));
  };

  // Delivery handlers
  const handleDeliveryChange = (idx, e) => {
    const { name, value } = e.target;
    setDeliveries((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, [name]: value } : row
      )
    );
  };
  const handleAddLocation = () => {
    setDeliveries((prev) => [
      ...prev,
      { requiredDate: "", deliveryLocation: "", shippingCost: "" },
    ]);
  };
  const handleDeleteLocation = (idx) => {
    setDeliveries((prev) => prev.filter((_, i) => i !== idx));
  };

  // Attachment handler
  const handleAttachmentChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  // Calculate totals
  const subtotal = pricing.reduce(
    (sum, row) =>
      sum +
      (parseFloat(row.unitPrice || 0) * parseFloat(row.quantity || 0) || 0),
    0
  );
  const totalShipping = deliveries.reduce(
    (sum, row) => sum + parseFloat(row.shippingCost || 0),
    0
  );
  const total = subtotal + totalShipping;

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Basic validation
    if (
      pricing.some(
        (row) =>
          !row.item ||
          !row.quantity ||
          !row.unitPrice ||
          isNaN(row.quantity) ||
          isNaN(row.unitPrice)
      )
    ) {
      setErrorMsg("Please fill all pricing fields correctly.");
      return;
    }
    if (
      deliveries.some(
        (row) =>
          !row.requiredDate ||
          !row.deliveryLocation ||
          !row.shippingCost ||
          isNaN(row.shippingCost)
      )
    ) {
      setErrorMsg("Please fill all delivery fields correctly.");
      return;
    }
    if (!paymentTerms) {
      setErrorMsg("Please select payment terms.");
      return;
    }

    setLoading(true);

    // Prepare data object (only form details)
    const data = {
      advancedPayment: parseFloat(advancedPayment || 0),
      paymentTerms,
      notes,
      totalAmount: total, 
      items: pricing.map((row) => ({
        item: row.item,
        quantity: parseInt(row.quantity, 10),
        unitPrice: parseFloat(row.unitPrice || 0),
        totalPrice: parseFloat(row.unitPrice || 0) * parseInt(row.quantity || 0, 10),
      })),
      deliveryInfos: deliveries.map((row) => ({
        deliveryDate: row.requiredDate,
        location: row.deliveryLocation,
        shippingCost: parseFloat(row.shippingCost || 0),
      })),
      attachments: attachments.map((file) => ({
        fileName: file.name,
        fileType: file.type,
        fileUrl: "", // If you want to handle file uploads later
      })),
    };

    try {
      const response = await fetch("http://localhost:8080/api/quotations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMsg("Quotation submitted successfully!");
        setPricing([{ item: "", quantity: "", unitPrice: "" }]);
        setAdvancedPayment("");
        setDeliveries([{ requiredDate: "", deliveryLocation: "", shippingCost: "" }]);
        setPaymentTerms("");
        setNotes("");
        setAttachments([]);
      } else {
        const error = await response.text();
        setErrorMsg("Failed to submit quotation: " + error);
      }
    } catch (err) {
      setErrorMsg("Error submitting quotation: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f7f9] min-h-screen font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slatebluegray mb-2">
          <a href="/dashboard1" className="hover:underline text-deep_green">Dashboard</a> &nbsp;/&nbsp;
          <a href="/requests" className="hover:underline text-deep_green">Request</a> &nbsp;/&nbsp;
          <span className="font-semibold">Submit Quotation</span>
        </div>

        <h1 className="text-2xl font-bold text-main_dark mb-1">Submit Quotation</h1>
        <p className="text-gray-500 mb-6">Provide your best quote for the requested items</p>

        {/* Success/Error messages */}
        {successMsg && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
            {errorMsg}
          </div>
        )}

        {/* Request Summary (for display only, not sent to backend) */}
        <div className="bg-light_gray rounded-lg p-6 mb-7">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
            <div>
              <div className="flex items-center mb-3">
                <span className="text-main_dark font-medium text-lg mr-3">Request Summary</span>
                <span className="bg-deep_green text-purewhite px-4 py-1.5 rounded-full text-sm font-medium">
                  RFQ-2024-001
                </span>
              </div>
              <div className="mb-2">
                <span className="text-slatebluegray">Contact:</span>
                <span className="ml-2 text-main_dark">Sarah Johnson</span>
              </div>
              <div>
                <span className="text-slatebluegray">Deadline:</span>
                <span className="ml-2 text-web_yellow font-semibold">Dec 22, 2024</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="text-slatebluegray mb-2">Items Requested:</div>
              <table className="w-full text-main_dark">
                <tbody>
                  <tr>
                    <td>Steel Pipes (6mm)</td>
                    <td className="text-right">500 units</td>
                  </tr>
                  <tr>
                    <td>Concrete Mix</td>
                    <td className="text-right">25 bags</td>
                  </tr>
                  <tr>
                    <td>Industrial Sensors</td>
                    <td className="text-right">250 units</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Pricing Information */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              Pricing Information
            </div>
            <div className="space-y-4">
              {pricing.map((row, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm text-slatebluegray mb-1">Item Requested</label>
                    <select
                      name="item"
                      value={row.item}
                      onChange={(e) => handlePricingChange(idx, e)}
                      className="w-full border border-light_gray rounded-lg px-3 py-2 text-main_dark focus:outline-none"
                    >
                      <option value="">Select Item</option>
                      {itemsRequested.map((item, i) => (
                        <option key={i} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slatebluegray mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={row.quantity}
                      onChange={(e) => handlePricingChange(idx, e)}
                      className="w-full border border-light_gray rounded-lg px-3 py-2 text-main_dark focus:outline-none"
                      min="0"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm text-slatebluegray mb-1">Unit Price</label>
                    <span className="absolute left-3 top-9 text-slatebluegray">$</span>
                    <input
                      type="number"
                      name="unitPrice"
                      value={row.unitPrice}
                      onChange={(e) => handlePricingChange(idx, e)}
                      className="w-full border border-light_gray rounded-lg pl-7 pr-3 py-2 text-main_dark focus:outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {pricing.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeletePricing(idx)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      aria-label="Delete item"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPricing}
                className="bg-deep_green text-purewhite font-medium px-4 py-2 rounded-md hover:bg-deep_green/90 transition mt-2"
              >
                + Add Item
              </button>
            </div>
          </section>

          {/* Advanced Payment Information */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">Advanced Payment Information</div>
            <div>
              <label className="block text-sm text-slatebluegray mb-1">Advanced Payment Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slatebluegray">$</span>
                <input
                  type="number"
                  name="advancedPayment"
                  value={advancedPayment}
                  onChange={(e) => setAdvancedPayment(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-light_gray rounded-lg pl-7 pr-3 py-2 text-main_dark focus:outline-none"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </section>

          {/* Delivery Information */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-main_dark">Delivery Information</div>
              <button
                type="button"
                onClick={handleAddLocation}
                className="bg-deep_green text-purewhite font-medium px-4 py-2 rounded-md hover:bg-deep_green/90 transition"
              >
                + Add Location
              </button>
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Delivery Date</label>
              </div>
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Delivery Location</label>
              </div>
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Shipping Cost</label>
              </div>
              {deliveries.map((row, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center">
                    <input
                      type="date"
                      name="requiredDate"
                      value={row.requiredDate}
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md px-3 py-2 text-main_dark text-sm focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="deliveryLocation"
                      value={row.deliveryLocation}
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md px-3 py-2 text-main_dark text-sm focus:outline-none"
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slatebluegray">$</span>
                    <input
                      type="number"
                      name="shippingCost"
                      value={row.shippingCost}
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md pl-7 pr-3 py-2 text-main_dark text-sm focus:outline-none"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    {deliveries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLocation(idx)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        aria-label="Delete location"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Terms & Conditions */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">Terms & Conditions</div>
            <div>
              <label className="block text-sm text-slatebluegray mb-1">Payment Terms</label>
              <select
                name="paymentTerms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full border border-light_gray rounded-lg px-3 py-2 text-main_dark focus:outline-none"
              >
                <option value="">Select payment terms</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
                <option value="Advance">Advance</option>
              </select>
            </div>
          </section>

          {/* Additional Notes */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">Additional Notes</div>
            <label className="block text-sm text-slatebluegray mb-1">Special Instructions or Comments</label>
            <textarea
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add any special instructions, bulk discounts, or additional information..."
              className="w-full border border-light_gray rounded-lg px-4 py-3 text-main_dark focus:outline-none resize-none"
            />
          </section>

          {/* Attachments */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">Attachments</div>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-light_gray rounded-lg py-8 bg-gray-50">
              <FaPaperclip className="text-2xl text-slatebluegray mb-2" />
              <div className="text-slatebluegray text-sm mb-2 font-medium">
                Drop files here or click to upload
              </div>
              <div className="text-gray-400 text-xs mb-4">
                Supported formats: PDF, DOC, XLS, JPG, PNG (Max 10MB)
              </div>
              <input
                type="file"
                name="attachments"
                multiple
                onChange={handleAttachmentChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-gray-200 text-main_dark px-6 py-2 rounded-lg cursor-pointer hover:bg-light_brown/80 transition font-medium"
              >
                Choose Files
              </label>
            </div>
            {attachments.length > 0 && (
              <ul className="text-sm text-slatebluegray mt-3">
                {attachments.map((file, idx) => (
                  <li key={idx} className="py-1">📄 {file.name}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Quotation Summary */}
          <section className="bg-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">Quotation Summary</div>
            <div className="space-y-2 text-main_dark">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${totalShipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>$0.00</span>
              </div>
              <hr className="border-gray-300 my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-web_yellow">${total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-web_yellow text-main_dark px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Quotation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitQuotation;
