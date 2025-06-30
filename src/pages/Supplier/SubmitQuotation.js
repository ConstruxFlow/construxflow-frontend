// src/pages/Supplier/SubmitQuotation.jsx
import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import { FaPaperclip } from "react-icons/fa";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations", active: true },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
];

const SubmitQuotation = () => {
  const [form, setForm] = useState({
    steelPipePrice: "",
    tax: "",
    paymentTerms: "",
    warranty: "",
    validity: "",
    advancedPayment: "",
    notes: "",
    attachments: [],
  });

  const [deliveries, setDeliveries] = useState([
    { requiredDate: "", deliveryLocation: "", shippingCost: "" },
  ]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: Array.from(files) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Quotation submitted!");
  };

  // Calculate totals
  const steelPipeTotal = parseFloat(form.steelPipePrice || 0) * 500;
  const totalShipping = deliveries.reduce((sum, delivery) =>
    sum + parseFloat(delivery.shippingCost || 0), 0
  );
  const subtotal = steelPipeTotal;
  const tax = ((subtotal + totalShipping) * parseFloat(form.tax || 0)) / 100;
  const totalBeforeAdvance = subtotal + totalShipping + tax;
  const advancedPayment = parseFloat(form.advancedPayment || 0);
  const finalTotal = totalBeforeAdvance - advancedPayment;

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-poppins">
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

        {/* Request Summary */}
        <div className="bg-light_gray rounded-lg p-6 mb-7 relative">
          <div className="text-main_dark font-medium mb-3">Request Summary</div>
          <span className="absolute top-4 right-4 bg-deep_green text-purewhite px-4 py-1.5 rounded-full text-sm font-medium">
            RFQ-2024-001
          </span>
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm">
            <div className="text-slatebluegray">Company:</div>
            <div className="text-main_dark">TechCorp Industries</div>
            <div className="text-slatebluegray">Items Requested:</div>
            <div className="text-main_dark"></div>

            <div className="text-slatebluegray">Contact:</div>
            <div className="text-main_dark">Sarah Johnson</div>
            <div className="text-main_dark">Steel Pipes (6mm)</div>
            <div className="text-main_dark text-right">500 units</div>

            <div className="text-slatebluegray">Deadline:</div>
            <div className="text-web_yellow font-semibold">Dec 22, 2024</div>
            <div className="text-main_dark"></div>
            <div className="text-main_dark"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Pricing Information */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              <span className="text-web_yellow text-lg"></span> Pricing Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Steel Pipes Unit Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slatebluegray">$</span>
                  <input
                    type="number"
                    name="steelPipePrice"
                    value={form.steelPipePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full border border-light_gray rounded-lg pl-7 pr-3 py-2 text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Tax (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="tax"
                    value={form.tax}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full border border-light_gray rounded-lg px-3 py-2 text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    min="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slatebluegray">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Advanced Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slatebluegray">$</span>
                  <input
                    type="number"
                    name="advancedPayment"
                    value={form.advancedPayment}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full border border-light_gray rounded-lg pl-7 pr-3 py-2 text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Information */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-main_dark font-semibold">
                <span className="text-web_yellow text-lg"></span>
                <span>Delivery Information</span>
              </div>
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
                <label className="block text-sm text-slatebluegray mb-1">Required Date</label>
              </div>
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Delivery Location</label>
              </div>
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Shipping Cost</label>
              </div>
              {deliveries.map((row, idx) => (
                <React.Fragment key={idx}>
                  <div>
                    <input
                      type="date"
                      name="requiredDate"
                      value={row.requiredDate}
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md px-3 py-2 text-main_dark text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="deliveryLocation"
                      value={row.deliveryLocation}
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md px-3 py-2 text-main_dark text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slatebluegray">$</span>
                    <input
                      type="number"
                      name="shippingCost"
                      value={row.shippingCost}
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md pl-7 pr-3 py-2 text-main_dark text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Terms & Conditions */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              <span className="text-web_yellow text-lg"></span> Terms & Conditions
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Payment Terms</label>
                <select
                  name="paymentTerms"
                  value={form.paymentTerms}
                  onChange={handleChange}
                  className="w-full border border-light_gray rounded-lg px-3 py-2 text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
                >
                  <option value="">Select payment terms</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Advance">Advance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Warranty Period</label>
                <select
                  name="warranty"
                  value={form.warranty}
                  onChange={handleChange}
                  className="w-full border border-light_gray rounded-lg px-3 py-2 text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
                >
                  <option value="">Select warranty period</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slatebluegray mb-1">Validity Period</label>
                <input
                  type="text"
                  name="validity"
                  value={form.validity}
                  onChange={handleChange}
                  className="w-full border border-light_gray rounded-lg px-3 py-2 text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>
          </section>

          {/* Additional Notes */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              <span className="text-web_yellow text-lg"></span> Additional Notes
            </div>
            <div>
              <label className="block text-sm text-slatebluegray mb-1">Special Instructions or Comments</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Add any special instructions, bulk discounts, or additional information..."
                className="w-full border border-light_gray rounded-lg px-4 py-3 text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow resize-none"
              />
            </div>
          </section>

          {/* Attachments */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              <span className="text-web_yellow text-lg"></span> Attachments
            </div>
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
                onChange={handleChange}
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
            {form.attachments.length > 0 && (
              <ul className="text-sm text-slatebluegray mt-3">
                {form.attachments.map((file, idx) => (
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
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Advanced Payment:</span>
                <span className="font-semibold text-web_yellow">-${advancedPayment.toFixed(2)}</span>
              </div>
              <hr className="border-gray-300 my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-web_yellow">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-purewhite border border-light_gray text-main_dark px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="bg-web_yellow text-main_dark px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Submit Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitQuotation;
