import React, { useState, useRef } from 'react';
import { ChevronDown, Calendar, Upload, Clock, Info, FileText, Package } from 'lucide-react';

const Site_Equipment_Request = () => {
  const [equipmentType, setEquipmentType] = useState('');
  const [specificEquipment, setSpecificEquipment] = useState('');
  const [requiredZone, setRequiredZone] = useState('');
  const [quantity, setQuantity] = useState('');
  const [requestStartDate, setRequestStartDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [reasonNotes, setReasonNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [isEquipmentTypeOpen, setIsEquipmentTypeOpen] = useState(false);
  const [isSpecificEquipmentOpen, setIsSpecificEquipmentOpen] = useState(false);
  const [isZoneOpen, setIsZoneOpen] = useState(false);

  const equipmentTypes = [
    'Select equipment type',
    'Heavy Machinery',
    'Transport Vehicle',
    'Hand Tools',
    'Power Equipment',
    'Safety Equipment'
  ];

  const specificEquipments = [
    'Select specific equipment',
    'Hydraulic Excavator CAT 320',
    'Concrete Mixer Truck',
    'Tower Crane TC-5216',
    'Generator 50KW Diesel',
    'Pneumatic Drill Set'
  ];

  const zones = [
    'Select zone',
    'Zone A - Foundation',
    'Zone B - Structure',
    'Zone C - Finishing',
    'Warehouse A',
    'Site Office'
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('equipmentType', equipmentType);
    formData.append('specificEquipment', specificEquipment);
    formData.append('requiredZone', requiredZone);
    formData.append('quantity', quantity);
    formData.append('requestStartDate', requestStartDate);
    formData.append('expectedReturnDate', expectedReturnDate);
    formData.append('reasonNotes', reasonNotes);
    if (uploadedFile) {
      formData.append('uploadedFile', uploadedFile);
    }

    // Log the data for now
    console.log('Form submitted:');
    for (let pair of formData.entries()) {
      console.log(pair[0], ':', pair[1]);
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Equipment request submitted successfully!');
    }, 2000);

    // You can send formData to a backend using fetch or axios
  };

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-main_dark mb-2">Equipment Request</h1>
        <p className="text-slatebluegray text-base">Request equipment from the main inventory for your construction site</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Equipment Info */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Equipment Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Equipment Type */}
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Equipment Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsEquipmentTypeOpen(!isEquipmentTypeOpen)}
                    className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent flex items-center justify-between transition-all duration-150"
                  >
                    <span className={equipmentType ? 'text-main_dark font-medium' : 'text-slatebluegray'}>
                      {equipmentType || 'Select equipment type'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slatebluegray transform transition-transform duration-150 ${isEquipmentTypeOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isEquipmentTypeOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {equipmentTypes.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            if (option !== 'Select equipment type') {
                              setEquipmentType(option);
                            }
                            setIsEquipmentTypeOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                          disabled={option === 'Select equipment type'}
                        >
                          <span className={option === 'Select equipment type' ? 'text-slatebluegray' : 'text-main_dark'}>
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Specific Equipment */}
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Specific Equipment <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSpecificEquipmentOpen(!isSpecificEquipmentOpen)}
                    className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent flex items-center justify-between transition-all duration-150"
                  >
                    <span className={specificEquipment ? 'text-main_dark font-medium' : 'text-slatebluegray'}>
                      {specificEquipment || 'Select specific equipment'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slatebluegray transform transition-transform duration-150 ${isSpecificEquipmentOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSpecificEquipmentOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {specificEquipments.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            if (option !== 'Select specific equipment') {
                              setSpecificEquipment(option);
                            }
                            setIsSpecificEquipmentOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                          disabled={option === 'Select specific equipment'}
                        >
                          <span className={option === 'Select specific equipment' ? 'text-slatebluegray' : 'text-main_dark'}>
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Required Zone */}
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Required Zone / Site Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsZoneOpen(!isZoneOpen)}
                    className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent flex items-center justify-between transition-all duration-150"
                  >
                    <span className={requiredZone ? 'text-main_dark font-medium' : 'text-slatebluegray'}>
                      {requiredZone || 'Select zone'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slatebluegray transform transition-transform duration-150 ${isZoneOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isZoneOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {zones.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            if (option !== 'Select zone') {
                              setRequiredZone(option);
                            }
                            setIsZoneOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                          disabled={option === 'Select zone'}
                        >
                          <span className={option === 'Select zone' ? 'text-slatebluegray' : 'text-main_dark'}>
                            {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Schedule</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Request Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={requestStartDate}
                    onChange={(e) => setRequestStartDate(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  />
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-deep_green" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slatebluegray mb-2">
                  Expected Return Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  />
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-deep_green" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-5 h-5 text-web_yellow" />
              <h2 className="text-lg font-semibold text-main_dark">Additional Information</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Reason / Notes
              </label>
              <textarea
                value={reasonNotes}
                onChange={(e) => setReasonNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                placeholder="Provide additional details about your equipment request..."
              />
            </div>

            {/* Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Upload Document (Optional)
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-150 ${
                  dragOver ? 'border-web_yellow bg-web_yellow/5' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-web_yellow/20 to-web_yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-web_yellow" />
                </div>
                <p className="text-main_dark font-medium mb-2">
                  Drag and drop files here or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-deep_green hover:text-deep_green/80 font-semibold transition-colors duration-150"
                  >
                    Browse Files
                  </button>
                </p>
                <p className="text-sm text-slatebluegray">PDF, DOC, or image files up to 10MB</p>
                {uploadedFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {uploadedFile.name}
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setUploadedFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button 
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-slatebluegray hover:text-main_dark font-semibold hover:bg-gray-50 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Site_Equipment_Request;
