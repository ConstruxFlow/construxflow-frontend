import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaFileAlt,
  FaBuilding,
  FaDollarSign,
  FaTruck,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBox
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';

const SiteManagerOrdersOverview = () => {
  const [loading, setLoading] = useState(true);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('All Delivery Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [projectId, setProjectId] = useState('PROJ-9C2264A5'); // This should come from user context or URL
  const itemsPerPage = 10;

  const navigate = useNavigate();
//   setProjectId('PROJ-FCEDA5D9'); // Temporary hardcoded project ID for testing

  useEffect(() => {
    fetchProjectOrders();
  }, [projectId]);

  useEffect(() => {
    filterOrders();
  }, [purchaseOrders, searchTerm, selectedStatus, selectedSupplier, selectedDeliveryStatus]);

  const fetchProjectOrders = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/purchasingorder/project/${projectId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setPurchaseOrders(data.data || []);
        console.log("orders", data.data);
      } else {
        toast.error('Failed to fetch project orders');
      }
    } catch (error) {
      toast.error('Network error: Failed to fetch project orders');
      console.error('Error fetching project orders:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const filterOrders = () => {
    let filtered = purchaseOrders.filter(order => {
      const matchesSearch = 
        order.ponumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All Status' || order.status === selectedStatus;
      const matchesSupplier = selectedSupplier === 'All Suppliers' || order.supplier.name === selectedSupplier;
      const matchesDeliveryStatus = selectedDeliveryStatus === 'All Delivery Status' || 
        getDeliveryStatus(order) === selectedDeliveryStatus;
      
      return matchesSearch && matchesStatus && matchesSupplier && matchesDeliveryStatus;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'subTotal') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'orderDate' || sortBy === 'createdDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'supplier') {
        aValue = a.supplier.name;
        bValue = b.supplier.name;
      } else if (sortBy === 'deliveryDate') {
        aValue = new Date(a.deliveries?.[0]?.requiredDate || 0);
        bValue = new Date(b.deliveries?.[0]?.requiredDate || 0);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'dispatch': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatus = (order) => {
    if (!order.deliveries || order.deliveries.length === 0) return 'No Delivery';
    
    if (order.status?.toLowerCase() === 'delivered') return 'Delivered';
    if (order.status?.toLowerCase() === 'shipped') return 'In Transit';
    
    const deliveryDate = new Date(order.deliveries[0]?.requiredDate);
    const today = new Date();
    
    if (deliveryDate < today) return 'Overdue';
    return 'Scheduled';
  };

  const getDeliveryStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isDeliveryOverdue = (requiredDate) => {
    if (!requiredDate) return false;
    return new Date(requiredDate) < new Date();
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

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const statuses = ['All Status', 'Approved', 'Shipped', 'Delivered', 'Pending'];
  const deliveryStatuses = ['All Delivery Status', 'Scheduled', 'In Transit', 'Delivered', 'Overdue'];
  const suppliers = ['All Suppliers', ...new Set(purchaseOrders.map(order => order.supplier.name))];

  const navLinks = [
  { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
                     { name: "Materials", href: "/site-manager/materials" },
          { name: "Inventory", href: "/site-manager/site-inventory" },
          // { name: "Purchase Orders", href: "/site-manager" },
];

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar links={navLinks} showButton={true} logoSrc="/logo1.png" profileURL="profile" />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Project Orders Overview
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Project ID: {projectId} • Manage deliveries and materials for your project
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{purchaseOrders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {purchaseOrders.filter(order => order.status === 'Approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {purchaseOrders.filter(order => order.status === 'Dispatch').length}
              </div>
              <div className="text-sm text-gray-600">In Transit</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {purchaseOrders.filter(order => order.status === 'Delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">
                {purchaseOrders.filter(order => getDeliveryStatus(order) === 'Overdue').length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by PO number or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Delivery Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                <select
                  value={selectedDeliveryStatus}
                  onChange={(e) => setSelectedDeliveryStatus(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {deliveryStatuses.map(status => (
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
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
          </div>

          {/* Orders Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
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
                      <div className="flex items-center gap-2">
                        <FaBox className="w-4 h-4" />
                        Materials
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('deliveryDate')}
                    >
                      <div className="flex items-center gap-2">
                        <FaTruck className="w-4 h-4" />
                        Delivery
                        {sortBy === 'deliveryDate' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Order Status</th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('subTotal')}
                    >
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="w-4 h-4" />
                        Amount
                        {sortBy === 'subTotal' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedOrders.map((order) => (
                    <tr key={order.poId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-main_dark">
                        {order.ponumber}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-main_dark text-sm">{order.supplier.name}</div>
                          <div className="text-xs text-gray-500">{order.supplier.company_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.materials && order.materials.length > 0 ? (
                          <div className="space-y-1">
                            {order.materials.slice(0, 2).map((material, index) => (
                              <div key={index} className="text-xs">
                                {material.material.materialName} ({material.quantity} {material.material.unitOfMeasurement})
                              </div>
                            ))}
                            {order.materials.length > 2 && (
                              <div className="text-xs text-gray-400">
                                +{order.materials.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No materials</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.deliveries && order.deliveries.length > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                              <span className="text-xs">{order.deliveries[0].location.substring(0, 20)}...</span>
                            </div>
                            <div className={`flex items-center gap-1 text-xs ${
                              isDeliveryOverdue(order.deliveries[0].requiredDate) ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              <FaCalendarAlt className="w-3 h-3" />
                              {formatDate(order.deliveries[0].requiredDate)}
                              {isDeliveryOverdue(order.deliveries[0].requiredDate) && (
                                <FaExclamationTriangle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No delivery info</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-main_dark">
                        RS {order.subTotal ? order.subTotal.toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/site-manager/order-details/${order.ponumber}`)} 
                            className="text-deep_green hover:text-deep_green/80 transition-colors"
                            title="View Details"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <div key={order.poId} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-main_dark text-sm">{order.ponumber}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{order.supplier.company_name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaBuilding className="w-3 h-3" />
                        {order.supplier.name}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(getDeliveryStatus(order))}`}>
                        {getDeliveryStatus(order)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <div className="font-semibold">
                        RS {order.subTotal ? order.subTotal.toLocaleString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Materials:</span>
                      <div className="font-semibold">{order.materials?.length || 0} items</div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {order.deliveries && order.deliveries.length > 0 && (
                    <div className="mb-3 p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500 mb-1">Delivery:</div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                        <span>{order.deliveries[0].location.substring(0, 30)}...</span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs mt-1 ${
                        isDeliveryOverdue(order.deliveries[0].requiredDate) ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <FaCalendarAlt className="w-3 h-3" />
                        {formatDate(order.deliveries[0].requiredDate)}
                        {isDeliveryOverdue(order.deliveries[0].requiredDate) && (
                          <span className="ml-1 px-1 bg-red-100 text-red-800 rounded text-xs">Overdue</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-600">
                      Project: {order.projectId}
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => navigate(`/sitemanager/orders/details/${order.ponumber}`)} 
                        className="text-deep_green hover:text-deep_green/80 transition-colors"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

export default SiteManagerOrdersOverview;
