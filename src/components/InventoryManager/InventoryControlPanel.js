import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Settings, RefreshCcw, Trash2,Wrench, BarChart3, AlertTriangle, FileText, Calendar, Users, TrendingUp } from 'lucide-react';

const InventoryControlPanel = () => {
  const navigate = useNavigate();

  const controlOptions = [
    {
      title: 'Add Equipment to Inventory',
      description: 'Register new machinery, tools, or vehicles to the equipment inventory.',
      icon: Settings,
      iconBg: 'bg-gradient-to-br from-deep_green to-deep_green/80',
      route: '/add-equipment',
      hoverClass: 'hover:border-deep_green/30'
    },
    {
      title: 'Add Material to Inventory',
      description: 'Log oils, lubricants, spare parts, or other materials to your inventory.',
      icon: Package,
      iconBg: 'bg-gradient-to-br from-web_yellow to-web_yellow/80',
      route: '/add-material',
      hoverClass: 'hover:border-web_yellow/30'
    },
    
    {
      title: 'Update Inventory',
      description: 'Modify quantities, replace old items, or adjust stock details for existing materials.',
      icon: RefreshCcw,
      iconBg: 'bg-gradient-to-br from-web_yellow to-web_yellow/80',
      route: '/update-inventory',
      hoverClass: 'hover:border-web_yellow/30'
    },
    {
      title: 'Delete Item',
      description: 'Remove outdated, damaged, or unnecessary materials from your inventory records.',
      icon: Trash2,
      iconBg: 'bg-gradient-to-br from-red-500 to-red-400',
      route: '/delete-item',
      hoverClass: 'hover:border-red-400/30'
    },
  ];

  const inventoryFeatures = [
    {
      icon: BarChart3,
      iconBg: 'bg-gradient-to-br from-deep_green to-deep_green/80',
      title: 'Inventory Analytics',
      description: 'Track usage patterns, monitor stock turnover rates, and generate comprehensive reports to optimize your inventory management decisions.'
    },
    {
      icon: AlertTriangle,
      iconBg: 'bg-gradient-to-br from-web_yellow to-web_yellow/80',
      title: 'Low Stock Alerts',
      description: 'Receive automated notifications when inventory levels drop below minimum thresholds to prevent stockouts and maintain smooth operations.'
    },
    {
      icon: FileText,
      iconBg: 'bg-gradient-to-br from-light_brown to-light_brown/80',
      title: 'Purchase Orders',
      description: 'Generate and manage purchase orders directly from the inventory system with supplier information and automated reorder calculations.'
    },
    {
      icon: Calendar,
      iconBg: 'bg-gradient-to-br from-deep_green to-deep_green/80',
      title: 'Maintenance Scheduling',
      description: 'Schedule and track maintenance activities for equipment with automated reminders and maintenance history tracking.'
    },
    {
      icon: Users,
      iconBg: 'bg-gradient-to-br from-web_yellow to-web_yellow/80',
      title: 'Multi-User Access',
      description: 'Collaborate with your team through role-based access controls, allowing different permission levels for inventory management tasks.'
    },
    {
      icon: TrendingUp,
      iconBg: 'bg-gradient-to-br from-light_brown to-light_brown/80',
      title: 'Cost Optimization',
      description: 'Monitor inventory costs, track depreciation values, and analyze spending patterns to optimize your inventory investment and reduce waste.'
    }
  ];

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-main_dark mb-2">Inventory Control Panel</h1>
        <p className="text-slatebluegray text-base">Manage and add new items to your inventory system</p>
      </div>

      {/* Main Control Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        {controlOptions.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(option.route)}
              className={`cursor-pointer bg-purewhite border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 ${option.hoverClass} group`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${option.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-main_dark mb-2 group-hover:text-deep_green transition-colors duration-150">
                    {option.title}
                  </h2>
                  <p className="text-sm text-slatebluegray leading-relaxed">
                    {option.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <Plus className="w-5 h-5 text-deep_green" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inventory Management Features */}
      <div className="bg-purewhite border border-gray-200 rounded-xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-main_dark mb-2">Comprehensive Inventory Management</h2>
          <p className="text-slatebluegray">Discover the full range of features available to streamline your inventory operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventoryFeatures.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <div className={`w-10 h-10 ${feature.iconBg} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <FeatureIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-main_dark mb-2 text-sm">{feature.title}</h3>
                  <p className="text-xs text-slatebluegray leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Benefits */}
      <div className="bg-gradient-to-r from-deep_green/5 to-web_yellow/5 rounded-xl p-6 sm:p-8 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-main_dark mb-2">Why Choose Our Inventory System?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slatebluegray">
          <div className="space-y-3">
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-deep_green rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>Real-time Tracking:</strong> Monitor all inventory items in real-time with automatic updates and instant availability checks across all locations.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-web_yellow rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>Smart Automation:</strong> Automate reorder processes, maintenance schedules, and inventory audits to reduce manual work and human error.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-light_brown rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>Cost Control:</strong> Track depreciation, monitor usage costs, and optimize purchasing decisions with detailed financial analytics.</span>
            </p>
          </div>
          <div className="space-y-3">
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-deep_green rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>Mobile Access:</strong> Access your inventory data from anywhere with mobile-responsive design and offline capability for field operations.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-web_yellow rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>Compliance Ready:</strong> Maintain audit trails, generate compliance reports, and ensure regulatory adherence with built-in documentation.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-light_brown rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>Integration Support:</strong> Seamlessly connect with existing ERP systems, accounting software, and supplier platforms for unified operations.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryControlPanel;
