import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, FileText, Download, Filter, Search } from 'lucide-react';

const AnalyticsReports = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [dateRange, setDateRange] = useState({ start: '', end: '' }); // Empty initial dates
  const [selectedReportType, setSelectedReportType] = useState('All');

  // Centralized color palette
  const colors = {
    teal: '#236571',
    green: '#10B981',
    yellow: '#EFC11A',
    blue: '#3B82F6',
    lime: '#84CC16',
    orange: '#F97316',
  };

  // Sample data for charts
  const projectCompletionData = [
    { month: 'Jan', completions: 2 },
    { month: 'Feb', completions: 4 },
    { month: 'Mar', completions: 6 },
    { month: 'Apr', completions: 8 },
    { month: 'May', completions: 12 },
    { month: 'Jun', completions: 15 },
  ];

  const upcomingProjectsData = [
    { name: 'Planning', value: 25, color: colors.blue },
    { name: 'Development', value: 35, color: colors.green },
    { name: 'Testing', value: 20, color: colors.lime },
    { name: 'Review', value: 20, color: colors.orange },
  ];

  const stockInventoryData = [
    { category: '1', inStock: 4500, lowStock: 3200, outOfStock: 1200 },
    { category: '2', inStock: 6200, lowStock: 4100, outOfStock: 800 },
    { category: '3', inStock: 5800, lowStock: 3900, outOfStock: 1500 },
  ];

  // Pre-generated reports data with URLs
  const preGeneratedReports = [
    {
      id: 1,
      title: 'Monthly Performance Report',
      description: 'Comprehensive analysis of project completions and team performance',
      date: '2024-06-30',
      type: 'Performance',
      size: '2.3 MB',
      downloads: 245,
      url: '/reports/performance-2024-06-30.pdf',
    },
    {
      id: 2,
      title: 'Inventory Status Report',
      description: 'Stock levels, low inventory alerts, and procurement recommendations',
      date: '2024-06-28',
      type: 'Inventory',
      size: '1.8 MB',
      downloads: 189,
      url: '/reports/inventory-2024-06-28.pdf',
    },
    {
      id: 3,
      title: 'Financial Summary Q2',
      description: 'Revenue, expenses, and profitability analysis for Q2 2024',
      date: '2024-06-25',
      type: 'Financial',
      size: '3.1 MB',
      downloads: 312,
      url: '/reports/financial-2024-06-25.pdf',
    },
    {
      id: 4,
      title: 'Customer Satisfaction Survey',
      description: 'Client feedback analysis and satisfaction metrics',
      date: '2024-06-20',
      type: 'Customer',
      size: '1.4 MB',
      downloads: 156,
      url: '/reports/customer-2024-06-20.pdf',
    },
    {
      id: 5,
      title: 'Resource Utilization Report',
      description: 'Team productivity and resource allocation analysis',
      date: '2024-06-15',
      type: 'Operations',
      size: '2.7 MB',
      downloads: 198,
      url: '/reports/operations-2024-06-15.pdf',
    },
  ];

  const reportTypes = ['All', 'Performance', 'Inventory', 'Financial', 'Customer', 'Operations'];

  const handleDownload = (reportId, title, url) => {
    // Simulate download with error handling
    try {
      if (!url) throw new Error('Report URL not available');
      // In a real app, this would trigger a download via window.location or an API
      alert(`Downloading ${title} from ${url}...`);
    } catch (error) {
      alert(`Error downloading ${title}: ${error.message}`);
    }
  };

  const generateReport = () => {
    if (!dateRange.start || !dateRange.end) {
      alert('Please select both start and end dates');
      return;
    }
    if (new Date(dateRange.end) < new Date(dateRange.start)) {
      alert('End date must be after start date');
      return;
    }
    alert(`Generating report for period: ${dateRange.start} to ${dateRange.end}`);
  };

  // Filter reports based on selected type
  const filteredReports = selectedReportType === 'All'
    ? preGeneratedReports
    : preGeneratedReports.filter(report => report.type === selectedReportType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Analytics & Reports
          </h1>
          <p className="text-gray-600 text-lg">Monitor performance and generate insights</p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex justify-center">
              <div className="flex space-x-2 bg-white rounded-xl p-2 shadow-sm">
                <button
                  className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === 'analytics'
                      ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('analytics')}
                  aria-label="View Analytics"
                >
                  📊 Analytics
                </button>
                <button
                  className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === 'reports'
                      ? 'text-white bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('reports')}
                  aria-label="View Reports"
                >
                  📋 Reports
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Analytics Tab Content */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Project Completions Chart */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Project Completions</h3>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectCompletionData}>
                          <XAxis dataKey="month" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Bar dataKey="completions" fill={colors.teal} radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Trend arrow */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">+25% Growth</p>
                          <p className="text-xs text-gray-600">vs last month</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Projects Pie Chart */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Upcoming Projects</h3>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
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
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Stock Inventory Status */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Stock Inventory Status</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Live Data</span>
                    </div>
                  </div>

                  {/* Inventory Icons Grid (Placeholder for inventory items) */}
                  <div className="grid grid-cols-12 gap-3 mb-8">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-white rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow"
                        title="Inventory Item"
                      ></div>
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
                        <Bar dataKey="inStock" fill={colors.green} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="lowStock" fill={colors.yellow} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="outOfStock" fill={colors.teal} radius={[4, 4, 0, 0]} />
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab Content */}
            {activeTab === 'reports' && (
              <div className="space-y-8">
                {/* Date Filter and Generate Report */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Generate Custom Report</h3>
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex flex-wrap gap-6 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <Calendar className="inline w-5 h-5 mr-2 text-indigo-600" />
                        Select Date Range
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                          className="flex-1 px-4 py-3 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          aria-label="Start Date"
                        />
                        <div className="px-3 py-2 bg-white rounded-lg border border-indigo-200 text-gray-500 font-medium">
                          to
                        </div>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                          className="flex-1 px-4 py-3 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          aria-label="End Date"
                        />
                      </div>
                    </div>
                    <button
                      onClick={generateReport}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      aria-label="Generate Report"
                    >
                      <Filter className="inline w-5 h-5 mr-2" />
                      Generate Report
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-gray-800">Pre-generated Reports</h3>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {reportTypes.map((type) => (
                        <button
                          key={type}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md ${
                            selectedReportType === type
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedReportType(type)}
                          aria-label={`Filter by ${type} reports`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reports Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReports.length === 0 ? (
                      <p className="text-gray-600 col-span-full text-center">No reports found for this filter.</p>
                    ) : (
                      filteredReports.map((report) => (
                        <div
                          key={report.id}
                          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
                              </div>
                              <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full font-semibold">
                                {report.type}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDownload(report.id, report.title, report.url)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                              aria-label={`Download ${report.title}`}
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          </div>

                          <h4 className="font-bold text-gray-800 mb-2 text-lg">{report.title}</h4>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

                          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                            <span className="font-medium">{report.date}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{report.size}</span>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-gray-500">{report.downloads} downloads</span>
                            </div>
                            <a
                              href={report.url}
                              download
                              onClick={() => handleDownload(report.id, report.title, report.url)}
                              className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                              aria-label={`Download ${report.title}`}
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;