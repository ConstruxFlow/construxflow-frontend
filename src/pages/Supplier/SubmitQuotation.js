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

const initialForm = {
  steelPipePrice: "",
  valvePrice: "",
  safetyEquipPrice: "",
  shipping: "",
  tax: "",
  deliveryTime: "",
  deliveryMethod: "",
  paymentTerms: "",
  warranty: "",
  validity: "",
  notes: "",
  attachments: [],
};

const SubmitQuotation = () => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: Array.from(files) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert("Quotation submitted!");
  };

  // Calculate totals
  const subtotal =
    (parseFloat(form.steelPipePrice || 0) * 500) +
    (parseFloat(form.valvePrice || 0) * 50) +
    (parseFloat(form.safetyEquipPrice || 0) * 200);

  const shipping = parseFloat(form.shipping || 0);
  const tax = ((subtotal + shipping) * parseFloat(form.tax || 0)) / 100;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slatebluegray mb-2">
          <a href="/dashboard1" className="hover:underline">Dashboard</a> /{" "}
          <a href="/requests" className="hover:underline">Request</a> /{" "}
          <span className="font-semibold">Submit Quotation</span>
        </div>

        <h1 className="text-2xl font-bold text-main_dark mb-1">Submit Quotation</h1>
        <p className="text-gray-500 mb-6">Provide your best quote for the requested items</p>

        {/* Request Summary */}
        <div className="bg-light_gray rounded-lg p-6 mb-7 relative">
        {/* RFQ Badge */}
        <span className="absolute top-4 right-4 bg-deep_green text-purewhite px-4 py-1.5 rounded-full text-sm font-semibold">
            RFQ-2024-001
        </span>
        <div className="text-main_dark font-semibold mb-3 text-base">Request Summary</div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm items-start">
            {/* Column 1: Labels */}
            <div className="text-slatebluegray space-y-2">
            <div>Company:</div>
            <div>Contact:</div>
            <div>Request Date:</div>
            <div>Deadline:</div>
            </div>
            {/* Column 2: Main values */}
            <div className="text-main_dark space-y-2">
            <div>TechCorp Industries</div>
            <div>Sarah Johnson</div>
            <div>Dec 15, 2024</div>
            <div className="font-semibold text-web_yellow">Dec 22, 2024</div>
            </div>
            {/* Column 3: Items and quantities */}
            <div className="text-main_dark space-y-2">
            <div>
                <span className="text-slatebluegray">Items Requested:</span>
            </div>
            <div className="flex justify-between">
                <span>Steel Pipes (6mm)</span>
                <span>500 units</span>
            </div>
            <div className="flex justify-between">
                <span>Industrial Valves</span>
                <span>50 units</span>
            </div>
            <div className="flex justify-between">
                <span>Safety Equipment</span>
                <span>200 units</span>
            </div>
            </div>
        </div>
        </div>



        <form onSubmit={handleSubmit}>
          {/* Pricing Information */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              <span className="text-web_yellow text-lg">$</span> Pricing Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="number"
                name="steelPipePrice"
                value={form.steelPipePrice}
                onChange={handleChange}
                placeholder="Steel Pipes Unit Price"
                className="border border-light_gray rounded-lg px-4 py-2"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                name="valvePrice"
                value={form.valvePrice}
                onChange={handleChange}
                placeholder="Industrial Valves Unit Price"
                className="border border-light_gray rounded-lg px-4 py-2"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                name="safetyEquipPrice"
                value={form.safetyEquipPrice}
                onChange={handleChange}
                placeholder="Safety Equipment Unit Price"
                className="border border-light_gray rounded-lg px-4 py-2"
                min="0"
                step="0.01"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                name="shipping"
                value={form.shipping}
                onChange={handleChange}
                placeholder="Shipping Cost"
                className="border border-light_gray rounded-lg px-4 py-2"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                name="tax"
                value={form.tax}
                onChange={handleChange}
                placeholder="Tax (%)"
                className="border border-light_gray rounded-lg px-4 py-2"
                min="0"
                step="0.01"
              />
            </div>
          </section>

          {/* Delivery Information */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              <span className="text-web_yellow text-lg">📦</span> Delivery Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="deliveryTime"
                value={form.deliveryTime}
                onChange={handleChange}
                className="border border-light_gray rounded-lg px-4 py-2"
              >
                <option value="">Select delivery timeframe</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
              </select>
              <select
                name="deliveryMethod"
                value={form.deliveryMethod}
                onChange={handleChange}
                className="border border-light_gray rounded-lg px-4 py-2"
              >
                <option value="">Select delivery method</option>
                <option value="Air">Air</option>
                <option value="Sea">Sea</option>
                <option value="Ground">Ground</option>
              </select>
            </div>
          </section>

          {/* Terms & Conditions */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              <span className="text-web_yellow text-lg">📄</span> Terms & Conditions
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                name="paymentTerms"
                value={form.paymentTerms}
                onChange={handleChange}
                className="border border-light_gray rounded-lg px-4 py-2"
              >
                <option value="">Select payment terms</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
                <option value="Advance">Advance</option>
              </select>
              <select
                name="warranty"
                value={form.warranty}
                onChange={handleChange}
                className="border border-light_gray rounded-lg px-4 py-2"
              >
                <option value="">Select warranty period</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="2 years">2 years</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                name="validity"
                value={form.validity}
                onChange={handleChange}
                className="border border-light_gray rounded-lg px-4 py-2"
                placeholder="Validity Period"
              />
            </div>
          </section>

          {/* Additional Notes */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              <span className="text-web_yellow text-lg">📝</span> Additional Notes
            </div>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Add any special instructions, bulk discounts, or additional information..."
              className="w-full border border-light_gray rounded-lg px-4 py-2"
            />
          </section>

          {/* Attachments */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              <span className="text-web_yellow text-lg">📎</span> Attachments
            </div>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-light_gray rounded-lg py-6 mb-2 bg-light_gray">
              <FaPaperclip className="text-2xl text-slatebluegray mb-2" />
              <div className="text-slatebluegray text-sm mb-2">
                Drop files here or click to upload
              </div>
              <div className="text-gray-400 text-xs mb-2">
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
                className="bg-light_brown text-main_dark px-4 py-2 rounded-lg cursor-pointer"
              >
                Choose Files
              </label>
            </div>
            {form.attachments.length > 0 && (
              <ul className="text-xs text-slatebluegray mt-2">
                {form.attachments.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Quotation Summary */}
          <section className="bg-light_brown rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">Quotation Summary</div>
            <div className="flex flex-col gap-2 text-main_dark text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-light_gray text-main_dark px-6 py-2 rounded-lg border border-light_gray font-semibold"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="bg-web_yellow text-main_dark px-6 py-2 rounded-lg font-semibold hover:opacity-90"
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
