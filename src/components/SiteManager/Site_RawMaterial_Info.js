import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, ChevronLeft, ChevronRight, Package } from 'lucide-react';

export default function Site_RawMaterial_Info() {
  const [searchTerm, setSearchTerm] = useState('');

  const materials = [
    {
      id: 1,
      name: 'Concrete Mix',
      type: 'Building Material',
      currentStock: '850 bags',
      reorderLevel: '200 bags',
      stockStatus: 'normal',
      icon: '🏗️'
    },
    {
      id: 2,
      name: 'Steel Rebar',
      type: 'Structural',
      currentStock: '45 tons',
      reorderLevel: '100 tons',
      stockStatus: 'low',
      icon: '⚒️'
    },
    {
      id: 3,
      name: 'Ceramic Tiles',
      type: 'Finishing',
      currentStock: '2,540 sqft',
      reorderLevel: '500 sqft',
      stockStatus: 'normal',
      icon: '🏛️'
    },
    {
      id: 4,
      name: 'Exterior Paint',
      type: 'Coating',
      currentStock: '125 gallons',
      reorderLevel: '50 gallons',
      stockStatus: 'normal',
      icon: '🎨'
    },
    {
      id: 5,
      name: 'Lumber 2x4',
      type: 'Wood',
      currentStock: '15 pieces',
      reorderLevel: '100 pieces',
      stockStatus: 'critical',
      icon: '🪵'
    }
  ];

  const getTypeColor = (type) => {
    const colors = {
      'Building Material': 'bg-blue-100 text-blue-800',
      'Structural': 'bg-gray-100 text-gray-800',
      'Finishing': 'bg-green-100 text-green-800',
      'Coating': 'bg-purple-100 text-purple-800',
      'Wood': 'bg-amber-100 text-amber-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStockColor = (status, currentStock) => {
    if (status === 'critical') return 'text-red-600';
    if (status === 'low') return 'text-orange-600';
    return 'text-gray-900';
  };

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: '#F3F4F6' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Package className="w-6 h-6 mr-3 text-gray-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Raw Materials Management</h1>
            </div>
            <button 
              className="flex items-center px-4 py-2 text-white font-medium rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#236571' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Materials Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold" style={{ color: '#236571' }}>Site Raw Materials</h2>
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent w-64"
                    style={{ focusRingColor: '#236571' }}
                  />
                </div>
                {/* Filter Button */}
                <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="px-6 py-3" style={{ backgroundColor: '#EFC11A' }}>
              <div className="grid grid-cols-6 gap-4">
                <div className="font-semibold text-gray-900">Material Name</div>
                <div className="font-semibold text-gray-900">Type</div>
                <div className="font-semibold text-gray-900">Current Stock</div>
                <div className="font-semibold text-gray-900">Reorder Level</div>
                <div className="font-semibold text-gray-900">Actions</div>
                <div></div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {materials.map((material) => (
                <div key={material.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Material Name */}
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{material.icon}</span>
                      <span className="font-medium text-gray-900">{material.name}</span>
                    </div>

                    {/* Type */}
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                        {material.type}
                      </span>
                    </div>

                    {/* Current Stock */}
                    <div className={`font-medium ${getStockColor(material.stockStatus, material.currentStock)}`}>
                      {material.currentStock}
                    </div>

                    {/* Reorder Level */}
                    <div className="text-gray-600">
                      {material.reorderLevel}
                    </div>

                    {/* Actions */}
                    <div>
                      <button 
                        className="flex items-center px-3 py-1 text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#236571' }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Update Quantity
                      </button>
                    </div>

                    <div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 5 of 5 materials
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">Previous</span>
              <button 
                className="px-3 py-1 text-white font-medium rounded-lg"
                style={{ backgroundColor: '#236571' }}
              >
                1
              </button>
              <span className="text-sm text-gray-600">Next</span>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stock Status Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Stock</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}