import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
} from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import { generateNextSupplierId } from "./Functions";

const SupplierRegPage = () => {
  const [supplierData, setSupplierData] = useState({
    companyName: "",
    businessType: "Manufacturer",
    registrationNumber: "",
    user_name: "",
    email: "",
    phone_number1: "",
    phone_number2: "",
    street: "",
    city: "",
    district: "",
    province: "",
    primaryCategory: "Electronics",
    minimumOrderValue: "",
    productDescription: "",
  });
  // const [userDetails, setUserDetails] = useState({
  //   supplierId: "",
  //   user_name: "",
  //   email: "",
  //   phone_number1: "",
  //   phone_number2: "",
  //   address: "",
  //   userRole: "Supplier",
  //   password: "",
  // });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleOnSubmit =async (e) => {
    e.preventDefault();
    // Prepare data for submission
    const submissionData = {
      supplierId: supplierData.registrationNumber,
      user_name: supplierData.user_name,
      email: supplierData.email,
      phone_number1: supplierData.phone_number1,
      phone_number2: supplierData.phone_number2,
      address: `${supplierData.street}, ${supplierData.city}, ${supplierData.district}, ${supplierData.province}`,
      userRole: "Supplier",
      password: "<GENERATED_PASSWORD>", // You can change this to a more secure password or generate one
    };// console.log(userDetails);


    if (!submissionData.supplierId || !submissionData.user_name || !submissionData.email || !submissionData.phone_number1) {
      alert("Please fill in all required fields");
      return;
    }

    const response=await fetch(
      "http://localhost:8080/api/user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      }
    );
    const result = await response.json();
    
  };

  const [SuppliersLatestId, setSuppliersLatestId] = useState("");
  const getlatestSupplierId = async () => {
    const response = await fetch(
      "http://localhost:8080/api/supplier/latest-id",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    
    if(data.status === "success") {
      setSuppliersLatestId(data.data);
    }else{
      // Handle error case
    }
  };
  
  useEffect(() => {
    getlatestSupplierId();
  }, []);
  

  const [newSupplierId, setNewSupplierId] = useState("");
  useEffect(() => {
    if (SuppliersLatestId) {
      const nextId = generateNextSupplierId(SuppliersLatestId);
      setNewSupplierId(nextId);
      setSupplierData((prevState) => ({
        ...prevState,
        registrationNumber: nextId,
      }));
    }   
  }, [SuppliersLatestId]);
  

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar
        links={[
          { name: "Dashboard", path: "/purchasing/dashboard" },
          { name: "Requests", path: "/purchasing/materialrequests/overview" },
          { name: "Orders", path: "/orders" },
          { name: "Suppliers", path: "/purchasing/supplier/dashboard" },
          { name: "Reports", path: "/reports" },
        ]}
      />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Back Button and Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button className="flex items-center gap-2 text-gray-600 hover:text-main_dark mb-4">
                <FaArrowLeft />
                <span className="text-sm">Back</span>
              </button>
              <h1 className="text-2xl font-bold text-main_dark">
                Supplier Registration
              </h1>
              <p className="text-gray-600 text-sm">
                Register new suppliers and manage existing supplier profiles
              </p>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Register New Supplier */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Information */}
              <div className="bg-light_brown/30 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Company Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Enter company name"
                      value={supplierData.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={supplierData.businessType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    >
                      <option>Manufacturer</option>
                      <option>Distributor</option>
                      <option>Service Provider</option>
                      <option>Retailer</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      placeholder="Enter registration number"
                      value={supplierData.registrationNumber}
                      onChange={handleChange}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Contact Name *
                    </label>
                    <input
                      type="text"
                      name="user_name"
                      placeholder="Enter contact name"
                      value={supplierData.user_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={supplierData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number 1*
                    </label>
                    <input
                      type="tel"
                      name="phone_number1"
                      placeholder="Enter phone number"
                      value={supplierData.phone_number1}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number 2
                    </label>
                    <input
                      type="tel"
                      name="phone_number2"
                      placeholder="Enter Phone number 2"
                      value={supplierData.phone_number2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Address Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      placeholder="Enter street address"
                      value={supplierData.street}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={supplierData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="district"
                      placeholder="Enter district"
                      value={supplierData.district}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province *
                    </label>
                    <input
                      type="text"
                      name="province"
                      placeholder="Enter province"
                      value={supplierData.province}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-4">
                  Business Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Category
                    </label>
                    <select
                      name="primaryCategory"
                      value={supplierData.primaryCategory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    >
                      <option>Electronics</option>
                      <option>Construction Materials</option>
                      <option>Textiles</option>
                      <option>Food & Beverages</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order Value
                    </label>
                    <input
                      type="number"
                      name="minimumOrderValue"
                      placeholder="Enter minimum order value"
                      value={supplierData.minimumOrderValue}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description
                  </label>
                  <textarea
                    name="productDescription"
                    value={supplierData.productDescription}
                    onChange={handleChange}
                    placeholder="Describe products and services offered..."
                    rows={4}
                    className="w-full resize-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Supplier Summary */}
            <div>
              <div className="bg-purewhite border border-gray-200 overflow-hidden rounded-lg sticky top-10">
                <h2 className="text-lg font-semibold bg-web_yellow/10 p-6 text-main_dark mb-4">
                  Registration Summary
                </h2>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium text-main_dark">
                        {supplierData.companyName || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Type:</span>
                      <span className="font-medium text-main_dark">
                        {supplierData.businessType}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                        {supplierData.primaryCategory}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Order:</span>
                      <span className="font-bold text-main_dark">
                        ${supplierData.minimumOrderValue || "0"}
                      </span>
                    </div>

                    <hr className="border-gray-300" />

                    <div>
                      <h4 className="font-semibold text-main_dark mb-2">
                        Contact:
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>
                          {supplierData.user_name || "Not specified"}
                        </p>
                        <p>{supplierData.email || "Not specified"}</p>
                        <p>{supplierData.phoneNumber1 || "Not specified"}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-main_dark mb-2">
                        Address:
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>{supplierData.street || "Street not specified"}</p>
                        <p>
                          {supplierData.city || "City not specified"},{" "}
                          {supplierData.district || "District not specified"}
                        </p>
                        <p>
                          {supplierData.province || "Province not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button className="w-full px-4 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-semibold flex items-center justify-center gap-2" onClick={handleOnSubmit}>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Register Supplier
                    </button>

                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplierRegPage;
