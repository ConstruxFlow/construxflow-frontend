// admin-dashboard.jsx

import React from "react";
import { ShoppingCart, Package, Crown, Eye, Edit } from "lucide-react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper: format LKR in compact notation (e.g., LKR2.4M)
function formatCurrencyLKR(amount) {
  const num =
    typeof amount === "string" ? parseFloat(amount) : Number(amount || 0);
  const compact = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
  return `LKR${compact}`;
}

const revenueYears = Array.from({ length: 12 }, (_, i) => 2022 + i);
const revenueValues = [
  1.3, 1.5, 1.8, 2.3, 2.5, 2.7, 2.6, 2.75, 2.9, 3.2, 3.5, 3.9,
];

const lineData = {
  labels: revenueYears,
  datasets: [
    {
      label: "Revenue (in $M)",
      data: revenueValues,
      fill: false,
      borderColor: "#236571",
      backgroundColor: "#236571",
      pointBorderColor: "#236571",
      pointBackgroundColor: "#236571",
      tension: 0.3,
    },
  ],
};

const lineOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: { display: false },
  },
  scales: {
    x: {
      grid: { color: "#E4E4E4" },
      ticks: { color: "#2E2F34", font: { weight: "bold" } },
    },
    y: {
      grid: { color: "#E4E4E4" },
      ticks: { color: "#2E2F34", font: { weight: "bold" } },
      beginAtZero: true,
      suggestedMax: 5,
    },
  },
};

export default function ConstructionDashboard() {
  // Admin summary (revenue + active orders)
  const [summary, setSummary] = React.useState({
    totalRevenue: 0,
    activeOrders: 0,
  });
  const [loading, setLoading] = React.useState(true);

  // Inventory summary (sum qty + distinct categories)
  const [invSummary, setInvSummary] = React.useState({
    totalQuantityInStock: 0,
    uniqueCategories: 0,
  });
  const [invLoading, setInvLoading] = React.useState(true);

  // Projects overview
  const [projects, setProjects] = React.useState([]);
  const [projLoading, setProjLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchDashboardSummary() {
      try {
        const res = await fetch("http://localhost:8080/api/admin/dashboard/summary");
        if (!res.ok) throw new Error("Failed to load dashboard summary");
        const data = await res.json();
        if (!isMounted) return;

        const totalRevenue =
          typeof data?.totalRevenue === "string"
            ? parseFloat(data.totalRevenue)
            : data?.totalRevenue ?? 0;

        const activeOrders =
          typeof data?.activeOrders === "string"
            ? parseInt(data.activeOrders, 10)
            : data?.activeOrders ?? 0;

        setSummary({ totalRevenue, activeOrders });
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function fetchInventorySummary() {
      try {
        const res = await fetch("http://localhost:8080/api/inventory/summary");
        if (!res.ok) throw new Error("Failed to load inventory summary");
        const data = await res.json();
        if (!isMounted) return;

        const totalQuantityInStock =
          typeof data?.totalQuantityInStock === "string"
            ? parseInt(data.totalQuantityInStock, 10)
            : data?.totalQuantityInStock ?? 0;

        const uniqueCategories =
          typeof data?.uniqueCategories === "string"
            ? parseInt(data.uniqueCategories, 10)
            : data?.uniqueCategories ?? 0;

        setInvSummary({ totalQuantityInStock, uniqueCategories });
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setInvLoading(false);
      }
    }

    async function fetchProjects() {
      try {
        const res = await fetch("http://localhost:8080/api/projects/overview");
        if (!res.ok) throw new Error("Failed to load projects");
        const data = await res.json();
        if (!isMounted) return;
        setProjects(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setProjLoading(false);
      }
    }

    fetchDashboardSummary();
    fetchInventorySummary();
    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-full mx-auto py-10 px-16">
      {/* Dashboard Header */}
      <section className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main_dark mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-base">
            Here’s what’s happening with your supply chain today.
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          label="Total Revenue"
          value={
            loading ? "Loading..." : formatCurrencyLKR(summary.totalRevenue)
          }
          change="+12.5% from last month"
          changeColor="text-deep_green"
          icon={<span className="text-2xl text-web_yellow font-bold">$</span>}
        />
        <DashboardCard
          label="Active Orders"
          value={
            loading
              ? "Loading..."
              : Number(summary.activeOrders || 0).toLocaleString()
          }
          change="+8.2% from last week"
          changeColor="text-deep_green"
          icon={<ShoppingCart className="w-8 h-8 text-deep_green" />}
        />
        <DashboardCard
          label="Inventory"
          value={
            invLoading
              ? "Loading..."
              : Number(invSummary.totalQuantityInStock || 0).toLocaleString()
          }
          change="-2.1% from last month"
          changeColor="text-web_yellow"
          icon={<Package className="w-8 h-8 text-light_brown" />}
        />
        <DashboardCard
          label="Unique Categories"
          value={
            invLoading
              ? "Loading..."
              : Number(invSummary.uniqueCategories || 0).toLocaleString()
          }
          change="+5.7% from last month"
          changeColor="text-green-600"
          icon={<Crown className="w-8 h-8 text-[#efc11a]" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-purewhite rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-main_dark mb-3">
            Revenue Trend
          </h3>
          <Line data={lineData} options={lineOptions} />
        </div>

        <div className="bg-purewhite rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-main_dark mb-2">
            Inventory Status
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Indicates how efficiently inventory is managed by showing how many
            times stock is sold and replaced within a year.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-5">
                Inventory turnover success metrics
              </p>
              <div className="bg-deep_green text-white p-3 rounded">
                <p className="text-base text-center mb-2">Inventory Turnover</p>
                <div className="text-center">
                  <p className="text-4xl font-bold">6.6</p>
                  <p className="text-base">This Year</p>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-deep_green mt-10 text-purewhite p-3 rounded">
                <p className="text-xs text-center mb-2">Reasons for Return</p>
                <div className="space-y-1 mt-2 text-xs">
                  <div className="flex justify-between">
                    <span>Damaged in Transit</span>
                    <span>41%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wrong Product</span>
                    <span>34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Defective</span>
                    <span>20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Others</span>
                    <span>5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Projects Section */}
      <div className="bg-purewhite rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#191919]">Projects</h3>
            <button className="bg-web_yellow text-main_dark px-4 py-2 rounded-lg font-medium">
              View All Projects
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-main_dark">
            <thead className="bg-light_brown/35 rounded-t-lg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Project ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-purewhite divide-y divide-[#E4E4E4]">
              {projLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-sm text-gray-500">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <ProjectRow
                    key={p.projectId}
                    projectId={p.projectId}
                    projectName={p.projectName}
                    startDate={p.startDate}
                    endDate={p.endDate}
                    status={p.progressStatus}
                    location={p.location}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ label, value, change, changeColor, icon }) {
  return (
    <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
      <div>
        <p className="text-sm text-main_dark">{label}</p>
        <p className="text-2xl font-bold text-main_dark mb-1">{value}</p>
        <p className={`text-xs ${changeColor}`}>{change}</p>
      </div>
      <div className="ml-28">{icon}</div>
    </div>
  );
}

function OrderRow({ id, customer, product, amount, status, statusColor }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{customer}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{product}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{amount}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}
        >
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex space-x-2">
          <Eye className="w-4 h-4 text-deep_green cursor-pointer" />
        </div>
      </td>
    </tr>
  );
}

function ProjectRow({ projectId, projectName, startDate, endDate, status, location }) {
  const badge = getStatusBadge(status);
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{projectId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{projectName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{startDate || "-"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{endDate || "-"}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${badge}`}>
          {status || "N/A"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{location || "-"}</td>
    </tr>
  );
}

function getStatusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("complete") || s === "completed") return "bg-green-100 text-green-800";
  if (s.includes("progress") || s === "in progress") return "bg-blue-100 text-blue-800";
  if (s.includes("delay") || s === "delayed") return "bg-red-100 text-red-800";
  if (s.includes("hold")) return "bg-gray-100 text-gray-800";
  return "bg-yellow-100 text-yellow-800";
}