// src/pages/Supplier/Profile.jsx
import React from "react";
import { FaEdit, FaDownload, FaTrash, FaLock,FaPaperclip } from "react-icons/fa";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
  { name: "Profile", href: "/profile", active: true }
];

const Profile = () => {
  return (
    <div className="bg-purewhite min-h-screen font-poppins">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-full mx-auto px-16 py-8">
        {/* Header */}
        <div className="bg-purewhite rounded-lg p-6 mb-6 flex items-center justify-between border border-light_gray">
          <div>
            <h1 className="text-3xl font-bold text-deep_green mb-2">BuildMax Construction Supplies</h1>
            <p className="text-gray-500 mb-5">Premium construction materials and equipment supplier</p>
            <button className="bg-web_yellow text-main_dark px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition">
              <FaEdit /> Edit Profile
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-light_gray flex items-center justify-center overflow-hidden border-2 border-web_yellow mr-5">
              {/* Company logo */}
              <img src="/company-logo.png" alt="Company Logo" className="w-24 h-24 object-contain" />
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
              <div className="font-medium text-main_dark">BuildMax Construction Supplies</div>
            </div>
            <div>
              <div className="text-slatebluegray text-sm mt-5">Business Registration Number</div>
              <div className="font-medium text-main_dark">REG-2024-CM-001</div>
            </div>
          </div>
          {/* Contact Information */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Contact Information</div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm mt-5">Contact Person</div>
              <div className="font-medium text-main_dark">John Anderson</div>
            </div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm">Email Address</div>
              <div className="font-medium text-main_dark">john.anderson@buildmax.com</div>
            </div>
            <div>
              <div className="text-slatebluegray text-sm">Phone Number</div>
              <div className="font-medium text-main_dark">+1 (555) 123-4567</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Address & Location */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl ">Address & Location</div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm mt-5">Company Address</div>
              <div className="font-medium text-main_dark">1234 Industrial Boulevard, Construction District, NY 10001</div>
            </div>
            <div>
              <div className="text-slatebluegray text-sm mb-1">Operating Locations</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-light_gray text-main_dark px-3 py-1 rounded-full text-xs font-medium">New York</span>
                <span className="bg-light_gray text-main_dark px-3 py-1 rounded-full text-xs font-medium">New Jersey</span>
                <span className="bg-light_gray text-main_dark px-3 py-1 rounded-full text-xs font-medium">Connecticut</span>
                <button className="bg-gray-200 text-main_dark px-3 py-1 rounded-full text-xs font-medium border border-light_gray hover:bg-gray-300 transition">+ Add Location</button>
              </div>
            </div>
          </div>
          {/* Products & Services */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Products & Services</div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm mb-1">Product Offerings</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-web_yellow text-main_dark px-3 py-1 rounded-full text-xs font-medium">Concrete</span>
                <span className="bg-web_yellow text-main_dark px-3 py-1 rounded-full text-xs font-medium">Steel Beams</span>
                <span className="bg-web_yellow text-main_dark px-3 py-1 rounded-full text-xs font-medium">Lumber</span>
                <span className="bg-web_yellow text-main_dark px-3 py-1 rounded-full text-xs font-medium">Roofing Materials</span>
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
                24/7 delivery service with our fleet of 15 trucks. Same-day delivery available within 50-mile radius. Specialized equipment for heavy materials.
              </div>
            </div>
            <div>
              <div className="text-slatebluegray text-sm mb-1">Pricing Details</div>
              <div className="text-main_dark text-sm">
                Competitive wholesale pricing with volume discounts. 2% early payment discount. Net 30 payment terms for established clients.
              </div>
            </div>
          </div>
          {/* Performance Metrics */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Performance Metrics</div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slatebluegray text-sm">Average Delivery Time</span>
                <span className="font-semibold text-main_dark">2.3 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slatebluegray text-sm">Reliability Score</span>
                <span className="font-semibold text-main_dark">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slatebluegray text-sm">Customer Rating</span>
                <span className="font-semibold text-main_dark">4.8/5.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Documents & Certifications */}
          <div className="bg-purewhite rounded-lg border border-light_gray p-5">
            <div className="font-semibold text-deep_green text-xl mb-3">Documents & Certifications</div>
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex items-center justify-between bg-light_gray rounded px-3 py-2">
                <div className="flex items-center gap-2">
                  <FaPaperclip className="text-web_yellow" />
                  <span className="text-main_dark text-sm">Business License.pdf</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-deep_green hover:text-green-700"><FaDownload /></button>
                  <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-light_gray rounded px-3 py-2">
                <div className="flex items-center gap-2">
                  <FaPaperclip className="text-web_yellow" />
                  <span className="text-main_dark text-sm">Insurance Certificate.pdf</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-deep_green hover:text-green-700"><FaDownload /></button>
                  <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </div>
              </div>
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
              <div className="font-medium text-main_dark">****-****-****-1234</div>
            </div>
            <div className="mb-2">
              <div className="text-slatebluegray text-sm">Bank Name</div>
              <div className="font-medium text-main_dark">First National Bank</div>
            </div>
            <div>
              
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4 justify-center mt-6">
          <button className="bg-web_yellow text-main_dark px-8 py-3 rounded-lg font-semibold text-lg shadow hover:opacity-90 transition">
            Save All Changes
          </button>
          <button className="flex items-center gap-2 bg-deep_green text-purewhite px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition">
                <FaLock /> Change Password
            </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
