import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { 
  FaTruck, 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaWrench, 
  FaBoxes, 
  FaExclamationTriangle, 
  FaClipboardList, 
  FaThumbsUp,
  FaTools,
  FaEye,
  FaPlus,
  FaChartBar,
  FaBell,
  FaFileInvoice
} from 'react-icons/fa';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Request', href: '/Inventory-requests' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

const InventoryDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${API_BASE_URL}/api/inventory/dashboard/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text.substring(0, 200));
          throw new Error('Server returned non-JSON response');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        // Fallback to dummy data if API fails
        const dummyData = {
          totalEquipment: 156,
          availableEquipment: 89,
          scheduledEquipment: 42,
          underMaintenanceEquipment: 25,
          totalMaterials: 234,
          lowStockMaterials: 18,
          pendingRequests: 12,
          approvedRequests: 34
        };
        setDashboardData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-deep_green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error: {error}</div>
          <div className="text-slatebluegray">Using fallback data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col">
      <NavBar links={navLinks} profileURL='/inventory/profile'/>
      
      <main className="py-6 flex-1">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-main_dark mb-2">Inventory Dashboard</h1>
            <p className="text-slatebluegray text-base">Overview of your inventory management system</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard 
              title="Total Equipment" 
              value={dashboardData?.totalEquipment} 
              icon={<FaTruck className="w-6 h-6" />}
              color="deep_green"
            />
            <StatCard 
              title="Available Equipment" 
              value={dashboardData?.availableEquipment} 
              icon={<FaCheckCircle className="w-6 h-6" />}
              color="web_yellow"
            />
            <StatCard 
              title="Scheduled Equipment" 
              value={dashboardData?.scheduledEquipment} 
              icon={<FaCalendarAlt className="w-6 h-6" />}
              color="light_brown"
            />
            <StatCard 
              title="Under Maintenance" 
              value={dashboardData?.underMaintenanceEquipment} 
              icon={<FaWrench className="w-6 h-6" />}
              color="deep_green"
            />
            <StatCard 
              title="Total Materials" 
              value={dashboardData?.totalMaterials} 
              icon={<FaBoxes className="w-6 h-6" />}
              color="web_yellow"
            />
            <StatCard 
              title="Low Stock Items" 
              value={dashboardData?.lowStockMaterials} 
              icon={<FaExclamationTriangle className="w-6 h-6" />}
              color="light_brown"
            />
            <StatCard 
              title="Pending Requests" 
              value={dashboardData?.pendingRequests} 
              icon={<FaClipboardList className="w-6 h-6" />}
              color="deep_green"
            />
            <StatCard 
              title="Approved Requests" 
              value={dashboardData?.approvedRequests} 
              icon={<FaThumbsUp className="w-6 h-6" />}
              color="web_yellow"
            />
          </div>

          {/* Control Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
            <ControlSection
              title="Add Equipment to Inventory"
              description="Register new machinery, tools, or vehicles to the equipment inventory."
              icon={<FaTools className="w-6 h-6" />}
              href="/add-equipment"
              color="deep_green"
            />

            <ControlSection
              title="Add Material to Inventory"
              description="Log oils, lubricants, spare parts, or other materials to your inventory."
              icon={<FaBoxes className="w-6 h-6" />}
              href="/add-material"
              color="web_yellow"
            />

            <ControlSection
              title="Update and Delete Inventory"
              description="Modify quantities, update stock levels, or remove items from your inventory system."
              icon={<FaWrench className="w-6 h-6" />}
              href="/update-inventory"
              color="light_brown"
            />

            <ControlSection
              title="Inventory Monitoring"
              description="Track and monitor inventory status in real-time."
              icon={<FaEye className="w-6 h-6" />}
              href="/inventory-monitoring"
              color="deep_green"
            />
          </div>

          {/* Comprehensive Inventory Management Section */}
          <div className="bg-purewhite border border-gray-200 rounded-xl p-6 sm:p-8 mb-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-main_dark mb-2">Comprehensive Inventory Management</h2>
              <p className="text-slatebluegray">Discover the full range of features available to streamline your inventory operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<FaChartBar className="w-5 h-5" />}
                iconBg="bg-gradient-to-br from-deep_green to-deep_green/80"
                title="Inventory Analytics"
                description="Track usage patterns, monitor stock turnover rates, and generate comprehensive reports to optimize your inventory management decisions."
              />
              <FeatureCard
                icon={<FaBell className="w-5 h-5" />}
                iconBg="bg-gradient-to-br from-web_yellow to-web_yellow/80"
                title="Low Stock Alerts"
                description="Receive automated notifications when inventory levels drop below minimum thresholds to prevent stockouts and maintain smooth operations."
              />
              <FeatureCard
                icon={<FaFileInvoice className="w-5 h-5" />}
                iconBg="bg-gradient-to-br from-light_brown to-light_brown/80"
                title="Purchase Orders"
                description="Generate and manage purchase orders directly from the inventory system with supplier information and automated reorder calculations."
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Now properly placed inside the main return */}
      <div className="bg-purewhite border-t border-gray-200 mt-8">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-slatebluegray">
              <span className="font-medium">© 2025 Construction Inventory Management</span>
              <span className="hidden sm:inline">•</span>
              <span>Version 2.1.0</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="text-sm text-deep_green hover:text-deep_green/80 font-medium transition-colors duration-150">
                Help & Support
              </button>
              <button className="text-sm text-deep_green hover:text-deep_green/80 font-medium transition-colors duration-150">
                Export Data
              </button>
              <button className="bg-web_yellow hover:bg-web_yellow/80 text-main_dark px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 shadow-sm hover:shadow-md">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component with your color palette
const StatCard = ({ title, value, icon, color }) => {
  const colorConfig = {
    deep_green: {
      bg: 'bg-gradient-to-br from-deep_green/10 to-deep_green/5',
      iconBg: 'bg-gradient-to-br from-deep_green to-deep_green/80',
      border: 'border-gray-200',
      text: 'text-deep_green'
    },
    web_yellow: {
      bg: 'bg-gradient-to-br from-web_yellow/10 to-web_yellow/5',
      iconBg: 'bg-gradient-to-br from-web_yellow to-web_yellow/80',
      border: 'border-gray-200',
      text: 'text-main_dark'
    },
    light_brown: {
      bg: 'bg-gradient-to-br from-light_brown/10 to-light_brown/5',
      iconBg: 'bg-gradient-to-br from-light_brown to-light_brown/80',
      border: 'border-gray-200',
      text: 'text-main_dark'
    }
  };

  const config = colorConfig[color] || colorConfig.deep_green;

  return (
    <div className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${config.border} group cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slatebluegray mb-2">{title}</p>
          <p className={`text-3xl font-bold ${config.text}`}>{value || 0}</p>
        </div>
        <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

// Control Section Component
const ControlSection = ({ title, description, icon, href, color }) => {
  const colorConfig = {
    deep_green: {
      bg: 'bg-gradient-to-br from-deep_green/5 to-deep_green/2',
      iconBg: 'bg-gradient-to-br from-deep_green to-deep_green/80',
      border: 'border-gray-200',
      hover: 'hover:border-deep_green/30'
    },
    web_yellow: {
      bg: 'bg-gradient-to-br from-web_yellow/5 to-web_yellow/2',
      iconBg: 'bg-gradient-to-br from-web_yellow to-web_yellow/80',
      border: 'border-gray-200',
      hover: 'hover:border-web_yellow/30'
    },
    light_brown: {
      bg: 'bg-gradient-to-br from-light_brown/5 to-light_brown/2',
      iconBg: 'bg-gradient-to-br from-light_brown to-light_brown/80',
      border: 'border-gray-200',
      hover: 'hover:border-light_brown/30'
    }
  };

  const config = colorConfig[color] || colorConfig.deep_green;

  return (
    <a
      href={href}
      className={`block bg-white border rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${config.border} ${config.hover} group cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-main_dark mb-3 group-hover:text-deep_green transition-colors duration-150">
              {title}
            </h3>
            <p className="text-sm text-slatebluegray leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 mt-2">
          <FaPlus className="w-5 h-5 text-deep_green" />
        </div>
      </div>
    </a>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, iconBg, title, description }) => {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
      <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-main_dark mb-2 text-sm">{title}</h3>
        <p className="text-xs text-slatebluegray leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default InventoryDashboard;