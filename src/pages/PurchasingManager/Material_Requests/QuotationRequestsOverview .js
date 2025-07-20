import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaDownload,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaFileAlt
} from 'react-icons/fa';
import NavBar from '../../../components/NavBar';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const QuotationRequestsOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [quotationRequests, setQuotationRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPriority, setSelectedPriority] = useState('All Priority');
  const [selectedType, setSelectedType] = useState('All Types');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('requestDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotationRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [quotationRequests, searchTerm, selectedStatus, selectedPriority, selectedType]);

  const fetchQuotationRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/quotationrequest/all');
      const data = await response.json();
      
      if (data.status === 'success') {
        setLoading(false);
        setQuotationRequests(data.data || []);
      } else {
        setLoading(false);
        toast.error('Failed to fetch quotation requests');
      }
    } catch (error) {
      toast.error('Network error: Failed to fetch quotation requests');
      console.error('Error fetching quotation requests:', error);
    } finally {
      setLoading(false);
    }
  };
  // console.log(quotationRequests);
  
  const filterRequests = () => {
    let filtered = quotationRequests.filter(request => {
      const matchesSearch = 
        request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.quotationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.additionalInfo && request.additionalInfo.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = selectedStatus === 'All Status' || request.status === selectedStatus;
      const matchesPriority = selectedPriority === 'All Priority' || request.priorityLevel === selectedPriority;
      const matchesType = selectedType === 'All Types' || request.quotationType === selectedType;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'estimatedCost') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'requestDate' || sortBy === 'quotationDeadline') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
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

  const getTotalMaterialsCount = (materials) => {
    return materials ? materials.length : 0;
  };

  const getTotalDeliveryLocations = (deliveries) => {
    return deliveries ? deliveries.length : 0;
  };

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const statuses = ['All Status', 'Pending', 'Approved', 'Rejected', 'In Progress'];
  const priorities = ['All Priority', 'Urgent', 'High', 'Medium', 'Low'];
  const types = ['All Types', 'Material', 'Service', 'Equipment', 'Other'];

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

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <NavBar
        links={[
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Quotation Requests Overview
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                View and manage all quotation requests across projects
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-4 py-2 bg-deep_green text-purewhite rounded-md hover:bg-deep_green/90 transition-colors flex items-center justify-center gap-2 text-sm">
                <FaDownload className="w-4 h-4" />
                Export List
              </button>
              <button onClick={() => navigate('/purchasing/materialrequests/create')} className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors flex items-center justify-center gap-2 text-sm font-semibold">
                <FaPlus className="w-4 h-4" />
                Create Request
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-main_dark">{quotationRequests.length}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {quotationRequests.filter(r => r.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {quotationRequests.filter(r => r.status === 'Approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-purewhite border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {quotationRequests.filter(r => r.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Requests</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by requester, type, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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

              {/* Priority Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="w-full lg:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full lg:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent text-sm"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
            </p>
          </div>

          {/* Requests Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_brown/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">
                      ID
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('requesterName')}
                    >
                      <div className="flex items-center gap-2">
                        <FaUser className="w-4 h-4" />
                        Requester
                        {sortBy === 'requesterName' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('quotationType')}
                    >
                      <div className="flex items-center gap-2">
                        <FaFileAlt className="w-4 h-4" />
                        Type
                        {sortBy === 'quotationType' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('requestDate')}
                    >
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="w-4 h-4" />
                        Request Date
                        {sortBy === 'requestDate' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('quotationDeadline')}
                    >
                      <div className="flex items-center gap-2">
                        <FaClock className="w-4 h-4" />
                        Deadline
                        {sortBy === 'quotationDeadline' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Materials</th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-main_dark cursor-pointer hover:bg-light_brown/50"
                      onClick={() => handleSort('estimatedCost')}
                    >
                      <div className="flex items-center gap-2">
                        Est. Cost
                        {sortBy === 'estimatedCost' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-main_dark">
                        #{request.id}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-main_dark text-sm">{request.requesterName}</div>
                          <div className="text-xs text-gray-500">
                            {getTotalMaterialsCount(request.quotationReqMaterials)} materials • {getTotalDeliveryLocations(request.quotationReqDelivery)} locations
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.quotationType}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(request.requestDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(request.quotationDeadline)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priorityLevel)}`}>
                          {request.priorityLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {request.quotationReqMaterials && request.quotationReqMaterials.length > 0 ? (
                          <div className="space-y-1">
                            {request.quotationReqMaterials.slice(0, 2).map((material, index) => (
                              <div key={index} className="text-xs">
                                {material.material.materialName} ({material.quantity} {material.material.unitOfMeasurement})
                              </div>
                            ))}
                            {request.quotationReqMaterials.length > 2 && (
                              <div className="text-xs text-gray-400">
                                +{request.quotationReqMaterials.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No materials</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-main_dark">
                        {request.estimatedCost ? `$${request.estimatedCost.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={()=>navigate(`/purchasing/quotationrequest/details/${request.id}`)} className="text-deep_green hover:text-deep_green/80 transition-colors">
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
              {paginatedRequests.map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-main_dark text-sm">#{request.id}</h3>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="font-semibold text-main_dark text-sm">{request.requesterName}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{request.quotationType}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaCalendarAlt className="w-3 h-3" />
                        {formatDate(request.requestDate)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priorityLevel)}`}>
                        {request.priorityLevel}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <div className="font-semibold">{formatDate(request.quotationDeadline)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Est. Cost:</span>
                      <div className="font-semibold">
                        {request.estimatedCost ? `$${request.estimatedCost.toLocaleString()}` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Materials Preview */}
                  {request.quotationReqMaterials && request.quotationReqMaterials.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs text-gray-500">Materials:</span>
                      <div className="text-xs text-gray-700 mt-1">
                        {request.quotationReqMaterials.slice(0, 2).map((material, index) => (
                          <div key={index}>
                            {material.material.materialName} ({material.quantity} {material.material.unitOfMeasurement})
                          </div>
                        ))}
                        {request.quotationReqMaterials.length > 2 && (
                          <div className="text-gray-400">+{request.quotationReqMaterials.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-600">
                      {getTotalMaterialsCount(request.quotationReqMaterials)} materials • {getTotalDeliveryLocations(request.quotationReqDelivery)} locations
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-deep_green hover:text-deep_green/80 transition-colors">
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} results
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

export default QuotationRequestsOverview;
