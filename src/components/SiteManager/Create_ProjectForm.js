import React, { useState } from 'react';
import { Calendar, Upload, FolderPlus, Save, X } from 'lucide-react';
import { pdfjs } from 'react-pdf';
import { useNavigate } from 'react-router-dom';
// IMPORTANT: Make sure public/pdf.worker.min.js exists (copy from node_modules/pdfjs-dist/build/pdf.worker.min.js)
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const Create_ProjectForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    startDate: '',
    endDate: '',
    progressStatus: '',
    boqFile: null
  });
  const navigate = useNavigate();

  // --- PHASES STATE AND HANDLERS ---
  const [phases, setPhases] = useState([
    // Initially empty, will be filled after BOQ upload in next step
  ]);
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
              unit: 'm³' 
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

  // --- BOQ PDF PARSING LOGIC (from BOQPDFReader.js) ---
  // Extract text from PDF
  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let extractedText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      extractedText += pageText + '\n';
    }
    return { totalPages: pdf.numPages, fullText: extractedText };
  };

  // Parse BOQ data (simplified from BOQPDFReader.js)
  const parseBOQData = (textData) => {
    // This is a simplified version for demo; you may want to use the full logic from BOQPDFReader.js
    // For now, we expect the textData to be in the same format as your sample JSON
    // We'll just simulate extracting phases and materials
    // In production, use the full parseBOQData from BOQPDFReader.js
    // Here, we return empty if not matched
    try {
      // Try to match PHASE blocks
      const phaseRegex = /PHASE [0-9]+[\s\S]*?(?=PHASE [0-9]+|$)/g;
      const matches = textData.fullText.match(phaseRegex);
      if (!matches) return [];
      let phaseId = 1;
      return matches.map(phaseBlock => {
        const lines = phaseBlock.split(/\n|  /).map(l => l.trim()).filter(Boolean);
        const name = lines[0];
        // Find material lines (look for item codes like 1.1, 2.1, etc.)
        const materialRegex = /([0-9]+\.[0-9]+)\s+([\w\s\(\)&\+]+)\s+(m²|m³|Item|kg|ton|No\.|pcs|m)\s+([0-9,]+)\s+([0-9,]+)\s+([0-9,]+)/g;
        let materials = [];
        let m;
        while ((m = materialRegex.exec(phaseBlock)) !== null) {
          materials.push({
            id: Date.now() + Math.random(),
            itemCode: m[1],
            name: m[2].split('&')[0].trim(),
            type: m[2].split('&')[1]?.trim() || '',
            unit: m[3],
            quantity: parseInt(m[4].replace(/,/g, '')),
            rate: parseInt(m[5].replace(/,/g, '')),
            total: parseInt(m[6].replace(/,/g, '')),
          });
        }
        return {
          id: phaseId++,
          name,
          startDate: '',
          endDate: '',
          isExpanded: true,
          materials: materials.map(mat => ({
            id: mat.id,
            name: mat.name,
            type: mat.type,
            quantity: mat.quantity,
            unit: mat.unit,
            rate: mat.rate,
            total: mat.total,
            itemCode: mat.itemCode
          }))
        };
      });
    } catch (e) {
      return [];
    }
  };

  // Handle BOQ file change (PDF)
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, boqFile: file }));
      if (file.type === 'application/pdf') {
        setBoqLoading(true);
        try {
          const textData = await extractTextFromPDF(file);
          const parsedPhases = parseBOQData(textData);
          if (parsedPhases.length > 0) {
            setPhases(parsedPhases);
          } else {
            setPhases([]);
            alert('Could not extract phases/materials from the PDF.');
          }
        } catch (err) {
          setPhases([]);
          alert('Error parsing BOQ PDF.');
        } finally {
          setBoqLoading(false);
        }
      }
    }
  };

  const handleCreateProject = async () => {
    const form = new FormData();
    form.append('projectName', formData.projectName);
    form.append('location', formData.location);
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    form.append('progressStatus', formData.progressStatus);
    if (formData.boqFile) form.append('boqFile', formData.boqFile);

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
    form.append('phases', JSON.stringify(phasesPayload));

    console.log(phasesPayload);
    
    try {
      const res = await fetch('http://localhost:5454/api/projects/create', {
        method: 'POST',
        body: form
      });
      if (res.ok) {
        alert('Project created successfully!');
        navigate('/projects-list');
        // Optionally, reset form or redirect here
      } else {
        alert('Failed to create project. Please try again.');
      }
    } catch (err) {
      alert('Failed to create project. Please try again.');
    }
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', formData);
  };

  const handleCancel = () => {
    console.log('Cancelled');
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
                  {boqLoading && (
                    <div className="mt-4 text-blue-700">Parsing BOQ PDF and extracting phases/materials...</div>
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
                            style={{backgroundColor: '#236571'}}
                          >
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