import React, { useState, useRef } from 'react';

const Edit_ProjectForm = () => {
  const [formData, setFormData] = useState({
    projectName: 'Downtown Office Complex',
    location: '123 Main Street, Downtown District',
    startDate: '2024-01-15',
    endDate: '2024-12-20',
    assignedSiteManager: 'John Doe',
    currentStatus: 'Upcoming'
  });

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Project_Blueprint_v2.pdf', size: '2.4 MB', type: 'pdf' },
    { id: 2, name: 'Construction_Schedule.docx', size: '1.1 MB', type: 'docx' },
    { id: 3, name: 'Budget_Analysis.xlsx', size: '800 KB', type: 'xlsx' }
  ]);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentDelete = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData, documents);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📘';
      case 'xls':
      case 'xlsx': return '📊';
      default: return '📁';
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    addFiles(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    addFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const addFiles = (files) => {
    const newDocs = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.name.split('.').pop().toLowerCase()
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm pt-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#000000] mb-2">Edit Project Details</h1>
        <p className="text-gray-600">Update project information and manage project documents.</p>
      </div>

      <div className="space-y-8">
        {/* Project Information */}
        <div className="bg-[#F3F4F6] p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-[#236571] rounded-full mr-3"></div>
            <h2 className="text-lg font-medium text-[#236571]">Project Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['projectName', 'location', 'startDate', 'endDate'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field === 'projectName' ? 'Project Name' :
                   field === 'location' ? 'Location' :
                   field === 'startDate' ? 'Start Date' : 'End Date'} *
                </label>
                <input
                  type={field.includes('Date') ? 'date' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571]"
                  required
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Site Manager *</label>
              <select
                name="assignedSiteManager"
                value={formData.assignedSiteManager}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571]"
                required
              >
                {['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'].map((manager) => (
                  <option key={manager} value={manager}>{manager}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Documents */}
        <div className="bg-[#F3F4F6] p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-[#236571] rounded-full mr-3"></div>
            <h2 className="text-lg font-medium text-[#236571]">Project Documents</h2>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Documents</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{getFileIcon(doc.type)}</span>
                    <div>
                      <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{doc.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDocumentDelete(doc.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#236571] transition-all"
            onClick={() => fileInputRef.current.click()}
          >
            <div className="text-4xl mb-4">☁️</div>
            <p className="text-gray-600 mb-2">Drag and drop files here or click to upload</p>
            <button
              type="button"
              className="bg-[#236571] text-white px-4 py-2 rounded-md hover:bg-[#1d505a] transition-colors"
            >
              Choose Files
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max: 10MB)
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-[#F3F4F6] p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#236571] rounded-full mr-3"></div>
              <h2 className="text-lg font-medium text-[#236571]">Project Status</h2>
            </div>
            <button
              type="button"
              className="text-[#236571] hover:text-[#1d505a] text-sm font-medium"
            >
              Create project phases
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Status *</label>
            <select
              name="currentStatus"
              value={formData.currentStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571]"
              required
            >
              {['Upcoming', 'In Progress', 'On Hold', 'Completed', 'Cancelled'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Phases */}
        <div className="bg-[#F3F4F6] p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-[#236571] rounded-full mr-3"></div>
              <h2 className="text-lg font-medium text-[#236571]">Project Phases</h2>
            </div>
            <button
              type="button"
              className="bg-[#EFC11A] text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors text-m font-medium"
            >
              View Phases
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#EFC11A] text-black rounded-md hover:bg-yellow-500 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit_ProjectForm;
