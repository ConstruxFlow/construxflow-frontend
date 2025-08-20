import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Settings, BarChart3, AlertTriangle, FileText, Calendar, Users, TrendingUp, ArrowRight } from 'lucide-react';

const SiteInventory = () => {
  const navigate = useNavigate();

  const controlOptions = [
    {
      title: 'Manage Site Raw Material',
      description: 'Add, update, and track raw materials inventory',
      icon: Package,
      iconBg: 'bg-gradient-to-br from-deep_green to-deep_green/90',
      route: '/site-material-info',
      hoverClass: 'hover:border-deep_green/40 hover:shadow-lg'
    },
    {
      title: 'Manage Site Equipment',
      description: 'Monitor and maintain equipment inventory',
      icon: Settings,
      iconBg: 'bg-gradient-to-br from-web_yellow to-web_yellow/90',
      route: '/site-equipment-info',
      hoverClass: 'hover:border-web_yellow/40 hover:shadow-lg'
    }
  ];

  const quickStats = [
    {
      label: 'Total Materials',
      value: '156',
      icon: Package,
      color: 'from-deep_green/20 to-deep_green/10',
      textColor: 'text-deep_green'
    },
    {
      label: 'Active Equipment',
      value: '89',
      icon: Settings,
      color: 'from-web_yellow/20 to-web_yellow/10',
      textColor: 'text-web_yellow'
    },
    {
      label: 'Low Stock Items',
      value: '12',
      icon: AlertTriangle,
      color: 'from-light_brown/20 to-light_brown/10',
      textColor: 'text-light_brown'
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track usage patterns and stock levels',
      color: 'text-deep_green'
    },
    {
      icon: AlertTriangle,
      title: 'Smart Alerts',
      description: 'Get notified about low stock and maintenance',
      color: 'text-web_yellow'
    },
    {
      icon: FileText,
      title: 'Easy Reporting',
      description: 'Generate comprehensive inventory reports',
      color: 'text-light_brown'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-deep_green/10 to-web_yellow/10 border border-deep_green/20 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-deep_green rounded-full animate-pulse"></div>
            <span className="text-deep_green font-medium text-sm">Site Inventory Management</span>
          </div>
          <h1 className="text-4xl font-bold text-main_dark mb-4">
            Inventory Control Center
          </h1>
          <p className="text-lg text-slatebluegray max-w-2xl mx-auto">
            Streamline your site operations with intelligent inventory management
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-purewhite rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-main_dark mb-1">{stat.value}</h3>
                <p className="text-slatebluegray text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {controlOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(option.route)}
                className={`group cursor-pointer bg-purewhite border-2 border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 ${option.hoverClass} transform hover:-translate-y-1`}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 ${option.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-main_dark mb-3 group-hover:text-deep_green transition-colors duration-300">
                      {option.title}
                    </h2>
                    <p className="text-slatebluegray text-base leading-relaxed mb-4">
                      {option.description}
                    </p>
                    <div className="flex items-center gap-2 text-deep_green font-semibold group-hover:gap-3 transition-all duration-300">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="bg-gradient-to-r from-deep_green/5 via-web_yellow/5 to-light_brown/5 rounded-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-main_dark mb-3">Powerful Features</h2>
            <p className="text-slatebluegray text-lg">Everything you need for efficient inventory management</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={index} className="bg-purewhite rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <FeatureIcon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-main_dark mb-2">{feature.title}</h3>
                  <p className="text-slatebluegray text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-deep_green to-web_yellow rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Inventory?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join hundreds of construction teams who have streamlined their operations with our intelligent inventory system.
            </p>
            <button 
              onClick={() => navigate('/site-material-info')}
              className="bg-white text-main_dark px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Start Managing Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteInventory;
