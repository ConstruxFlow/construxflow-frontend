import React, { useContext, useEffect, useState } from "react";
import {
  FaRegUserCircle,
  FaTruck,
  FaRegFileAlt,
  FaEye,
  FaUser,
  FaHeadset,
  FaRegCheckCircle,
  FaRegFolderOpen,
} from "react-icons/fa";
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
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";

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
  { name: "Dashboard", href: "/supplier/dashboard" },
  { name: "Requests", href: "/supplier/requests" },
  { name: "Quotations", href: "/supplier/quotations" },
  { name: "Orders", href: "/supplier/orders" },
  { name: "Payments", href: "/supplier/payments" },
];

const materialRequestsData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Requests",
      data: [15, 22, 18, 35, 28, 42, 30, 25, 40, 38, 45, 50],
      fill: false,
      borderColor: "#236571",
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
    line: { borderWidth: 3 },
  },
};

function ActionTile({ onClick, icon, label, iconColorClass, hoverClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 bg-white border border-light_gray rounded-lg shadow-sm
        hover:shadow-md transition-all focus:outline-none w-full text-left ${hoverClass}`}
    >
      <span
        className={`rounded-full p-2 bg-light_gray/40 flex items-center justify-center ${iconColorClass}`}
      >
        {icon}
      </span>
      <span className="font-medium text-base text-main_dark">{label}</span>
    </button>
  );
}

const SupplierDashboard = () => {
  const [supplierData, setSupplierData] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [quotations, setQuotations] = useState([]); // ✅ Added
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    ordersInTransit: 0,
    totalPayments: 0,
    pendingPayments: 0,
  });
  const [quotationStats, setQuotationStats] = useState({
    // ✅ Added
    approvedQuotations: 0,
    pendingQuotations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();
  const supplierId = authState?.user?.supplierId;

  useEffect(() => {
    if (!supplierId) {
      setError("Supplier ID not found");
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, [supplierId]);

  const fetchDashboardData = async () => {
    setError(null);
    setLoading(true);

    try {
      console.log("=== FETCHING DASHBOARD DATA ===");
      console.log("Supplier ID:", supplierId);

      // Fetch supplier details
      const supplierRes = await axios.get(
        `http://localhost:8080/api/supplier/find/${supplierId}`
      );
      setSupplierData(supplierRes.data.data);
      console.log("Supplier Data:", supplierRes.data.data);

      // ✅ Fetch all quotations and filter by supplier
      try {
        const quotationsRes = await axios.get(
          `http://localhost:8080/api/quotations/all`
        );
        // Handle both response structures
        const allQuotations = Array.isArray(quotationsRes.data)
          ? quotationsRes.data
          : quotationsRes.data.data || [];

        console.log("All Quotations:", allQuotations.length);
        console.log("Sample Quotation:", allQuotations[0]);

        // Filter quotations for this supplier
        const supplierQuotations = allQuotations.filter((quotation) => {
          const quotSupplierId = quotation.supplierId;
          console.log(
            `Quotation ${
              quotation.id
            }: supplierId = ${quotSupplierId}, Match = ${
              quotSupplierId === supplierId
            }`
          );
          return String(quotSupplierId).trim() === String(supplierId).trim();
        });

        console.log("Supplier Quotations:", supplierQuotations.length);
        setQuotations(supplierQuotations);

        // Calculate quotation statistics
        calculateQuotationStats(supplierQuotations);
      } catch (quotError) {
        console.error("Error fetching quotations:", quotError);
        // Continue with orders even if quotations fail
        setQuotations([]);
        setQuotationStats({ approvedQuotations: 0, pendingQuotations: 0 });
      }

      // Fetch all purchase orders and filter by supplier
      const ordersRes = await axios.get(
        `http://localhost:8080/api/purchasingorder/all`
      );
      const allOrders = ordersRes.data.data || [];

      console.log("All Orders:", allOrders.length);

      // Filter orders for this supplier
      const supplierOrders = allOrders.filter((order) => {
        const orderSupplierId =
          order.supplier?.supplierId || order.supplier?.supplier_id;
        return String(orderSupplierId).trim() === String(supplierId).trim();
      });

      console.log("Supplier Orders:", supplierOrders.length);
      setPurchaseOrders(supplierOrders);

      // Calculate order statistics
      calculateOrderStats(supplierOrders);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      console.error("Error details:", err.response?.data);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderStats = (orders) => {
    // Total Purchase Orders
    const totalOrders = orders.length;

    // Orders in Transit (status = "Dispatched")
    const inTransitOrders = orders.filter(
      (o) => o.status?.toLowerCase() === "dispatched"
    ).length;

    // Total Payments (sum of all order payments)
    const totalPayments = orders.reduce((sum, order) => {
      return sum + (parseFloat(order.orderPayment?.amount) || 0);
    }, 0);

    // Pending Payments (sum of remaining amounts)
    const pendingPayments = orders.reduce((sum, order) => {
      return sum + (parseFloat(order.orderPayment?.remainingAmount) || 0);
    }, 0);

    console.log("=== ORDER STATISTICS ===");
    console.log("Total Orders:", totalOrders);
    console.log("In Transit:", inTransitOrders);
    console.log("Total Payments:", totalPayments);
    console.log("Pending Payments:", pendingPayments);

    setOrderStats({
      totalOrders,
      ordersInTransit: inTransitOrders,
      totalPayments,
      pendingPayments,
    });
  };

  // ✅ NEW FUNCTION: Calculate quotation statistics
  const calculateQuotationStats = (quotations) => {
    // Approved Quotations (status = "Approved")
    const approvedQuotations = quotations.filter(
      (q) => q.status?.toLowerCase() === "approved"
    ).length;

    // Pending Quotations (status = "Pending")
    const pendingQuotations = quotations.filter(
      (q) => q.status?.toLowerCase() === "pending"
    ).length;

    console.log("=== QUOTATION STATISTICS ===");
    console.log("Approved Quotations:", approvedQuotations);
    console.log("Pending Quotations:", pendingQuotations);

    setQuotationStats({
      approvedQuotations,
      pendingQuotations,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          links={navLinks}
          profileURL="/supplier/profile"
          logoSrc="/logo1.png"
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-web_yellow text-main_dark rounded-lg hover:bg-web_yellow/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar
        links={navLinks}
        profileURL="/supplier/profile"
        logoSrc="/logo1.png"
      />
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Welcome back,{" "}
          {supplierData?.userDetails?.user_name ||
            supplierData?.name ||
            "Supplier"}
          !
        </h2>
        <p className="text-gray-600 mb-8 text-base">
          Here's what's happening with your supply chain today.
        </p>

        {/* Urgent Actions */}
        {quotationStats.pendingQuotations > 0 && (
          <div className="bg-gradient-to-r from-web_yellow/15 via-web_yellow/8 to-transparent border-l-4 border-web_yellow rounded-lg p-4 mb-8 flex items-start gap-4 shadow-md">
            <div className="text-yellow-600 text-2xl mt-1">⚠</div>
            <div>
              <h3 className="font-semibold text-base text-gray-800 mb-1 tracking-wide">
                Urgent Actions Required
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                You have {quotationStats.pendingQuotations} pending quotation
                {quotationStats.pendingQuotations > 1 ? "s" : ""} awaiting
                review. Please check for updates to avoid delays in your supply
                chain.
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Card 1 - Static for now */}
          <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex-1 min-w-0">
              <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                Pending Requests
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                -
              </h3>
              <span className="text-deep_green text-xs">Coming soon</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg">
              <MdOutlineStorage className="text-purewhite text-lg" />
            </div>
          </div>

          {/* Card 2 - Approved Quotations (FROM BACKEND) ✅ */}
          <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex-1 min-w-0">
              <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                Approved Quotations
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                {quotationStats.approvedQuotations}
              </h3>
              <span className="text-deep_green text-xs">
                {quotationStats.pendingQuotations} Pending
              </span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-deep_green via-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg">
              <FaRegFileAlt className="text-purewhite text-lg" />
            </div>
          </div>

          {/* Card 3 - Purchase Orders (FROM BACKEND) */}
          <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex-1 min-w-0">
              <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                Purchase Orders
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                {orderStats.totalOrders}
              </h3>
              <span className="text-deep_green text-xs">
                {orderStats.ordersInTransit} In Transit
              </span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-light_brown via-light_brown to-light_brown/80 rounded-xl flex items-center justify-center shadow-lg">
              <FaTruck className="text-purewhite text-lg" />
            </div>
          </div>

          {/* Card 4 - Total Payments (FROM BACKEND) */}
          <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <div className="flex-1 min-w-0">
              <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">
                Total Payments
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                RS {(orderStats.totalPayments / 1000).toFixed(1)}K
              </h3>
              <span className="text-deep_green text-xs">
                RS {(orderStats.pendingPayments / 1000).toFixed(1)}K Pending
              </span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg">
              <BsCreditCard2Back className="text-purewhite text-lg" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-5 mb-6 shadow">
          <div className="font-semibold text-main_dark text-lg mb-4 border-b border-light_gray/60 pb-1">
            Quick Actions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            <ActionTile
              onClick={() => navigate("/supplier/requests")}
              icon={<FaEye className="text-xl" />}
              iconColorClass="text-deep_green"
              label="View Requests"
              hoverClass="hover:bg-deep_green/10"
            />
            <ActionTile
              onClick={() => navigate("/supplier/quotations")}
              icon={<FaRegFileAlt className="text-xl" />}
              iconColorClass="text-web_yellow"
              label="View Quotations"
              hoverClass="hover:bg-web_yellow/15"
            />
            <ActionTile
              onClick={() => navigate("/supplier/profile/edit")}
              icon={<FaUser className="text-xl" />}
              iconColorClass="text-main_dark"
              label="Update Profile"
              hoverClass="hover:bg-light_gray/70"
            />
            <ActionTile
              onClick={() => navigate("/supplier/contact-support")}
              icon={<FaHeadset className="text-xl" />}
              iconColorClass="text-deep_green"
              label="Contact Support"
              hoverClass="hover:bg-deep_green/5"
            />
          </div>
        </div>

        {/* Trends & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 min-h-[230px]">
            <div className="font-semibold mb-2 text-lg text-gray-700">
              Material Requests Trend
            </div>
            <div className="w-full h-60 px-5 mt-5">
              <Line
                data={materialRequestsData}
                options={materialRequestsOptions}
              />
            </div>
          </div>
          <div className="bg-purewhite border border-gray-200 rounded-xl p-5 min-h-[230px]">
            <div className="font-semibold mb-2 text-lg text-gray-700">
              Urgent Notifications
            </div>
            <div className="space-y-3">
              {quotationStats.pendingQuotations > 0 && (
                <div className="flex items-start bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400 shadow mt-8">
                  <div className="flex-1 ml-3">
                    <div className="font-semibold text-yellow-700">
                      Pending Quotations
                    </div>
                    <div className="text-sm text-yellow-800">
                      {quotationStats.pendingQuotations} quotation
                      {quotationStats.pendingQuotations > 1 ? "s are" : " is"}{" "}
                      awaiting purchasing manager review.
                    </div>
                    <div className="text-xs text-yellow-500 mt-1">
                      Check status in Quotations page
                    </div>
                  </div>
                </div>
              )}
              {orderStats.ordersInTransit > 0 && (
                <div className="flex items-start bg-deep_green/10 rounded-lg p-4 border-l-4 border-deep_green shadow">
                  <div className="flex-1 ml-3">
                    <div className="font-semibold text-deep_green">
                      Orders In Transit
                    </div>
                    <div className="text-sm text-deep_green">
                      {orderStats.ordersInTransit} order
                      {orderStats.ordersInTransit > 1 ? "s are" : " is"}{" "}
                      currently being delivered.
                    </div>
                    <div className="text-xs text-deep_green/80 mt-1">
                      Track status in Orders page
                    </div>
                  </div>
                </div>
              )}
              {/* {orderStats.pendingPayments > 0 && (
                <div className="flex items-start bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400 shadow">
                  <div className="flex-1 ml-3">
                    <div className="font-semibold text-yellow-700">
                      Pending Payments
                    </div>
                    <div className="text-sm text-yellow-800">
                      RS {orderStats.pendingPayments.toLocaleString()} in
                      payments pending.
                    </div>
                    <div className="text-xs text-yellow-500 mt-1">
                      View details
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-purewhite border border-gray-200 rounded-xl p-5 mt-8">
          <div className="font-semibold mb-4">Recent Orders</div>
          <div className="space-y-3">
            {purchaseOrders.length > 0 ? (
              purchaseOrders.slice(0, 3).map((order, idx) => (
                <div
                  key={idx}
                  className="flex items-start bg-purewhite rounded-lg p-4 border-l-4 border-deep_green shadow hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                  onClick={() => navigate(`/supplier/orders/${order.ponumber}`)}
                >
                  <span className="flex items-center justify-center w-8 h-8 mr-4">
                    <FaTruck className="text-deep_green text-lg" />
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      Purchase Order{" "}
                      <span className="font-semibold">{order.ponumber}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Status:{" "}
                      <span className="font-medium">{order.status}</span> • RS{" "}
                      {parseFloat(order.subTotal || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FaTruck className="text-4xl mx-auto mb-2 opacity-30" />
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
