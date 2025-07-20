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
  FaCalendarAlt,
  FaDownload,
  // FaRefresh,
  FaArrowUp,
  FaArrowDown,
  FaMinus
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import LoadingOverlay from '../../components/LoadingOverlay';

const FinancialOfficerDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentType, setSelectedPaymentType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const [dashboardData, setDashboardData] = useState({
    pendingApprovals: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalPaymentValue: 0,
    avgApprovalTime: 0,
    monthlyVolume: 0,
    overduePayments: 0,
    highPriorityCount: 0
  });

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [purchaseOrders, searchTerm, selectedStatus, selectedPaymentType, selectedPriority]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/purchasingorder/all');
      const data = await response.json();
      
      if (data.status === 'success') {
        const orders = data.data || [];
        const ordersWithPayments = orders.filter(order => order.orderPayment);
        
        setPurchaseOrders(ordersWithPayments);
        calculateDashboardStats(ordersWithPayments);
        generateNotifications(ordersWithPayments);
        setLoading(false);
      } else {
        toast.error('Failed to fetch dashboard data');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Network error: Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDashboardStats = (orders) => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const stats = {
      pendingApprovals: orders.filter(order => order.orderPayment?.status === 'Pending').length,
      approvedToday: orders.filter(order => {
        const approvedDate = order.orderPayment?.approvedDate;
        return approvedDate && approvedDate.split('T')[0] === todayString;
      }).length,
      rejectedToday: orders.filter(order => {
        const rejectedDate = order.orderPayment?.rejectedDate;
        return rejectedDate && rejectedDate.split('T')[0] === todayString;
      }).length,
      totalPaymentValue: orders
        .filter(order => order.orderPayment?.status === 'Pending')
        .reduce((sum, order) => sum + (order.orderPayment?.amount || 0), 0),
      avgApprovalTime: 2.5, // This would be calculated from historical data
      monthlyVolume: orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === today.getMonth() && 
               orderDate.getFullYear() === today.getFullYear();
      }).length,
      overduePayments: orders.filter(order => {
        if (!order.orderPayment || order.orderPayment.status !== 'Pending') return false;
        const paymentDate = new Date(order.orderPayment.paymentDate);
        return paymentDate < today;
      }).length,
      highPriorityCount: orders.filter(order => getPriorityLevel(order) === 'high').length
    };
    
    setDashboardData(stats);
  };

  const generateNotifications = (orders) => {
    const notifications = [];
    
    // High priority pending payments
    const highPriorityPending = orders.filter(order => 
      order.orderPayment?.status === 'Pending' && getPriorityLevel(order) === 'high'
    );
    
    highPriorityPending.forEach(order => {
      notifications.push({
        id: `high-${order.poId}`,
        type: 'urgent',
        message: `High-value payment request requires immediate attention`,
        time: getTimeAgo(order.orderPayment.createdDate),
        poNumber: order.ponumber,
        amount: order.orderPayment.amount
      });
    });

    // Overdue payments
    const overduePayments = orders.filter(order => {
      if (!order.orderPayment || order.orderPayment.status !== 'Pending') return false;
      const paymentDate = new Date(order.orderPayment.paymentDate);
      return paymentDate < new Date();
    });

    overduePayments.forEach(order => {
      notifications.push({
        id: `overdue-${order.poId}`,
        type: 'warning',
        message: `Payment request is overdue`,
        time: getTimeAgo(order.orderPayment.paymentDate),
        poNumber: order.ponumber,
        amount: order.orderPayment.amount
      });
    });

    // Recently approved
    const recentlyApproved = orders.filter(order => {
      const approvedDate = order.orderPayment?.approvedDate;
      if (!approvedDate) return false;
      const timeDiff = new Date() - new Date(approvedDate);
      return timeDiff < 24 * 60 * 60 * 1000; // Last 24 hours
    });

    recentlyApproved.slice(0, 2).forEach(order => {
      notifications.push({
        id: `approved-${order.poId}`,
        type: 'info',
        message: `Payment approved and processed successfully`,
        time: getTimeAgo(order.orderPayment.approvedDate),
        poNumber: order.ponumber,
        amount: order.orderPayment.amount
      });
    });

    setNotifications(notifications.slice(0, 5)); // Limit to 5 notifications
  };

  const getPriorityLevel = (order) => {
    if (!order.orderPayment) return 'low';
    
    const amount = parseFloat(order.orderPayment.amount) || 0;
    const paymentDate = new Date(order.orderPayment.paymentDate);
    const today = new Date();
    const daysDiff = Math.floor((paymentDate - today) / (1000 * 60 * 60 * 24));
    
    if (amount > 100000 || daysDiff < 1) return 'high';
    if (amount > 50000 || daysDiff < 3) return 'medium';
    return 'low';
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const filterOrders = () => {
    let filtered = purchaseOrders.filter(order => {
      const matchesSearch = 
        order.ponumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || 
        (order.orderPayment && order.orderPayment.status.toLowerCase() === selectedStatus.toLowerCase());
      
      const matchesPaymentType = selectedPaymentType === 'all' || 
        (order.orderPayment && order.orderPayment.paymentType.toLowerCase() === selectedPaymentType.toLowerCase());
      
      const matchesPriority = selectedPriority === 'all' || 
        getPriorityLevel(order) === selectedPriority;
      
      return matchesSearch && matchesStatus && matchesPaymentType && matchesPriority;
    });

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[getPriorityLevel(a)];
      const bPriority = priorityOrder[getPriorityLevel(b)];
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      return new Date(b.orderPayment.createdDate) - new Date(a.orderPayment.createdDate);
    });

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-web_yellow/20 text-main_dark border-web_yellow/40';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleQuickApprove = async (order) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/purchaseorder/payment/${order.orderPayment.paymentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Approved',
            approvedBy: 'Financial Officer',
            approvedDate: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        toast.success(`Payment approved for ${order.ponumber}`);
        fetchDashboardData(); // Refresh data
      } else {
        throw new Error('Failed to approve payment');
      }
    } catch (error) {
      toast.error('Failed to approve payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReject = async (order) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/purchaseorder/payment/${order.orderPayment.paymentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Rejected',
            rejectedBy: 'Financial Officer',
            rejectedDate: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        toast.success(`Payment rejected for ${order.ponumber}`);
        fetchDashboardData(); // Refresh data
      } else {
        throw new Error('Failed to reject payment');
      }
    } catch (error) {
      toast.error('Failed to reject payment');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getChangeIndicator = (current, previous) => {
    if (current > previous) return <FaArrowUp className="w-3 h-3 text-green-600" />;
    if (current < previous) return <FaArrowDown className="w-3 h-3 text-red-600" />;
    return <FaMinus className="w-3 h-3 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {isLoading && <LoadingOverlay />}
      
      <NavBar
        links={[
          { name: 'Dashboard', path: '/financial/dashboard' },
          { name: 'Payment Approvals', path: '/financial/payment-list' },
          { name: 'Purchase Orders', path: '/financial/purchase-order-list' },
          { name: 'Projects', path: '/financial/financial-projects' },
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Financial Officer Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage payment approvals and monitor financial transactions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:text-main_dark transition-colors">
                <FaBell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <button 
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors flex items-center gap-2"
              >
                {/* <FaRefresh className="w-4 h-4" /> */}
                Refresh
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-main_dark">{dashboardData.pendingApprovals}</p>
                </div>
                <div className="p-3 bg-web_yellow/20 rounded-lg">
                  <FaClock className="w-6 h-6 text-main_dark" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {getChangeIndicator(dashboardData.pendingApprovals, 9)}
                <span className="text-sm text-gray-600">
                  {dashboardData.highPriorityCount} high priority
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-main_dark">{dashboardData.approvedToday}</p>
                </div>
                <div className="p-3 bg-deep_green/20 rounded-lg">
                  <FaCheck className="w-6 h-6 text-deep_green" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {getChangeIndicator(dashboardData.approvedToday, 6)}
                <span className="text-sm text-deep_green">
                  +{dashboardData.approvedToday - 6} from yesterday
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Payment Value</p>
                  <p className="text-2xl font-bold text-main_dark">
                    {formatCurrency(dashboardData.totalPaymentValue).replace('$', '$')}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaDollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-blue-600">Pending approval</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Payments</p>
                  <p className="text-2xl font-bold text-main_dark">{dashboardData.overduePayments}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-red-600">Requires attention</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Payment Requests */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                    <h2 className="text-lg font-semibold text-main_dark">Payment Requests</h2>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search PO number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Bar */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <select
                      value={selectedPaymentType}
                      onChange={(e) => setSelectedPaymentType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    >
                      <option value="all">All Types</option>
                      <option value="advance">Advance</option>
                      <option value="full">Full Payment</option>
                      <option value="partial">Partial</option>
                    </select>

                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-web_yellow"
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Payment Requests Table - Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-light_brown/30">
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
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.slice(0, 10).map((order) => {
                        const priority = getPriorityLevel(order);
                        return (
                          <tr key={order.poId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-main_dark font-mono">{order.ponumber}</div>
                              <div className="text-sm text-gray-500">{formatDate(order.orderDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-main_dark font-medium">{order.supplier.name}</div>
                              <div className="text-sm text-gray-500">{order.supplier.company_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-main_dark">
                                {formatCurrency(order.orderPayment.amount)}
                              </div>
                              <div className="text-sm text-gray-500">
                                of {formatCurrency(order.subTotal)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                                order.orderPayment.paymentType === 'advance' 
                                  ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                  : order.orderPayment.paymentType === 'full'
                                  ? 'bg-deep_green/20 text-deep_green border-deep_green/40'
                                  : 'bg-web_yellow/20 text-main_dark border-web_yellow/40'
                              }`}>
                                {order.orderPayment.paymentType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.orderPayment.status)}`}>
                                {order.orderPayment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(priority)}`}>
                                {priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/financial/advance-payment-approval/${order.ponumber}`, { state: { orderData: order } })}
                                  className="text-deep_green hover:text-deep_green/80 transition-colors"
                                  title="View Details"
                                >
                                  <FaEye className="w-4 h-4" />
                                </button>
                                {order.orderPayment.status === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => handleQuickApprove(order)}
                                      className="text-green-600 hover:text-green-800 transition-colors"
                                      title="Quick Approve"
                                    >
                                      <FaCheck className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleQuickReject(order)}
                                      className="text-red-600 hover:text-red-800 transition-colors"
                                      title="Quick Reject"
                                    >
                                      <FaTimes className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden divide-y divide-gray-200">
                  {filteredOrders.slice(0, 10).map((order) => {
                    const priority = getPriorityLevel(order);
                    return (
                      <div key={order.poId} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
                                {priority}
                              </span>
                              <h3 className="font-semibold text-main_dark text-sm font-mono">{order.ponumber}</h3>
                            </div>
                            <p className="text-sm text-gray-900 font-medium">{order.supplier.name}</p>
                            <p className="text-xs text-gray-600">{order.supplier.company_name}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderPayment.status)}`}>
                            {order.orderPayment.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <div className="font-semibold text-main_dark">
                              {formatCurrency(order.orderPayment.amount)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <div className="font-semibold">
                              {order.orderPayment.paymentType}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-600">
                            {formatDate(order.orderDate)}
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => navigate(`/financial/advance-payment-approval/${order.ponumber}`, { state: { orderData: order } })}
                              className="text-deep_green hover:text-deep_green/80 transition-colors"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            {order.orderPayment.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleQuickApprove(order)}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                >
                                  <FaCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleQuickReject(order)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <FaTimes className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show More Button */}
                {filteredOrders.length > 10 && (
                  <div className="p-4 text-center border-t border-gray-200">
                    <button 
                      onClick={() => navigate('/financial/payment-approvals')}
                      className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors"
                    >
                      View All {filteredOrders.length} Requests
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Notifications & Quick Actions */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Recent Notifications</h3>
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'urgent' 
                            ? 'bg-red-100' 
                            : notification.type === 'warning' 
                            ? 'bg-web_yellow/20' 
                            : 'bg-blue-100'
                        }`}>
                          <FaExclamationTriangle className={`w-4 h-4 ${
                            notification.type === 'urgent' 
                              ? 'text-red-600' 
                              : notification.type === 'warning' 
                              ? 'text-main_dark' 
                              : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-main_dark">{notification.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{notification.time}</span>
                            <span className="text-xs text-deep_green font-mono">{notification.poNumber}</span>
                          </div>
                          {notification.amount && (
                            <div className="text-xs text-gray-600 mt-1">
                              Amount: {formatCurrency(notification.amount)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No recent notifications</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/financial/payment-approvals')}
                    className="w-full px-4 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors flex items-center gap-2"
                  >
                    <FaFileInvoice className="w-4 h-4" />
                    View All Payments
                  </button>
                  <button 
                    onClick={() => navigate('/financial/reports')}
                    className="w-full px-4 py-3 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center gap-2"
                  >
                    <FaChartLine className="w-4 h-4" />
                    Generate Report
                  </button>
                  <button 
                    onClick={() => navigate('/financial/purchase-orders')}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <FaBuilding className="w-4 h-4" />
                    View Purchase Orders
                  </button>
                </div>
              </div>

              {/* Payment Statistics */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-main_dark mb-4">Payment Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-semibold text-main_dark">{dashboardData.monthlyVolume} payments</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approval Rate</span>
                    <span className="font-semibold text-deep_green">
                      {dashboardData.monthlyVolume > 0 
                        ? Math.round(((dashboardData.monthlyVolume - dashboardData.rejectedToday) / dashboardData.monthlyVolume) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Amount</span>
                    <span className="font-semibold text-main_dark">
                      {dashboardData.monthlyVolume > 0 
                        ? formatCurrency(dashboardData.totalPaymentValue / dashboardData.monthlyVolume)
                        : '$0'}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Processing Time</span>
                      <span className="text-sm font-semibold">
                        {dashboardData.avgApprovalTime}h avg
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-deep_green h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(85, (24 - dashboardData.avgApprovalTime) / 24 * 100)}%` }}
                      ></div>
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
