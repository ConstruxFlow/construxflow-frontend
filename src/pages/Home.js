import React from "react";
import NavBar from "../components/NavBar";
import { MdOutlineStorage } from "react-icons/md";
import { FaRobot, FaChartLine, FaWarehouse, FaUser, FaBuilding } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import { IoSearch, IoMail } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import { FaPhoneAlt, FaArrowUpLong } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigation = useNavigate();

  const handleLogin = () => {
    navigation("/login");
  };

  return (
    <div className="bg-purewhite flex flex-col items-center justify-center w-full font-poppins">
      <NavBar
        links={[
          { name: "Home", href: "#" },
          { name: "Features", href: "#features" },
          { name: "Solutions", href: "#solutions" },
          { name: "Contact", href: "#contact" },
        ]}
        showButton={true}
        onButtonClick={handleLogin}
      />

      {/* Hero Section with Full Background Image */}
      <div 
        className="relative w-full min-h-[calc(100vh-70px)] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/assets/home_page/1.jpg')`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-web_yellow/20 via-web_yellow/15 to-transparent border border-web_yellow/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-web_yellow rounded-full animate-pulse"></div>
            <span className="text-purewhite font-medium text-sm">Trusted by 500+ Construction Teams</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-purewhite font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 max-w-4xl mx-auto drop-shadow-lg">
            Streamline Your Construction
            <span className="text-web_yellow"> Operations</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-gray-200 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-md">
            All-in-one platform for inventory management, procurement tracking, and maintenance coordination—designed for modern construction teams.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-gradient-to-r from-web_yellow to-web_yellow/90 font-semibold text-main_dark px-8 py-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm">
              Start Free Trial
            </button>
            <button className="bg-purewhite/10 backdrop-blur-sm border-2 border-purewhite font-semibold text-purewhite px-8 py-4 rounded-xl hover:bg-purewhite hover:text-main_dark transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center bg-purewhite/10 backdrop-blur-sm rounded-lg p-4 border border-purewhite/20">
              <h3 className="text-3xl font-bold text-purewhite mb-1">500+</h3>
              <p className="text-gray-200 text-sm">Active Projects</p>
            </div>
            <div className="text-center bg-purewhite/10 backdrop-blur-sm rounded-lg p-4 border border-purewhite/20">
              <h3 className="text-3xl font-bold text-purewhite mb-1">98%</h3>
              <p className="text-gray-200 text-sm">Client Satisfaction</p>
            </div>
            <div className="text-center bg-purewhite/10 backdrop-blur-sm rounded-lg p-4 border border-purewhite/20">
              <h3 className="text-3xl font-bold text-purewhite mb-1">24/7</h3>
              <p className="text-gray-200 text-sm">Support Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Right Side Image */}
      <div id="features" className="w-full py-16 bg-light_gray/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Content Column */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-main_dark mb-6">
                Everything You Need for Construction Excellence
              </h2>
              <p className="text-slatebluegray text-lg mb-8 leading-relaxed">
                Powerful features designed specifically for construction teams to streamline operations and boost productivity. Our comprehensive platform brings together all the tools you need in one place.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-web_yellow rounded-full flex items-center justify-center">
                    <MdOutlineStorage className="text-main_dark text-sm"/>
                  </div>
                  <span className="text-main_dark font-medium">Smart Inventory Management</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-deep_green rounded-full flex items-center justify-center">
                    <FaRobot className="text-purewhite text-sm"/>
                  </div>
                  <span className="text-main_dark font-medium">Automated Procurement</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-web_yellow rounded-full flex items-center justify-center">
                    <SiGoogleanalytics className="text-main_dark text-sm"/>
                  </div>
                  <span className="text-main_dark font-medium">Real-time Analytics</span>
                </div>
              </div>
            </div>
            
            {/* Image Column */}
            <div className="relative">
              <img 
                src="/assets/home_page/2.jpg" 
                alt="Construction Management Features"
                className="w-full h-auto rounded-2xl shadow-xl border border-gray-200"
              />
              <div className="absolute -bottom-6 -left-6 bg-web_yellow rounded-xl p-4 shadow-lg">
                <div className="text-main_dark font-bold text-lg">40%</div>
                <div className="text-main_dark text-sm">Efficiency Boost</div>
              </div>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-purewhite border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center mx-auto mb-6">
                <MdOutlineStorage className="text-purewhite text-2xl"/>
              </div>
              <h3 className="text-xl font-semibold text-main_dark mb-4">Inventory Management</h3>
              <p className="text-slatebluegray leading-relaxed">
                Track materials, manage stock levels, and automate reordering with intelligent inventory controls.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-purewhite border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaRobot className="text-purewhite text-2xl"/>
              </div>
              <h3 className="text-xl font-semibold text-main_dark mb-4">Automated Procurement</h3>
              <p className="text-slatebluegray leading-relaxed">
                Streamline purchasing with automated workflows, supplier management, and approval processes.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-purewhite border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center mx-auto mb-6">
                <SiGoogleanalytics className="text-purewhite text-2xl"/>
              </div>
              <h3 className="text-xl font-semibold text-main_dark mb-4">Real-time Analytics</h3>
              <p className="text-slatebluegray leading-relaxed">
                Get instant insights into project progress, costs, and resource utilization with comprehensive dashboards.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-purewhite border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaWarehouse className="text-purewhite text-2xl"/>
              </div>
              <h3 className="text-xl font-semibold text-main_dark mb-4">Multi-Site Management</h3>
              <p className="text-slatebluegray leading-relaxed">
                Manage inventory and operations across multiple construction sites from a single platform.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-purewhite border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaUser className="text-purewhite text-2xl"/>
              </div>
              <h3 className="text-xl font-semibold text-main_dark mb-4">Supplier Network</h3>
              <p className="text-slatebluegray leading-relaxed">
                Build and manage relationships with trusted suppliers for consistent material delivery.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-purewhite border border-gray-200 rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaChartLine className="text-purewhite text-2xl"/>
              </div>
              <h3 className="text-xl font-semibold text-main_dark mb-4">Cost Control</h3>
              <p className="text-slatebluegray leading-relaxed">
                Monitor budgets, track expenses, and prevent cost overruns with real-time financial insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Section with Left Side Image */}
      <div id="solutions" className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-main_dark mb-4">
              Built for Construction Excellence
            </h2>
            <p className="text-slatebluegray text-lg max-w-2xl mx-auto">
              See how leading construction companies are transforming their operations with our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Image Column - Left Side */}
            <div className="relative order-2 lg:order-1">
              <img 
                src="/assets/home_page/3.jpg" 
                alt="Construction Solutions Dashboard"
                className="w-full h-auto rounded-2xl shadow-xl border border-gray-200"
              />
              <div className="absolute -top-6 -right-6 bg-deep_green rounded-xl p-4 shadow-lg">
                <div className="text-purewhite font-bold text-lg">24/7</div>
                <div className="text-purewhite text-sm">Support</div>
              </div>
            </div>

            {/* Content Column - Right Side */}
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-web_yellow rounded-xl flex items-center justify-center flex-shrink-0">
                    {/* <FaArrowUpLong className="text-main_dark text-lg"/> */}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-main_dark mb-3">Increase Efficiency by 40%</h3>
                    <p className="text-slatebluegray leading-relaxed">Reduce manual processes and eliminate bottlenecks with automated workflows and intelligent resource allocation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-deep_green rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaBuilding className="text-purewhite text-lg"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-main_dark mb-3">Scale Across Multiple Sites</h3>
                    <p className="text-slatebluegray leading-relaxed">Manage inventory and procurement across all your construction sites from one centralized platform with real-time synchronization.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-web_yellow rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaChartLine className="text-main_dark text-lg"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-main_dark mb-3">Real-time Cost Control</h3>
                    <p className="text-slatebluegray leading-relaxed">Track expenses, monitor budgets, and prevent cost overruns with live financial insights and predictive analytics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-gradient-to-br from-light_gray/20 to-light_brown/10 rounded-2xl p-8">
            <div className="bg-purewhite rounded-xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-main_dark mb-6">Live Dashboard Preview</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slatebluegray font-medium">Materials on Site</span>
                  <span className="font-bold text-main_dark">85%</span>
                </div>
                <div className="w-full bg-light_gray rounded-full h-3">
                  <div className="bg-gradient-to-r from-web_yellow to-web_yellow/80 h-3 rounded-full" style={{width: '85%'}}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slatebluegray font-medium">Budget Utilization</span>
                  <span className="font-bold text-main_dark">72%</span>
                </div>
                <div className="w-full bg-light_gray rounded-full h-3">
                  <div className="bg-gradient-to-r from-deep_green to-deep_green/80 h-3 rounded-full" style={{width: '72%'}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slatebluegray font-medium">Active Orders</span>
                  <span className="font-bold text-main_dark">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slatebluegray font-medium">Pending Approvals</span>
                  <span className="font-bold text-main_dark">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section with Right Side Image */}
      <div className="w-full py-16 bg-light_gray/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Column */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-main_dark mb-8">
                Trusted by Industry Leaders
              </h2>
              
              <div className="space-y-8">
                <div className="bg-purewhite rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src="/assets/home_page/4.jpg" 
                      alt="John Smith"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-main_dark">John Smith</h4>
                      <p className="text-slatebluegray text-sm">Project Manager, BuildCorp</p>
                    </div>
                  </div>
                  <p className="text-slatebluegray leading-relaxed">
                    "This platform has revolutionized how we manage our construction projects. The inventory tracking alone has saved us thousands in waste reduction."
                  </p>
                </div>

                <div className="bg-purewhite rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src="/assets/home_page/hero2.jpg" 
                      alt="Sarah Johnson"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-main_dark">Sarah Johnson</h4>
                      <p className="text-slatebluegray text-sm">Operations Director, SteelWorks</p>
                    </div>
                  </div>
                  <p className="text-slatebluegray leading-relaxed">
                    "The real-time analytics give us unprecedented visibility into our operations. We can now make data-driven decisions that improve our bottom line."
                  </p>
                </div>
              </div>
            </div>
            
            {/* Image Column */}
            <div className="relative">
              <img 
                src="/assets/home_page/4.jpg" 
                alt="Construction Team Success"
                className="w-full h-auto rounded-2xl shadow-xl border border-gray-200"
              />
              <div className="absolute -bottom-6 -left-6 bg-purewhite rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="text-main_dark font-bold text-lg">98%</div>
                <div className="text-main_dark text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-16 bg-gradient-to-r from-deep_green to-deep_green/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-purewhite mb-4">
            Ready to Transform Your Construction Operations?
          </h2>
          <p className="text-light_gray text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of construction teams already using our platform to streamline their projects and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-web_yellow font-semibold text-main_dark px-8 py-4 rounded-xl hover:bg-web_yellow/90 transition-all duration-300">
              Start Free Trial
            </button>
            <button className="bg-transparent border-2 border-purewhite font-semibold text-purewhite px-8 py-4 rounded-xl hover:bg-purewhite hover:text-deep_green transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div id="contact" className="w-full py-12 bg-purewhite border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img
                src="/logo2.png"
                alt="Logo"
                className="h-12 w-auto mb-4"
              />
              <p className="text-slatebluegray mb-6 max-w-md leading-relaxed">
                Empowering construction teams with intelligent project management solutions for better efficiency and control.
              </p>
              <div className="flex items-center gap-2 text-sm text-slatebluegray">
                <IoMail className="text-web_yellow"/>
                support@constructflow.com
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-main_dark mb-4">Product</h4>
              <div className="space-y-3">
                <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Features</p>
                <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Pricing</p>
                <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Integrations</p>
                <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">API</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-main_dark mb-4">Support</h4>
              <div className="space-y-3">
                <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Help Center</p>
                <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Documentation</p>
                <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Training</p>
                <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Contact Us</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slatebluegray text-sm">© 2024 ConstructFlow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Privacy Policy</p>
              <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Terms of Service</p>
              <p className="text-slatebluegray text-sm hover:text-deep_green cursor-pointer transition-colors">Cookie Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
