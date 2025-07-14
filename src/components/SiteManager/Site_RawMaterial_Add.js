import React, { useState } from 'react';
import { Plus, ChevronDown, Package } from 'lucide-react';

export default function Site_RawMaterial_Add() {
  const [formData, setFormData] = useState({
    materialName: '',
    materialType: '',
    reorderLevel: ''
  });

  const [materials, setMaterials] = useState([]);

  const materialTypes = [
    'Building Material',
    'Structural',
    'Finishing',
    'Coating',
    'Wood',
    'Electrical',
    'Plumbing',
    'Hardware'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMaterial = () => {
    if (formData.materialName && formData.materialType && formData.reorderLevel) {
      const newMaterial = {
        id: Date.now(),
        name: formData.materialName,
        type: formData.materialType,
        reorderLevel: formData.reorderLevel
      };
      setMaterials(prev => [...prev, newMaterial]);
      setFormData({ materialName: '', materialType: '', reorderLevel: '' });
    }
  };

  const handleClearForm = () => {
    setFormData({ materialName: '', materialType: '', reorderLevel: '' });
  };

  const handleRemoveMaterial = (id) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Project Materials Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Project Materials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Material Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Name
              </label>
              <input
                type="text"
                placeholder="Enter material name"
                value={formData.materialName}
                onChange={(e) => handleInputChange('materialName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent bg-gray-50"
                style={{ focusRingColor: '#236571' }}
              />
            </div>

            {/* Material Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Type
              </label>
              <div className="relative">
                <select
                  value={formData.materialType}
                  onChange={(e) => handleInputChange('materialType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent appearance-none bg-gray-50 pr-10"
                  style={{ focusRingColor: '#236571' }}
                >
                  <option value="">Select type</option>
                  {materialTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Level
              </label>
              <input
                type="text"
                placeholder="Enter reorder level"
                value={formData.reorderLevel}
                onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent bg-gray-50"
                style={{ focusRingColor: '#236571' }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddMaterial}
              className="flex items-center px-6 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#236571' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </button>
            <button
              onClick={handleClearForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </div>

        {/* Materials List Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Materials List</h3>
              <div className="flex items-center">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: '#236571' }}
                >
                  {materials.length} materials
                </span>
              </div>
            </div>
          </div>

          {/* Table or Empty State */}
          {materials.length > 0 ? (
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-sm font-medium text-gray-700">Material Name</div>
                  <div className="text-sm font-medium text-gray-700">Type</div>
                  <div className="text-sm font-medium text-gray-700">Reorder Level</div>
                  <div className="text-sm font-medium text-gray-700">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {materials.map((material) => (
                  <div key={material.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="text-gray-900 font-medium">{material.name}</div>
                      <div className="text-gray-600">{material.type}</div>
                      <div className="text-gray-600">{material.reorderLevel}</div>
                      <div>
                        <button
                          onClick={() => handleRemoveMaterial(material.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="px-6 py-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials added yet</h3>
              <p className="text-gray-500">Add your first material using the form above</p>
            </div>
          )}
        </div>

        {/* Save Project Button */}
        {materials.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              className="px-8 py-3 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#EFC11A', color: '#000' }}
            >
              Save Project Materials
            </button>
          </div>
        )}
      </div>
    </div>
  );
}