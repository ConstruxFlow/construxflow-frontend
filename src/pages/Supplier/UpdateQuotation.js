import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { FaPaperclip, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations", active: true },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments" },
];

const UpdateQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestSummary, setRequestSummary] = useState(null);
  const [itemsRequested, setItemsRequested] = useState([]);

  const [pricing, setPricing] = useState([]);
  const [advancedPayment, setAdvancedPayment] = useState("");
  const [isPercentage, setIsPercentage] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [initAttachmentNames, setInitAttachmentNames] = useState([]);

  const [quotationRequestId, setQuotationRequestId] = useState(null);
  const [supplierId, setSupplierId] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/quotations/find/${id}`);
        if (!res.ok) throw new Error("Could not load quotation.");
        const data = await res.json();
        const q = data;

        console.log("=== FETCHED QUOTATION DATA ===");
        console.log("Full Quotation:", q);
        console.log("Quotation Request ID:", q.quotationRequestId);
        console.log("Supplier ID:", q.supplierId);
        
        // ✅ STORE THE IDs
        setQuotationRequestId(q.quotationRequestId);
        setSupplierId(q.supplierId);
        
        const reqRes = await fetch(`http://localhost:8080/api/quotationrequest/find/${q.quotationRequestId}`);
        const reqData = await reqRes.json();

        setRequestSummary(reqData.data);

        const materials =
          reqData.data.quotationReqMaterials?.map((m) => ({
            id: m.material.materialId,
            name: m.material.materialName,
            quantity: `${m.quantity} ${m.material.unitOfMeasurement || ""}`,
          })) || [];
        setItemsRequested(materials);

        setPricing(
          (q.items || []).map((item) => ({
            item: item.material.materialId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            estimatedUnitPrice:
              reqData.data.quotationReqMaterials?.find(
                (m) => m.material.materialId === item.material.materialId
              )?.unitPrice || "",
          }))
        );

        // Load advanced payment - check which type was used
        if (q.advancedPaymentPercentage !== null && q.advancedPaymentPercentage !== undefined && q.advancedPaymentPercentage > 0) {
          setIsPercentage(true);
          setAdvancedPayment(q.advancedPaymentPercentage.toString());
        } else if (q.advancedPayment !== null && q.advancedPayment !== undefined && q.advancedPayment > 0) {
          setIsPercentage(false);
          setAdvancedPayment(q.advancedPayment.toString());
        } else {
          setIsPercentage(false);
          setAdvancedPayment("");
        }

        setDeliveries(
          (q.deliveryInfos || []).map((d, i) => ({
            requiredDate: d.deliveryDate,
            deliveryLocation: d.location,
            shippingCost: d.shippingCost,
            deliveryDate: (
              reqData.data.quotationReqDelivery?.[i]?.deliveryDate ||
              d.deliveryDate
            ),
          }))
        );
        setPaymentTerms(q.paymentTerms || "");
        setNotes(q.notes || "");
        setInitAttachmentNames(q.attachments?.map((a) => a.fileName) || []);
        setAttachments([]);
      } catch (err) {
        toast.error("Failed to load quotation for update.");
        console.error(err);
      }
    })();
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
      { requiredDate: "", deliveryLocation: "", shippingCost: "", deliveryDate: deliveries[0]?.deliveryDate || "" },
    ]);
  
  const handleDeleteLocation = (idx) =>
    setDeliveries(deliveries.filter((_, i) => i !== idx));

  const handleAttachmentChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  // Handle payment type toggle - clear value when switching
  const handlePaymentTypeChange = (isPercentageType) => {
    setIsPercentage(isPercentageType);
    setAdvancedPayment(""); // Clear the input when switching
  };

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

  // Calculate advanced payment amount based on type
  const advancedPaymentAmount = isPercentage 
    ? (parseFloat(advancedPayment || 0) / 100) * subtotal 
    : parseFloat(advancedPayment || 0);

  const total = subtotal + totalShipping;

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      return;
    }

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
      return;
    }

    const invalidDeliveryDates = deliveries.some((d) => {
      const deliveryDate = new Date(d.requiredDate);
      const requiredDate = new Date(d.deliveryDate);
      return deliveryDate > requiredDate;
    });

    if (invalidDeliveryDates) {
      toast.error("Delivery Date cannot be after Required Date.");
      return;
    }

    if (!paymentTerms) {
      toast.error("Please select payment terms.");
      return;
    }

    // Validate percentage range if percentage is selected
    if (isPercentage && advancedPayment) {
      const percentValue = parseFloat(advancedPayment);
      if (percentValue < 0 || percentValue > 100) {
        toast.error("Percentage must be between 0 and 100.");
        return;
      }
    }

    // ✅ VALIDATION: Check if IDs exist
    if (!quotationRequestId || !supplierId) {
      toast.error("Missing quotation request or supplier information!");
      console.error("❌ Missing IDs:", { quotationRequestId, supplierId });
      return;
    }

    setLoading(true);

    // Prepare payload based on selected payment type
    const payload = {
      quotationRequestId: quotationRequestId,  // ✅ ADD THIS
      supplierId: supplierId,
      advancedPayment: isPercentage ? advancedPaymentAmount : parseFloat(advancedPayment || 0),
      advancedPaymentPercentage: isPercentage ? parseFloat(advancedPayment || 0) : null,
      paymentTerms,
      notes,
      totalAmount: total,
      status: "Pending",
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
        fileUrl: "",
      })),
    };

     // ✅ CONSOLE LOG: Check payload before sending
    console.log("=== UPDATE PAYLOAD ===");
    console.log("Full Payload:", JSON.stringify(payload, null, 2));
    console.log("Quotation Request ID in Payload:", payload.quotationRequestId);
    console.log("Supplier ID in Payload:", payload.supplierId);

    try {
      const res = await fetch(`http://localhost:8080/api/quotations/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ CONSOLE LOG: Check response
      console.log("=== API RESPONSE ===");
      console.log("Status:", res.status);
      console.log("OK:", res.ok)

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

       const responseData = await res.json();
      console.log("✅ Response Data:", responseData);

      toast.success("Quotation updated successfully!");
      navigate("/supplier/quotations");
    } catch (err) {
      toast.error("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f7f9] min-h-screen font-poppins">
      <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-20 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slatebluegray mb-2">
          <a href="/supplier/dashboard" className="hover:underline text-deep_green">
            Dashboard
          </a>{" "}
          &nbsp;/&nbsp;
          <a href="/supplier/quotations" className="hover:underline text-deep_green">
            Quotations
          </a>{" "}
          &nbsp;/&nbsp;
          <span className="font-semibold">Update Quotation</span>
        </div>

        <h1 className="text-2xl font-bold text-main_dark mb-1">Update Quotation</h1>
        <p className="text-gray-500 mb-6">Edit your quotation if further changes are required.</p>

        
        {quotationRequestId && supplierId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
               Quotation Request ID: {quotationRequestId} | Supplier ID: {supplierId}
            </p>
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
                  <span className="text-slatebluegray">Quotation Deadline:</span>
                  <span className="ml-2 text-web_yellow font-semibold">
                    {new Date(requestSummary.quotationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <div className="text-slatebluegray mb-2">Items Requested:</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-main_dark min-w-max">
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
                      className="text-red-500 hover:text-red-700 sm:col-span-4 sm:text-right"
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
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    checked={!isPercentage}
                    onChange={() => handlePaymentTypeChange(false)}
                    className="mr-2"
                  />
                  <span className="text-sm text-main_dark">Fixed Amount</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    checked={isPercentage}
                    onChange={() => handlePaymentTypeChange(true)}
                    className="mr-2"
                  />
                  <span className="text-sm text-main_dark">Percentage of Subtotal</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slatebluegray mb-1">
                Advanced Payment {isPercentage ? 'Percentage' : 'Amount'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slatebluegray font-medium">
                  {isPercentage ? '%' : 'RS'}
                </span>
                <input
                  type="number"
                  name="advancedPayment"
                  value={advancedPayment}
                  onChange={(e) => setAdvancedPayment(e.target.value)}
                  placeholder={isPercentage ? "Enter percentage (0-100)" : "Enter amount"}
                  className="w-full border border-light_gray rounded-lg pl-12 pr-3 py-2 text-main_dark focus:outline-none focus:ring-2 focus:ring-web_yellow"
                  min="0"
                  max={isPercentage ? "100" : undefined}
                  step={isPercentage ? "0.1" : "0.01"}
                />
              </div>
              
              {/* Show calculated amount if percentage is selected and has value */}
              {isPercentage && advancedPayment && subtotal > 0 && (
                <div className="mt-2 p-3 bg-deep_green/10 rounded-lg">
                  <div className="text-sm text-slatebluegray">
                    Calculated Amount:{" "}
                    <span className="font-semibold text-deep_green text-base">
                      RS {advancedPaymentAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ({advancedPayment}% of RS {subtotal.toFixed(2)})
                  </div>
                </div>
              )}

              {/* Show info message for fixed amount */}
              {!isPercentage && advancedPayment && (
                <div className="mt-2 text-sm text-slatebluegray">
                  Fixed advanced payment: <span className="font-medium text-main_dark">RS {parseFloat(advancedPayment).toFixed(2)}</span>
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
                    <label className="block text-sm text-slatebluegray mb-1">Required Date</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={row.deliveryDate}
                      readOnly
                      disabled
                      className="w-full border border-light_gray rounded-md px-3 py-2 text-main_dark text-sm focus:outline-none bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slatebluegray mb-1">Delivery Date</label>
                    <input
                      type="date"
                      name="requiredDate"
                      value={row.requiredDate}
                      onChange={(e) => handleDeliveryChange(idx, e)}
                      className="w-full border border-light_gray rounded-md px-3 py-2 text-main_dark text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slatebluegray mb-1">Delivery Location</label>
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
                    <label className="block text-sm text-slatebluegray mb-1">Shipping Cost</label>
                    <span className="absolute left-1 top-2 text-slatebluegray">
                      RS
                    </span>
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
                      className="text-red-500 hover:text-red-700 sm:col-span-4 sm:text-right"
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
            <div className="font-semibold text-main_dark mb-4">Terms & Conditions</div>
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
            <div className="font-semibold text-main_dark mb-4">
              Additional Notes
            </div>
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

          {/* Attachments */}
          <section className="bg-purewhite border border-light_gray rounded-lg p-4 sm:p-6 mb-6">
            <div className="font-semibold text-main_dark mb-4">Attachments</div>
            {initAttachmentNames.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-semibold text-main_dark mb-2">
                  Existing Attachments:
                </div>
                <ul className="list-disc pl-6 space-y-1">
                  {initAttachmentNames.map((name, idx) => (
                    <li key={idx} className="text-sm text-gray-700"> {name}</li>
                  ))}
                </ul>
                <div className="text-xs text-gray-500 mt-2">
                  Note: Uploading new files will not remove existing attachments.
                </div>
              </div>
            )}
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
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-semibold text-main_dark mb-2">
                  New Files to Upload:
                </div>
                <ul className="space-y-1">
                  {attachments.map((file, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                       {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                <div className="flex justify-between text-deep_green font-medium">
                  <span>
                    Advanced Payment {isPercentage ? `(${advancedPayment}%)` : ''}:
                  </span>
                  <span>RS {advancedPaymentAmount.toFixed(2)}</span>
                </div>
              )}
              <hr className="border-gray-300 my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-web_yellow">RS {total.toFixed(2)}</span>
              </div>
              {advancedPaymentAmount > 0 && (
                <div className="flex justify-between text-sm text-slatebluegray pt-2 border-t border-gray-200">
                  <span>Remaining Amount:</span>
                  <span className="font-semibold">RS {(total - advancedPaymentAmount).toFixed(2)}</span>
                </div>
              )}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/supplier/quotations')}
              className="bg-gray-200 text-main_dark px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-web_yellow text-main_dark px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Quotation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuotation;
