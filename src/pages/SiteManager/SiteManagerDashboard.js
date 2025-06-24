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

const navLinks = [
  { name: "Dashboard", href: "/" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
];

const SiteManagerDashboard = () => {
  const stats = [
    {
      icon: <MdOutlineStorage className="text-2xl text-deep_green" />,
      value: "24",
      label: "Pending Requests",
      action: "View Details →",
      badge: { text: "12 New", color: "bg-web_yellow text-gray-800" },
      link: "/requests",
    },
    {
      icon: <FaRegFileAlt className="text-2xl text-web_yellow" />,
      value: "18",
      label: "Active Quotations",
      action: "Manage →",
      badge: { text: "8 Pending", color: "bg-deep_green text-white" },
      link: "/quotations",
    },
    {
      icon: <FaTruck className="text-2xl text-deep_green" />,
      value: "32",
      label: "Purchase Orders",
      action: "Track →",
      badge: { text: "5 In Transit", color: "bg-light_brown text-gray-800" },
      link: "/orders",
    },
    {
      icon: <BsCreditCard2Back className="text-2xl text-web_yellow" />,
      value: "$128.5K",
      label: "Total Payments",
      action: "View All →",
      badge: { text: "$45.2K", color: "bg-deep_green text-white" },
      link: "/payments",
    },
  ];

  const quickActions = [
    { icon: <FaEye className="text-2xl mb-2" />, text: "View Requests", bg: "bg-web_yellow", textColor: "text-main_dark" },
    { icon: <FaPlus className="text-2xl mb-2" />, text: "New Quotation", bg: "bg-deep_green", textColor: "text-white" },
    { icon: <FaUser className="text-2xl mb-2" />, text: "Update Profile", bg: "bg-light_brown", textColor: "text-main_dark" },
    { icon: <FaHeadset className="text-2xl mb-2" />, text: "Contact Support", bg: "bg-purewhite", textColor: "text-main_dark" },
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
      <div className="max-w-full mx-auto px-10 py-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome back, John!</h2>
        <p className="text-gray-500 mb-8">
          Here’s what’s happening at your construction sites today.
        </p>

        {/* Highlight Banner */}
        <div className="bg-web_yellow text-black rounded-lg flex items-center px-4 py-3 mb-8">
          <span className="font-medium mr-2 text-gray-800">📋 3 new requests awaiting your approval</span>
          <button className="ml-auto bg-main_dark text-white px-4 py-2 rounded-lg hover:bg-slatebluegray text-sm">
            View All
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-purewhite rounded-lg p-5 shadow-md transition-transform duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center mb-2">
                {stat.icon}
                <span className={`${stat.badge.color} text-xs px-2 py-1 rounded-full font-medium ml-auto`}>{stat.badge.text}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
              <a href={stat.link} className="text-deep_green text-sm mt-3 inline-block">{stat.action}</a>
            </div>
          ))}
        </div>

        {/* Action Boxes */}
        <div className="bg-gray-900 rounded-lg p-5 mb-6">
          <div className="font-semibold text-white mb-4">Quick Actions</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className={`flex flex-col items-center justify-center ${action.bg} ${action.textColor} px-6 py-5 rounded font-semibold shadow hover:brightness-95 transition`}
              >
                {action.icon}
                <span className="text-base font-medium">{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-purewhite rounded-lg p-5 shadow-md mt-8">
          <div className="font-semibold mb-4">Recent Activity</div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className={`flex items-start bg-gray-100 rounded-lg p-4 border-l-4 ${item.border} shadow`}>
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
