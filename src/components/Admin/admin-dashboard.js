import React from 'react';
import { Bell, ShoppingCart, Package, Users, Crown, Eye, Edit } from 'lucide-react';


export default function ConstructionDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-[#236571] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#EFC11A] rounded-full flex items-center justify-center">
                <span className="text-[#236571] font-bold text-sm">C</span>
              </div>
              <span className="font-semibold">CONSTRUCTFLOW</span>
            </div>
            <nav className="flex space-x-6">
              <span className="text-[#EFC11A] border-b-2 border-[#EFC11A] pb-2">Dashboard</span>
              <span className="hover:text-[#EFC11A] cursor-pointer">Supply Chain</span>
              <span className="hover:text-[#EFC11A] cursor-pointer">Inventory</span>
              <span className="hover:text-[#EFC11A] cursor-pointer">Insights</span>
              <span className="hover:text-[#EFC11A] cursor-pointer">Users</span>
              <span className="hover:text-[#EFC11A] cursor-pointer">Settings</span>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 cursor-pointer" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span>John Supplier</span>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="p-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome back, John Doe</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-[#EFC11A] text-[#236571] px-2 py-1 rounded-full text-sm font-bold">5</div>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div>
              <div className="text-sm font-semibold">Kasun Zoysa</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">$2.4M</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <div className="text-[#EFC11A] text-2xl">$</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-gray-800">847</p>
                <p className="text-sm text-green-600">+8.2% from last week</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-[#236571]" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inventory Items</p>
                <p className="text-2xl font-bold text-gray-800">12,543</p>
                <p className="text-sm text-red-600">-2.1% from last month</p>
              </div>
              <Package className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-800">1,284</p>
                <p className="text-sm text-green-600">+5.7% from last month</p>
              </div>
              <Crown className="w-8 h-8 text-[#EFC11A]" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="mb-2">
              <p className="text-sm text-gray-600">Global Construction Software Market Revenue</p>
              <p className="text-xs text-gray-500">Market Revenue in USD million</p>
            </div>
            <div className="h-64 bg-gray-50 rounded flex items-end justify-center space-x-1 p-4">
              {[1.6, 1.8, 2.1, 2.3, 2.6, 2.8, 3.1, 3.4, 3.7, 4.0, 4.3, 4.7].map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-[#236571] rounded-t"
                    style={{ height: `${value * 40}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{2022 + index}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Inventory turnover success metrics</p>
                <div className="bg-[#236571] text-white p-3 rounded">
                  <p className="text-xs text-center mb-2">Inventory Turnover</p>
                  <div className="text-center">
                    <p className="text-2xl font-bold">6.6</p>
                    <p className="text-xs">This Year</p>
                  </div>
                </div>
                <div className="bg-blue-100 p-2 rounded mt-2">
                  <p className="text-xs text-center text-blue-800">INVENTORY TURNOVER (2019-2023)</p>
                  <div className="flex justify-center items-end space-x-1 mt-2">
                    {[5.2, 5.8, 6.1, 6.6, 6.4].map((value, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-4 bg-blue-500 rounded-t"
                          style={{ height: `${value * 5}px` }}
                        ></div>
                        <span className="text-xs">{2019 + index}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-[#236571] text-white p-3 rounded">
                  <p className="text-xs text-center mb-2">Reasons for Return</p>
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="w-full h-full rounded-full border-8 border-blue-400 relative">
                      <div className="absolute inset-0 rounded-full border-8 border-[#EFC11A]" style={{
                        clipPath: 'polygon(50% 50%, 50% 0%, 85% 15%, 50% 50%)'
                      }}></div>
                    </div>
                  </div>
                  <div className="text-xs mt-2 space-y-1">
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

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <button className="bg-[#EFC11A] text-[#236571] px-4 py-2 rounded font-semibold hover:bg-yellow-400">
                View All Orders
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#ORD-001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">BuildCorp Inc.</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Steel Beams</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$45,200</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#236571]" />
                      <Edit className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#236571]" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#ORD-002</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Metro Construction</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Concrete Blocks</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$28,750</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Processing
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#236571]" />
                      <Edit className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#236571]" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#ORD-003</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Urban Developers</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Roofing Materials</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$15,300</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Shipped
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#236571]" />
                      <Edit className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#236571]" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}