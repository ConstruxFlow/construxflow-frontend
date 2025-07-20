import React, { useState } from 'react';
import { Calendar, MapPin, Settings, Save, X, Clock, Building } from 'lucide-react';

const ScheduleForm = () => {
  const [formData, setFormData] = useState({
    equipmentName: '',
    equipmentType: '',
    scheduleDateFrom: '',
    scheduleDateTo: '',
    assignToSite: '',
    shiftType: 'Full Day',
    priority: 'Medium',
    operatorRequired: 'Yes',
    specialInstructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const equipmentOptions = [
    'Excavator CAT 320',
    'Tower Crane TC-1000',
    'Concrete Mixer CM-500',
    'Bulldozer BD-250',
    'Jackhammer JH-250',
    'Dump Truck DT-450'
  ];

  const siteOptions = [
    'Downtown Site - Office Complex',
    'Uptown Project - Residential Tower',
    'Highway Expansion - Infrastructure',
    'Industrial Park - Manufacturing',
    'Waterfront Development - Mixed Use'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Equipment scheduled successfully!');
      // Reset form
      setFormData({
        equipmentName: '',
        equipmentType: '',
        scheduleDateFrom: '',
        scheduleDateTo: '',
        assignToSite: '',
        shiftType: 'Full Day',
        priority: 'Medium',
        operatorRequired: 'Yes',
        specialInstructions: ''
      });
    }, 2000);
  };

  const handleSaveDraft = async () => {
    setIsDraft(true);
    // Simulate API call
    setTimeout(() => {
      setIsDraft(false);
      alert('Schedule saved as draft!');
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      equipmentName: '',
      equipmentType: '',
      scheduleDateFrom: '',
      scheduleDateTo: '',
      assignToSite: '',
      shiftType: 'Full Day',
      priority: 'Medium',
      operatorRequired: 'Yes',
      specialInstructions: ''
    });
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

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Equipment Information */}
        <div>
          <h3 className="text-lg font-semibold text-main_dark mb-4">Equipment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Equipment Name <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.equipmentName}
                onChange={(e) => handleInputChange('equipmentName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                required
              >
                <option value="">Select Equipment</option>
                {equipmentOptions.map(equipment => (
                  <option key={equipment} value={equipment}>{equipment}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Equipment Type
              </label>
              <input
                type="text"
                value={formData.equipmentType}
                onChange={(e) => handleInputChange('equipmentType', e.target.value)}
                placeholder="e.g., Heavy Machinery, Vehicle"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
              />
            </div>
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
                  value={formData.scheduleDateFrom}
                  onChange={(e) => handleInputChange('scheduleDateFrom', e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
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
                  value={formData.scheduleDateTo}
                  onChange={(e) => handleInputChange('scheduleDateTo', e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                  required
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
                  value={formData.assignToSite}
                  onChange={(e) => handleInputChange('assignToSite', e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Operator Required
              </label>
              <select
                value={formData.operatorRequired}
                onChange={(e) => handleInputChange('operatorRequired', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
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
        {(formData.equipmentName || formData.assignToSite || formData.priority) && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-main_dark mb-3">Schedule Summary</h4>
            <div className="space-y-2 text-sm">
              {formData.equipmentName && (
                <div className="flex justify-between">
                  <span className="text-slatebluegray">Equipment:</span>
                  <span className="font-medium text-main_dark">{formData.equipmentName}</span>
                </div>
              )}
              {formData.assignToSite && (
                <div className="flex justify-between">
                  <span className="text-slatebluegray">Site:</span>
                  <span className="font-medium text-main_dark">{formData.assignToSite}</span>
                </div>
              )}
              {(formData.scheduleDateFrom && formData.scheduleDateTo) && (
                <div className="flex justify-between">
                  <span className="text-slatebluegray">Duration:</span>
                  <span className="font-medium text-main_dark">
                    {formData.scheduleDateFrom} to {formData.scheduleDateTo}
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
            disabled={isSubmitting || !formData.equipmentName || !formData.scheduleDateFrom || !formData.scheduleDateTo || !formData.assignToSite}
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
