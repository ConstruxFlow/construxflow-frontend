import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
  // --- END PHASES HANDLERS ---

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

  // --- BOQ PDF PARSING LOGIC (optional for edit) ---
  // You can add PDF parsing logic here if you want to allow BOQ re-upload and phase extraction

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

  if (loading) return <div>Loading project data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#236571] flex items-center justify-center">
              <span className="text-white font-bold text-lg">✏️</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Project</h1>
          </div>
          <p className="text-gray-600">Update the details below to edit this construction project</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
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
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-[#236571] placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#236571] focus:border-[#236571] placeholder-gray-400"
                />
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
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.xlsx,.xls,.doc,.docx"
                  ref={fileInputRef}
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

          {/* --- PHASES/MATERIALS MANAGEMENT UI --- */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rounded bg-[#236571]"></div>
              <h2 className="text-lg font-medium text-gray-900">Project Phases & Materials</h2>
            </div>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div key={phase.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  {/* Phase Header */}
                  <div 
                    className="bg-gray-100 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {phase.isExpanded ? '▼' : '▶'}
                      </span>
                      <span className="font-medium text-gray-900">
                        Phase {index + 1}: {phase.name}
                      </span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deletePhase(phase.id); }}
                      className="text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      🗑️
                    </button>
                  </div>
                  {/* Phase Content */}
                  {phase.isExpanded && (
                    <div className="p-4 space-y-4">
                      {/* Phase Details */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phase Name
                          </label>
                          <input
                            type="text"
                            value={phase.name}
                            onChange={e => updatePhase(phase.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={phase.startDate}
                            onChange={e => updatePhase(phase.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={phase.endDate}
                            onChange={e => updatePhase(phase.id, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      {/* Materials Section */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Materials</h4>
                          <button
                            onClick={() => addMaterial(phase.id)}
                            className="text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                            style={{backgroundColor: '#236571'}}>
                            + Add Material
                          </button>
                        </div>
                        {/* Materials List */}
                        <div className="space-y-2">
                          {phase.materials.map(material => (
                            <div key={material.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                              <input
                                type="text"
                                placeholder="Material name"
                                value={material.name}
                                onChange={e => updateMaterial(phase.id, material.id, 'name', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="number"
                                placeholder="Quantity"
                                value={material.quantity}
                                onChange={e => {
                                  const value = e.target.value;
                                  updateMaterial(phase.id, material.id, 'quantity', value);
                                  const rate = parseFloat(material.rate) || 0;
                                  const qty = parseFloat(value) || 0;
                                  updateMaterial(phase.id, material.id, 'total', rate * qty);
                                }}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <select
                                value={material.unit}
                                onChange={e => updateMaterial(phase.id, material.id, 'unit', e.target.value)}
                                className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="w-28 px-3 py-2 border border-gray-200 rounded-md bg-gray-100 flex items-center justify-end text-gray-700">
                                {Number(material.rate || 0) * Number(material.quantity || 0)}
                              </div>
                              <button
                                onClick={() => removeMaterial(phase.id, material.id)}
                                className="text-red-500 hover:text-red-700 px-2 py-1"
                              >
                                ❌
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
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <button
                  onClick={addNewPhase}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mx-auto"
                >
                  <span className="text-lg">+</span>
                  Add New Phase
                </button>
              </div>
            </div>
          </div>
          {/* --- END PHASES/MATERIALS MANAGEMENT UI --- */}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2.5 bg-[#236571] text-white font-medium rounded-md hover:bg-[#1e5a66] transition-colors"
              disabled={submitting}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit_ProjectForm;
