import React, { useState, useRef } from 'react';
import { ChevronDown, Calendar, Upload, Star, Clock, Info } from 'lucide-react';

const Site_Equipment_Request = () => {
  const [equipmentType, setEquipmentType] = useState('');
  const [specificEquipment, setSpecificEquipment] = useState('');
  const [requiredZone, setRequiredZone] = useState('');
  const [quantity, setQuantity] = useState('');
  const [requestStartDate, setRequestStartDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [reasonNotes, setReasonNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

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

    // You can send formData to a backend using fetch or axios
  };

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: '#F3F4F6' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Equipment Request</h1>
          <p className="text-gray-600 mt-1">Request equipment from the main inventory for your construction site</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Equipment Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 mr-2" style={{ color: '#EFC11A' }} />
              <h2 className="text-lg font-medium text-gray-900">Equipment Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Equipment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsEquipmentTypeOpen(!isEquipmentTypeOpen)}
                    className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none flex items-center justify-between"
                  >
                    <span className={equipmentType ? 'text-gray-900' : 'text-gray-500'}>
                      {equipmentType || 'Select equipment type'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {isEquipmentTypeOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      {equipmentTypes.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (option !== 'Select equipment type') {
                              setEquipmentType(option);
                            }
                            setIsEquipmentTypeOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50"
                          disabled={option === 'Select equipment type'}
                        >
                          <span className={option === 'Select equipment type' ? 'text-gray-400' : 'text-gray-900'}>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Equipment <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSpecificEquipmentOpen(!isSpecificEquipmentOpen)}
                    className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none flex items-center justify-between"
                  >
                    <span className={specificEquipment ? 'text-gray-900' : 'text-gray-500'}>
                      {specificEquipment || 'Select specific equipment'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {isSpecificEquipmentOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
                          className="w-full px-3 py-2 text-left hover:bg-gray-50"
                          disabled={option === 'Select specific equipment'}
                        >
                          <span className={option === 'Select specific equipment' ? 'text-gray-400' : 'text-gray-900'}>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Zone / Site Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsZoneOpen(!isZoneOpen)}
                    className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none flex items-center justify-between"
                  >
                    <span className={requiredZone ? 'text-gray-900' : 'text-gray-500'}>
                      {requiredZone || 'Select zone'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {isZoneOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
                          className="w-full px-3 py-2 text-left hover:bg-gray-50"
                          disabled={option === 'Select zone'}
                        >
                          <span className={option === 'Select zone' ? 'text-gray-400' : 'text-gray-900'}>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2" style={{ color: '#EFC11A' }} />
              <h2 className="text-lg font-medium text-gray-900">Schedule</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={requestStartDate}
                    onChange={(e) => setRequestStartDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Return Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Info className="w-5 h-5 mr-2" style={{ color: '#EFC11A' }} />
              <h2 className="text-lg font-medium text-gray-900">Additional Information</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason / Notes
              </label>
              <textarea
                value={reasonNotes}
                onChange={(e) => setReasonNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                placeholder="Provide additional details about your equipment request..."
              />
            </div>

            {/* Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document (Optional)
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop files here or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse Files
                  </button>
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, or image files up to 10MB</p>
                {uploadedFile && <p className="mt-2 text-sm text-gray-700">📄 {uploadedFile.name}</p>}
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
            <div className="flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-md text-black font-semibold hover:opacity-90 transition-opacity flex items-center"
                style={{ backgroundColor: '#EFC11A' }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Site_Equipment_Request;
