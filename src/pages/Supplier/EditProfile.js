// src/pages/Supplier/EditProfile.jsx

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaSave, FaArrowLeft } from "react-icons/fa";
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
      address: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const supplierId = authState?.user?.supplierId;

  useEffect(() => {
    if (!supplierId) {
      toast.error("Supplier ID not found");
      navigate("/supplier/dashboard");
      return;
    }

    fetchSupplier();
  }, [supplierId]);

  const fetchSupplier = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/supplier/find/${supplierId}`
      );
      setSupplierData(res.data.data);
    } catch (err) {
      toast.error("Failed to load supplier details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("userDetails.")) {
      const key = name.split(".")[1];
      setSupplierData((prev) => ({
        ...prev,
        userDetails: {
          ...prev.userDetails,
          [key]: value,
        },
      }));
    } else {
      setSupplierData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8080/api/supplier/update/${supplierId}`,
        supplierData
      );
      toast.success("Profile updated successfully!");
      navigate("/supplier/profile");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-deep_green mx-auto mb-4"></div>
          <p className="text-slatebluegray text-lg">Loading...</p>
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
        {/* Back Button */}
        <button
          onClick={() => navigate("/supplier/profile")}
          className="flex items-center gap-2 text-slatebluegray hover:text-deep_green mb-4 transition"
        >
          <FaArrowLeft /> Back to Profile
        </button>

        <h1 className="text-2xl font-bold text-deep_green mb-6">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Company Information */}
            <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
              <h2 className="text-lg font-semibold text-deep_green mb-4">
                Company Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slatebluegray mb-1 block font-medium">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={supplierData.company_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green"
                  />
                </div>
                <div>
                  <label className="text-xs text-slatebluegray mb-1 block font-medium">
                    Business Registration Number *
                  </label>
                  <input
                    type="text"
                    name="business_Registration_Number"
                    value={supplierData.business_Registration_Number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
              <h2 className="text-lg font-semibold text-deep_green mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slatebluegray mb-1 block font-medium">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="userDetails.user_name"
                    value={supplierData.userDetails?.user_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green"
                  />
                </div>
                <div>
                  <label className="text-xs text-slatebluegray mb-1 block font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="userDetails.email"
                    value={supplierData.userDetails?.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green"
                  />
                </div>
                <div>
                  <label className="text-xs text-slatebluegray mb-1 block font-medium">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="userDetails.phone_number1"
                    value={supplierData.userDetails?.phone_number1}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
              <h2 className="text-lg font-semibold text-deep_green mb-4">
                Address & Location
              </h2>
              <div>
                <label className="text-xs text-slatebluegray mb-1 block font-medium">
                  Company Address
                </label>
                <textarea
                  name="userDetails.address"
                  value={supplierData.userDetails?.address}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green resize-none"
                />
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
              <h2 className="text-lg font-semibold text-deep_green mb-4">
                Distribution & Delivery
              </h2>
              <div>
                <label className="text-xs text-slatebluegray mb-1 block font-medium">
                  Delivery Capabilities
                </label>
                <input
                  type="text"
                  name="delivery_Capabilities"
                  value={supplierData.delivery_Capabilities || ""}
                  onChange={handleChange}
                  placeholder="e.g., Nationwide, Same-day delivery"
                  className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green"
                />
              </div>
            </div>

            {/* Banking */}
            <div className="md:col-span-2 bg-purewhite rounded-lg shadow-sm border border-light_gray p-5">
              <h2 className="text-lg font-semibold text-deep_green mb-4">
                Banking Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slatebluegray mb-1 block font-medium">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={supplierData.bank_name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green"
                  />
                </div>
                <div>
                  <label className="text-xs text-slatebluegray mb-1 block font-medium">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="bank_account_name"
                    value={supplierData.bank_account_name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green"
                  />
                </div>
                <div>
                  <label className="text-xs text-slatebluegray mb-1 block font-medium">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="bank_account_number"
                    value={supplierData.bank_account_number || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-light_gray rounded-lg focus:outline-none focus:border-deep_green"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/supplier/profile")}
              className="px-6 py-3 border border-light_gray rounded-lg text-main_dark hover:bg-light_gray transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-web_yellow text-main_dark px-8 py-3 rounded-lg font-semibold shadow hover:opacity-90 transition flex items-center gap-2"
            >
              <FaSave /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
