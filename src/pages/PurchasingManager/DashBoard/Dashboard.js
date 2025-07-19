import React, { useState, useEffect, useContext } from 'react';
import NavBar from '../../../components/NavBar';
import { MdOutlinePendingActions } from "react-icons/md";
import { LiaNotesMedicalSolid } from "react-icons/lia";
import { GrDeliver } from "react-icons/gr";
import { IoMdCheckmark } from "react-icons/io";
import { FaUser, FaEye, FaCalendarAlt, FaBuilding, FaDollarSign } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import { IoSearch } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../Context/AuthContext';
import { Space } from 'lucide-react';

const PurchasingDashboard = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/purchasingorder/all');
      const data = await response.json();
      
      if (data.status === 'success') {
        setPurchaseOrders(data.data || []);
      } else {
        toast.error('Failed to fetch purchase orders');
      }
    } catch (error) {
      toast.error('Network error: Failed to fetch purchase orders');
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-light_brown text-main_dark';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentProgress = (orderPayment) => {
    if (!orderPayment || !orderPayment.amount) return 0;
    return ((orderPayment.paidAmount || 0) / orderPayment.amount) * 100;
  };

  // Get the 3 most recent purchase orders based on createdDate
  const getRecentOrders = () => {
    return purchaseOrders
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
      .slice(0, 3);
  };

  const recentOrders = getRecentOrders();

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar 
      profileURL="/purchasing/profile"
      links={[
        { name: 'Dashboard', path: '/purchasing/dashboard' },
        { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
        { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
        { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
        { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
      ]} />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-main_dark mb-1 tracking-tight">
              Purchasing Dashboard
            </h1>
            {
              authState?.user && (
                <p className="text-slatebluegray text-base">
                  Welcome back, <span className='font-semibold'>{authState.user.userName || 'User'}</span>. Here's your procurement overview.
                </p>
              )
            }
          </div>

          {/* Urgent Actions Alert */}
          <div className="bg-gradient-to-r from-web_yellow/15 via-web_yellow/8 to-transparent border-l-4 border-web_yellow rounded-lg p-4 mb-5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-full flex items-center justify-center text-main_dark text-lg font-bold shadow-lg animate-pulse">
                ⚠
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-main_dark mb-2">
                  Urgent Actions Required
                </h3>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-2 bg-purewhite px-3 py-1.5 rounded-full shadow-md border border-web_yellow/20">
                    <div className="w-3 h-3 bg-gradient-to-r from-web_yellow to-web_yellow/70 rounded-full animate-pulse"></div>
                    <span className="text-main_dark font-medium">3 delayed deliveries</span>
                  </span>
                  <span className="flex items-center gap-2 bg-purewhite px-3 py-1.5 rounded-full shadow-md border border-deep_green/20">
                    <div className="w-3 h-3 bg-gradient-to-r from-deep_green to-deep_green/70 rounded-full animate-pulse"></div>
                    <span className="text-main_dark font-medium">2 low stock alerts</span>
                  </span>
                  <span className="flex items-center gap-2 bg-purewhite px-3 py-1.5 rounded-full shadow-md border border-light_brown/30">
                    <div className="w-3 h-3 bg-gradient-to-r from-light_brown to-light_brown/70 rounded-full animate-pulse"></div>
                    <span className="text-main_dark font-medium">1 pending approval</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Pending Requests</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {purchaseOrders.filter(order => order.status === 'Pending').length}
                </h3>
                <span className="text-deep_green text-xs">+3 from yesterday</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <MdOutlinePendingActions className="text-purewhite text-lg"/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Approved Today</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">
                  {purchaseOrders.filter(order => order.status === 'Approved').length}
                </h3>
                <span className="text-deep_green text-xs">87% approval rate</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <IoMdCheckmark className="text-purewhite text-lg"/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Open Quotations</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">12</h3>
                <span className="text-deep_green text-xs">5 expiring soon</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <LiaNotesMedicalSolid className="text-purewhite text-lg"/>
              </div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-slatebluegray font-medium text-sm mb-0.5 truncate">Active Suppliers</p>
                <h3 className="text-xl sm:text-2xl font-bold text-main_dark leading-tight mb-0.5">156</h3>
                <span className="text-deep_green text-xs">92% performance avg</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-web_yellow via-web_yellow to-web_yellow/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <GrDeliver className="text-purewhite text-lg"/>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-main_dark mb-4 tracking-tight text-center lg:text-left">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div onClick={() => navigate('/purchasing/supplier/register')} className="bg-purewhite border-2 hover:border-web_yellow rounded-lg p-4 sm:p-5 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
                <div className="text-xl flex justify-center text-deep_green sm:text-2xl mb-2"><FaUser/></div>
                <span className="font-medium text-main_dark text-xs sm:text-sm">Register Supplier</span>
              </div>

              <div className="bg-purewhite border-2 hover:border-web_yellow rounded-lg p-4 sm:p-5 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
                <div className="text-xl flex justify-center text-deep_green sm:text-2xl mb-2"><TfiWrite/></div>
                <span className="font-medium text-main_dark text-xs sm:text-sm">Create Request</span>
              </div>

              <div className="bg-purewhite border-2 hover:border-web_yellow rounded-lg p-4 sm:p-5 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
                <div className="text-xl flex justify-center text-deep_green sm:text-2xl mb-2"><IoSearch/></div>
                <span className="font-medium text-main_dark text-xs sm:text-sm">Review Quotes</span>
              </div>

              <div className="bg-purewhite border-2 hover:border-web_yellow rounded-lg p-4 sm:p-5 text-center cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
                <div className="text-xl flex justify-center text-deep_green sm:text-2xl mb-2"><SiGoogleanalytics/></div>
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

          {/* Recent Orders Full Table */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h2 className="text-lg font-semibold text-main_dark tracking-tight text-center sm:text-left">
                Recent Purchase Orders
              </h2>
              <a href="#" onClick={() => navigate('/purchasing/orders/overview')} className="text-deep_green hover:text-deep_green/80 font-medium text-sm transition-colors duration-150 text-center sm:text-right">
                View All
              </a>
            </div>
            
            <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading recent orders...</p>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No purchase orders found
                </div>
              ) : (
                <>
                  {/* Mobile Cards */}
                  <div className="lg:hidden divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <div key={order.poId} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-main_dark text-sm">{order.ponumber}</h3>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="font-semibold text-main_dark text-sm">{order.supplier?.name || 'Unknown'}</span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{order.supplier?.company_name || 'No Company'}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <FaCalendarAlt className="w-3 h-3" />
                              {formatDate(order.createdDate)}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            {order.orderPayment && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.orderPayment.status)}`}>
                                {order.orderPayment.status || 'Pending'}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <div className="font-semibold">
                              ${order.subTotal ? order.subTotal.toLocaleString() : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Materials:</span>
                            <div className="font-semibold">{order.materials ? order.materials.length : 0}</div>
                          </div>
                        </div>

                        {/* Materials Preview */}
                        {order.materials && order.materials.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs text-gray-500">Materials:</span>
                            <div className="text-xs text-gray-700 mt-1">
                              {order.materials.slice(0, 2).map((material, index) => (
                                <div key={index}>
                                  {material.material.materialName} ({material.quantity} {material.material.unitOfMeasurement})
                                </div>
                              ))}
                              {order.materials.length > 2 && (
                                <div className="text-gray-400">+{order.materials.length - 2} more</div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Payment Progress */}
                        {order.orderPayment && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Payment Progress</span>
                              <span>${order.orderPayment.paidAmount || 0} / ${order.orderPayment.amount || 0}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${getPaymentProgress(order.orderPayment)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-600">
                            {order.materials ? order.materials.length : 0} materials • {order.deliveries ? order.deliveries.length : 0} locations
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/purchasing/orders/details/${order.ponumber}`)} className="text-deep_green hover:text-deep_green/80 transition-colors">
                              <FaEye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Full Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-light_brown/30">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                            PO Number
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                            <div className="flex items-center gap-2">
                              <FaBuilding className="w-4 h-4" />
                              Supplier
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="w-4 h-4" />
                              Order Date
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Materials</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                            <div className="flex items-center gap-2">
                              <FaDollarSign className="w-4 h-4" />
                              Amount
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Payment</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Delivery</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.poId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-main_dark">
                              {order.ponumber}
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-semibold text-main_dark text-sm">{order.supplier?.name || 'Unknown Supplier'}</div>
                                <div className="text-xs text-gray-500">{order.supplier?.company_name || 'No Company'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatDate(order.createdDate)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
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
                            <td className="px-6 py-4 text-sm font-semibold text-main_dark">
                              ${order.subTotal ? order.subTotal.toLocaleString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              {order.orderPayment ? (
                                <div className="space-y-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.orderPayment.status)}`}>
                                    {order.orderPayment.status || 'Pending'}
                                  </span>
                                  <div className="text-xs text-gray-500">
                                    ${order.orderPayment.paidAmount || 0} / ${order.orderPayment.amount || 0}
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div 
                                      className="bg-green-500 h-1 rounded-full" 
                                      style={{ width: `${getPaymentProgress(order.orderPayment)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">No payment info</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {order.deliveries && order.deliveries.length > 0 ? (
                                <div className="space-y-1">
                                  {order.deliveries.slice(0, 1).map((delivery, index) => (
                                    <div key={index} className="text-xs">
                                      <div>{delivery.location}</div>
                                      <div className="text-gray-400">{formatDate(delivery.requiredDate)}</div>
                                    </div>
                                  ))}
                                  {order.deliveries.length > 1 && (
                                    <div className="text-xs text-gray-400">
                                      +{order.deliveries.length - 1} more
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">No deliveries</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => navigate(`/purchasing/orders/details/${order.ponumber}`)} className="text-deep_green hover:text-deep_green/80 transition-colors">
                                  <FaEye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchasingDashboard;
