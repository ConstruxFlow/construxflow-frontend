import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineStorage, MdOutlineNotificationsNone } from "react-icons/md";
import { FaTruck, FaRegFileAlt } from "react-icons/fa";
import { BsCreditCard2Back } from "react-icons/bs";
import { FaEye, FaPlus, FaUser, FaHeadset } from "react-icons/fa";
import { FaRegCheckCircle, FaRegFolderOpen } from "react-icons/fa";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
];

const SupplierDashboard = () => {
  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar links={navLinks} logoSrc="/logo1.png" />
      <div className="max-w-full mx-auto px-16 py-6">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome back, John!</h2>
        <p className="text-gray-500 mb-8 text-base">
          Here’s what’s happening with your supply chain today.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-5 mb-8 flex items-start gap-4 shadow-md">
          <div className="text-yellow-600 text-2xl mt-1">⚠</div>
          <div>
            <h3 className="font-semibold text-base text-gray-800 mb-1 tracking-wide">
              Urgent Actions Required
            </h3>
            <p className="text-yellow-700 text-sm font-medium">
              3 delayed shipments • 2 critical stock replenishments needed • 1 quotation awaiting your approval
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex items-center mb-2">
              <MdOutlineStorage className="text-2xl text-deep_green mr-2 " />
              <span className="bg-web_yellow text-xs px-2 py-1 rounded-full font-medium ml-auto">12 New</span>
            </div>
            <div className="text-2xl font-bold">24</div>
            <div className="text-gray-500">Pending Requests</div>
            <a href="/requests" className="text-deep_green text-sm mt-3 inline-block">View Details →</a>
          </div>
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex items-center mb-2">
              <FaRegFileAlt className="text-2xl text-web_yellow mr-2" />
              <span className="bg-deep_green text-xs text-white px-2 py-1 rounded-full font-medium ml-auto">8 Pending</span>
            </div>
            <div className="text-2xl font-bold">18</div>
            <div className="text-gray-500">Active Quotations</div>
            <a href="/quotations" className="text-deep_green text-sm mt-3 inline-block">Manage →</a>
          </div>
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex items-center mb-2">
              <FaTruck className="text-2xl text-deep_green mr-2" />
              <span className="bg-light_brown text-xs px-2 py-1 rounded-full font-medium ml-auto">5 In Transit</span>
            </div>
            <div className="text-2xl font-bold">32</div>
            <div className="text-gray-500">Purchase Orders</div>
            <a href="/orders" className="text-deep_green text-sm mt-3 inline-block">Track →</a>
          </div>
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex items-center mb-2">
              <BsCreditCard2Back className="text-2xl text-web_yellow mr-2" />
              <span className="bg-deep_green text-xs text-white px-2 py-1 rounded-full font-medium ml-auto">$45.2K</span>
            </div>
            <div className="text-2xl font-bold">$128.5K</div>
            <div className="text-gray-500">Total Payments</div>
            <a href="/payments" className="text-deep_green text-sm mt-3 inline-block">View All →</a>
          </div>
        </div>

        <div className="bg-purewhite border border-gray-200 rounded-xl p-5 mb-6">
            <div className="font-semibold mb-4">Quick Actions</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center bg-web_yellow text-main_dark px-6 py-5 rounded font-semibold shadow hover:brightness-95 transition">
                    <FaEye className="text-2xl mb-2" />
                    <span className="text-base font-medium">View Requests</span>
                </button>
                <button className="flex flex-col items-center justify-center bg-deep_green text-white px-6 py-5 rounded font-semibold shadow hover:brightness-95 transition">
                    <FaPlus className="text-2xl mb-2" />
                    <span className="text-base font-medium">New Quotation</span>
                </button>
                <button className="flex flex-col items-center justify-center bg-light_brown text-main_dark px-6 py-5 rounded font-semibold shadow hover:brightness-95 transition">
                    <FaUser className="text-2xl mb-2" />
                    <span className="text-base font-medium">Update Profile</span>
                </button>
                <button className="flex flex-col items-center justify-center bg-gray-200 text-main_dark px-6 py-5 rounded font-semibold shadow hover:brightness-95 transition">
                    <FaHeadset className="text-2xl mb-2" />
                    <span className="text-base font-medium">Contact Support</span>
                </button>
            </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 min-h-[230px]">
            <div className="font-semibold mb-2 text-lg text-gray-700">Material Requests Trend</div>
            {/* You can add a chart here */}
          </div>
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 min-h-[230px]">
            <div className="font-semibold mb-2 text-lg text-gray-700">Urgent Notifications</div>
            {/* Notifications go here */}
          </div>
        </div>

        

        <div className="bg-purewhite rounded-lg p-5 shadow-md mt-8">
            <div className="font-semibold mb-4">Recent Activity</div>
            <div className="space-y-3">
                {/* Activity 1 */}
                <div className="flex items-start bg-gray-100 rounded-lg p-4 border-l-4 border-deep_green shadow">
                <span className="flex items-center justify-center w-8 h-8 mr-4">
                    <FaRegCheckCircle className="text-deep_green text-lg" />
                </span>
                <div className="flex-1">
                    <div className="font-medium text-gray-800">
                    Quotation <span className="font-semibold">#Q-2024-156</span> accepted
                    </div>
                    <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                </div>
                </div>
                {/* Activity 2 */}
                <div className="flex items-start bg-gray-100 rounded-lg p-4 border-l-4 border-web_yellow shadow">
                <span className="flex items-center justify-center w-8 h-8 mr-4">
                    <FaRegFolderOpen className="text-web_yellow text-lg" />
                </span>
                <div className="flex-1">
                    <div className="font-medium text-gray-800">
                    Payment received for PO
                    </div>
                    <div className="text-xs text-gray-500 mt-1 font-mono">#PO-2024-089</div>
                </div>
                </div>
                {/* Activity 3 */}
                <div className="flex items-start bg-gray-100 rounded-lg p-4 border-l-4 border-deep_green shadow">
                <span className="flex items-center justify-center w-8 h-8 mr-4">
                    <MdOutlineNotificationsNone className="text-deep_green text-lg" />
                </span>
                <div className="flex-1">
                    <div className="font-medium text-gray-800">
                    New material request received
                    </div>
                    <div className="text-xs text-gray-500 mt-1">1 day ago</div>
                </div>
                </div>
            </div>
            </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;