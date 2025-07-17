// FinancialOfficerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaClock,
  FaDollarSign,
  FaFileInvoice,
  FaChartLine,
  FaExclamationTriangle,
  FaUsers,
  FaBuilding,
//   FaRefresh
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';

const FinancialOfficerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    pendingApprovals: 12,
    approvedToday: 8,
    rejectedToday: 2,
    overdueRequests: 3,
    totalPaymentValue: 245000,
    avgApprovalTime: 2.5,
    monthlyVolume: 156
  });

  const [recentPOs, setRecentPOs] = useState([
    {
      id: 'PO-2025-001',
      supplier: 'ABC Manufacturing Co.',
      orderDate: '2025-07-14',
      totalAmount: 50000,
      paymentStatus: 'pending',
      paymentType: 'advance',
      approvalStatus: 'pending',
      priority: 'high',
      requestedAmount: 15000
    },
    {
      id: 'PO-2025-002',
      supplier: 'XYZ Industrial Supply',
      orderDate: '2025-07-13',
      totalAmount: 75000,
      paymentStatus: 'approved',
      paymentType: 'full',
      approvalStatus: 'approved',
      priority: 'medium',
      requestedAmount: 75000
    },
    {
      id: 'PO-2025-003',
      supplier: 'BuildTech Materials',
      orderDate: '2025-07-12',
      totalAmount: 30000,
      paymentStatus: 'processing',
      paymentType: 'advance',
      approvalStatus: 'approved',
      priority: 'low',
      requestedAmount: 9000
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      message: 'High-value payment request requires immediate attention',
      time: '5 min ago',
      poNumber: 'PO-2025-001'
    },
    {
      id: 2,
      type: 'info',
      message: 'Payment approved and processed successfully',
      time: '1 hour ago',
      poNumber: 'PO-2025-002'
    },
    {
      id: 3,
      type: 'warning',
      message: 'Payment request approaching deadline',
      time: '2 hours ago',
      poNumber: 'PO-2025-004'
    }
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    paymentType: 'all',
    priority: 'all',
    dateRange: 'today'
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = async (poId) => {
    try {
      // API call would go here
      toast.success(`Payment approved for ${poId}`);
      // Update local state
      setRecentPOs(prev => 
        prev.map(po => 
          po.id === poId 
            ? { ...po, approvalStatus: 'approved', paymentStatus: 'processing' }
            : po
        )
      );
    } catch (error) {
      toast.error('Failed to approve payment');
    }
  };

  const handleReject = async (poId) => {
    try {
      // API call would go here
      toast.success(`Payment rejected for ${poId}`);
      // Update local state
      setRecentPOs(prev => 
        prev.map(po => 
          po.id === poId 
            ? { ...po, approvalStatus: 'rejected', paymentStatus: 'rejected' }
            : po
        )
      );
    } catch (error) {
      toast.error('Failed to reject payment');
    }
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
        links={[
          { name: 'Dashboard', path: '/finance/dashboard' },
          { name: 'Payment Approvals', path: '/finance/approvals' },
          { name: 'Reports', path: '/finance/reports' },
          { name: 'Settings', path: '/finance/settings' },
        ]}
      />

      <main className="py-6">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-main_dark">Financial Officer Dashboard</h1>
              <p className="text-gray-600 text-sm">
                Manage payment approvals and monitor financial transactions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:text-main_dark">
                <FaBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              <button className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors flex items-center gap-2">
                {/* <FaRefresh className="w-4 h-4" /> */}
                Refresh
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-main_dark">{dashboardData.pendingApprovals}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FaClock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-yellow-600">+3 from yesterday</span>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-main_dark">{dashboardData.approvedToday}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">+2 from yesterday</span>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Payment Value</p>
                  <p className="text-2xl font-bold text-main_dark">${dashboardData.totalPaymentValue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaDollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-blue-600">Pending approval</span>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Approval Time</p>
                  <p className="text-2xl font-bold text-main_dark">{dashboardData.avgApprovalTime}h</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaChartLine className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-purple-600">-0.5h from last week</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Payment Requests */}
            <div className="lg:col-span-2">
              <div className="bg-purewhite border border-gray-200 rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-main_dark">Payment Requests</h2>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search PO number..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        />
                      </div>
                      <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <FaFilter className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Filter Bar */}
                  <div className="flex items-center gap-4 mb-4">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <select
                      value={filters.paymentType}
                      onChange={(e) => setFilters(prev => ({ ...prev, paymentType: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    >
                      <option value="all">All Types</option>
                      <option value="advance">Advance Payment</option>
                      <option value="full">Full Payment</option>
                    </select>

                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Payment Requests Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PO Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supplier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-purewhite divide-y divide-gray-200">
                      {recentPOs.map((po) => (
                        <tr key={po.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-main_dark">{po.id}</div>
                            <div className="text-sm text-gray-500">{po.orderDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-main_dark">{po.supplier}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-main_dark">
                              ${po.requestedAmount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              of ${po.totalAmount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              po.paymentType === 'advance' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {po.paymentType === 'advance' ? 'Advance' : 'Full Payment'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(po.approvalStatus)}`}>
                              {po.approvalStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(po.priority)}`}>
                              {po.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/finance/payment-details/${po.id}`)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaEye className="w-4 h-4" />
                              </button>
                              {po.approvalStatus === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(po.id)}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <FaCheck className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(po.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FaTimes className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Notifications & Quick Actions */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Recent Notifications</h3>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'urgent' 
                          ? 'bg-red-100' 
                          : notification.type === 'warning' 
                          ? 'bg-yellow-100' 
                          : 'bg-blue-100'
                      }`}>
                        <FaExclamationTriangle className={`w-4 h-4 ${
                          notification.type === 'urgent' 
                            ? 'text-red-600' 
                            : notification.type === 'warning' 
                            ? 'text-yellow-600' 
                            : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-main_dark">{notification.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <span className="text-xs text-blue-600">{notification.poNumber}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors flex items-center gap-2">
                    <FaFileInvoice className="w-4 h-4" />
                    Bulk Approve Payments
                  </button>
                  <button className="w-full px-4 py-3 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center gap-2">
                    <FaChartLine className="w-4 h-4" />
                    Generate Report
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <FaUsers className="w-4 h-4" />
                    View All Suppliers
                  </button>
                </div>
              </div>

              {/* Payment Statistics */}
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Payment Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-semibold text-main_dark">{dashboardData.monthlyVolume} payments</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approval Rate</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Amount</span>
                    <span className="font-semibold text-main_dark">$15,750</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Processing Time</span>
                      <span className="text-sm font-semibold">85% on time</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialOfficerDashboard;
