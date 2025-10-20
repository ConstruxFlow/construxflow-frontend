import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { FaPaperclip, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthContext";
import LoadingOverlay from "../../components/LoadingOverlay";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations", active: true },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments" },
];

const SubmitQuotation = () => {
  const { id } = useParams(); // request ID from URL
  const navigate = useNavigate();
  const [requestSummary, setRequestSummary] = useState(null);
  const [itemsRequested, setItemsRequested] = useState([]);
  const { authState } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [pricing, setPricing] = useState([
    { item: "", quantity: "", unitPrice: "" },
  ]);
  const [advancedPayment, setAdvancedPayment] = useState("");
  const [isPercentage, setIsPercentage] = useState(false); // New state for percentage toggle
  const [deliveries, setDeliveries] = useState([
    {
      requiredDate: "",
      deliveryLocation: "",
      shippingCost: "",
      deliveryDate: "",
    },
  ]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Fetch quotation request details
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/quotationrequest/find/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setRequestSummary(data.data);
          const materials =
            data.data.quotationReqMaterials?.map((m) => ({
              id: m.material.materialId,
              name: m.material.materialName,
              quantity: `${m.quantity} ${m.material.unitOfMeasurement || ""}`,
            })) || [];
          setItemsRequested(materials);
          setPricing(
            materials.map((item) => ({
              item: item.id,
              quantity: "",
              unitPrice: "",
              estimatedUnitPrice:
                data.data.quotationReqMaterials?.find(
                  (m) => m.material.materialId === item.id
                )?.unitPrice || "",
            }))
          );
          const reqDate = data.data.deliveryDate || ""; // Use actual field from your data
          console.log(data.data.quotationReqDelivery);
          setDeliveries(
            data.data.quotationReqDelivery.map((delivery) => ({
              requiredDate: "",
              deliveryLocation: delivery.location,
              shippingCost: "",
              deliveryDate: delivery.deliveryDate,
            }))
          );
        }
      })
      .catch((err) => {
        toast.error("Failed to load request summary.");
        console.error(err);
      });
  }, [id]);

  const handlePricingChange = (idx, e) => {
    const { name, value } = e.target;
    setPricing(
      pricing.map((item, i) => (i === idx ? { ...item, [name]: value } : item))
    );
  };
  const handleAddPricing = () =>
    setPricing([...pricing, { item: "", quantity: "", unitPrice: "" }]);
  const handleDeletePricing = (idx) =>
    setPricing(pricing.filter((_, i) => i !== idx));

  const handleDeliveryChange = (idx, e) => {
    const { name, value } = e.target;
    setDeliveries(
      deliveries.map((d, i) => (i === idx ? { ...d, [name]: value } : d))
    );
  };
  const handleAddLocation = () =>
    setDeliveries([
      ...deliveries,
      {
        requiredDate: "",
        deliveryLocation: "",
        shippingCost: "",
        deliveryDate: deliveries[0]?.deliveryDate || "",
      },
    ]);
  const handleDeleteLocation = (idx) =>
    setDeliveries(deliveries.filter((_, i) => i !== idx));

  const handleAttachmentChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  // Updated calculations with percentage support
  const subtotal = pricing.reduce(
    (sum, item) =>
      sum +
      (parseFloat(item.unitPrice || 0) * parseFloat(item.quantity || 0) || 0),
    0
  );
  const totalShipping = deliveries.reduce(
    (sum, d) => sum + parseFloat(d.shippingCost || 0),
    0
  );

  // Calculate advanced payment amount
  const advancedPaymentAmount = isPercentage 
    ? (parseFloat(advancedPayment || 0) / 100) * subtotal 
    : parseFloat(advancedPayment || 0);

  const total = subtotal + totalShipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    setIsLoading(true);
    setLoadingProgress(0);

    // Validation
    if (
      pricing.some(
        (p) =>
          !p.item ||
          !p.quantity ||
          !p.unitPrice ||
          isNaN(p.quantity) ||
          isNaN(p.unitPrice)
      )
    ) {
      toast.error("Please fill all pricing fields correctly.");
      setIsLoading(false);
      setLoading(false);
      return;
    }
    setLoadingProgress(20);

    if (
      deliveries.some(
        (d) =>
          !d.requiredDate ||
          !d.deliveryLocation ||
          !d.shippingCost ||
          isNaN(d.shippingCost)
      )
    ) {
      toast.error("Please fill all delivery fields correctly.");
      setIsLoading(false);
      setLoading(false);
      return;
    }

    const invalidDeliveryDates = deliveries.some((d) => {
      const deliveryDate = new Date(d.requiredDate);
      const requiredDate = new Date(d.deliveryDate);
      return deliveryDate > requiredDate;
    });

    if (invalidDeliveryDates) {
      toast.error("Delivery Date cannot be after Required Date.");
      setIsLoading(false);
      setLoading(false);
      return;
    }

    if (!paymentTerms) {
      toast.error("Please select payment terms.");
      setIsLoading(false);
      setLoading(false);
      return;
    }

    // Validate percentage range
    if (isPercentage && (parseFloat(advancedPayment || 0) < 0 || parseFloat(advancedPayment || 0) > 100)) {
      toast.error("Percentage must be between 0 and 100.");
      setIsLoading(false);
      setLoading(false);
      return;
    }

    setLoadingProgress(40);

    setLoading(true);
    const payload = {
      quotationRequestId: id,
      advancedPayment: advancedPaymentAmount, // Use calculated amount
      advancedPaymentPercentage: isPercentage ? parseFloat(advancedPayment || 0) : null, // Store percentage if applicable
      paymentTerms,
      notes,
      totalAmount: total,
      status: "Pending",
      supplierId: authState?.user.supplierId || "S001",
      items: pricing.map((p) => ({
        material: { materialId: p.item },
        quantity: parseInt(p.quantity, 10),
        unitPrice: parseFloat(p.unitPrice),
        totalPrice: parseFloat(p.quantity) * parseFloat(p.unitPrice),
      })),
      deliveryInfos: deliveries.map((d) => ({
        deliveryDate: d.requiredDate,
        location: d.deliveryLocation,
        shippingCost: parseFloat(d.shippingCost),
      })),
      attachments: attachments.map((file) => ({
        fileName: file.name,
        fileType: file.type,
        fileUrl: "", // if needed
      })),
    };
    setLoadingProgress(50);

    try {
      const res = await fetch("http://localhost:8080/api/quotations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setLoadingProgress(80);

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      setLoadingProgress(100);
      setIsLoading(false);
      const data = await res.json();
      console.log("Submission response:", data);
      toast.success("Quotation submitted successfully!");
      navigate("/supplier/quotations");
      setPricing([{ item: "", quantity: "", unitPrice: "" }]);
      setAdvancedPayment("");
      setIsPercentage(false);
      setDeliveries([
        {
          requiredDate: "",
          deliveryLocation: "",
          shippingCost: "",
          deliveryDate: deliveries[0]?.deliveryDate || "",
        },
      ]);
      setPaymentTerms("");
      setNotes("");
      setAttachments([]);
    } catch (err) {
      setIsLoading(false);
      toast.error("Submission failed: " + err.message);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f7f9] min-h-screen font-poppins">
      <NavBar
        links={navLinks}
        profileURL="/supplier/profile"
        logoSrc="/logo1.png"
      />

      {isLoading && (
        <LoadingOverlay
          progress={loadingProgress}
          message="Submitting quotation details..."
        />
      )}

      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-20 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slatebluegray mb-2">
          <a
            href="/supplier/dashboard"
            className="hover:underline text-deep_green"
          >
            Dashboard
          </a>{" "}
          &nbsp;/&nbsp;
          <a
            href="/supplier/requests"
            className="hover:underline text-deep_green"
          >
            Request
          </a>{" "}
          &nbsp;/&nbsp;
          <span className="font-semibold">Submit Quotation</span>
        </div>

        <h1 className="text-2xl font-bold text-main_dark mb-1">
          Submit Quotation
        </h1>
        <p className="text-gray-500 mb-6">
          Provide your best quote for the requested items.
        </p>

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

        {/* Request Summary Block */}
        {requestSummary && (
          <div className="bg-light_gray rounded-lg p-4 sm:p-6 mb-7">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 md:gap-0">
              <div>
                <div className="flex items-center mb-3">
                  <span className="text-main_dark font-medium text-lg mr-3">
                    Request Summary
                  </span>
                  <span className="bg-deep_green text-purewhite px-4 py-1.5 rounded-full text-sm font-medium">
                    RFQ-{requestSummary.id}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-slatebluegray">Contact:</span>
                  <span className="ml-2 text-main_dark">
                    {requestSummary.requesterName}
                  </span>
                </div>
                <div>
                  <span className="text-slatebluegray">
                    Quotation Deadline:
                  </span>
                  <span className="ml-2 text-web_yellow font-semibold">
                    {new Date(
                      requestSummary.quotationDeadline
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <div className="text-slatebluegray mb-2">Items Requested:</div>
                <table className="w-full text-main_dark">
                  <tbody>
                    {itemsRequested.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td className="text-right">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Pricing Information */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-4 sm:p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4 flex items-center gap-2">
              Pricing Information
            </div>
            <div className="space-y-4">
              {pricing.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm text-slatebluegray mb-1">
                      Item Requested
                    </label>
                    <select
                      name="item"
                      value={row.item}
                      onChange={(e) => handlePricingChange(idx, e)}
                      className="w-full border border-light_gray rounded-lg px-3 py-2 text-main_dark focus:outline-none"
                    >
                      <option value="">Select Item</option>
                      {itemsRequested.map((item, i) => (
                        <option key={i} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slatebluegray mb-1">
                      Quantity
                    </label>
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
                    <label className="block text-sm text-slatebluegray mb-1">
                      Standard Unit Price
                    </label>
                    <span className="absolute left-1 top-8 text-slatebluegray">
                      RS
                    </span>
                    <input
                      type="number"
                      name="unitPrice"
                      value={row.estimatedUnitPrice || ""}
                      readOnly
                      disabled
                      className="w-full border border-light_gray rounded-lg pl-7 pr-3 py-2 text-main_dark focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm text-slatebluegray mb-1">
                      Unit Price
                    </label>
                    <span className="absolute left-1 top-8 text-slatebluegray">
                      RS
                    </span>
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
                      className="ml-2 w-fit text-red-500 hover:text-red-700 sm:col-span-4 sm:text-right"
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

          {/* Advanced Payment Information - UPDATED */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">
              Advanced Payment Information
            </div>
            
            {/* Toggle between Amount and Percentage */}
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentType"
                    checked={!isPercentage}
                    onChange={() => setIsPercentage(false)}
                    className="mr-2"
                  />
                  <span className="text-sm text-main_dark">Fixed Amount</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentType"
                    checked={isPercentage}
                    onChange={() => setIsPercentage(true)}
                    className="mr-2"
                  />
                  <span className="text-sm text-main_dark">Percentage of Total</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slatebluegray mb-1">
                Advanced Payment {isPercentage ? 'Percentage' : 'Amount'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slatebluegray">
                  {isPercentage ? '%' : 'RS'}
                </span>
                <input
                  type="number"
                  name="advancedPayment"
                  value={advancedPayment}
                  onChange={(e) => setAdvancedPayment(e.target.value)}
                  placeholder={isPercentage ? "0" : "0.00"}
                  className="w-full border border-light_gray rounded-lg pl-10 pr-3 py-2 text-main_dark focus:outline-none"
                  min="0"
                  max={isPercentage ? "100" : undefined}
                  step={isPercentage ? "1" : "0.01"}
                />
              </div>
              
              {/* Show calculated amount if percentage is selected */}
              {isPercentage && advancedPayment && (
                <div className="mt-2 text-sm text-slatebluegray">
                  Calculated Amount: <span className="font-medium text-main_dark">
                    ${((parseFloat(advancedPayment) / 100) * subtotal).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Delivery Information */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
              <div className="font-semibold text-main_dark">
                Delivery Information
              </div>
              <button
                type="button"
                onClick={handleAddLocation}
                className="bg-deep_green text-purewhite font-medium px-4 py-2 rounded-md hover:bg-deep_green/90 transition"
              >
                + Add Location
              </button>
            </div>
            <div className="space-y-4">
              {deliveries.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm text-slatebluegray mb-1">
                      Required Date
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={row.deliveryDate}
                      readOnly
                      disabled
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md px-3 py-2 text-main_dark text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slatebluegray mb-1">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      name="requiredDate"
                      value={row.requiredDate}
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md px-3 py-2 text-main_dark text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slatebluegray mb-1">
                      Delivery Location
                    </label>
                    <input
                      type="text"
                      name="deliveryLocation"
                      value={row.deliveryLocation}
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md px-3 py-2 text-main_dark text-sm focus:outline-none"
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm text-slatebluegray mb-1">
                      Shipping Cost RS:
                    </label>
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
                  </div>
                  {deliveries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLocation(idx)}
                      className="text-red-500 w-fit hover:text-red-700 sm:col-span-4 sm:text-right"
                      aria-label="Delete location"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Terms & Conditions */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-4 sm:p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">
              Terms & Conditions
            </div>
            <div>
              <label className="block text-sm text-slatebluegray mb-1">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full border border-light_gray rounded-lg px-3 py-2 text-main_dark focus:outline-none"
              >
                <option value="">Select payment terms</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
              </select>
            </div>
          </section>

          {/* Additional Notes */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-4 sm:p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">Additional Notes</div>
            <label className="block text-sm text-slatebluegray mb-1">
              Special Instructions or Comments
            </label>
            <textarea
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add any special instructions, bulk discounts, or additional information..."
              className="w-full border border-light_gray rounded-lg px-4 py-3 text-main_dark focus:outline-none resize-none"
            />
          </section>

          {/* Quotation Summary - UPDATED */}
          <section className="bg-light_gray rounded-lg p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">
              Quotation Summary
            </div>
            <div className="space-y-2 text-main_dark">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>RS {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>RS {totalShipping.toFixed(2)}</span>
              </div>
              {advancedPaymentAmount > 0 && (
                <div className="flex justify-between text-deep_green">
                  <span>
                    Advanced Payment {isPercentage ? `(${advancedPayment}%)` : ''}:
                  </span>
                  <span>${advancedPaymentAmount.toFixed(2)}</span>
                </div>
              )}
              <hr className="border-gray-300 my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-web_yellow">RS {total.toFixed(2)}</span>
              </div>
              {advancedPaymentAmount > 0 && (
                <div className="flex justify-between text-sm text-slatebluegray">
                  <span>Remaining Amount:</span>
                  <span>${(total - advancedPaymentAmount).toFixed(2)}</span>
                </div>
              )}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
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
