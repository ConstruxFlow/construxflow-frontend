// src/pages/Supplier/EditProfile.jsx

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaSave, FaLock, FaPaperclip, FaDownload, FaTrash } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations" },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments" },

];

const EditProfile = () => {
  const [supplierData, setSupplierData] = useState({
    company_name: "",
    business_Registration_Number: "",
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
    delivery_Capabilities: "",
    userDetails: {
      user_name: "",
      email: "",
      phone_number1: "",
      address: ""
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const {authState}=useContext(AuthContext);
  const navigate = useNavigate();
  console.log("Auth State:", authState?.user?.supplierId);

  const supplierId = authState?.user?.supplierId;
  console.log("Supplier ID:", supplierId);


  // const supplierId = "S001"; // Replace with actual logic

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
        toast.error("Failed to load supplier details");
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [supplierId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("userDetails.")) {
      const key = name.split(".")[1];
      setSupplierData((prev) => ({
        ...prev,
        userDetails: {
          ...prev.userDetails,
          [key]: value
        }
      }));
    } else {
      setSupplierData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      await axios.put(`http://localhost:8080/api/supplier/update/${supplierId}`, supplierData);
      toast.success("Profile updated successfully.");
      navigate("/supplier/profile");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} profileURL="/supplier/profile" logoSrc="/logo1.png" />

      <form onSubmit={handleSubmit}>
        <div className="max-w-full mx-auto px-16 py-8">
          {/* Header */}
          <div className="bg-purewhite rounded-lg p-6 mb-6 flex items-center justify-between border border-light_gray">
            <div>
              <input
                className="text-3xl font-bold text-deep_green mb-2 bg-transparent border-b-2 border-light_gray focus:border-deep_green outline-none"
                name="company_name"
                value={supplierData.company_name}
                onChange={handleChange}
                required
              />
              <p className="text-gray-500 mb-5">Premium construction materials and equipment supplier</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 rounded-full bg-light_gray flex items-center justify-center overflow-hidden border-2 border-web_yellow mr-5">
                <img src="/assets/profile/supplier.jpg" alt="Company Logo" className="w-24 h-24 object-contain" />
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
                <input
                  className="font-medium text-main_dark w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="company_name"
                  value={supplierData.company_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="text-slatebluegray text-sm mt-5">Business Registration Number</div>
                <input
                  className="font-medium text-main_dark w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="business_Registration_Number"
                  value={supplierData.business_Registration_Number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Contact Information */}
            <div className="bg-purewhite rounded-lg border border-light_gray p-5">
              <div className="font-semibold text-deep_green text-xl mb-3">Contact Information</div>
              <div className="mb-2">
                <div className="text-slatebluegray text-sm mt-5">Contact Person</div>
                <input
                  className="font-medium text-main_dark w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="userDetails.user_name"
                  value={supplierData.userDetails?.user_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <div className="text-slatebluegray text-sm">Email Address</div>
                <input
                  type="email"
                  className="font-medium text-main_dark w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="userDetails.email"
                  value={supplierData.userDetails?.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="text-slatebluegray text-sm">Phone Number</div>
                <input
                  className="font-medium text-main_dark w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="userDetails.phone_number1"
                  value={supplierData.userDetails?.phone_number1}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Address & Location */}
            <div className="bg-purewhite rounded-lg border border-light_gray p-5">
              <div className="font-semibold text-deep_green text-xl ">Address & Location</div>
              <div className="mb-2">
                <div className="text-slatebluegray text-sm mt-5">Company Address</div>
                <textarea
                  className="font-medium text-main_dark w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="userDetails.address"
                  value={supplierData.userDetails?.address}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              
            </div>
            {/* Products & Services */}
            <div className="bg-purewhite rounded-lg border border-light_gray p-5">
              <div className="font-semibold text-deep_green text-xl mb-3">Products & Services</div>
              <div className="mb-2">
                <div className="text-slatebluegray text-sm mb-1">Product Offerings</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-web_yellow text-main_dark px-3 py-1 rounded-full text-xs font-medium">No materials registered yet</span>
                  <button type="button" className="bg-gray-200 text-main_dark px-3 py-1 rounded-full text-xs font-medium border border-light_gray hover:bg-gray-300 transition">+ Add Product</button>
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
                <input
                  className="text-main_dark text-sm w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="delivery_Capabilities"
                  value={supplierData.delivery_Capabilities}
                  onChange={handleChange}
                />
              </div>
              
            </div>
            {/* Performance Metrics */}
            <div className="bg-purewhite rounded-lg border border-light_gray p-5">
              <div className="font-semibold text-deep_green text-xl mb-3">Performance Metrics</div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-slatebluegray text-sm">Average Delivery Time</span>
                  <input
                    className="font-semibold text-main_dark border-b border-light_gray bg-transparent focus:outline-none w-24 text-right"
                    name="average_delivery_time"
                    value={supplierData.average_delivery_time || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-slatebluegray text-sm">Reliability Score</span>
                  <input
                    className="font-semibold text-main_dark border-b border-light_gray bg-transparent focus:outline-none w-24 text-right"
                    name="reliability_score"
                    value={supplierData.reliability_score || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-slatebluegray text-sm">Customer Rating</span>
                  <input
                    className="font-semibold text-main_dark border-b border-light_gray bg-transparent focus:outline-none w-24 text-right"
                    name="customer_rating"
                    value={supplierData.customer_rating || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Documents & Certifications */}
            <div className="bg-purewhite rounded-lg border border-light_gray p-5">
              <div className="font-semibold text-deep_green text-xl mb-3">Documents & Certifications</div>
              <div className="flex flex-col gap-2 mb-2">
                <div className="text-main_dark text-sm">No documents uploaded yet</div>
              </div>
              <button type="button" className="w-full bg-purewhite text-main_dark py-2 rounded-lg border border-deep_green hover:bg-gray-200 transition text-sm font-medium mt-2">
                + Upload Document
              </button>
            </div>
            {/* Security & Banking */}
            <div className="bg-purewhite rounded-lg border border-light_gray p-5">
              <div className="font-semibold text-deep_green text-xl mb-3">Security & Banking</div>
              <div className="mb-2">
                <div className="text-slatebluegray text-sm">Account Number</div>
                <input
                  className="font-medium text-main_dark w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="bank_account_number"
                  value={supplierData.bank_account_number || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <div className="text-slatebluegray text-sm">Bank Name</div>
                <input
                  className="font-medium text-main_dark w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="bank_name"
                  value={supplierData.bank_name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <div className="text-slatebluegray text-sm">Account Name</div>
                <input
                  className="font-medium text-main_dark w-full border-b border-light_gray bg-transparent focus:outline-none"
                  name="bank_account_name"
                  value={supplierData.bank_account_name || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4 justify-center mt-6">
            <button
              type="submit"
              className="bg-web_yellow text-main_dark px-8 py-3 rounded-lg font-semibold text-lg shadow hover:opacity-90 transition flex items-center gap-2"
            >
              <FaSave /> Save All Changes
            </button>
            <button
              type="button"
              className="flex items-center gap-2 bg-deep_green text-purewhite px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              <FaLock /> Change Password
            </button>
          </div>
          {successMsg && <div className="mt-4 text-green-600">{successMsg}</div>}
          {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

