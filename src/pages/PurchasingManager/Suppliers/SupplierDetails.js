import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit, FaDownload, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaCalendarAlt, FaTruck, FaFileAlt, FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import NavBar from '../../../components/NavBar';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const SupplierDetail = () => {
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const { supplierId } = location.state || {};

  const fetchSupplierData=async()=>{
      const response = await fetch(`http://localhost:8080/api/supplier/find/${supplierId}`,{
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          }
      });
      if(response.ok){
          const data = await response.json();
          setSupplierData(data.data);
          setLoading(false);
      } else {
          toast.error("Failed to fetch supplier data");
          setLoading(false);
      }
  }
  useEffect(()=>{
      fetchSupplierData();
  },[])
console.log(supplierData);

//   // Sample data structure based on your API response
//   const sampleData = {
//     status: "success",
//     message: "Operation completed successfully",
//     data: {
//       supplier_id: "S001",
//       name: "imandi",
//       company_name: "123 company",
//       status: "Active",
//       bank_name: "ABC Bank",
//       bank_account_name: "123 Company Ltd",
//       bank_account_number: "1234567890",
//       on_time_delivery_rate: 95,
//       quotation_acceptance_rate: 87,
//       past_orders_completed: 156,
//       avg_delay_days: 2.3,
//       rating_by_site_manager: 4.5,
//       createdAt: "2025-07-06T13:40:32.198501",
//       business_Registration_Number: "0123/sad-21",
//       delivery_Capability: "Nationwide delivery within 7 days",
//       materials: [
//         {
//           id: 1,
//           material_name: "Steel Rods",
//           category: "Construction Materials",
//           unit_price: 45.50,
//           minimum_order: 100,
//           availability: "In Stock"
//         },
//         {
//           id: 2,
//           material_name: "Cement Bags",
//           category: "Construction Materials", 
//           unit_price: 12.75,
//           minimum_order: 50,
//           availability: "Limited Stock"
//         }
//       ],
//       documents: [
//         {
//           id: 1,
//           document_name: "Business License",
//           file_type: "PDF",
//           file_size: "2.3 MB",
//           upload_date: "2025-01-15",
//           status: "Verified"
//         },
//         {
//           id: 2,
//           document_name: "Tax Certificate",
//           file_type: "PDF",
//           file_size: "1.8 MB",
//           upload_date: "2025-01-20",
//           status: "Pending"
//         }
//       ],
//       userDetails: {
//         firebaseUid: "bfCpvFYHsPYs0g6uEYp6dnBBTBT2",
//         user_name: "imandi",
//         email: "imandi12ssandarua3@gmail.com",
//         phone_number1: 9876543210,
//         phone_number2: 9123456780,
//         address: "123 Main Street, City, Country",
//         createdAt: "2025-07-06T13:40:32.127932",
//         manager: null,
//         user_id: 1602,
//         userRole: "Supplier"
//       }
//     }
//   };


  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading supplier details...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar
        links={[
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
        ]}
      />

      {/* Main Content */}
      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div className="flex-1">
              <button className="flex items-center gap-2 text-slatebluegray text-sm mb-4 hover:underline">
                <FaArrowLeft className="w-4 h-4" />
                Back to Suppliers
              </button>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                    {supplierData?.company_name || 'Company Name'}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-gray-600 text-sm">
                      Supplier ID: <span className="font-semibold text-main_dark">{supplierData?.supplier_id}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(supplierData?.status || 'Active')}`}>
                      {supplierData?.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button className="px-4 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center justify-center gap-2 text-sm">
                <FaEdit className="w-4 h-4" />
                Edit Supplier
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
                <FaDownload className="w-4 h-4" />
                Export Details
              </button>
            </div>
          </div>

          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaStar className="w-4 h-4 text-web_yellow" />
                <span className="text-sm font-medium text-gray-600">Rating</span>
              </div>
              <div className="text-xl font-bold text-main_dark">
                {supplierData?.rating_by_site_manager || 'N/A'}
              </div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaTruck className="w-4 h-4 text-deep_green" />
                <span className="text-sm font-medium text-gray-600">On-Time</span>
              </div>
              <div className="text-xl font-bold text-main_dark">
                {supplierData?.on_time_delivery_rate ? `${supplierData.on_time_delivery_rate}%` : 'N/A'}
              </div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaFileAlt className="w-4 h-4 text-web_yellow" />
                <span className="text-sm font-medium text-gray-600">Acceptance</span>
              </div>
              <div className="text-xl font-bold text-main_dark">
                {supplierData?.quotation_acceptance_rate ? `${supplierData.quotation_acceptance_rate}%` : 'N/A'}
              </div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaBuilding className="w-4 h-4 text-slatebluegray" />
                <span className="text-sm font-medium text-gray-600">Orders</span>
              </div>
              <div className="text-xl font-bold text-main_dark">
                {supplierData?.past_orders_completed || 'N/A'}
              </div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="w-4 h-4 text-light_brown" />
                <span className="text-sm font-medium text-gray-600">Avg Delay</span>
              </div>
              <div className="text-xl font-bold text-main_dark">
                {supplierData?.avg_delay_days ? `${supplierData.avg_delay_days} days` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-purewhite border border-gray-200 rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'materials', label: 'Materials' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'performance', label: 'Performance' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-web_yellow text-web_yellow'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Company Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-main_dark mb-4">Company Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Company Name</label>
                        <p className="font-medium text-main_dark">{supplierData?.company_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Contact Person</label>
                        <p className="font-medium text-main_dark">{supplierData?.userDetails?.user_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Registration Number</label>
                        <p className="font-medium text-main_dark">{supplierData?.business_Registration_Number || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Joined Date</label>
                        <p className="font-medium text-main_dark">
                          {supplierData?.createdAt ? new Date(supplierData.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-main_dark mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="w-4 h-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-600 block">Email</label>
                          <p className="font-medium text-main_dark">{supplierData?.userDetails?.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaPhone className="w-4 h-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-600 block">Primary Phone</label>
                          <p className="font-medium text-main_dark">{supplierData?.userDetails?.phone_number1 || 'N/A'}</p>
                        </div>
                      </div>
                      {supplierData?.userDetails?.phone_number2 && (
                        <div className="flex items-center gap-3">
                          <FaPhone className="w-4 h-4 text-gray-400" />
                          <div>
                            <label className="text-sm font-medium text-gray-600 block">Secondary Phone</label>
                            <p className="font-medium text-main_dark">{supplierData.userDetails.phone_number2}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <label className="text-sm font-medium text-gray-600 block">Address</label>
                          <p className="font-medium text-main_dark">{supplierData?.userDetails?.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banking Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-main_dark mb-4">Banking Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Bank Name</label>
                        <p className="font-medium text-main_dark">{supplierData?.bank_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Account Name</label>
                        <p className="font-medium text-main_dark">{supplierData?.bank_account_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Account Number</label>
                        <p className="font-medium text-main_dark">
                          {supplierData?.bank_account_number ? `****${supplierData.bank_account_number.slice(-4)}` : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Capability */}
                  <div>
                    <h3 className="text-lg font-semibold text-main_dark mb-4">Delivery Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1">Delivery Capability</label>
                        <p className="font-medium text-main_dark">{supplierData?.delivery_Capability || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Materials Tab */}
              {activeTab === 'materials' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-main_dark">Supplied Materials</h3>
                  </div>
                  
                  {supplierData?.materials && supplierData.materials.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-light_gray/30">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Material Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Category</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Unit of Measure</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-main_dark">Reports</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {supplierData.materials.map((material, index) => (
                            <tr key={material.id || index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-main_dark">{material.material_name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{material.category}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">${material.unit_price}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{material.minimum_order}</td>
                              
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">No materials registered yet</p>
                      <p className="text-sm text-gray-500">Add materials to start receiving quotation requests</p>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-main_dark">Documents</h3>
                  </div>
                  
                  {supplierData?.documents && supplierData.documents.length > 0 ? (
                    <div className="space-y-4">
                      {supplierData.documents.map((document, index) => (
                        <div key={document.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <FaFileAlt className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-main_dark">{document.document_name}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{document.file_type}</span>
                                <span>{document.file_size}</span>
                                <span>Uploaded: {new Date(document.upload_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="text-deep_green hover:text-deep_green/80 transition-colors">
                              <FaDownload className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">No documents uploaded yet</p>
                      <p className="text-sm text-gray-500">Upload required documents for verification</p>
                    </div>
                  )}
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-light_gray/30 rounded-lg p-6">
                    <h4 className="font-semibold text-main_dark mb-4">Performance Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">On-Time Delivery Rate:</span>
                        <span className="font-semibold text-main_dark">
                          {supplierData?.on_time_delivery_rate ? `${supplierData.on_time_delivery_rate}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quotation Acceptance Rate:</span>
                        <span className="font-semibold text-main_dark">
                          {supplierData?.quotation_acceptance_rate ? `${supplierData.quotation_acceptance_rate}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Orders Completed:</span>
                        <span className="font-semibold text-main_dark">
                          {supplierData?.past_orders_completed || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Delay Days:</span>
                        <span className="font-semibold text-main_dark">
                          {supplierData?.avg_delay_days ? `${supplierData.avg_delay_days} days` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Site Manager Rating:</span>
                        <span className="font-semibold text-main_dark flex items-center gap-1">
                          {supplierData?.rating_by_site_manager ? (
                            <>
                              <FaStar className="w-4 h-4 text-web_yellow" />
                              {supplierData.rating_by_site_manager}
                            </>
                          ) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-light_brown/30 rounded-lg p-6">
                    <h4 className="font-semibold text-main_dark mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="font-medium text-main_dark">Account Created</p>
                        <p className="text-gray-600">
                          {supplierData?.createdAt ? new Date(supplierData.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-main_dark">User Role</p>
                        <p className="text-gray-600">{supplierData?.userDetails?.userRole || 'N/A'}</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-main_dark">Firebase UID</p>
                        <p className="text-gray-600 font-mono text-xs">
                          {supplierData?.userDetails?.firebaseUid || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplierDetail;
