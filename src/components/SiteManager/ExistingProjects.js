import React from 'react';

const ExistingProjects = () => {
  const projects = [
    {
      id: 1,
      name: "Downtown Office Complex",
      status: "In Progress",
      statusColor: "text-blue-600",
      statusBg: "bg-blue-100",
      startDate: "March 15, 2024",
      endDate: "December 30, 2024"
    },
    {
      id: 2,
      name: "Residential Tower A",
      status: "Completed",
      statusColor: "text-green-600",
      statusBg: "bg-green-100",
      startDate: "January 8, 2024",
      endDate: "October 15, 2024"
    },
    {
      id: 3,
      name: "Highway Bridge Extension",
      status: "On Hold",
      statusColor: "text-orange-600",
      statusBg: "bg-orange-100",
      startDate: "May 1, 2024",
      endDate: "April 30, 2025"
    },
    {
      id: 4,
      name: "Shopping Mall Renovation",
      status: "Planning",
      statusColor: "text-purple-600",
      statusBg: "bg-purple-100",
      startDate: "July 10, 2024",
      endDate: "March 15, 2025"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen pt-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Construction Projects</h1>
          <p className="text-gray-600">Manage and track all your construction projects</p>
        </div>
        <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-lg font-medium text-[#000000]">
            <span>🏗️</span>
            Create New Project
        </span>
        
        <button
            className="px-4 py-2 text-black font-semibold rounded-lg"
            style={{ backgroundColor: '#EFC11A' }}
        >
            + New Project
        </button>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">Status:</span>
          <select className="border border-gray-300 rounded-md px-3 py-1 bg-white">
            <option>All Projects</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>On Hold</option>
            <option>Planning</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="border border-gray-300 rounded-md px-3 py-1 bg-white w-64"
          />
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <button 
                className="text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                style={{backgroundColor: '#236571'}}
              >
                ✏️ Edit
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1">Status</label>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.statusColor} ${project.statusBg}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1">Start Date</label>
                <p className="text-gray-900">{project.startDate}</p>
              </div>
              
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1">End Date</label>
                <p className="text-gray-900">{project.endDate}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
            <button 
                className="text-black font-semibold px-4 py-2 rounded text-sm flex items-center gap-2"
                style={{ backgroundColor: '#EFC11A' }}
            >
                + Add Phase
            </button>
            <button 
                className="text-black font-semibold px-4 py-2 rounded text-sm flex items-center gap-2"
                style={{ backgroundColor: '#EFC11A' }}
            >
                🗎 View Materials
            </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ExistingProjects;