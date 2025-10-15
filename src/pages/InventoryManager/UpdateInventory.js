import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import { Search, Package, Warehouse, AlertTriangle } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

const UpdateInventory = () => {
  const [type, setType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockChange, setStockChange] = useState('');
  const [action, setAction] = useState('add');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Handle search for items
  const handleSearch = async () => {
    if (!type || !searchTerm.trim()) {
      alert('Please select a type and enter a search term');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/inventory/search?type=${type}&name=${searchTerm.trim()}`
      );
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
      
      if (data.length === 0) {
        alert('No items found with that name.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for items: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle item selection from search results
  const handleSelectItem = (item) => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      stock: type === 'equipment' ? item.quantity : item.quantityInStock,
      currentData: item // Keep the full item data for reference
    });
    setShowResults(false);
    setSearchTerm(item.name); // Show the selected item name in search box
  };

  // Handle save/update inventory
  const handleSave = async () => {
    if (!selectedItem || !stockChange || parseInt(stockChange) <= 0) {
      alert('Please select an item and enter a valid quantity');
      return;
    }

    if (action === 'remove' && parseInt(stockChange) > selectedItem.stock) {
      alert(`Cannot remove ${stockChange} items. Only ${selectedItem.stock} available in stock.`);
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        type: type,
        id: selectedItem.id,
        action: action,
        quantity: parseInt(stockChange)
      };

      const response = await fetch('http://localhost:8080/api/inventory/update-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Update failed');
      }
      
      const result = await response.json();
      
      alert(`✅ ${selectedItem.name} updated successfully!\nNew stock: ${result.newStock}`);

      // Reset form
      setSelectedItem(null);
      setStockChange('');
      setSearchTerm('');
      setSearchResults([]);
      setShowResults(false);
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating inventory: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setSelectedItem(null);
    setStockChange('');
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Update Inventory
          </h1>
          <p className="text-gray-600 text-lg">
            Manage equipment and material stock levels
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* Step 1: Select Type */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-web_yellow" />
                1. Select Inventory Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  handleReset(); // Reset when type changes
                }}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-200"
              >
                <option value="">-- Choose Type --</option>
                <option value="equipment">Equipment</option>
                <option value="material">Material</option>
              </select>
            </div>

            {/* Step 2: Search Item */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-web_yellow" />
                2. Search Item
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={`Enter ${type ? type : 'item'} name...`}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-200"
                    disabled={!type}
                  />
                  
                  {/* Search Results Dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        >
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            Current Stock: {type === 'equipment' ? item.quantity : item.quantityInStock}
                            {item.brand && ` • Brand: ${item.brand}`}
                            {item.category && ` • Category: ${item.category}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!type || !searchTerm.trim() || isLoading}
                  className="flex items-center gap-2 bg-web_yellow text-black px-6 py-3 rounded-lg hover:bg-web_yellow/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  ) : (
                    <Search size={18} />
                  )}
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Step 3: Selected Item Details */}
            {selectedItem && (
              <div className="mb-8 p-6 border-2 border-green-200 rounded-xl bg-green-50">
                <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Warehouse className="w-5 h-5 text-green-600" />
                  3. Item Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Item Name:</strong><br />
                      <span className="text-lg font-semibold text-green-700">{selectedItem.name}</span>
                    </p>
                    <p className="text-gray-700 mt-2">
                      <strong className="text-gray-900">Current Stock:</strong><br />
                      <span className="text-xl font-bold text-blue-600">{selectedItem.stock} units</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-600">
                      <strong>ID:</strong> {selectedItem.id}<br />
                      {selectedItem.currentData?.brand && (
                        <>
                          <strong>Brand:</strong> {selectedItem.currentData.brand}<br />
                        </>
                      )}
                      {selectedItem.currentData?.category && (
                        <>
                          <strong>Category:</strong> {selectedItem.currentData.category}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Update Stock */}
            {selectedItem && (
              <div className="space-y-6">
                <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-web_yellow" />
                  4. Update Stock
                </label>

                {/* Action Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Type
                    </label>
                    <select
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-200"
                    >
                      <option value="add">➕ Add to Stock</option>
                      <option value="remove">➖ Remove from Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity to {action === 'add' ? 'Add' : 'Remove'}
                    </label>
                    <input
                      type="number"
                      value={stockChange}
                      onChange={(e) => setStockChange(e.target.value)}
                      placeholder="Enter quantity..."
                      min="1"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Preview Calculation */}
                {stockChange && parseInt(stockChange) > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      📊 Stock Update Preview:
                    </p>
                    <p className="text-blue-700">
                      Current: <strong>{selectedItem.stock}</strong> units<br />
                      {action === 'add' ? 'Adding' : 'Removing'}: <strong>{stockChange}</strong> units<br />
                      New Stock: <strong>
                        {action === 'add' 
                          ? selectedItem.stock + parseInt(stockChange)
                          : selectedItem.stock - parseInt(stockChange)
                        }
                      </strong> units
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!stockChange || parseInt(stockChange) <= 0 || isLoading}
                    className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        💾 Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Real-time Updates</h3>
            </div>
            <p className="text-gray-600 text-sm">
              All inventory changes are immediately synchronized with the central database and reflected across the system.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Warehouse className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Stock Control</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Maintain optimal stock levels with easy add/remove functionality. Prevent stockouts and overstocking.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Audit Trail</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Every inventory change is logged with timestamp and details for complete audit compliance and tracking.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-web_yellow transition-colors duration-200">
              <h4 className="font-semibold text-gray-800 mb-2">Need to Add Multiple Items?</h4>
              <p className="text-gray-600 text-sm mb-3">
                Use batch import for adding multiple inventory items at once.
              </p>
              <button className="text-web_yellow font-medium text-sm hover:underline">
                Open Batch Import →
              </button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-web_yellow transition-colors duration-200">
              <h4 className="font-semibold text-gray-800 mb-2">Low Stock Alerts</h4>
              <p className="text-gray-600 text-sm mb-3">
                View items that are running low and need reordering.
              </p>
              <button className="text-web_yellow font-medium text-sm hover:underline">
                Check Low Stock Items →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateInventory;