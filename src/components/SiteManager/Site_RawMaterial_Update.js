import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Save, X, Package } from 'lucide-react';

const Site_RawMaterial_Update = () => {
  const [newQuantity, setNewQuantity] = useState('245');
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonOptions = [
    'Select reason',
    'Material Received',
    'Material Used',
    'Inventory Adjustment',
    'Damage/Loss',
    'Transfer'
  ];

  const handleSave = async () => {
    if (!reason || !newQuantity) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Material quantity updated successfully!');
    }, 2000);
  };

  const handleCancel = () => {
    // Reset form or navigate back
    console.log('Cancelled');
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      <main className="py-4 sm:py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
              Update Material Quantity
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Modify inventory levels for construction materials
            </p>
          </div>

          {/* Main Container */}
          <div className="bg-purewhite border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Material Overview Section */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-main_dark mb-6">Material Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Material Name */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Material Name
                  </label>
                  <div className="text-main_dark font-semibold text-base">Portland Cement</div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Type
                  </label>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-deep_green/10 text-deep_green border border-deep_green/20">
                    Building Material
                  </div>
                </div>

                {/* Unit Type */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Unit Type
                  </label>
                  <div className="text-main_dark font-semibold text-base">Bags (50kg)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Current Quantity */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Current Quantity
                  </label>
                  <div className="text-2xl font-bold text-main_dark">
                    245<span className="text-sm font-normal text-slatebluegray ml-1">bags</span>
                  </div>
                </div>

                {/* Reorder Level */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Reorder Level
                  </label>
                  <div className="text-xl font-semibold text-main_dark">
                    50<span className="text-sm font-normal text-slatebluegray ml-1">bags</span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Status
                  </label>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-deep_green/10 text-deep_green border border-deep_green/20">
                    In Stock
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Update Section */}
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-main_dark mb-6">Quantity Update</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Quantity */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    New Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                      placeholder="Enter quantity"
                    />
                    <div className="px-4 py-3 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-slatebluegray text-sm font-medium">
                      bags
                    </div>
                  </div>
                </div>

                {/* Reason for Update */}
                <div>
                  <label className="block text-sm font-medium text-slatebluegray mb-2">
                    Reason for Update <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsReasonOpen(!isReasonOpen)}
                      className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent flex items-center justify-between transition-all duration-150"
                    >
                      <span className={reason ? 'text-main_dark font-medium' : 'text-slatebluegray'}>
                        {reason || 'Select reason'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slatebluegray transform transition-transform duration-150 ${isReasonOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isReasonOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {reasonOptions.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              if (option !== 'Select reason') {
                                setReason(option);
                              }
                              setIsReasonOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                            disabled={option === 'Select reason'}
                          >
                            <span className={option === 'Select reason' ? 'text-slatebluegray' : 'text-main_dark'}>
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
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent resize-none transition-all duration-150"
                  placeholder="Add any additional notes or comments..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-slatebluegray hover:text-main_dark font-semibold hover:bg-gray-50 transition-all duration-150"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSubmitting || !reason || !newQuantity}
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
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Site_RawMaterial_Update;
