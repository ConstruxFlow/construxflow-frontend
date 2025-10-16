// src/pages/Supplier/Profile.jsx

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaDownload, FaTrash, FaLock, FaPaperclip } from "react-icons/fa";
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
  const {authState}=useContext(AuthContext);
  console.log("Auth State:", authState?.user?.supplierId);
  

    const navigate = useNavigate();

  // console.log("Supplier ID:");
  
  // Replace with actual supplier ID logic (from auth or route params)
  const supplierId = authState?.user?.supplierId;
  console.log("Supplier ID:", supplierId);

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
      const res = await axios.get(`http://localhost:8080/api/supplier/find/${supplierId}`);
      setSupplierData(res.data.data);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Header */}
        <div className="bg-purewhite rounded-lg p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 sm:gap-0 border border-light_gray">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-deep_green mb-2">
              {supplierData?.company_name || "Company Name"}
            </h1>
            <p className="text-gray-500 mb-5">
              Premium construction materials and equipment supplier
            </p>
            <button onClick={() => navigate('/supplier/profile/edit')} className="bg-web_yellow text-main_dark px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition mx-auto sm:mx-0">
              <FaEdit /> Edit Profile
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-light_gray flex items-center justify-center overflow-hidden border-2 border-web_yellow mr-0 sm:mr-5">
              <img src="/assets/profile/supplier.jpg" alt="Company Logo" className="w-52 h-52 object-contain" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Company Information */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green mb-3 text-xl">Company Information</div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm mt-5">Company Name</div>
              <div className="font-medium text-main_dark">{supplierData?.company_name || "N/A"}</div>
            </div>
            <div>
              <div className="text-slatebluegray text-sm mt-5">Business Registration Number</div>
              <div className="font-medium text-main_dark">{supplierData?.business_Registration_Number || "N/A"}</div>
            </div>
          </div>
          {/* Contact Information */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Contact Information</div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm mt-5">Contact Person</div>
              <div className="font-medium text-main_dark">{supplierData?.userDetails?.user_name || "N/A"}</div>
            </div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm">Email Address</div>
              <div className="font-medium text-main_dark">{supplierData?.userDetails?.email || "N/A"}</div>
            </div>
            <div>
              <div className="text-slatebluegray text-sm">Phone Number</div>
              <div className="font-medium text-main_dark">{supplierData?.userDetails?.phone_number1 || "N/A"}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Address & Location */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl ">Address & Location</div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm mt-5">Company Address</div>
              <div className="font-medium text-main_dark">{supplierData?.userDetails?.address || "N/A"}</div>
            </div>
            
          </div>
          {/* Products & Services */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Products & Services</div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm mb-1">Product Offerings</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {supplierData?.materials && supplierData.materials.length > 0 ? (
                  supplierData.materials.map((mat, idx) => (
                    <span key={idx} className="bg-web_yellow text-main_dark px-3 py-1 rounded-full text-xs font-medium">
                      {mat.material_name}
                    </span>
                  ))
                ) : (
                  <span className="bg-web_yellow text-main_dark px-3 py-1 rounded-full text-xs font-medium">No materials registered yet</span>
                )}
                <button className="bg-gray-200 text-main_dark px-3 py-1 rounded-full text-xs font-medium border border-light_gray hover:bg-gray-300 transition">+ Add Product</button>
              </div>
            </div>
            <div>
              <div className="text-slatebluegray text-sm mb-1">Material Availability</div>
              <select className="w-40 px-3 py-2 border border-light_gray rounded-md bg-white text-main_dark text-sm focus:outline-none">
                <option>Available</option>
                <option>Limited</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Distribution & Delivery */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Distribution & Delivery</div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm mb-1">Delivery Capabilities</div>
              <div className="text-main_dark text-sm">
                {supplierData?.delivery_Capabilities || "Not specified"}
              </div>
            </div>
            
          </div>
          {/* Performance Metrics */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Performance Metrics</div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slatebluegray text-sm">Average Delivery Time</span>
                <span className="font-semibold text-main_dark">{supplierData?.average_delivery_time || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slatebluegray text-sm">Reliability Score</span>
                <span className="font-semibold text-main_dark">{supplierData?.reliability_score || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slatebluegray text-sm">Customer Rating</span>
                <span className="font-semibold text-main_dark">{supplierData?.customer_rating || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Documents & Certifications */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Documents & Certifications</div>
            <div className="flex flex-col gap-2 mb-2">
              {supplierData?.documents && supplierData.documents.length > 0 ? (
                supplierData.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-light_gray rounded px-3 py-2">
                    <div className="flex items-center gap-2">
                      <FaPaperclip className="text-web_yellow" />
                      <span className="text-main_dark text-sm">{doc.document_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-deep_green hover:text-green-700"><FaDownload /></button>
                      <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-main_dark text-sm">No documents uploaded yet</div>
              )}
            </div>
            <button className="w-full bg-purewhite text-main_dark py-2 rounded-lg border border-deep_green hover:bg-gray-200 transition text-sm font-medium mt-2">
              + Upload Document
            </button>
          </div>
          {/* Security & Banking */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Security & Banking</div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm">Account Number</div>
              <div className="font-medium text-main_dark">
                {supplierData?.bank_account_number
                  ? `****-****-****-${supplierData.bank_account_number.slice(-4)}`
                  : "Not provided"}
              </div>
            </div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm">Bank Name</div>
              <div className="font-medium text-main_dark">{supplierData?.bank_name || "Not provided"}</div>
            </div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm">Account Name</div>
              <div className="font-medium text-main_dark">{supplierData?.bank_account_name || "Not provided"}</div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          {/* <button className="bg-web_yellow text-main_dark px-8 py-3 rounded-lg font-semibold text-lg shadow hover:opacity-90 transition">
            Save All Changes
          </button> */}
          <button className="flex items-center gap-2 bg-deep_green text-purewhite px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition">
            <FaLock /> Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
