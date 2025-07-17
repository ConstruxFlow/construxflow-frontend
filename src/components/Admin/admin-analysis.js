import React from 'react';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AnalyticsReports = () => {
  // Sample data for charts
  const projectCompletionData = [
    { month: 'Jan', completions: 2 },
    { month: 'Feb', completions: 4 },
    { month: 'Mar', completions: 6 },
    { month: 'Apr', completions: 8 },
    { month: 'May', completions: 12 },
    { month: 'Jun', completions: 15 }
  ];

  const upcomingProjectsData = [
    { name: 'Planning', value: 25, color: '#3B82F6' },
    { name: 'Development', value: 35, color: '#10B981' },
    { name: 'Testing', value: 20, color: '#84CC16' },
    { name: 'Review', value: 20, color: '#F97316' }
  ];

  const stockInventoryData = [
    { category: '1', inStock: 4500, lowStock: 3200, outOfStock: 1200 },
    { category: '2', inStock: 6200, lowStock: 4100, outOfStock: 800 },
    { category: '3', inStock: 5800, lowStock: 3900, outOfStock: 1500 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics & Reports</h1>
        <p className="text-gray-600">Monitor performance and generate insights</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-white rounded-lg p-1 w-fit">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
            Analytics
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
            Reports
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Completions Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Completions</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectCompletionData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Bar dataKey="completions" fill="#236571" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Trend arrow */}
          <div className="flex items-center mt-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>
        </div>

        {/* Upcoming Projects Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Projects</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={upcomingProjectsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {upcomingProjectsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stock Inventory Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Stock Inventory Status</h3>
        
        {/* Inventory Icons Grid */}
        <div className="grid grid-cols-8 gap-4 mb-6">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockInventoryData} barCategoryGap="20%">
              <XAxis dataKey="category" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                domain={[0, 8000]}
                ticks={[1000, 2000, 3000, 4000, 5000, 6000, 7000]}
              />
              <Bar dataKey="inStock" fill="#10B981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="lowStock" fill="#EFC11A" radius={[2, 2, 0, 0]} />
              <Bar dataKey="outOfStock" fill="#236571" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;