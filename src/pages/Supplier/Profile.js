// src/pages/Supplier/Profile.jsx

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaDownload,
  FaTrash,
  FaPaperclip,
  FaCheckCircle,
  FaTruck,
  FaStar,
  FaClock,
  FaFileAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { AuthContext } from "../../Context/AuthContext";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations" },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments" },
];

const Profile = () => {
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const supplierId = authState?.user?.supplierId;

  useEffect(() => {
    if (!supplierId) {
      setError("Supplier ID not found");
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    const fetchSupplier = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/supplier/find/${supplierId}`
        );
        setSupplierData(res.data.data);
        console.log("Supplier Data:", res.data.data);
      } catch (err) {
        setError("Failed to load supplier details");
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [supplierId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-deep_green mx-auto mb-4"></div>
          <p className="text-slatebluegray text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/supplier/dashboard")}
            className="bg-web_yellow text-main_dark px-6 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar
        links={navLinks}
        profileURL="/supplier/profile"
        logoSrc="/logo1.png"
      />

      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-16 py-6">
        {/* Header Section */}
        <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-6 mb-5 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full border-3 border-web_yellow flex items-center justify-center overflow-hidden bg-light_gray">
              <img
                src="/assets/profile/supplier.jpg"
                alt="Company Logo"
                className="w-full h-full object-contain p-3"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-deep_green mb-1">
                {supplierData?.company_name || "Company Name"}
              </h1>
              <p className="text-slatebluegray">
                Premium construction materials and equipment supplier
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/supplier/profile/edit")}
            className="mt-4 md:mt-0 bg-web_yellow text-main_dark px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition"
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-purewhite rounded-lg p-5 shadow-sm border border-light_gray">
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-deep_green text-2xl" />
              <span className="text-3xl font-bold text-deep_green">
                {supplierData?.past_orders_completed || 0}
              </span>
            </div>
            <p className="text-slatebluegray font-medium text-sm">
              Orders Completed
            </p>
          </div>

          <div className="bg-purewhite rounded-lg p-5 shadow-sm border border-light_gray">
            <div className="flex items-center justify-between mb-2">
              <FaTruck className="text-deep_green text-2xl" />
              <span className="text-3xl font-bold text-deep_green">
                {supplierData?.on_time_delivery_rate || "N/A"}
                {supplierData?.on_time_delivery_rate && (
                  <span className="text-lg">%</span>
                )}
              </span>
            </div>
            <p className="text-slatebluegray font-medium text-sm">
              On-Time Delivery
            </p>
          </div>

          <div className="bg-purewhite rounded-lg p-5 shadow-sm border border-light_gray">
            <div className="flex items-center justify-between mb-2">
              <FaStar className="text-web_yellow text-2xl" />
              <span className="text-3xl font-bold text-deep_green">
                {supplierData?.rating_by_site_manager || "N/A"}
                {supplierData?.rating_by_site_manager && (
                  <span className="text-lg">/5</span>
                )}
              </span>
            </div>
            <p className="text-slatebluegray font-medium text-sm">
              Manager Rating
            </p>
          </div>

          <div className="bg-purewhite rounded-lg p-5 shadow-sm border border-light_gray">
            <div className="flex items-center justify-between mb-2">
              <FaClock className="text-deep_green text-2xl" />
              <span className="text-3xl font-bold text-deep_green">
                {supplierData?.avg_delay_days !== null &&
                supplierData?.avg_delay_days !== undefined
                  ? supplierData.avg_delay_days
                  : "N/A"}
              </span>
            </div>
            <p className="text-slatebluegray font-medium text-sm">
              Avg Delay Days
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Information */}
          <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
            <h2 className="text-lg font-semibold text-deep_green mb-4">
              Company Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Company Name
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.company_name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Business Registration Number
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.business_Registration_Number || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
            <h2 className="text-lg font-semibold text-deep_green mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Contact Person
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.userDetails?.user_name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Email Address
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.userDetails?.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Phone Number
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.userDetails?.phone_number1 || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Address & Location */}
          <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
            <h2 className="text-lg font-semibold text-deep_green mb-4">
              Address & Location
            </h2>
            <div>
              <label className="text-xs text-slatebluegray mb-1 block">
                Company Address
              </label>
              <p className="text-main_dark font-semibold">
                {supplierData?.userDetails?.address || "N/A"}
              </p>
            </div>
          </div>

          {/* Distribution & Delivery */}
          <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
            <h2 className="text-lg font-semibold text-deep_green mb-4">
              Distribution & Delivery
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Delivery Capabilities
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.delivery_Capabilities ||
                    supplierData?.Delivery_Capabilities ||
                    "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  On-Time Delivery Rate
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.on_time_delivery_rate
                    ? `${supplierData.on_time_delivery_rate}%`
                    : "Not available"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Average Delay Days
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.avg_delay_days !== null &&
                  supplierData?.avg_delay_days !== undefined
                    ? `${supplierData.avg_delay_days} days`
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
            <h2 className="text-lg font-semibold text-deep_green mb-4">
              Performance Metrics
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slatebluegray text-sm">
                  Past Orders Completed
                </span>
                <span className="text-main_dark font-bold">
                  {supplierData?.past_orders_completed || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slatebluegray text-sm">
                  Site Manager Rating
                </span>
                <span className="text-main_dark font-bold">
                  {supplierData?.rating_by_site_manager
                    ? `${supplierData.rating_by_site_manager}/5 ⭐`
                    : "Not rated yet"}
                </span>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
            <h2 className="text-lg font-semibold text-deep_green mb-4">
              Security & Banking
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Account Number
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.bank_account_number
                    ? `****-****-****-${supplierData.bank_account_number.slice(
                        -4
                      )}`
                    : "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Bank Name
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.bank_name || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-xs text-slatebluegray mb-1 block">
                  Account Name
                </label>
                <p className="text-main_dark font-semibold">
                  {supplierData?.bank_account_name || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Documents & Certifications - Full Width */}
          <div className="md:col-span-2 bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-deep_green">
                Documents & Certifications
              </h2>
              <button className="bg-deep_green text-purewhite px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 font-medium text-sm">
                <FaPaperclip /> Upload Document
              </button>
            </div>
            <div className="space-y-2">
              {supplierData?.documents && supplierData.documents.length > 0 ? (
                supplierData.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-light_gray rounded-lg hover:bg-gray-200 transition"
                  >
                    <div className="flex items-center gap-3">
                      <FaPaperclip className="text-deep_green" />
                      <span className="text-main_dark font-medium text-sm">
                        {doc.document_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-deep_green hover:text-green-700 p-1.5">
                        <FaDownload />
                      </button>
                      <button className="text-red-500 hover:text-red-700 p-1.5">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slatebluegray">
                  <FaFileAlt className="mx-auto text-3xl mb-2 opacity-30" />
                  <p className="text-sm">No documents uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
