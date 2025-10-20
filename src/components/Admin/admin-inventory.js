import React, { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  User,
  Settings,
  BarChart3,
  Truck,
  Package,
  Wrench,
  Droplets,
  Heart,
  Fuel,
} from "lucide-react";

const InventoryDashboard = () => {
  // Backend data
  const [stockItems, setStockItems] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);

  // Equipment section state (for Supplier Dispatch section replacement)
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [equipmentLoading, setEquipmentLoading] = useState(true);

  // Static supplier section kept as-is (no backend provided for this yet)
  const supplierItems = [
    {
      item: "Steel Rods (500 units)",
      status: "Delivered",
      eta: "Today",
      statusColor: "bg-deep_green",
    },
    {
      item: "Hydraulic Oil (200L)",
      status: "In Transit",
      eta: "Dec 20",
      statusColor: "bg-light_brown",
    },
    {
      item: "Safety Helmets (50 pcs)",
      status: "Delayed",
      eta: "Dec 22",
      statusColor: "bg-web_yellow",
    },
    {
      item: "Diesel Fuel (1000L)",
      status: "In Transit",
      eta: "Dec 19",
      statusColor: "bg-light_brown",
    },
    {
      item: "First Aid Kits (25 pcs)",
      status: "Pending",
      eta: "Dec 25",
      statusColor: "bg-light_gray",
    },
  ];

  // Change if you host API elsewhere
  const API_BASE = "http://localhost:8080/api"; // e.g., import.meta.env.VITE_API_BASE_URL || ""

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/inventory/overview`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Map backend stockItems (category-level summary) to UI
        const mappedStock = (data?.stockItems || []).map((s) => {
          const name = s.category || "Uncategorized";
          const IconComp = categoryIconMap[name] || Package;
          return {
            name,
            icon: <IconComp className="w-8 h-8" />,
            count: formatCount(s.totalQuantity, name),
            capacity: s.capacityPercent ?? 0,
            status: s.status || "Good",
            color: getBarColorByStatus(s.status),
          };
        });

        // Map backend criticalItems to UI
        const mappedCritical = (data?.criticalItems || []).map((c) => ({
          name: c.name,
          current: formatCriticalQuantity(c.current, c.unitOfMeasure),
          min: formatCriticalQuantity(c.min, c.unitOfMeasure),
          priority: c.priority || "medium",
          icon: "", // UI keeps icon wrapper commented; leaving empty
        }));

        setStockItems(mappedStock);
        setCriticalItems(mappedCritical);
      } catch (e) {
        console.error("Failed to fetch inventory overview:", e);
        // Fallback to empty arrays if error; UI remains unchanged
        setStockItems([]);
        setCriticalItems([]);
      }
    };

    fetchOverview();
  }, []);

  // Fetch equipment summaries for Supplier Dispatch section (Name, Status, Last Maintenance)
  useEffect(() => {
    let alive = true;
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`${API_BASE}/equipment/summary`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setEquipmentItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch equipment summary:", e);
        if (alive) setEquipmentItems([]);
      } finally {
        if (alive) setEquipmentLoading(false);
      }
    };
    fetchEquipment();
    return () => {
      alive = false;
    };
  }, []);

  // Icon mapping by category (adjust if your category names differ)
  const categoryIconMap = {
    "Spare Parts": Settings,
    Machinery: Wrench,
    "Fluids & Lubricants": Droplets,
    "First Aid": Heart,
    Fuel: Fuel,
  };

  // Helpers to keep your existing UI fields consistent
  function getBarColorByStatus(status) {
    switch (status) {
      case "Critical":
        return "bg-light_brown";
      case "Low":
        return "bg-web_yellow";
      case "Good":
        return "bg-deep_green";
      default:
        return "bg-light_gray";
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Critical":
        return "text-red-400";
      case "Good":
        return "text-green-500";
      case "Low":
        return "text-[#EFC11A]";
      default:
        return "text-gray-500";
    }
  };

  // Equipment status dot colors (keeps palette consistent with existing UI)
  const getEquipmentDotColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-deep_green";
      case "IN_USE":
        return "bg-light_brown";
      case "MAINTENANCE":
      case "MAINTENANCE_DUE":
        return "bg-web_yellow";
      case "OUT_OF_SERVICE":
        return "bg-light_gray";
      default:
        return "bg-light_gray";
    }
  };

  // For category cards: append "L" for liquid categories
  function formatCount(totalQuantity, category) {
    const isLiquid = ["Fuel", "Fluids & Lubricants"].includes(category || "");
    const n = Number(totalQuantity || 0);
    const num = n.toLocaleString();
    return isLiquid ? `${num}L` : num;
  }

  // For critical list: use unitOfMeasure if provided
  function formatCriticalQuantity(value, uom) {
    const n = Number(value || 0).toLocaleString();
    if (!uom) return n;
    const liquidUnits = ["l", "liter", "litre", "liters", "litres"];
    if (liquidUnits.includes(String(uom).toLowerCase())) return `${n}L`;
    return `${n}${uom.startsWith(" ") ? "" : " "}${uom}`;
  }

  // Format date for Last Maintenance
  function formatDate(value) {
    if (!value) return "—";
    const dt = new Date(value);
    return isNaN(dt.getTime()) ? value : dt.toLocaleDateString();
  }

  return (
    <div className="min-h-screen bg-purewhite">
      <main className="p-6">
        {/* ✅ All content wrapped in a centered responsive container */}
        <div className="max-w-full mx-auto px-16 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className=" justify-between mb-8">
            <h1 className="text-2xl font-bold text-main_dark">
              Inventory Management
            </h1>
            <p className="text-gray-600 text-base mt-2">
              Monitor, control, and optimize your stock levels to ensure timely
              supply and efficient operations.
            </p>
            {/* <div className="flex items-center space-x-4">
              <button className="bg-[#EFC11A] text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2 font-medium">
                <Plus className="w-4 h-4" />
                <span>Add Stock</span>
              </button>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div> */}
          </div>

          {/* Current Stock Status */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-main_dark mb-4">
              Current Stock Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stockItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-600">{item.icon}</div>
                    <span
                      className={`text-sm font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-gray-800 font-medium mb-2">
                    {item.name}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {item.count}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.capacity}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.capacity}% of capacity
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-column section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Supplier Dispatch Status (replaced with Equipment data) */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Equipment Status Summary
              </h2>
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="bg-gray-200 px-4 py-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-700">
                      Name
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      Status
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      Last Maintenance
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {equipmentLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Loading...
                    </div>
                  ) : equipmentItems.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No equipment found.
                    </div>
                  ) : (
                    equipmentItems.map((item) => (
                      <div key={item.id} className="px-4 py-3">
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div className="text-sm text-gray-900">
                            {item.name}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getEquipmentDotColor(
                                item.status
                              )}`}
                            ></div>
                            <span className="text-sm text-gray-700">
                              {item.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {formatDate(item.lastMaintenance)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Critical Stock Needs */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Critical Stock Needs
              </h2>
              <div className="space-y-4">
                {criticalItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.priority === "high"
                              ? "bg-red-100"
                              : "bg-yellow-100"
                          }`}
                        >
                          <span className="text-sm">{item.icon}</span>
                        </div> */}
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Current: {item.current} | Min: {item.min}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Consumption Forecast */}
          {/* <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Stock Consumption Forecast
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Forecast chart would be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default InventoryDashboard;