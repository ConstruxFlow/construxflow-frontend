import React from 'react';
import NavBar from '../../../components/NavBar';
import { MdOutlinePendingActions } from "react-icons/md";
import { LiaNotesMedicalSolid } from "react-icons/lia";
import { GrDeliver } from "react-icons/gr";
import { IoMdCheckmark } from "react-icons/io";

const PurchasingDashboard = () => {
  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
     <NavBar links={
        [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Orders', path: '/orders' },
          { name: 'Suppliers', path: '/suppliers' },
          { name: 'Reports', path: '/reports' }
        ]
     } />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-main_dark mb-1 tracking-tight">
              Purchasing Dashboard
            </h1>
            <p className="text-slatebluegray text-base">
              Welcome back, John. Here's your procurement overview.
            </p>
          </div>

          {/* Urgent Actions Alert */}
          <div className="bg-yellow-50 border border-web_yellow rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="text-web_yellow text-lg mt-0.5">⚠</div>
            <div>
              <h3 className="font-semibold text-sm text-main_dark mb-0.5">
                Urgent Actions Required
              </h3>
              <p className="text-slatebluegray text-xs">
                3 delayed deliveries • 2 low stock alerts • 1 pending approval
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Pending Requests</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">24</h3>
                <span className="text-deep_green text-xs">+3 from yesterday</span>
              </div>
              <div className="w-11 h-11 bg-web_yellow rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0">
                <MdOutlinePendingActions/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Approved Today</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">18</h3>
                <span className="text-deep_green text-xs">87% approval rate</span>
              </div>
              <div className="w-11 h-11 bg-deep_green rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0">
                <IoMdCheckmark/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Open Quotations</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">12</h3>
                <span className="text-deep_green text-xs">5 expiring soon</span>
              </div>
              <div className="w-11 h-11 bg-light_brown rounded-lg flex items-center justify-center text-gray-900 text-lg flex-shrink-0">
                <LiaNotesMedicalSolid/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Active Suppliers</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">156</h3>
                <span className="text-deep_green text-xs">92% performance avg</span>
              </div>
              <div className="w-11 h-11 bg-light_gray rounded-lg flex items-center justify-center text-gray-900 text-lg flex-shrink-0">
                <GrDeliver/>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-main_dark mb-4 tracking-tight text-center lg:text-left">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-purewhite border border-gray-200 hover:border-web_yellow rounded-lg p-4 sm:p-5 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
                <div className="text-xl sm:text-2xl mb-2">👤</div>
                <span className="font-medium text-main_dark text-xs sm:text-sm">Register Supplier</span>
              </div>
              
              <div className="bg-purewhite border border-gray-200 hover:border-deep_green rounded-lg p-4 sm:p-5 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
                <div className="text-xl sm:text-2xl mb-2">📝</div>
                <span className="font-medium text-main_dark text-xs sm:text-sm">Create Request</span>
              </div>
              
              <div className="bg-purewhite border border-gray-200 hover:border-light_brown rounded-lg p-4 sm:p-5 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
                <div className="text-xl sm:text-2xl mb-2">🔍</div>
                <span className="font-medium text-main_dark text-xs sm:text-sm">Review Quotes</span>
              </div>
              
              <div className="bg-purewhite border border-gray-200 hover:border-light_gray rounded-lg p-4 sm:p-5 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
                <div className="text-xl sm:text-2xl mb-2">📊</div>
                <span className="font-medium text-main_dark text-xs sm:text-sm">View Reports</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-8">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-5">
              <h3 className="font-semibold text-main_dark mb-4 text-base">
                Procurement Trends
              </h3>
              <div className="h-36 sm:h-45 bg-gray-50 border border-dashed border-gray-300 rounded-md"></div>
            </div>
            
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-5">
              <h3 className="font-semibold text-main_dark mb-4 text-base">
                Supplier Delivery Performance
              </h3>
              <div className="h-36 sm:h-45 bg-gray-50 border border-dashed border-gray-300 rounded-md"></div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h2 className="text-lg font-semibold text-main_dark tracking-tight text-center sm:text-left">
                Recent Purchase Orders
              </h2>
              <a href="#" className="text-deep_green hover:text-deep_green/80 font-medium text-sm transition-colors duration-150 text-center sm:text-right">
                View All
              </a>
            </div>
            
            <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden">
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">#PO-2024-001</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">BuildCorp Materials</p>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">$45,200</span>
                    <span className="text-gray-500">Dec 18, 2024</span>
                  </div>
                </div>
                
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">#PO-2024-002</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Approved
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Steel Solutions Inc</p>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">$78,500</span>
                    <span className="text-gray-500">Dec 17, 2024</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">#PO-2024-003</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-light_brown text-main_dark">
                      Delivered
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Concrete Masters</p>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">$32,100</span>
                    <span className="text-gray-500">Dec 16, 2024</span>
                  </div>
                </div>
              </div>

              {/* Desktop Table View */}
              <table className="w-full hidden sm:table">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 sm:px-4 py-3 text-left font-semibold text-main_dark text-xs uppercase tracking-wide">
                      Order ID
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left font-semibold text-main_dark text-xs uppercase tracking-wide">
                      Supplier
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left font-semibold text-main_dark text-xs uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left font-semibold text-main_dark text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left font-semibold text-main_dark text-xs uppercase tracking-wide">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150">
                    <td className="px-3 sm:px-4 py-4 text-sm font-medium">#PO-2024-001</td>
                    <td className="px-3 sm:px-4 py-4 text-sm">BuildCorp Materials</td>
                    <td className="px-3 sm:px-4 py-4 text-sm font-medium">$45,200</td>
                    <td className="px-3 sm:px-4 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-4 text-sm text-gray-500">Dec 18, 2024</td>
                  </tr>
                  
                  <tr className="hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150">
                    <td className="px-3 sm:px-4 py-4 text-sm font-medium">#PO-2024-002</td>
                    <td className="px-3 sm:px-4 py-4 text-sm">Steel Solutions Inc</td>
                    <td className="px-3 sm:px-4 py-4 text-sm font-medium">$78,500</td>
                    <td className="px-3 sm:px-4 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-4 text-sm text-gray-500">Dec 17, 2024</td>
                  </tr>
                  
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-3 sm:px-4 py-4 text-sm font-medium">#PO-2024-003</td>
                    <td className="px-3 sm:px-4 py-4 text-sm">Concrete Masters</td>
                    <td className="px-3 sm:px-4 py-4 text-sm font-medium">$32,100</td>
                    <td className="px-3 sm:px-4 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-light_brown text-main_dark">
                        Delivered
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-4 text-sm text-gray-500">Dec 16, 2024</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchasingDashboard;
