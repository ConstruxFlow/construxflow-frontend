import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const Site_RawMaterial_Update = () => {
  const [newQuantity, setNewQuantity] = useState('245');
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isReasonOpen, setIsReasonOpen] = useState(false);

  const reasonOptions = [
    'Select reason',
    'Material Received',
    'Material Used',
    'Inventory Adjustment',
    'Damage/Loss',
    'Transfer'
  ];

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          {/* <button className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Materials
          </button> */}
          <h1 className="text-2xl font-semibold text-gray-900">Update Material Quantity</h1>
          <p className="text-gray-600 mt-1">Modify inventory levels for construction materials</p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Material Overview Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Material Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Material Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Name
                </label>
                <div className="text-gray-900 font-medium">Portland Cement</div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white" 
                     style={{ backgroundColor: '#EFC11A' }}>
                  Cement
                </div>
              </div>

              {/* Unit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Type
                </label>
                <div className="text-gray-900 font-medium">Bags (50kg)</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Current Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Quantity
                </label>
                <div className="text-2xl font-bold text-gray-900">
                  245<span className="text-sm font-normal text-gray-500 ml-1">bags</span>
                </div>
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reorder Level
                </label>
                <div className="text-xl font-semibold text-gray-900">
                  50<span className="text-sm font-normal text-gray-500 ml-1">bags</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  In Stock
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Update Section */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Quantity Update</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Quantity <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: '#236571' }}
                    placeholder="Enter quantity"
                  />
                  <div className="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-gray-500 text-sm">
                    bags
                  </div>
                </div>
              </div>

              {/* Reason for Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Update <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsReasonOpen(!isReasonOpen)}
                    className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-between"
                    style={{ focusRingColor: '#236571' }}
                  >
                    <span className={reason ? 'text-gray-900' : 'text-gray-500'}>
                      {reason || 'Select reason'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  {isReasonOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      {reasonOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (option !== 'Select reason') {
                              setReason(option);
                            }
                            setIsReasonOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                          disabled={option === 'Select reason'}
                        >
                          <span className={option === 'Select reason' ? 'text-gray-400' : 'text-gray-900'}>
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
                style={{ focusRingColor: '#236571' }}
                placeholder="Add any additional notes or comments..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                Cancel
              </button>
              <button 
                className="px-6 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#EFC11A' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Site_RawMaterial_Update;