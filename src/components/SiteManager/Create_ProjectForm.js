import React, { useState } from 'react';
import { Calendar, Upload, FolderPlus, Save, X } from 'lucide-react';

const Create_ProjectForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    startDate: '',
    endDate: '',
    progressStatus: '',
    boqFile: null
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({
        ...prev,
        boqFile: e.dataTransfer.files[0]
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        boqFile: e.target.files[0]
      }));
    }
  };

  const handleCreateProject = () => {
    console.log('Creating project:', formData);
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', formData);
  };

  const handleCancel = () => {
    console.log('Cancelled');
  };

  const handleCreatePhases = () => {
    console.log('Creating project phases');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#236571] flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Create New Project</h1>
          </div>
          <p className="text-gray-600">Fill in the details below to create a new construction project</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          
          {/* Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded bg-[#236571]"></div>
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-[#236571] placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Select project location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-[#236571] placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Project Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded bg-[#236571]"></div>
              <h2 className="text-lg font-medium text-gray-900">Project Timeline</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-[#236571] placeholder-gray-400"
                  />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-[#236571] pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-[#236571] placeholder-gray-400"
                  />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-[#236571] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Project Documents */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded bg-[#236571]"></div>
              <h2 className="text-lg font-medium text-gray-900">Project Documents</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BOQ File Upload
              </label>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-[#236571] bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <div className="mb-4">
                    <p className="text-gray-600 mb-1">
                      Drop your BOQ files here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported formats: PDF, Excel, Word (Max: 10MB)
                    </p>
                  </div>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.xlsx,.xls,.doc,.docx"
                    />
                    <span className="bg-[#236571] text-white px-4 py-2 rounded-md hover:bg-[#1d505a] transition-colors">
                      Choose File
                    </span>
                  </label>
                  
                  {formData.boqFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">
                        Selected: {formData.boqFile.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Status */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded bg-[#236571]"></div>
              <h2 className="text-lg font-medium text-gray-900">Project Status</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Status
              </label>
              <select
                name="progressStatus"
                value={formData.progressStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-[#236571] bg-white"
              >
                <option value="">Select status</option>
                <option value="not-started">Not Started</option>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Create Project Phases */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#236571]"></div>
                <h2 className="text-lg font-medium text-gray-900">Create project phases</h2>
            </div>

            <button
                onClick={handleCreatePhases}
                className="inline-flex items-center px-6 py-2 bg-[#EFC11A] text-gray-900 font-medium rounded-md hover:bg-yellow-400 transition-colors"
            >
                Create Phases
            </button>
            </div>


          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center px-6 py-2.5 bg-[#236571] text-white font-medium rounded-md hover:bg-[#1e5a66] transition-colors"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Project
            </button>
            
            <button
              onClick={handleSaveAsDraft}
              className="inline-flex items-center px-6 py-2.5 bg-[#EFC11A] text-gray-900 font-medium rounded-md hover:bg-yellow-400 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </button>
            
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create_ProjectForm;