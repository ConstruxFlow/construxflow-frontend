import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import { Search, Package, Warehouse, AlertTriangle, Trash2 } from 'lucide-react';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Search function (existing)
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

  // Select item function (existing)
  const handleSelectItem = (item) => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      stock: type === 'equipment' ? item.quantity : item.quantityInStock,
      currentData: item
    });
    setShowResults(false);
    setSearchTerm(item.name);
  };

  // Save/Update function (existing)
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

      handleReset();
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating inventory: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW: Delete item function
  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/inventory/delete?type=${type}&id=${selectedItem.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Delete failed');
      }
      
      const result = await response.json();
      
      alert(`🗑️ ${selectedItem.name} deleted successfully!`);
      setShowDeleteModal(false);
      handleReset();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting item: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset form function
  const handleReset = () => {
    setSelectedItem(null);
    setStockChange('');
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
    setShowDeleteModal(false);
  };

  // Open delete confirmation modal
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete <strong>"{selectedItem?.name}"</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              ⚠️ This action cannot be undone. All data for this item will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  handleReset();
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
                <div className="flex justify-between items-start mb-4">
                  <label className="block text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Warehouse className="w-5 h-5 text-green-600" />
                    3. Item Details
                  </label>
                  {/* ✅ DELETE BUTTON */}
                  <button
                    onClick={openDeleteModal}
                    className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Item
                  </button>
                </div>
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
      </div>
    </div>
  );
};

export default UpdateInventory;