import React, { useState, useEffect } from 'react';
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

const EquipmentSelection = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('Available');

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockEquipment = [
          {
            id: 1,
            name: 'Hydraulic Excavator CAT 320',
            category: 'Heavy Machinery',
            brand: 'Caterpillar',
            model: 'CAT 320',
            condition: 'Excellent',
            location: 'Main Warehouse',
            status: 'Available',
            totalUsageHours: 1250.5,
            totalKilometers: 0,
            purchaseDate: '2022-03-15',
            notes: 'Well maintained, ready for use'
          },
          {
            id: 2,
            name: 'Concrete Mixer Truck',
            category: 'Transport Vehicle',
            brand: 'Volvo',
            model: 'FM 400',
            condition: 'Good',
            location: 'Main Warehouse',
            status: 'Available',
            totalUsageHours: 890.0,
            totalKilometers: 45000,
            purchaseDate: '2021-08-20',
            notes: 'Recently serviced, good condition'
          },
          {
            id: 3,
            name: 'Pneumatic Drill Set',
            category: 'Hand Tools',
            brand: 'DeWalt',
            model: 'D25133K',
            condition: 'Excellent',
            location: 'Tool Storage',
            status: 'Available',
            totalUsageHours: 45.5,
            totalKilometers: 0,
            purchaseDate: '2023-01-10',
            notes: 'New equipment, minimal usage'
          },
          {
            id: 4,
            name: 'Tower Crane TC-5216',
            category: 'Heavy Machinery',
            brand: 'Liebherr',
            model: 'TC-5216',
            condition: 'Good',
            location: 'Main Warehouse',
            status: 'Available',
            totalUsageHours: 2100.0,
            totalKilometers: 0,
            purchaseDate: '2020-11-05',
            notes: 'Professional operator required'
          },
          {
            id: 5,
            name: 'Generator 50KW Diesel',
            category: 'Power Equipment',
            brand: 'Cummins',
            model: 'C50D5',
            condition: 'Good',
            location: 'Power Equipment Bay',
            status: 'Available',
            totalUsageHours: 680.0,
            totalKilometers: 0,
            purchaseDate: '2021-06-12',
            notes: 'Fuel efficient, reliable power source'
          }
        ];
        setEquipment(mockEquipment);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const categories = ['All Categories', 'Heavy Machinery', 'Transport Vehicle', 'Hand Tools', 'Power Equipment', 'Safety Equipment'];
  const statuses = ['Available', 'In Use', 'Maintenance', 'All'];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
    
    // Navigate to request form with selected equipment
    navigate(`/site-manager/equipment-request/${projectId}`, {
      state: { selectedEquipment: selectedEquipment }
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Heavy Machinery': return <Settings className="w-5 h-5" />;
      case 'Transport Vehicle': return <Truck className="w-5 h-5" />;
      case 'Hand Tools': return <Wrench className="w-5 h-5" />;
      case 'Power Equipment': return <Package className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'In Use': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purewhite to-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep_green mx-auto mb-4"></div>
          <p className="text-slatebluegray">Loading available equipment...</p>
        </div>
      </div>
    );
  }

  return (
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
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
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
                      <span className="text-slatebluegray">Total Hours:</span>
                      <span className="font-medium text-main_dark">{item.totalUsageHours.toFixed(1)}h</span>
                    </div>
                    {item.totalKilometers > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slatebluegray">Total KM:</span>
                        <span className="font-medium text-main_dark">{item.totalKilometers.toLocaleString()}</span>
                      </div>
                    )}
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
                setStatusFilter('Available');
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
      </div>
    </div>
  );
};

export default EquipmentSelection;








