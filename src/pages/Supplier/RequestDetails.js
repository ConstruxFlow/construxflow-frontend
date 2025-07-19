import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaUserTie, FaExclamationTriangle } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { FiDownload, FiInfo, FiCheckCircle } from "react-icons/fi";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests", active: true },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" }
];

function InfoBlock({ icon, label, value, iconClass = "" }) {
  // A two-line info box
  return (
    <div className="flex items-center space-x-4 bg-purewhite rounded-lg border border-light_gray px-6 py-3">
      <span className={`text-xl ${iconClass}`}>{icon}</span>
      <div>
        <div className="text-slatebluegray text-sm font-medium tracking-wide">{label}</div>
        <div className="text-main_dark text-base font-medium mt-1">{value}</div>
      </div>
    </div>
  );
}

function SectionHeading({children}) {
  return (
    <div className="text-main_dark text-lg font-bold mb-3 mt-5">{children}</div>
  );
}

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/quotationrequest/find/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch request details: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.data) setRequest(data.data);
        else setError("No data found for this request.");
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id]);

  if (loading) return <div className="text-center mt-12 text-lg text-main_dark">Loading request details...</div>;
  if (error) return <div className="text-center mt-12 text-lg text-red-600">{error}</div>;
  if (!request) return <div className="text-center mt-12 text-lg text-slatebluegray">No request details available.</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };
  const handleFileDownload = (file) => {
    window.open(file.documentUrl || file.url || "#", "_blank");
  };

  return (
    <div className="bg-purewhite min-h-screen font-poppins w-full overflow-x-hidden">
      {/* NavBar */}
      <NavBar links={navLinks} logoSrc="/logo1.png" />
      
      {/* Page Title and Info Banner */}
      {/* <div className="w-full bg-gradient-to-r from-slate-100 to-white px-6 md:px-16 pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-main_dark mb-2 tracking-tight">Material Request Details</h1>
          <div className="flex items-center gap-3 mb-3">
            <FiInfo className="text-blue-600 text-xl" />
            <p className="text-slate-600 text-base font-medium">
              Review all request information, materials and attachments. <span className="text-blue-700 font-semibold">Send quotations</span> or return to Requests anytime.
            </p>
          </div>
        </div>
      </div> */}

      {/* Breadcrumb */}
      <div className="w-full max-w-full px-24 pt-7 pb-3 text-sm text-slatebluegray bg-purewhite">
        <a href="/dashboard1" className="hover:underline text-deep_green font-semibold">Dashboard</a>
        &nbsp;/&nbsp;
        <a href="/requests" className="hover:underline text-deep_green font-semibold">Requests</a>
        &nbsp;/&nbsp;
        <span className="font-extrabold">Request Details</span>
      </div>

      {/* Split Panel */}
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-0 min-h-[calc(100vh-68px)] bg-purewhite">
        {/* --- Left Info Panel --- */}
        <div className="flex-1 flex flex-col px-0 sm:px-6 md:px-1 py-4">
          <div className="w-full max-w-full px-24 ml-0">
            {/* REQUEST HEADLINE */}
            <h2 className="text-main_dark text-xl sm:text-2xl font-bold mb-1 mt-0">
              Material Request #{request.id}
            </h2>
            <p className="text-gray-600 text-base font-medium mb-6">
              Review all request information, materials and attachments. <span className="text-web_yellow font-semibold">Send quotations</span> or return to Requests anytime.
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-block bg-deep_green text-purewhite px-4 py-1 rounded-full text-sm font-medium ">{request.status}</span>
              <span className="inline-flex  bg-web_yellow text-main_dark px-4 py-1 rounded-full text-sm font-medium gap-1">
                 {request.priorityLevel}
              </span>
              <span className="inline-block text-slatebluegray/70 text-xs">{formatDate(request.requestDate)}</span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              <InfoBlock
                icon={<FaUserTie />}
                label="Requested By"
                value={request.requesterName}
                iconClass="text-deep_green"
              />
              <InfoBlock
                icon={<FaCalendarAlt />}
                label="Requested Date"
                value={formatDate(request.requestDate)}
                iconClass="text-deep_green"
              />
              <InfoBlock
                icon={<FaCalendarAlt />}
                label="Quotation Deadline"
                value={formatDate(request.quotationDeadline)}
                iconClass="text-deep_green"
              />
              <InfoBlock
                icon={<FaExclamationTriangle />}
                label="Priority"
                value={request.priorityLevel}
                iconClass="text-deep_green"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-light_gray my-6" />

            {/* Requested Materials */}
            <SectionHeading>Requested Materials</SectionHeading>
            <div className="bg-purewhite border border-light_gray rounded-lg px-0 sm:px-4 py-2 sm:py-4 text-main_dark text-base mb-7">
              {request.quotationReqMaterials?.length > 0 ? (
                request.quotationReqMaterials.map((mat, idx) => (
                  <div key={idx} className="flex justify-between items-center py-4 px-2 border-b last:border-b-0">
                    <div>
                      <div className="font-semibold text-base">{mat.material?.materialName}</div>
                      <div className="text-xs text-slatebluegray">Type: {mat.material?.materialType}</div>
                      <div className="text-sm mt-2 text-slatebluegray">
                        Standard Unit Price: <span className="text-main_dark">{mat.unitPrice}</span>
                      </div>
                    </div>
                    <div className="font-semibold text-main_dark text-lg text-right mr-5">
                      {mat.quantity} <span className="font-light text-sm">{mat.material?.unitOfMeasurement}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slatebluegray px-3 py-3">No materials specified for this request</div>
              )}
            </div>

            {/* Delivery Schedule */}
            <SectionHeading>Delivery Schedule</SectionHeading>
            <div className="bg-purewhite border border-light_gray rounded-lg px-0 sm:px-4 py-2 sm:py-4 flex flex-col gap-3 mb-7">
              {request.quotationReqDelivery?.length > 0 ? (
                request.quotationReqDelivery.map((delivery, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-light_gray/35 rounded-lg p-4">
                    <div>
                      <div className="text-slatebluegray text-sm font-semibold mb-1">Location</div>
                      <div className="text-main_dark text-sm">{delivery.location}</div>
                    </div>
                    <div>
                      <div className="text-slatebluegray text-sm font-semibold mb-1">Required Date</div>
                      <div className="text-main_dark text-sm">{formatDate(delivery.deliveryDate)}</div>
                    </div>
                    <div>
                      <div className="text-slatebluegray text-sm font-semibold mb-1">Quantity Split</div>
                      <div className="text-main_dark text-sm">{delivery.quantitySplit}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slatebluegray px-3 py-3">No delivery schedule specified for this request</div>
              )}
            </div>

            {/* Description & Requirements */}
            <SectionHeading>Description & Requirements</SectionHeading>
            <div className="bg-purewhite border border-light_gray rounded-lg px-3 py-3 text-main_dark text-sm min-h-[48px] mb-7">
              {request.additionalInfo || "No additional information provided."}
            </div>

            {/* Attachments */}
            <SectionHeading>Attachments</SectionHeading>
            <div className="bg-purewhite border border-light_gray rounded-lg px-0 sm:px-4 py-2 sm:py-4 text-main_dark text-sm flex flex-col gap-3 mb-7">
              {request.quotationReqDocs?.length > 0 ? (
                request.quotationReqDocs.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-4 group rounded hover:bg-light_gray/50 p-2 transition">
                    <div className={`min-w-[38px] min-h-[38px] flex items-center justify-center rounded-md ${file.documentName.endsWith('.pdf') ? 'bg-red-100' : 'bg-blue-100'}`}>
                      {file.documentName.endsWith('.pdf') ? (
                        <span className="text-red-600 text-xl">📄</span>
                      ) : (
                        <span className="text-blue-600 text-xl">🖼️</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{file.documentName}</div>
                      <div className="text-xs text-slatebluegray">{file.documentSize || ""}</div>
                    </div>
                    <button className="p-2 rounded hover:bg-deep_green/10 transition" tabIndex={0} title="Download" onClick={() => handleFileDownload(file)}>
                      <FiDownload className="text-xl text-deep_green group-hover:text-main_dark" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-slatebluegray px-3 py-3">No documents attached to this request</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-1 pb-8">
              <button className="flex-1 bg-web_yellow text-main_dark font-semibold text-base py-3 rounded-lg shadow hover:opacity-90 transition"
                onClick={() => navigate(`/quotations/submit/${request.id}`)}>
                Send Quotation
              </button>
              <button className="flex-1 flex items-center justify-center bg-deep_green text-purewhite font-semibold text-base py-3 rounded-lg shadow hover:opacity-90 transition"
                onClick={() => navigate("/requests")}>
                &larr; Back to Requests
              </button>
            </div>
          </div>
        </div>

        {/* --- Right Panel: Info/Quick Links/Branding --- */}
        <div className="w-full lg:w-[390px] flex-shrink-0 px-2 sm:px-2 py-4 flex flex-col mr-14">
          <div className="sticky top-6">
            <div className="rounded-2xl border border-light_gray bg-white p-7 flex flex-col items-center mb-8">
              <div className="text-xl font-semibold text-main_dark mb-2 text-center mt-3">
                Supplier Portal
              </div>
              <div className="text-slatebluegray text-sm font-medium text-center mb-5">
                Manage your material requests, quotations, and orders—fast and seamlessly!
              </div>
              <div className="w-full border-t border-light_gray my-4"/>
              <div className="flex items-center gap-3 mb-1">
                <FiCheckCircle className="text-deep_green text-xl" />
                <div className="text-main_dark font-semibold">
                  Status:&nbsp;<span className="capitalize">{request.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <FaUserTie className="text-deep_green" />
                <div className="text-main_dark">
                  <span className="font-semibold">Requested By:</span> {request.requesterName}
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <FiInfo className="text-web_yellow text-xl" />
                <div className="text-main_dark text-sm">
                  <span className="font-semibold">Deadline:</span>
                  <span className="ml-1">{formatDate(request.quotationDeadline)}</span>
                </div>
              </div>
              {/* Tips or Quick Links */}
              <div className="w-full border-t border-light_gray my-4"/>
              <div className="mt-2 flex flex-col w-full gap-2 mb-3">
                <a href="/requests" className="text-deep_green hover:text-main_dark font-semibold px-4 py-2 rounded-full border border-light_gray transition text-center">
                  &#8592; All Requests
                </a>
                <a href="/orders" className="text-main_dark hover:text-web_yellow font-semibold px-4 py-2 rounded-full border border-light_gray transition text-center">
                  View All Orders
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* ---- End Right Panel ---- */}
      </div>{/* End Split Panel */}
    </div>
  );
};

export default RequestDetails;
