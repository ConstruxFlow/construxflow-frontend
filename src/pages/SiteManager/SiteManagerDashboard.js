import React from "react";
import {
  MdOutlineStorage,
  MdOutlineNotificationsNone,
} from "react-icons/md";
import {
  FaTruck,
  FaRegFileAlt,
  FaEye,
  FaPlus,
  FaUser,
  FaHeadset,
  FaRegCheckCircle,
  FaRegFolderOpen,
} from "react-icons/fa";
import { BsCreditCard2Back } from "react-icons/bs";
import NavBar from '../../components/NavBar'
import { useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", href: "/" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
];

function ActionTile({ onClick, icon, label, iconColorClass, hoverClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 bg-white border border-light_gray rounded-lg shadow-sm
        hover:shadow-md transition-all focus:outline-none w-full text-left ${hoverClass}`}
    >
      <span className={`rounded-full p-2 bg-light_gray/40 flex items-center justify-center ${iconColorClass}`}>
        {icon}
      </span>
      <span className="font-medium text-base text-main_dark">{label}</span>
    </button>
  );
}

const SiteManagerDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: <MdOutlineStorage className="text-purewhite text-lg"/>,
      value: "24",
      label: "Pending Requests",
      badge: { text: "12 New", color: "text-deep_green" },
      iconBg: "bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80",
    },
    {
      icon: <FaRegFileAlt className="text-purewhite text-lg"/>,
      value: "18",
      label: "Active Quotations",
      badge: { text: "8 Pending", color: "text-deep_green" },
      iconBg: "bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80",
    },
    {
      icon: <FaTruck className="text-purewhite text-lg"/>,
      value: "32",
      label: "Purchase Orders",
      badge: { text: "5 In Transit", color: "text-deep_green" },
      iconBg: "bg-gradient-to-br from-light_brown via-light_brown to-light_brown/80",
    },
    {
      icon: <BsCreditCard2Back className="text-purewhite text-lg"/>,
      value: "$128.5K",
      label: "Total Payments",
      badge: { text: "$45.2K", color: "text-deep_green" },
      iconBg: "bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80",
    },
  ];

  const recentActivity = [
    {
      icon: <FaRegCheckCircle className="text-deep_green text-lg" />,
      border: "border-deep_green",
      title: "Quotation #Q-2024-156 accepted",
      time: "2 hours ago",
    },
    {
      icon: <FaRegFolderOpen className="text-web_yellow text-lg" />,
      border: "border-web_yellow",
      title: "Payment received for PO",
      note: "#PO-2024-089",
    },
    {
      icon: <MdOutlineNotificationsNone className="text-deep_green text-lg" />,
      border: "border-deep_green",
      title: "New material request received",
      time: "1 day ago",
    },
  ];

  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar links={navLinks} showButton={true} logoSrc="/logo1.png" />
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome back, John!</h2>
        <p className="text-gray-600 mb-8 text-base">
          Here's what's happening at your construction sites today.
        </p>

        {/* Highlight Banner */}
        <div className="bg-gradient-to-r from-web_yellow/15 via-web_yellow/8 to-transparent border-l-4 border-web_yellow rounded-lg p-4 mb-8 flex items-start gap-4 shadow-md">
          <div className="text-yellow-600 text-2xl mt-1">📋</div>
          <div>
            <h3 className="font-semibold text-base text-gray-800 mb-1 tracking-wide">
              Urgent Actions Required
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              3 new requests awaiting your approval. Please review them as soon as possible to avoid delays in your construction sites.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">{stat.label}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">{stat.value}</h3>
                <span className={`${stat.badge.color} text-xs`}>{stat.badge.text}</span>
              </div>
              <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg transition-all duration-300`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-5 mb-6 shadow">
          <div className="font-semibold text-main_dark text-lg mb-4 border-b border-light_gray/60 pb-1">
            Quick Actions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            <ActionTile
              onClick={() => navigate('/requests')}
              icon={<FaEye className="text-xl" />}
              iconColorClass="text-deep_green"
              label="View Requests"
              hoverClass="hover:bg-deep_green/10"
            />
            <ActionTile
              onClick={() => navigate('/quotations')}
              icon={<FaPlus className="text-xl" />}
              iconColorClass="text-web_yellow"
              label="New Quotation"
              hoverClass="hover:bg-web_yellow/15"
            />
            <ActionTile
              onClick={() => navigate('/profile/edit')}
              icon={<FaUser className="text-xl" />}
              iconColorClass="text-main_dark"
              label="Update Profile"
              hoverClass="hover:bg-light_gray/70"
            />
            <ActionTile
              onClick={() => navigate('/contact-support')}
              icon={<FaHeadset className="text-xl" />}
              iconColorClass="text-deep_green"
              label="Contact Support"
              hoverClass="hover:bg-deep_green/5"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-5 mt-8">
          <div className="font-semibold mb-4">Recent Activity</div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className={`flex items-start bg-purewhite rounded-lg p-4 border-l-4 ${item.border} shadow hover:-translate-y-0.5 transition-all duration-150`}>
                <span className="flex items-center justify-center w-8 h-8 mr-4">
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.title}</div>
                  {item.time && <div className="text-xs text-gray-500 mt-1">{item.time}</div>}
                  {item.note && <div className="text-xs text-gray-500 mt-1 font-mono">{item.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteManagerDashboard;
