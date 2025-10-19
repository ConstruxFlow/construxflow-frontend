import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Settings, Save, X, Clock, Wrench, AlertTriangle } from 'lucide-react';

const API_BASE = import.meta?.env?.VITE_API_BASE ?? 'http://localhost:8080/api';

const ScheduleForm = ({ equipmentId }) => {
  const [formData, setFormData] = useState({
    equipmentId: equipmentId,
    siteName: '',
    startDate: '',
    endDate: '',
    shiftType: 'Full Day',
    priority: 'Medium',
    specialInstructions: ''
  });

  const [equipmentInfo, setEquipmentInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMaintenanceConflict, setHasMaintenanceConflict] = useState(false);
  const [checkingConflict, setCheckingConflict] = useState(false);
  const [sendingMaintenanceRequest, setSendingMaintenanceRequest] = useState(false);

  const siteOptions = [
    'Downtown Site - Office Complex',
    'Uptown Project - Residential Tower',
    'Highway Expansion - Infrastructure',
    'Industrial Park - Manufacturing',
    'Waterfront Development - Mixed Use'
  ];

  // Fetch equipment data when component mounts
  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE}/equipment-schedule/form-data/${equipmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch equipment data');
        }
        const data = await response.json();
        setEquipmentInfo(data);
      } catch (error) {
        console.error('Error fetching equipment data:', error);
        setError('Failed to load equipment information');
      } finally {
        setLoading(false);
      }
    };

    if (equipmentId) {
      fetchEquipmentData();
    }
  }, [equipmentId]);

  // Check for maintenance conflict when dates change
  useEffect(() => {
    const checkMaintenanceConflict = async () => {
      if (formData.startDate && formData.endDate && equipmentId) {
        setCheckingConflict(true);
        try {
          const params = new URLSearchParams({
            equipmentId: equipmentId,
            startDate: formData.startDate,
            endDate: formData.endDate
          });

          const response = await fetch(`${API_BASE}/maintenance-schedule-requests/check-conflict?${params}`);
          if (response.ok) {
            const data = await response.json();
            setHasMaintenanceConflict(data.hasConflict);
          }
        } catch (error) {
          console.error('Error checking maintenance conflict:', error);
        } finally {
          setCheckingConflict(false);
        }
      }
    };

    checkMaintenanceConflict();
  }, [formData.startDate, formData.endDate, equipmentId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/equipment-schedule/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Equipment scheduled successfully!');
        // Reset form
        setFormData({
          equipmentId: equipmentId,
          siteName: '',
          startDate: '',
          endDate: '',
          shiftType: 'Full Day',
          priority: 'Medium',
          specialInstructions: ''
        });
        setHasMaintenanceConflict(false);
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to schedule equipment');
      }
    } catch (error) {
      setError(error.message || 'Error scheduling equipment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMaintenanceRequest = async () => {
    setSendingMaintenanceRequest(true);
    try {
      const maintenanceRequestData = {
        equipmentId: equipmentId,
        equipmentName: equipmentInfo?.equipmentName,
        equipmentType: equipmentInfo?.equipmentType,
        reason: `Maintenance required during scheduled period (${formData.startDate} to ${formData.endDate})`,
        notes: `Next maintenance date: ${equipmentInfo?.nextMaintenance}. This equipment is scheduled for use during its maintenance period.`
      };

      const response = await fetch(`${API_BASE}/maintenance-schedule-requests/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenanceRequestData),
      });

      if (response.ok) {
        alert('Maintenance request sent successfully! The maintenance team has been notified.');
        setHasMaintenanceConflict(false);
      } else {
        throw new Error('Failed to send maintenance request');
      }
    } catch (error) {
      setError(error.message || 'Error sending maintenance request');
    } finally {
      setSendingMaintenanceRequest(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsDraft(true);
    // Simulate API call for draft saving
    setTimeout(() => {
      setIsDraft(false);
      alert('Schedule saved as draft!');
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      equipmentId: equipmentId,
      siteName: '',
      startDate: '',
      endDate: '',
      shiftType: 'Full Day',
      priority: 'Medium',
      specialInstructions: ''
    });
    setHasMaintenanceConflict(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-web_yellow/10 text-web_yellow border-web_yellow/30';
      case 'low': return 'bg-deep_green/10 text-deep_green border-deep_green/30';
      default: return 'bg-light_gray/40 text-slatebluegray border-light_gray';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow"></div>
        <span className="ml-2 text-gray-600">Loading equipment data...</span>
      </div>
    );
  }

  if (error && !equipmentInfo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-600 font-semibold">Error</div>
        <div className="text-red-500 text-sm mt-1">{error}</div>
        <button 
          onClick={() => window.history.back()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-deep_green" />
          <h2 className="text-lg font-semibold text-main_dark">Equipment Scheduling Form</h2>
        </div>
        <p className="text-slatebluegray text-sm mt-1">Fill in the details to schedule equipment for your construction site</p>
      </div>

      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      {/* Maintenance Conflict Warning */}
      {hasMaintenanceConflict && (
        <div className="mx-6 mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-orange-800 font-semibold text-sm mb-1">Maintenance Conflict Detected</h4>
              <p className="text-orange-700 text-sm">
                This equipment is scheduled for maintenance on <strong>{equipmentInfo?.nextMaintenance}</strong>, 
                which falls within your selected scheduling period ({formData.startDate} to {formData.endDate}).
              </p>
              <p className="text-orange-700 text-sm mt-2">
                Please consider rescheduling or send a maintenance request to notify the maintenance team.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleSendMaintenanceRequest}
                  disabled={sendingMaintenanceRequest}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 disabled:opacity-50"
                >
                  {sendingMaintenanceRequest ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      Send Maintenance Request
                    </>
                  )}
                </button>
                <button
                  onClick={() => setHasMaintenanceConflict(false)}
                  className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 transition-all duration-150"
                >
                  Proceed Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Equipment Information - Auto-filled */}
        <div>
          <h3 className="text-lg font-semibold text-main_dark mb-4">Equipment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Equipment Name
              </label>
              <input
                type="text"
                value={equipmentInfo?.equipmentName || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Equipment Type
              </label>
              <input
                type="text"
                value={equipmentInfo?.equipmentType || ''}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>
          
          {/* Next Maintenance Date */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Next Maintenance Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={equipmentInfo?.nextMaintenance || 'Not scheduled'}
                readOnly
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <Wrench className="absolute left-4 top-3.5 w-4 h-4 text-deep_green pointer-events-none" />
            </div>
            {checkingConflict && (
              <p className="text-xs text-web_yellow mt-1 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-web_yellow"></div>
                Checking for maintenance conflicts...
              </p>
            )}
          </div>
        </div>

        {/* Schedule Information */}
        <div>
          <h3 className="text-lg font-semibold text-main_dark mb-4">Schedule Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Schedule Date From <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-deep_green pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Schedule Date To <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-deep_green pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Assign To Site <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
                >
                  <option value="">Select Site</option>
                  {siteOptions.map(site => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-deep_green pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Shift Type
              </label>
              <div className="relative">
                <select
                  value={formData.shiftType}
                  onChange={(e) => handleInputChange('shiftType', e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                >
                  <option value="Full Day">Full Day (8 hours)</option>
                  <option value="Half Day">Half Day (4 hours)</option>
                  <option value="Night Shift">Night Shift</option>
                  <option value="Weekend">Weekend Only</option>
                </select>
                <Clock className="absolute left-4 top-3.5 w-4 h-4 text-deep_green pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <h3 className="text-lg font-semibold text-main_dark mb-4">Additional Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Special Instructions
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent resize-none transition-all duration-150"
              placeholder="Enter any special instructions for equipment handling or usage..."
            />
          </div>
        </div>

        {/* Current Selection Summary */}
        {(formData.siteName || formData.priority || formData.startDate) && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-main_dark mb-3">Schedule Summary</h4>
            <div className="space-y-2 text-sm">
              {equipmentInfo?.equipmentName && (
                <div className="flex justify-between">
                  <span className="text-slatebluegray">Equipment:</span>
                  <span className="font-medium text-main_dark">{equipmentInfo.equipmentName}</span>
                </div>
              )}
              {formData.siteName && (
                <div className="flex justify-between">
                  <span className="text-slatebluegray">Site:</span>
                  <span className="font-medium text-main_dark">{formData.siteName}</span>
                </div>
              )}
              {(formData.startDate && formData.endDate) && (
                <div className="flex justify-between">
                  <span className="text-slatebluegray">Duration:</span>
                  <span className="font-medium text-main_dark">
                    {formData.startDate} to {formData.endDate}
                  </span>
                </div>
              )}
              {formData.priority && (
                <div className="flex justify-between items-center">
                  <span className="text-slatebluegray">Priority:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(formData.priority)}`}>
                    {formData.priority}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 rounded-lg text-slatebluegray hover:text-main_dark font-semibold hover:bg-gray-50 transition-all duration-150"
          >
            <X className="w-4 h-4 inline mr-2" />
            Reset
          </button>
          
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isDraft}
            className="px-6 py-3 border border-gray-300 rounded-lg text-slatebluegray hover:text-main_dark font-semibold hover:bg-gray-50 transition-all duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDraft ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slatebluegray"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Draft
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !formData.siteName || !formData.startDate || !formData.endDate}
            className="bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold px-8 py-3 rounded-lg transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-main_dark"></div>
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                Schedule Equipment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;