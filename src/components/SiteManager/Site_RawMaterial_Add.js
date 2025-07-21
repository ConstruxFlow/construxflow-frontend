import React, { useState } from 'react';
import { Plus, ChevronDown, Package, Trash2, Save, X } from 'lucide-react';

export default function Site_RawMaterial_Add() {
  const [formData, setFormData] = useState({
    materialName: '',
    materialType: '',
    reorderLevel: '',
    unit: ''
  });

  const [materials, setMaterials] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const units = [
    'bags',
    'tons',
    'sqft',
    'gallons',
    'pieces',
    'kg',
    'lbs',
    'cubic yards',
    'cubic feet',
    'meters',
    'feet'
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
        reorderLevel: formData.reorderLevel,
        unit: formData.unit || 'pieces'
      };
      setMaterials(prev => [...prev, newMaterial]);
      setFormData({ materialName: '', materialType: '', reorderLevel: '', unit: '' });
    }
  };

  const handleClearForm = () => {
    setFormData({ materialName: '', materialType: '', reorderLevel: '', unit: '' });
  };

  const handleRemoveMaterial = (id) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  const handleSaveProject = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Project materials saved successfully!');
      setMaterials([]);
    }, 2000);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Building Material': 'bg-deep_green/10 text-deep_green',
      'Structural': 'bg-light_gray/40 text-slatebluegray',
      'Finishing': 'bg-deep_green/10 text-deep_green',
      'Coating': 'bg-web_yellow/10 text-web_yellow',
      'Wood': 'bg-light_brown/10 text-light_brown',
      'Electrical': 'bg-blue-100 text-blue-800',
      'Plumbing': 'bg-cyan-100 text-cyan-800',
      'Hardware': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-light_gray/40 text-slatebluegray';
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
              Add Raw Materials
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Add and manage raw materials for your construction project
            </p>
          </div>

          {/* Add Material Form */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-semibold text-main_dark mb-6">Add New Material</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Material Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter material name"
                  value={formData.materialName}
                  onChange={(e) => handleInputChange('materialName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                />
              </div>

              {/* Material Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.materialType}
                    onChange={(e) => handleInputChange('materialType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent appearance-none bg-white pr-10 transition-all duration-150"
                  >
                    <option value="">Select type</option>
                    {materialTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <div className="relative">
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent appearance-none bg-white pr-10 transition-all duration-150"
                  >
                    <option value="">Select unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reorder Level <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter reorder level"
                  value={formData.reorderLevel}
                  onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddMaterial}
                disabled={!formData.materialName || !formData.materialType || !formData.reorderLevel}
                className="bg-deep_green hover:bg-deep_green/80 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Material
              </button>
              <button
                onClick={handleClearForm}
                className="px-6 py-3 border border-gray-300 text-slatebluegray hover:text-main_dark font-semibold rounded-lg hover:bg-gray-50 transition-all duration-150"
              >
                <X className="w-4 h-4 inline mr-2" />
                Clear Form
              </button>
            </div>
          </div>

          {/* Materials List */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-main_dark">Added Materials</h3>
                <div className="flex items-center">
                  <span className="bg-deep_green text-white px-3 py-1 rounded-full text-sm font-medium">
                    {materials.length} material{materials.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            {materials.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-light_brown/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Material Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Unit</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Reorder Level</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {materials.map((material) => (
                        <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-main_dark">{material.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                              {material.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{material.unit}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{material.reorderLevel}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleRemoveMaterial(material.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden divide-y divide-gray-200">
                  {materials.map((material) => (
                    <div key={material.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-main_dark text-sm mb-1">{material.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                              {material.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMaterial(material.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <p><span className="font-medium">Unit:</span> {material.unit}</p>
                        <p><span className="font-medium">Reorder Level:</span> {material.reorderLevel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-light_gray/40 to-light_gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-slatebluegray" />
                </div>
                <h3 className="text-lg font-semibold text-main_dark mb-2">No materials added yet</h3>
                <p className="text-slatebluegray">Add your first material using the form above</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          {materials.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleSaveProject}
                disabled={isSubmitting}
                className="bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold px-8 py-3 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Project Materials
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
