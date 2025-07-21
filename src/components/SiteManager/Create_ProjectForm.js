import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Upload, FolderPlus, Save, X, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { pdfjs } from 'react-pdf';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const Create_ProjectForm = () => {
  const {authState}=useContext(AuthContext);
  // console.log("Auth State:", authState?.user?.managerId);
  const managerId = authState?.user?.managerId || '';
  
  const [formData, setFormData] = useState({
    managerId: '',
    projectName: '',
    location: '',
    startDate: '',
    endDate: '',
    progressStatus: '',
    boqFile: null
  });
  
  if(managerId){
    formData.managerId = managerId;
  }
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setFormData(prev => ({
        ...prev,
        managerId: user.id
      }));
    }
  }, []);

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

  // --- BOQ PDF PARSING LOGIC ---
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

  const parseBOQData = (textData) => {
    try {
      const phaseRegex = /PHASE [0-9]+[\s\S]*?(?=PHASE [0-9]+|$)/g;
      const matches = textData.fullText.match(phaseRegex);
      if (!matches) return [];
      let phaseId = 1;
      return matches.map(phaseBlock => {
        const lines = phaseBlock.split(/\n|  /).map(l => l.trim()).filter(Boolean);
        const name = lines[0];
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
    form.append('managerId', formData.managerId);
    form.append('location', formData.location);
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    form.append('progressStatus', formData.progressStatus);
    if (formData.boqFile) form.append('boqFile', formData.boqFile);

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

    // console.log(phasesPayload);
    
    try {
      const res = await fetch('http://localhost:8080/api/projects/create', {
        method: 'POST',
        body: form
      });
      if (res.ok) {
        alert('Project created successfully!');
        navigate('/projects-list');
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
    navigate('/projects-list');
  };

  return (
    <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-xl flex items-center justify-center shadow-lg">
            <FolderPlus className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-main_dark">Create New Project</h1>
        </div>
        <p className="text-slatebluegray text-base">Fill in the details below to create a new construction project</p>
      </div>

      {/* Form */}
      <div className="bg-purewhite border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-8">
        
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
                Manager ID
              </label>
              <input
                type="text"
                name="managerId"
                value={formData?.managerId}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
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
            
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-150 ${
                dragActive 
                  ? 'border-web_yellow bg-web_yellow/5' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-web_yellow/20 to-web_yellow/10 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-web_yellow" />
                </div>
                <div className="mb-4">
                  <p className="text-main_dark font-medium mb-1">
                    Drop your BOQ files here or click to browse
                  </p>
                  <p className="text-sm text-slatebluegray">
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
                  <span className="bg-deep_green hover:bg-deep_green/80 text-white px-6 py-3 rounded-lg font-medium transition-all duration-150 shadow-sm hover:shadow-md">
                    Choose File
                  </span>
                </label>
                
                {formData.boqFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      Selected: {formData.boqFile.name}
                    </p>
                  </div>
                )}
                {boqLoading && (
                  <div className="mt-4 flex items-center gap-2 text-deep_green">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-deep_green"></div>
                    <span className="text-sm font-medium">Parsing BOQ PDF and extracting phases/materials...</span>
                  </div>
                )}
              </div>
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
            onClick={handleCreateProject}
            className="inline-flex items-center px-8 py-3 bg-deep_green hover:bg-deep_green/80 text-white font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Project
          </button>
          
          <button
            onClick={handleSaveAsDraft}
            className="inline-flex items-center px-8 py-3 bg-web_yellow hover:bg-web_yellow/80 text-main_dark font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </button>
          
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-8 py-3 border border-gray-300 text-slatebluegray hover:text-main_dark font-semibold rounded-lg hover:bg-gray-50 transition-all duration-150"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create_ProjectForm;
