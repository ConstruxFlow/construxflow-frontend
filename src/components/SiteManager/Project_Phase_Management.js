import React, { useState } from 'react';

const Project_Phase_Management = () => {
  const [phases, setPhases] = useState([
    {
      id: 1,
      name: "Foundation",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      isExpanded: true,
      materials: [
        { id: 1, name: "Concrete", quantity: "50", unit: "m³" },
        { id: 2, name: "Steel Rebar", quantity: "200", unit: "kg" }
      ]
    },
    {
      id: 2,
      name: "Framing",
      startDate: "",
      endDate: "",
      isExpanded: false,
      materials: []
    }
  ]);

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
              name: "", 
              quantity: "", 
              unit: "m³" 
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
      startDate: "",
      endDate: "",
      isExpanded: true,
      materials: []
    };
    setPhases([...phases, newPhase]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen pt-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Phases Management</h1>
        <p className="text-gray-600">Add and manage construction phases with materials</p>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={phase.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                onClick={(e) => {
                  e.stopPropagation();
                  deletePhase(phase.id);
                }}
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
                      onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
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
                      onChange={(e) => updatePhase(phase.id, 'startDate', e.target.value)}
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
                      onChange={(e) => updatePhase(phase.id, 'endDate', e.target.value)}
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
                    {phase.materials.map((material) => (
                      <div key={material.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                        <input
                          type="text"
                          placeholder="Material name"
                          value={material.name}
                          onChange={(e) => updateMaterial(phase.id, material.id, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(phase.id, material.id, 'quantity', e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={material.unit}
                          onChange={(e) => updateMaterial(phase.id, material.id, 'unit', e.target.value)}
                          className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="m³">m³</option>
                          <option value="kg">kg</option>
                          <option value="pcs">pcs</option>
                          <option value="m">m</option>
                          <option value="m²">m²</option>
                        </select>
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
  );
};

export default Project_Phase_Management;