import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Upload, Save, X, Plus, Trash2, ChevronDown, ChevronRight, Edit } from 'lucide-react';

const Edit_ProjectForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    startDate: '',
    endDate: '',
    progressStatus: '',
    boqFile: null
  });

  // --- PHASES STATE AND HANDLERS ---
  const [phases, setPhases] = useState([]);
  const [boqLoading, setBoqLoading] = useState(false);

  const togglePhase = (phaseId) => {
    setPhases(phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, isExpanded: !phase.isExpanded }
        : phase
    ));
  };

  const addMaterial = (phaseId) => {
    setPhases(phases.map(phase => 
      phase.id === phaseId 
        ? { 
            ...phase, 
            materials: [...phase.materials, { 
              id: Date.now(), 
              name: '', 
              quantity: '', 
              unit: 'm³',
              rate: '',
              total: '',
              type: ''
            }]
          }
        : phase
    ));
  };

  const removeMaterial = (phaseId, materialId) => {
    setPhases(phases.map(phase => 
      phase.id === phaseId 
        ? { 
            ...phase, 
            materials: phase.materials.filter(m => m.id !== materialId)
          }
        : phase
    ));
  };

  const updateMaterial = (phaseId, materialId, field, value) => {
    setPhases(phases.map(phase => 
      phase.id === phaseId 
        ? { 
            ...phase, 
            materials: phase.materials.map(material => 
              material.id === materialId 
                ? { ...material, [field]: value }
                : material
            )
          }
        : phase
    ));
  };

  const updatePhase = (phaseId, field, value) => {
    setPhases(phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, [field]: value }
        : phase
    ));
  };

  const deletePhase = (phaseId) => {
    setPhases(phases.filter(phase => phase.id !== phaseId));
  };

  const addNewPhase = () => {
    const newPhase = {
      id: Date.now(),
      name: `Phase ${phases.length + 1}`,
      startDate: '',
      endDate: '',
      isExpanded: true,
      materials: []
    };
    setPhases([...phases, newPhase]);
  };

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    axios.get(`http://localhost:5454/api/projects/${projectId}`)
      .then(res => {
        const project = res.data;
        setFormData({
          projectName: project.projectName || '',
          location: project.location || '',
          startDate: project.startDate || '',
          endDate: project.endDate || '',
          progressStatus: project.progressStatus || '',
          boqFile: null
        });
        // Convert backend phases/materials to frontend structure
        setPhases((project.phases || []).map((phase, idx) => ({
          id: Date.now() + idx,
          name: phase.phaseName || '',
          startDate: phase.startDate || '',
          endDate: phase.endDate || '',
          isExpanded: true,
          materials: (phase.materials || []).map((mat, mIdx) => ({
            id: Date.now() + idx * 1000 + mIdx,
            name: mat.materialName || '',
            type: mat.materialType || '',
            quantity: mat.quantity || '',
            unit: mat.unitOfMeasurement || 'm³',
            rate: mat.rate || '',
            total: mat.total || ''
          }))
        })));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch project data');
        setLoading(false);
      });
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, boqFile: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Prepare phases as JSON string
      const phasesPayload = phases.map(phase => ({
        phaseName: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        status: phase.status || '',
        subtotal: phase.materials.reduce((sum, m) => sum + Number(m.total || 0), 0),
        materials: phase.materials.map(m => ({
          materialName: m.name,
          materialType: m.type || '',
          unitOfMeasurement: m.unit,
          quantity: Number(m.quantity),
          rate: Number(m.rate),
          total: Number(m.total)
        }))
      }));
      const data = new FormData();
      data.append('projectName', formData.projectName);
      data.append('location', formData.location);
      data.append('startDate', formData.startDate);
      data.append('endDate', formData.endDate);
      data.append('progressStatus', formData.progressStatus);
      data.append('phases', JSON.stringify(phasesPayload));
      if (formData.boqFile) data.append('boqFile', formData.boqFile);
      
      await axios.put(`http://localhost:5454/api/projects/${projectId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Project updated successfully!');
      navigate('/projects-list');
    } catch (err) {
      alert('Failed to update project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/projects-list');
  };

  if (loading) {
    return (
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-web_yellow mx-auto mb-4"></div>
          <p className="text-slatebluegray ml-3">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg">
            <Edit className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-main_dark">Edit Project</h1>
        </div>
        <p className="text-slatebluegray text-base">Update the details below to edit this construction project</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-8">
        
        {/* Basic Information */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-gradient-to-b from-deep_green to-deep_green/80 rounded-full"></div>
            <h2 className="text-lg font-semibold text-main_dark">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Enter project name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent placeholder-gray-400 transition-all duration-150"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter project location"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent placeholder-gray-400 transition-all duration-150"
              />
            </div>
          </div>
        </div>

        {/* Project Timeline */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-gradient-to-b from-web_yellow to-web_yellow/80 rounded-full"></div>
            <h2 className="text-lg font-semibold text-main_dark">Project Timeline</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                />
                <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-deep_green pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slatebluegray mb-2">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent transition-all duration-150"
                />
                <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-deep_green pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Project Documents */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-gradient-to-b from-light_brown to-light_brown/80 rounded-full"></div>
            <h2 className="text-lg font-semibold text-main_dark">Project Documents</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              BOQ File Upload
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.xlsx,.xls,.doc,.docx"
                  ref={fileInputRef}
                />
                <span className="bg-deep_green hover:bg-deep_green/80 text-white px-6 py-3 rounded-lg font-medium transition-all duration-150 shadow-sm hover:shadow-md inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Choose File
                </span>
              </label>
              {formData.boqFile && (
                <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    Selected: {formData.boqFile.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Status */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-gradient-to-b from-deep_green to-deep_green/80 rounded-full"></div>
            <h2 className="text-lg font-semibold text-main_dark">Project Status</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slatebluegray mb-2">
              Progress Status
            </label>
            <select
              name="progressStatus"
              value={formData.progressStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent bg-white transition-all duration-150"
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

        {/* Phases & Materials Management */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-gradient-to-b from-web_yellow to-web_yellow/80 rounded-full"></div>
            <h2 className="text-lg font-semibold text-main_dark">Project Phases & Materials</h2>
          </div>
          
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                {/* Phase Header */}
                <div 
                  className="bg-gray-100 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => togglePhase(phase.id)}
                >
                  <div className="flex items-center gap-3">
                    {phase.isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slatebluegray" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slatebluegray" />
                    )}
                    <span className="font-semibold text-main_dark">
                      Phase {index + 1}: {phase.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); deletePhase(phase.id); }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-150"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Phase Content */}
                {phase.isExpanded && (
                  <div className="p-6 space-y-6">
                    {/* Phase Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-2">
                          Phase Name
                        </label>
                        <input
                          type="text"
                          value={phase.name}
                          onChange={e => updatePhase(phase.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={phase.startDate}
                          onChange={e => updatePhase(phase.id, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slatebluegray mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={phase.endDate}
                          onChange={e => updatePhase(phase.id, 'endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    {/* Materials Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-main_dark">Materials</h4>
                        <button
                          type="button"
                          onClick={() => addMaterial(phase.id)}
                          className="bg-deep_green hover:bg-deep_green/80 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-150 shadow-sm hover:shadow-md"
                        >
                          <Plus className="w-4 h-4" />
                          Add Material
                        </button>
                      </div>
                      
                      {/* Materials List */}
                      <div className="space-y-3">
                        {phase.materials.map(material => (
                          <div key={material.id} className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-150">
                            <input
                              type="text"
                              placeholder="Material name"
                              value={material.name}
                              onChange={e => updateMaterial(phase.id, material.id, 'name', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                            />
                            <input
                              type="number"
                              placeholder="Qty"
                              value={material.quantity}
                              onChange={e => {
                                const value = e.target.value;
                                updateMaterial(phase.id, material.id, 'quantity', value);
                                const rate = parseFloat(material.rate) || 0;
                                const qty = parseFloat(value) || 0;
                                updateMaterial(phase.id, material.id, 'total', rate * qty);
                              }}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                            />
                            <select
                              value={material.unit}
                              onChange={e => updateMaterial(phase.id, material.id, 'unit', e.target.value)}
                              className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                            >
                              <option value="m³">m³</option>
                              <option value="kg">kg</option>
                              <option value="pcs">pcs</option>
                              <option value="m">m</option>
                              <option value="m²">m²</option>
                              <option value="Item">Item</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Rate"
                              value={material.rate || ''}
                              onChange={e => {
                                const value = e.target.value;
                                updateMaterial(phase.id, material.id, 'rate', value);
                                const qty = parseFloat(material.quantity) || 0;
                                const rate = parseFloat(value) || 0;
                                updateMaterial(phase.id, material.id, 'total', rate * qty);
                              }}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                            />
                            <div className="w-28 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-end text-main_dark font-medium">
                              {Number(material.rate || 0) * Number(material.quantity || 0)}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMaterial(phase.id, material.id)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-150"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add New Phase Button */}
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-150">
              <button
                type="button"
                onClick={addNewPhase}
                className="text-slatebluegray hover:text-main_dark flex items-center gap-2 mx-auto font-medium"
              >
                <Plus className="w-5 h-5" />
                Add New Phase
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200">
          <button
            type="submit"
            className="inline-flex items-center px-8 py-3 bg-deep_green hover:bg-deep_green/80 text-white font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-8 py-3 border border-gray-300 text-slatebluegray hover:text-main_dark font-semibold rounded-lg hover:bg-gray-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit_ProjectForm;
