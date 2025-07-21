import React, { useState } from 'react';
import { Upload, Calendar, User, AlertCircle } from 'lucide-react';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import TeamSection from '../../components/MaintenanceHead/TeamSection';

const MaintenanceMaterialRequest = () => {
  const [formData, setFormData] = useState({
    equipmentType: '',
    equipmentName: '',
    materialPartName: '',
    quantity: '',
    requestingDate: '',
    urgency: 'Medium',
    attachments: null
  });

  const [showTeam, setShowTeam] = useState(false);
  const navigation = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "#", onClick: () => navigation("/maintenance/dashboard") },
          { name: "Task", href: "#", onClick: () => navigation("/maintenance/scheduling") },
          {
            name: "Schedule",
            href: "#",
            onClick: () => navigation("/maintenance/update-equipment-maintenance"),
          },
          { name: "Team", href: "#",
            onClick: () => {
              console.log("Team link clicked");
              setShowTeam(true);
            },
          },
          { name: "Equipment", href: "#", onClick: () => navigation("/maintenance/equipment")},
          { name: "Add Technician", href: "#", onClick: () => navigation("/maintenance/add-member") },
        ]}
        showButton={true}
      />
      
      <div className="bg-purewhite min-h-screen">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-2xl font-bold text-main_dark">Maintenance Material Request</h1>
            </div>
            <p className="text-slatebluegray text-base">Submit your maintenance material requests for maintenance tasks</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-main_dark mb-6 border-b border-light_gray/60 pb-2">
                  Material Request Form
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Equipment Type */}
                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Equipment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="equipmentType"
                      value={formData.equipmentType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-purewhite focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all text-main_dark"
                    >
                      <option value="">Select Equipment Type</option>
                      <option value="hvac">HVAC System</option>
                      <option value="electrical">Electrical Equipment</option>
                      <option value="plumbing">Plumbing System</option>
                      <option value="mechanical">Mechanical Equipment</option>
                    </select>
                  </div>

                  {/* Equipment Name */}
                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Equipment Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="equipmentName"
                      value={formData.equipmentName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-purewhite focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all text-main_dark"
                    >
                      <option value="">Select Equipment</option>
                      <option value="air-conditioner">Air Conditioner</option>
                      <option value="generator">Generator</option>
                      <option value="pump">Water Pump</option>
                      <option value="boiler">Boiler</option>
                    </select>
                  </div>

                  {/* Material/Part Name */}
                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Material/Part Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="materialPartName"
                      value={formData.materialPartName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-purewhite focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all text-main_dark"
                    >
                      <option value="">Select Material/Part</option>
                      <option value="filter">Air Filter</option>
                      <option value="belt">Drive Belt</option>
                      <option value="gasket">Gasket</option>
                      <option value="valve">Control Valve</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-purewhite focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all text-main_dark"
                    />
                  </div>

                  {/* Requesting Date */}
                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Requesting Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="requestingDate"
                        value={formData.requestingDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-purewhite focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all text-main_dark"
                      />
                      <Calendar className="absolute right-4 top-3.5 h-5 w-5 text-slatebluegray pointer-events-none" />
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-3">
                      Urgency Level <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['High', 'Medium', 'Low'].map((level) => (
                        <label key={level} className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="radio"
                              name="urgency"
                              value={level}
                              checked={formData.urgency === level}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div 
                              className={`px-4 py-3 rounded-lg text-sm font-medium text-center border transition-all ${
                                level === 'High' 
                                  ? formData.urgency === level 
                                    ? 'bg-red-100 text-red-800 border-red-300 ring-2 ring-red-500' 
                                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                  : level === 'Medium' 
                                    ? formData.urgency === level 
                                      ? 'bg-web_yellow/20 text-main_dark border-web_yellow ring-2 ring-web_yellow' 
                                      : 'bg-web_yellow/10 text-main_dark border-web_yellow/30 hover:bg-web_yellow/20'
                                    : formData.urgency === level 
                                      ? 'bg-deep_green/20 text-deep_green border-deep_green ring-2 ring-deep_green' 
                                      : 'bg-deep_green/10 text-deep_green border-deep_green/30 hover:bg-deep_green/20'
                              }`}
                            >
                              {level}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Attachment */}
                  <div>
                    <label className="block text-sm font-medium text-main_dark mb-2">
                      Attachment (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-web_yellow transition-colors bg-gray-50/50">
                      <Upload className="mx-auto h-12 w-12 text-slatebluegray mb-4" />
                      <p className="text-sm text-main_dark mb-2 font-medium">
                        Drag and drop files here or click to browse
                      </p>
                      <p className="text-xs text-slatebluegray mb-4">PDF, JPG, PNG files (max 10MB)</p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block bg-deep_green hover:bg-deep_green/80 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all shadow-sm hover:shadow-md"
                      >
                        Choose File
                      </label>
                    </div>
                    {formData.attachments && (
                      <div className="mt-3 p-3 bg-deep_green/10 border border-deep_green/20 rounded-lg">
                        <p className="text-sm text-deep_green font-medium">
                          ✓ Selected: {formData.attachments.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => navigation(-1)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-slatebluegray bg-purewhite rounded-lg font-medium hover:bg-light_gray/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-web_yellow hover:bg-web_yellow/80 text-main_dark rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Request Preview Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-main_dark">Request Preview</h3>
                  <span className="bg-deep_green text-white px-3 py-1 rounded-full text-xs font-medium">
                    PREVIEW
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-light_gray/20 rounded-lg">
                    <p className="text-sm font-medium text-slatebluegray mb-1">Request ID</p>
                    <p className="text-sm font-semibold text-main_dark">MR-2025-0002</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slatebluegray mb-1">Equipment</p>
                    <p className="text-sm text-main_dark font-medium">
                      {formData.equipmentName || 'Not selected'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slatebluegray mb-1">Material/Part</p>
                    <p className="text-sm text-main_dark font-medium">
                      {formData.materialPartName || 'Not selected'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slatebluegray mb-1">Quantity</p>
                    <p className="text-sm text-main_dark font-medium">
                      {formData.quantity || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slatebluegray mb-1">Requested Date</p>
                    <p className="text-sm text-main_dark font-medium">
                      {formData.requestingDate || 'Not selected'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slatebluegray mb-2">Priority Level</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      formData.urgency === 'High' ? 'bg-red-100 text-red-800' :
                      formData.urgency === 'Medium' ? 'bg-web_yellow/20 text-main_dark' :
                      'bg-deep_green/20 text-deep_green'
                    }`}>
                      {formData.urgency}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-slatebluegray mb-2">
                      <User className="h-4 w-4" />
                      <span>John Doe</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slatebluegray">
                      <AlertCircle className="h-4 w-4" />
                      <span>Maintenance Department</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay and Team Sidebar */}
      {showTeam && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-all"
            onClick={() => setShowTeam(false)}
            aria-label="Close team sidebar"
          />
          <TeamSection onClose={() => setShowTeam(false)} />
        </>
      )}
    </>
  );
};

export default MaintenanceMaterialRequest;
