import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Package, 
  Settings, 
  Truck, 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Check
} from 'lucide-react';
import NavBar from '../NavBar';
import { AuthContext } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../components/LoadingOverlay';


const EquipmentSelection = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('AVAILABLE');
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestData, setRequestData] = useState({
    requestedStartDate: '',
    requestedEndDate: '',
    priority: 'High',
    additionalNotes: '',
    requestPurpose: '',
    expectedLocation: ''
  });
   const { authState, logout } = useContext(AuthContext);
   console.log("AuthState:", authState);
     const [loadingProgress, setLoadingProgress] = useState(0);
   

  // Fetch equipment data from backend API
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/equipment/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        return response.json();
      })
      .then((data) => {
        setEquipment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log("Equipment data:", equipment);
  
  const categories = ['All Categories', 'Heavy Equipment', 'Transport Vehicle', 'Hand Tools', 'Power Equipment', 'Safety Equipment'];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  console.log("Filtered equipment:", filteredEquipment);

  const handleEquipmentSelect = (equipmentId) => {
    setSelectedEquipment(prev => {
      if (prev.includes(equipmentId)) {
        return prev.filter(id => id !== equipmentId);
      } else {
        return [...prev, equipmentId];
      }
    });
  };

  const handleSubmitRequest = () => {
    if (selectedEquipment.length === 0) {
      alert('Please select at least one equipment item');
      return;
    }
    
    // Show the request form
    setShowRequestForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!requestData.requestedStartDate || !requestData.requestedEndDate) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError("");
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress((p) => (p >= 90 ? p : p + Math.random() * 5));
    }, 200);

    try {
      setLoadingProgress(10);

      const requestBody = {
        projectId: projectId || "P1989",
        siteManagerId: authState.user.managerId,
        requestDate: new Date().toISOString(),
        requestedStartDate: new Date(requestData.requestedStartDate).toISOString(),
        requestedEndDate: new Date(requestData.requestedEndDate).toISOString(),
        priority: requestData.priority,
        status: "Pending",
        additionalNotes: requestData.additionalNotes,
        rejectionReason: null,
        approvalDate: null,
        approvedBy: null,
        equipmentIds: selectedEquipment,
        requestPurpose: requestData.requestPurpose,
        expectedLocation: requestData.expectedLocation
      };

      console.log("Sending Request Body:", JSON.stringify(requestBody, null, 2));

      setLoadingProgress(25);

      const response = await fetch("http://localhost:8080/api/equipment-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      setLoadingProgress(50);

      if (!response.ok) {
        throw new Error("Failed to submit equipment request");
      }

      const result = await response.json();
      
      setLoadingProgress(90);
      
      console.log("Success Response:", result);
      
      // Reset form and selections
      setSelectedEquipment([]);
      setShowRequestForm(false);
      setRequestData({
        requestedStartDate: '',
        requestedEndDate: '',
        priority: 'High',
        additionalNotes: '',
        requestPurpose: '',
        expectedLocation: ''
      });
      
      setLoadingProgress(100);
      toast.success("Equipment request submitted successfully!");
      navigate(`/site-manager/project-equipment/${projectId}`);
      
    } catch (error) {
      console.error("Error submitting request:", error);
      setError(error.message);
      toast.error("Failed to submit equipment request. Please try again.");
    } finally {
      setSubmitting(false);
      clearInterval(progressInterval);
      setLoadingProgress(0);
    }
  };

  const handleInputChange = (field, value) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Heavy Equipment': return <Settings className="w-5 h-5" />;
      case 'Heavy Machinery': return <Settings className="w-5 h-5" />;
      case 'Transport Vehicle': return <Truck className="w-5 h-5" />;
      case 'Hand Tools': return <Wrench className="w-5 h-5" />;
      case 'Power Equipment': return <Package className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'IN_USE': return 'bg-blue-100 text-blue-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <>
        <NavBar
          profileURL='profile'
          links={[
            { name: "Dashboard", href: "/site-manager" },
            { name: "Projects", href: "/site-manager/projects-list" },
            { name: "Materials", href: "/site-manager/material-request-list" },
            { name: "Inventory", href: "/site-manager/site-inventory" },
            { name: "Purchase Orders", href: "/site-manager/order-details" }
          ]}
        />
        <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep_green mx-auto mb-4"></div>
            <p className="text-slatebluegray">Loading available equipment...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar
        profileURL='profile'
        links={[
          { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
          { name: "Materials", href: "/site-manager/material-request-list" },
          { name: "Inventory", href: "/site-manager/site-inventory" },
          { name: "Purchase Orders", href: "/site-manager/order-details" }
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
            >
              <ArrowLeft className="w-5 h-5 text-slatebluegray" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-main_dark">Select Equipment</h1>
              <p className="text-slatebluegray text-lg">Choose equipment needed for your project</p>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedEquipment.length > 0 && (
            <div className="bg-gradient-to-r from-deep_green/10 to-web_yellow/10 border border-deep_green/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-deep_green" />
                  <span className="font-semibold text-main_dark">
                    {selectedEquipment.length} equipment item{selectedEquipment.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <button
                  onClick={handleSubmitRequest}
                  className="bg-deep_green text-white px-6 py-2 rounded-lg font-semibold hover:bg-deep_green/90 transition-colors duration-150 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Submit Request
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-slatebluegray" />
            <h2 className="text-lg font-semibold text-main_dark">Search & Filter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slatebluegray" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
            >
              <option value="All">All</option>
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredEquipment.map((item) => {
            const isSelected = selectedEquipment.includes(item.id);
            return (
              <div
                key={item.id}
                className={`bg-purewhite border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-deep_green bg-deep_green/5' 
                    : 'border-gray-200 hover:border-deep_green/30'
                }`}
                onClick={() => handleEquipmentSelect(item.id)}
              >
                {/* Selection Indicator */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'border-deep_green bg-deep_green' 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                {/* Equipment Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-deep_green/20 to-web_yellow/20 rounded-lg flex items-center justify-center">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-main_dark text-lg">{item.name}</h3>
                      <p className="text-slatebluegray text-sm">{item.brand} {item.model}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slatebluegray">Category:</span>
                      <span className="font-medium text-main_dark">{item.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slatebluegray">Condition:</span>
                      <span className="font-medium text-main_dark">{item.condition}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slatebluegray">Serial Number:</span>
                      <span className="font-medium text-main_dark">{item.serialNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slatebluegray">Purchase Date:</span>
                      <span className="font-medium text-main_dark">{new Date(item.purchaseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slatebluegray">Location:</span>
                      <span className="font-medium text-main_dark">{item.location}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-slatebluegray italic">{item.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-main_dark mb-2">No Equipment Found</h3>
            <p className="text-slatebluegray mb-4">Try adjusting your search terms or filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All Categories');
                setStatusFilter('AVAILABLE');
              }}
              className="text-deep_green hover:text-deep_green/80 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Bottom Action Bar */}
        {selectedEquipment.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-deep_green" />
                <span className="font-medium text-main_dark">
                  {selectedEquipment.length} equipment item{selectedEquipment.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <button
                onClick={handleSubmitRequest}
                className="bg-deep_green text-white px-8 py-3 rounded-lg font-semibold hover:bg-deep_green/90 transition-colors duration-150 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Submit Equipment Request
              </button>
            </div>
          </div>
        )}

        {/* Equipment Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-main_dark">Equipment Request Details</h2>
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <div className="w-6 h-6">✕</div>
                  </button>
                </div>
                <p className="text-slatebluegray mt-1">
                  {selectedEquipment.length} equipment item{selectedEquipment.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                {/* Selected Equipment Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-main_dark mb-3">Selected Equipment:</h3>
                  <div className="space-y-2">
                    {selectedEquipment.map(equipmentId => {
                      const item = equipment.find(eq => eq.id === equipmentId);
                      return item ? (
                        <div key={equipmentId} className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                          <div className="w-8 h-8 bg-gradient-to-br from-deep_green/20 to-web_yellow/20 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <p className="font-medium text-main_dark">{item.name}</p>
                            <p className="text-sm text-slatebluegray">{item.brand} {item.model}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Requested Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={requestData.requestedStartDate}
                      onChange={(e) => handleInputChange('requestedStartDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Requested End Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={requestData.requestedEndDate}
                      onChange={(e) => handleInputChange('requestedEndDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Priority
                    </label>
                    <select
                      value={requestData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Expected Location
                    </label>
                    <input
                      type="text"
                      value={requestData.expectedLocation}
                      onChange={(e) => handleInputChange('expectedLocation', e.target.value)}
                      placeholder="e.g., Colombo Main Site"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-main_dark mb-2">
                    Request Purpose
                  </label>
                  <input
                    type="text"
                    value={requestData.requestPurpose}
                    onChange={(e) => handleInputChange('requestPurpose', e.target.value)}
                    placeholder="e.g., Excavation and soil removal"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-main_dark mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={requestData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional information or special requirements..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent resize-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-deep_green text-white px-6 py-3 rounded-lg font-semibold hover:bg-deep_green/90 transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    
    {/* Loading Overlay */}
    {submitting && (
      <LoadingOverlay 
        message="Submitting Equipment Request..." 
        progress={loadingProgress}
      />
    )}
    </>
  );
};

export default EquipmentSelection;








