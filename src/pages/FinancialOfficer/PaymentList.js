import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaDownload,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaFileInvoiceDollar,
  FaBuilding,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import LoadingOverlay from '../../components/LoadingOverlay';

const PaymentList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All Payment Status');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedAmountRange, setSelectedAmountRange] = useState('All Amounts');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [purchaseOrders, searchTerm, selectedPaymentStatus, selectedSupplier, selectedAmountRange]);

  const fetchPurchaseOrders = async () => {
    // setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/purchasingorder/all');
      const data = await response.json();
      
      if (data.status === 'success') {
        setLoading(false);
        // Filter only orders that have payment information
        const ordersWithPayments = data.data.filter(order => order.orderPayment);
        setPurchaseOrders(ordersWithPayments || []);
      } else {
        setLoading(false);
        toast.error('Failed to fetch purchase orders');
      }
    } catch (error) {
      toast.error('Network error: Failed to fetch purchase orders');
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };
//   console.log(purchaseOrders);
  
  const filterOrders = () => {
    let filtered = purchaseOrders.filter(order => {
      const matchesSearch = 
        order.ponumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.orderPayment.referenceNumber && order.orderPayment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPaymentStatus = selectedPaymentStatus === 'All Payment Status' || 
        (order.orderPayment && order.orderPayment.status === selectedPaymentStatus);
      
      const matchesSupplier = selectedSupplier === 'All Suppliers' || order.supplier.name === selectedSupplier;
      
      const matchesAmountRange = selectedAmountRange === 'All Amounts' || 
        checkAmountRange(order.orderPayment.amount, selectedAmountRange);
      
      return matchesSearch && matchesPaymentStatus && matchesSupplier && matchesAmountRange;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'amount') {
        aValue = parseFloat(a.orderPayment.amount) || 0;
        bValue = parseFloat(b.orderPayment.amount) || 0;
      } else if (sortBy === 'orderDate' || sortBy === 'paymentDate') {
        aValue = new Date(sortBy === 'orderDate' ? aValue : a.orderPayment.paymentDate);
        bValue = new Date(sortBy === 'orderDate' ? bValue : b.orderPayment.paymentDate);
      } else if (sortBy === 'supplier') {
        aValue = a.supplier.name;
        bValue = b.supplier.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const checkAmountRange = (amount, range) => {
    const amt = parseFloat(amount) || 0;
    switch (range) {
      case 'Under RS 10K': return amt < 10000;
      case 'RS 10K - RS 50K': return amt >= 10000 && amt < 50000;
      case 'RS 50K - RS 100K': return amt >= 50000 && amt < 100000;
      case 'Over RS 100K': return amt >= 100000;
      default: return true;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'advance': return <FaCreditCard className="w-4 h-4 text-blue-500" />;
      case 'partial': return <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />;
      case 'full': return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      default: return <FaDollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityLevel = (order) => {
    const amount = parseFloat(order.orderPayment.amount) || 0;
    const paymentDate = new Date(order.orderPayment.paymentDate);
    const today = new Date();
    const daysDiff = Math.floor((paymentDate - today) / (1000 * 60 * 60 * 24));
    
    if (amount > 100000 || daysDiff < 3) return 'high';
    if (amount > 50000 || daysDiff < 7) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  const getPaymentProgress = (orderPayment) => {
    if (!orderPayment || !orderPayment.amount) return 0;
    return ((orderPayment.paidAmount || 0) / orderPayment.amount) * 100;
  };

  const handleViewPayment = (order) => {
    navigate(`/financial/advance-payment-approval/${order.ponumber}`);
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const paymentStatuses = ['All Payment Status', 'Pending', 'Approved', 'Rejected', 'Processing'];
  const amountRanges = ['All Amounts', 'Under RS 10K', 'RS 10K - RS 50K', 'RS 50K - RS 100K', 'Over RS 100K'];

  // Get unique suppliers for filter
  const suppliers = ['All Suppliers', ...new Set(purchaseOrders.map(order => order.supplier.name))];

  // Calculate stats
  const stats = {
    total: purchaseOrders.length,
    pending: purchaseOrders.filter(order => order.orderPayment.status === 'Pending').length,
    approved: purchaseOrders.filter(order => order.orderPayment.status === 'Approved').length,
    totalValue: purchaseOrders.reduce((sum, order) => sum + (order.orderPayment.amount || 0), 0),
    highPriority: purchaseOrders.filter(order => getPriorityLevel(order) === 'high').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {isLoading && <LoadingOverlay />}
      
      <NavBar
      profileURL="/financial/profile"
        links={[
          { name: 'Dashboard', path: '/financial/dashboard' },
          { name: 'Payment Approvals', path: '/financial/payment-list' },
          { name: 'Purchase Orders', path: '/financial/purchase-order-list' },
          { name: 'Projects', path: '/financial/financial-projects' },
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Payment Approvals
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Review and approve purchase order payments
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors text-sm font-medium flex items-center gap-2">
                <FaDownload className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-main_dark">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Payments</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats.totalValue).replace('$', 'RS ')}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Payments</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by PO number, supplier, or payment ref..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Payment Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="w-full lg:w-44 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {paymentStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Supplier Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {suppliers.map(supplier => (
                    <option key={supplier} value={supplier}>{supplier}</option>
                  ))}
                </select>
              </div>

              {/* Amount Range Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                <select
                  value={selectedAmountRange}
                  onChange={(e) => setSelectedAmountRange(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {amountRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} payments
            </p>
          </div>

          {/* Payments Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      PO Number
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('supplier')}
                    >
                      <div className="flex items-center gap-2">
                        <FaBuilding className="w-4 h-4" />
                        Supplier
                        {sortBy === 'supplier' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Payment Details
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="w-4 h-4" />
                        Amount
                        {sortBy === 'amount' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      Payment Status
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('paymentDate')}
                    >
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4" />
                        Payment Date
                        {sortBy === 'paymentDate' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedOrders.map((order) => {
                    const priority = getPriorityLevel(order);
                    return (
                      <tr key={order.poId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-main_dark font-mono">
                          {order.ponumber}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-main_dark text-sm">{order.supplier.name}</div>
                            <div className="text-xs text-gray-500">{order.supplier.company_name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              {getPaymentTypeIcon(order.orderPayment.paymentType)}
                              <span className="font-medium">{order.orderPayment.paymentType}</span>
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {order.orderPayment.referenceNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.orderPayment.bankDetails}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-main_dark">
                              {formatCurrency(order.orderPayment.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Paid: {formatCurrency(order.orderPayment.paidAmount || 0)}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-green-500 h-1 rounded-full" 
                                style={{ width: `${getPaymentProgress(order.orderPayment)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.orderPayment.status)}`}>
                            {order.orderPayment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(order.orderPayment.paymentDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewPayment(order)}
                              className="text-deep_green hover:text-deep_green/80 transition-colors"
                              title="Review Payment"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-800 transition-colors"
                              title="Download Documents"
                            >
                              <FaDownload className="w-4 h-4" />
                            </button>
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
              {paginatedOrders.map((order) => {
                const priority = getPriorityLevel(order);
                return (
                  <div key={order.poId} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </span>
                          <h3 className="font-semibold text-main_dark text-sm font-mono">{order.ponumber}</h3>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{order.supplier.name}</p>
                        <p className="text-xs text-gray-600">{order.supplier.company_name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.orderPayment.status)}`}>
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
                        <span className="text-gray-500">Payment Date:</span>
                        <div className="font-semibold">
                          {formatDate(order.orderPayment.paymentDate)}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        {getPaymentTypeIcon(order.orderPayment.paymentType)}
                        <span className="font-medium">{order.orderPayment.paymentType}</span>
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {order.orderPayment.referenceNumber}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Payment Progress</span>
                        <span>{formatCurrency(order.orderPayment.paidAmount || 0)} / {formatCurrency(order.orderPayment.amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${getPaymentProgress(order.orderPayment)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-600">
                        {order.orderPayment.bankDetails}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewPayment(order)}
                          className="text-deep_green hover:text-deep_green/80 transition-colors"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                          <FaDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 text-sm rounded font-medium transition-colors ${
                    currentPage === index + 1
                      ? 'bg-web_yellow text-main_dark'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentList;
