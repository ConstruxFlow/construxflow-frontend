import React from "react";
import { FaRegUserCircle, FaTruck, FaRegFileAlt, FaEye, FaPlus, FaUser, FaHeadset, FaRegCheckCircle, FaRegFolderOpen } from "react-icons/fa";
import { MdOutlineStorage, MdOutlineNotificationsNone } from "react-icons/md";
import { BsCreditCard2Back } from "react-icons/bs";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const navLinks = [
  { name: "Dashboard", href: "/" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
];

// Data for the Material Requests Trend chart (matches the provided image)
const materialRequestsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Requests",
      data: [15, 22, 18, 35, 28, 42, 30, 25, 40, 38, 45, 50],
      fill: false,
      borderColor: "#236571", // deep green
      backgroundColor: "#236571",
      pointBackgroundColor: "#236571",
      pointBorderColor: "#236571",
      pointRadius: 4,
      pointHoverRadius: 5,
      pointBorderWidth: 1,
      tension: 0.3,
    },
  ],
};

const materialRequestsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#555", font: { size: 14 } },
    },
    y: {
      grid: { color: "#eee" },
      ticks: { color: "#555", font: { size: 14 } },
      beginAtZero: true,
      suggestedMax: 50,
    },
  },
  elements: {
    line: {
      borderWidth: 3,
    },
  },
};


const SupplierDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar links={navLinks} logoSrc="/logo1.png" />
      <div className="max-w-full mx-auto px-16 py-6">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome back, John!</h2>
        <p className="text-gray-500 mb-8 text-base">
          Here’s what’s happening with your supply chain today.
        </p>

        {/* Urgent Actions */}
        <div className="bg-gradient-to-r from-web_yellow/15 via-web_yellow/8 to-transparent border-l-4 border-web_yellow rounded-lg p-4 mb-8 flex items-start gap-4 shadow-md">
          <div className="text-yellow-600 text-2xl mt-1">⚠</div>
          <div>
            <h3 className="font-semibold text-base text-gray-800 mb-1 tracking-wide">
              Urgent Actions Required
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              You have 3 pending material requests that need your attention. Please review them as soon as possible to avoid delays in your supply chain.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex-1 min-w-0">
              <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Pending Requests</p>
              <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">24</h3>
              <span className="text-deep_green text-xs">12 New</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <MdOutlineStorage className="text-purewhite text-lg"/>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex-1 min-w-0">
              <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Active Quotations</p>
              <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">18</h3>
              <span className="text-deep_green text-xs">8 Pending</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <FaRegFileAlt className="text-purewhite text-lg"/>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex-1 min-w-0">
              <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Purchase Orders</p>
              <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">32</h3>
              <span className="text-deep_green text-xs">5 In Transit</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-light_brown via-light_brown to-light_brown/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <FaTruck className="text-purewhite text-lg"/>
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex-1 min-w-0">
              <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Total Payments</p>
              <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">$128.5K</h3>
              <span className="text-deep_green text-xs">$45.2K</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <BsCreditCard2Back className="text-purewhite text-lg"/>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-5 mb-6">
          <div className="font-semibold mb-4">Quick Actions</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-5">
            <button onClick={() => navigate('/requests')} className="flex items-center justify-center w-full h-14 rounded-xl bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 hover:bg-deep_green/90 transition font-medium text-white text-base gap-2">
              <FaEye className="text-lg" />
              <span>View Requests</span>
            </button>
            <button onClick={() => navigate('/quotations')}  className="flex items-center justify-center w-full h-14 rounded-xl bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 hover:bg-web_yellow/90 transition font-medium text-main_dark text-base gap-2">
              <FaRegFileAlt className="text-lg" />
              <span>View Quotations</span>
            </button>
            <button onClick={()=> navigate('/supplierprofile/edit')} className="flex items-center justify-center w-full h-14 rounded-xl bg-gradient-to-br from-light_brown via-light_brown to-light_brown/80 hover:bg-light_brown/90 transition font-medium text-main_dark text-base gap-2">
              <FaUser className="text-lg" />
              <span>Update Profile</span>
            </button>
            <button className="flex items-center justify-center w-full h-14 rounded-xl bg-light_gray hover:bg-light_gray/90 transition font-medium text-main_dark text-base gap-2">
              <FaHeadset className="text-lg" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>

        {/* Trends & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 min-h-[230px]">
            <div className="font-semibold mb-2 text-lg text-gray-700">Material Requests Trend</div>
            <div className="w-full h-60 px-5 mt-5">
              <Line data={materialRequestsData} options={materialRequestsOptions} />
            </div>
          </div>
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 min-h-[230px]">
            <div className="font-semibold mb-2 text-lg text-gray-700">Urgent Notifications</div>
            {/* Notifications go here */}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-5 mt-8">
          <div className="font-semibold mb-4">Recent Activity</div>
          <div className="space-y-3">
            {/* Activity 1 */}
            <div className="flex items-start bg-purewhite rounded-lg p-4 border-l-4 border-deep_green shadow hover:-translate-y-0.5 transition-all duration-150">
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
            <div className="flex items-start bg-purewhite rounded-lg p-4 border-l-4 border-web_yellow shadow hover:-translate-y-0.5 transition-all duration-150">
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
            <div className="flex items-start bg-purewhite rounded-lg p-4 border-l-4 border-deep_green shadow hover:-translate-y-0.5 transition-all duration-150">
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
