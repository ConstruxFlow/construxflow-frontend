import React, { useState, useEffect } from "react";
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
import ProjectProgressAnalytics from '../../components/SiteManager/ProjectProgressAnalytics';
import axios from 'axios';

const navLinks = [
  { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
                     { name: "Materials", href: "/site-manager/materials" },
          { name: "Inventory", href: "/site-manager/site-inventory" },
          { name: "Purchase Orders", href: "/site-manager/order-details" },
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live stats
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [equipmentsInUseCount, setEquipmentsInUseCount] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [equipmentStats, setEquipmentStats] = useState(null);
  const [latestPO, setLatestPO] = useState(null);

  // Helper to format "time ago" simple string
  const timeAgo = (isoOrDate) => {
    try {
      const date = new Date(isoOrDate);
      if (isNaN(date)) return "";
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch (e) {
      return "";
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      // Parallel requests to relevant endpoints. These endpoints exist in the backend.
      const [projectsRes, materialReqRes, inventoryRes, equipmentRes, ordersRes, maintenanceRes, equipmentStatsRes, latestPORes] = await Promise.all([
        axios.get('http://localhost:8080/api/projects/all').catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/api/material-requests').catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/api/inventory').catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/api/equipment').catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/api/purchasingorder').catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/api/maintenance-requests').catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/api/equipment/stats').catch(() => ({ data: null })),
        axios.get('http://localhost:8080/api/purchasingorder/latest').catch(() => ({ data: null })),
      ]);

      const projectsData = Array.isArray(projectsRes?.data) ? projectsRes.data : (projectsRes.data?.projects || []);
      setProjects(projectsData);
      setActiveProjectsCount(Array.isArray(projectsData) ? projectsData.length : 0);

      const materialRequests = Array.isArray(materialReqRes?.data) ? materialReqRes.data : (materialReqRes.data?.requests || []);
      // pending = those not yet approved/fulfilled
      const pending = materialRequests.filter(r => {
        const status = (r.status || r.requestStatus || '').toLowerCase();
        return status === '' || status === 'pending' || status === 'requested' || status === 'awaiting';
      }).length;
      setPendingRequestsCount(pending);

      const equipments = Array.isArray(equipmentRes?.data) ? equipmentRes.data : (equipmentRes.data?.equipment || []);
      // try to count in-use by flagged property or status
      const inUse = equipments.filter(e => {
        const s = (e.status || e.equipmentStatus || '').toLowerCase();
        return s === 'in use' || s === 'active' || s === 'deployed' || e.inUse === true;
      }).length || (Array.isArray(equipments) ? equipments.length : 0);
      setEquipmentsInUseCount(inUse);

      const orders = Array.isArray(ordersRes?.data) ? ordersRes.data : (ordersRes.data?.orders || []);
      // Sum payments safely from nested fields
      let paymentsTotal = 0;
      orders.forEach(o => {
        const pay = o.order_payment || o.payment || o.orderPayment || o.order_payment_detail;
        const amount = pay ? (pay.amount || pay.total || pay.paidAmount || pay.paymentAmount) : (o.totalAmount || o.total || o.amount);
        const n = Number(amount) || 0;
        paymentsTotal += n;
      });
      setTotalPayments(paymentsTotal);

      // Build a lightweight recent activity list from material requests, maintenance and recent orders
      const recent = [];
      const pushItem = (title, time, note, type) => {
        const item = { title, time, note, type };
        recent.push(item);
      };

      // include latest material requests
      materialRequests.slice(-6).reverse().forEach(r => {
        pushItem(
          `Material Request: ${r.itemName || r.materialName || r.title || r.requestedItem || 'Item'}`,
          r.createdDate || r.created_date || r.requestedAt || r.timestamp || r.createdAt,
          r.note || r.description || r.comment || `Requested by ${r.requestedBy || r.projectName || r.requester || 'team'}`,
          'material'
        );
      });

      // include maintenance requests
      const maint = Array.isArray(maintenanceRes?.data) ? maintenanceRes.data : (maintenanceRes.data?.maintenance || []);
      maint.slice(-4).reverse().forEach(m => {
        pushItem(
          `Maintenance: ${m.title || m.summary || m.requestType || 'Maintenance'}`,
          m.createdDate || m.created_date || m.requestedAt || m.timestamp || m.createdAt,
          m.note || m.description || `For equipment ${m.equipmentName || m.equipmentId || ''}`,
          'maintenance'
        );
      });

      // include recent paid orders
      orders.slice(-3).reverse().forEach(o => {
        const pay = o.order_payment || o.payment || o.orderPayment;
        const status = pay ? (pay.status || pay.paymentStatus || '') : (o.paymentStatus || o.status || '');
        pushItem(
          `Order ${o.id || o.orderId || ''} - ${status || 'Updated'}`,
          pay?.payment_date || pay?.created_date || o.updatedAt || o.createdAt || o.created_date,
          `Amount: ${Number(pay?.amount || pay?.total || o.totalAmount || o.amount || 0).toLocaleString()}`,
          'order'
        );
      });

      // Sort recent by time if possible
      recent.sort((a, b) => {
        const ta = new Date(a.time).getTime() || 0;
        const tb = new Date(b.time).getTime() || 0;
        return tb - ta;
      });

      setRecentActivity(recent.slice(0, 8));

  // equipment stats
  const eqStats = equipmentStatsRes?.data || equipmentStatsRes?.data?.data || equipmentStatsRes?.data?.stats || null;
  // If the backend returns an ApiResponse wrapper, unwrap
  const eqStatsUnwrapped = equipmentStatsRes?.data?.data ? equipmentStatsRes.data.data : equipmentStatsRes?.data;
  setEquipmentStats(eqStatsUnwrapped || null);

  // latest PO unwrap ApiResponse if necessary
  const latestWrapped = latestPORes?.data;
  const latestData = latestWrapped && latestWrapped.data ? latestWrapped.data : latestWrapped;
  setLatestPO(latestData || null);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial fetch + polling
    fetchDashboard();
    const id = setInterval(fetchDashboard, 30000); // 30s
    return () => clearInterval(id);
  }, []);

  const stats = [
    {
      icon: <MdOutlineStorage className="text-purewhite text-lg"/>,
      value: pendingRequestsCount,
      label: "Pending Material Requests",
      badge: { text: `${pendingRequestsCount > 0 ? pendingRequestsCount + ' Pending' : 'No New'}`, color: "text-deep_green" },
      iconBg: "bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80",
    },
    {
      icon: <FaRegFileAlt className="text-purewhite text-lg"/>,
      value: activeProjectsCount,
      label: "Active Projects",
      badge: { text: `${activeProjectsCount} Total`, color: "text-deep_green" },
      iconBg: "bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80",
    },
    {
      icon: <FaTruck className="text-purewhite text-lg"/>,
      value: equipmentsInUseCount,
      label: "Equipments in use",
      badge: { text: `${equipmentsInUseCount} Active`, color: "text-deep_green" },
      iconBg: "bg-gradient-to-br from-light_brown via-light_brown to-light_brown/80",
    },
    {
      icon: <BsCreditCard2Back className="text-purewhite text-lg"/>,
      value: `Rs. ${totalPayments.toLocaleString()}`,
      label: "Total Payments",
      badge: { text: `Updated`, color: "text-deep_green" },
      iconBg: "bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80",
    },
  ];

  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar links={navLinks} showButton={true} logoSrc="/logo1.png" profileURL="profile" />
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Site Manager Portal</h2>
        <p className="text-gray-600 mb-8 text-base">
          Here's what's happening at your construction sites today.
        </p>

        {/* Highlight Banner */}
        {/* <div className="bg-gradient-to-r from-web_yellow/15 via-web_yellow/8 to-transparent border-l-4 border-web_yellow rounded-lg p-4 mb-8 flex items-start gap-4 shadow-md">
          <div className="text-yellow-600 text-2xl mt-1">🚨</div>
          <div>
            <h3 className="font-semibold text-base text-gray-800 mb-1 tracking-wide">
              Attention Needed: Site Alerts
            </h3>
            <ul className="text-gray-500 text-sm font-medium list-disc pl-5 space-y-1">
              <li>2 materials at critical stock levels. <span className="text-red-600 font-semibold">Restock required!</span></li>
              <li>1 equipment item overdue for return. <span className="text-orange-600 font-semibold">Check status.</span></li>
              <li>4 pending material requests need your review.</li>
            </ul>
          </div>
        </div> */}

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

        {/* Equipment KPIs (from /api/equipment/stats) */}
        {/* {equipmentStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
              <p className="text-slatebluegray font-medium text-sm mb-1">Total Equipment</p>
              <h3 className="text-xl font-bold">{equipmentStats.total}</h3>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
              <p className="text-slatebluegray font-medium text-sm mb-1">Available</p>
              <h3 className="text-xl font-bold text-deep_green">{equipmentStats.available}</h3>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
              <p className="text-slatebluegray font-medium text-sm mb-1">On Site</p>
              <h3 className="text-xl font-bold">{equipmentStats.onASite}</h3>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
              <p className="text-slatebluegray font-medium text-sm mb-1">Under Maintenance</p>
              <h3 className="text-xl font-bold text-red-600">{equipmentStats.underMaintenance}</h3>
            </div>
          </div>
        )} */}

        {/* Latest Purchasing Order */}
        {latestPO && (
          <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 mb-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slatebluegray">Latest Purchase Order</p>
                <h3 className="text-lg font-bold">{latestPO.ponumber || latestPO.poId || 'PO'}</h3>
                <p className="text-xs text-gray-500">Status: {latestPO.status || latestPO.orderStatus || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-semibold">{latestPO.subTotal ? `Rs. ${Number(latestPO.subTotal).toLocaleString()}` : '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-5 mb-6 shadow">
          <div className="font-semibold text-main_dark text-lg mb-4 border-b border-light_gray/60 pb-1">
            Quick Actions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            <ActionTile
              onClick={() => navigate('/site-manager/materials')}
              icon={<FaEye className="text-xl" />}
              iconColorClass="text-deep_green"
              label="View Materials"
              hoverClass="hover:bg-deep_green/10"
            />
            <ActionTile
              onClick={() => navigate('/projects-list/create-project')}
              icon={<FaPlus className="text-xl" />}
              iconColorClass="text-web_yellow"
              label="New Project"
              hoverClass="hover:bg-web_yellow/15"
            />
            <ActionTile
              onClick={() => navigate('/site-manager/profile')}
              icon={<FaUser className="text-xl" />}
              iconColorClass="text-main_dark"
              label="My Profile"
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

        {/* Project Progress Analytics */}
        <div className="mb-6">
          <ProjectProgressAnalytics projects={projects} />
        </div>

        {/* Recent Activity */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-5 mt-8">
          <div className="font-semibold mb-4">Recent Activity</div>
          <div className="space-y-3">
            {loading && <div className="text-sm text-gray-500">Loading recent activity...</div>}
            {!loading && recentActivity.length === 0 && (
              <div className="text-sm text-gray-500">No recent activity.</div>
            )}
            {!loading && recentActivity.map((item, i) => (
              <div key={i} className={`flex items-start bg-purewhite rounded-lg p-4 border-l-4 ${item.type === 'material' ? 'border-web_yellow' : item.type === 'maintenance' ? 'border-orange-400' : 'border-deep_green'} shadow hover:-translate-y-0.5 transition-all duration-150`}>
                <span className="flex items-center justify-center w-8 h-8 mr-4">
                  {item.type === 'material' && <FaRegFolderOpen className="text-web_yellow text-lg" />}
                  {item.type === 'maintenance' && <FaTruck className="text-orange-500 text-lg" />}
                  {item.type === 'order' && <BsCreditCard2Back className="text-deep_green text-lg" />}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.title}</div>
                  {item.time && <div className="text-xs text-gray-500 mt-1">{timeAgo(item.time)}</div>}
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
