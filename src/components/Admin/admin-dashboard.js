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
  return (
    <div className="max-w-full mx-auto py-10 px-4 sm:px-8 lg:px-16">
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
          value="$2.4M"
          change="+12.5% from last month"
          changeColor="text-deep_green"
          icon={<span className="text-2xl text-web_yellow font-bold">$</span>}
        />
        <DashboardCard
          label="Active Orders"
          value="847"
          change="+8.2% from last week"
          changeColor="text-deep_green"
          icon={<ShoppingCart className="w-8 h-8 text-deep_green" />}
        />
        <DashboardCard
          label="Inventory Items"
          value="12,543"
          change="-2.1% from last month"
          changeColor="text-web_yellow"
          icon={<Package className="w-8 h-8 text-light_brown" />}
        />
        <DashboardCard
          label="Active Customers"
          value="1,284"
          change="+5.7% from last month"
          changeColor="text-green-600"
          icon={<Crown className="w-8 h-8 text-[#efc11a]" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend (Line Chart) */}
        <div className="bg-purewhite rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-main_dark mb-3">
            Revenue Trend
          </h3>
          <Line data={lineData} options={lineOptions} />
        </div>

        {/* Inventory Status */}
        <div className="bg-purewhite rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-main_dark mb-2">
            Inventory Status
          </h3>
          <p className="text-sm text-gray-500 mb-4">
              Indicates how efficiently inventory is managed by showing how
              many times stock is sold and replaced within a year.
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

      {/* Recent Orders Section */}
      <div className="bg-purewhite rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#191919]">
              Recent Orders
            </h3>
            <button className="bg-web_yellow text-main_dark px-4 py-2 rounded-lg font-medium">
              View All Orders
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-main_dark min-w-max">
            <thead className="bg-light_brown/35 rounded-t-lg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-purewhite divide-y divide-[#E4E4E4]">
              <OrderRow
                id="#ORD-001"
                customer="BuildCorp Inc."
                product="Steel Beams"
                amount="$45,200"
                status="Delivered"
                statusColor="bg-green-100 text-green-800"
              />
              <OrderRow
                id="#ORD-002"
                customer="Metro Construction"
                product="Concrete Blocks"
                amount="$28,750"
                status="Processing"
                statusColor="bg-yellow-100 text-yellow-800"
              />
              <OrderRow
                id="#ORD-003"
                customer="Urban Developers"
                product="Roofing Materials"
                amount="$15,300"
                status="Shipped"
                statusColor="bg-blue-100 text-blue-800"
              />
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
