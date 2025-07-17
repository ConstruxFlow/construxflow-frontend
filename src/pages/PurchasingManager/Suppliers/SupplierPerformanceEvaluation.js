import React, { useState } from 'react';
import { FaDownload, FaStar, FaTruck, FaDollarSign, FaShieldAlt , FaEye, FaEdit } from 'react-icons/fa';
import { FaPlus } from "react-icons/fa6";
import NavBar from '../../../components/NavBar';
import { useNavigate } from 'react-router-dom';


const SupplierPerformanceEvaluation = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Last 6 Months');
  const [feedbackSupplier, setFeedbackSupplier] = useState('');
  const [feedbackRating, setFeedbackRating] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');
  const navigate = useNavigate();

  
  const performanceData = [
    {
      month: 'Jan',
      qualityScore: 4.2,
      deliveryScore: 4.1
    },
    {
      month: 'Feb',
      qualityScore: 4.3,
      deliveryScore: 4.2
    },
    {
      month: 'Mar',
      qualityScore: 4.4,
      deliveryScore: 4.3
    },
    {
      month: 'Apr',
      qualityScore: 4.5,
      deliveryScore: 4.4
    },
    {
      month: 'May',
      qualityScore: 4.4,
      deliveryScore: 4.3
    },
    {
      month: 'Jun',
      qualityScore: 4.6,
      deliveryScore: 4.5
    }
  ];

  const deliveryData = [
    { week: 'Week 1', onTime: 95, delayed: 5 },
    { week: 'Week 2', onTime: 88, delayed: 12 },
    { week: 'Week 3', onTime: 92, delayed: 8 },
    { week: 'Week 4', onTime: 90, delayed: 10 }
  ];

  const supplierTableData = [
    {
      name: 'TechCorp Solutions',
      rating: 4.8,
      onTimeDelivery: 95,
      qualityScore: 4.7,
      costPerformance: 92,
      status: 'Excellent',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'Global Materials Inc',
      rating: 4.2,
      onTimeDelivery: 85,
      qualityScore: 4.1,
      costPerformance: 85,
      status: 'Good',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Premier Logistics',
      rating: 3.8,
      onTimeDelivery: 78,
      qualityScore: 3.9,
      costPerformance: 82,
      status: 'Average',
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ];

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar
        links={[
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
        ]}
      />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-main_dark mb-1 tracking-tigh">
              Supplier Performance Evaluation
            </h1>
            <p className="text-gray-600 text-sm">
              Monitor and analyze supplier performance metrics across all projects
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                >
                  <option>All Suppliers</option>
                  <option>TechCorp Solutions</option>
                  <option>Global Materials Inc</option>
                  <option>Premier Logistics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                >
                  <option>All Projects</option>
                  <option>Downtown Office Complex</option>
                  <option>Riverside Mall Extension</option>
                  <option>Bridge Construction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <select
                  value={selectedTimePeriod}
                  onChange={(e) => setSelectedTimePeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                >
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                  <option>Last Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <button className="w-full px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-medium">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Overall Rating</h3>
                <FaStar className="w-5 h-5 text-web_yellow" />
              </div>
              <div className="text-2xl font-bold text-main_dark">4.2</div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">On-Time Delivery</h3>
                <FaTruck className="w-5 h-5 text-deep_green" />
              </div>
              <div className="text-2xl font-bold text-main_dark">92%</div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Cost Efficiency</h3>
                <FaDollarSign className="w-5 h-5 text-web_yellow" />
              </div>
              <div className="text-2xl font-bold text-main_dark">87%</div>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Quality Score</h3>
                <FaShieldAlt  className="w-5 h-5 text-deep_green" />
              </div>
              <div className="text-2xl font-bold text-main_dark">4.5</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Performance Trends Chart */}
            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-main_dark mb-4">Performance Trends</h3>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#grid)" />
                  
                  {/* Y-axis labels */}
                  <text x="10" y="20" className="text-xs fill-gray-500">6</text>
                  <text x="10" y="60" className="text-xs fill-gray-500">4</text>
                  <text x="10" y="100" className="text-xs fill-gray-500">2</text>
                  <text x="10" y="140" className="text-xs fill-gray-500">0</text>
                  
                  {/* X-axis labels */}
                  {performanceData.map((data, index) => (
                    <text key={index} x={60 + index * 50} y="190" className="text-xs fill-gray-500" textAnchor="middle">
                      {data.month}
                    </text>
                  ))}
                  
                  {/* Quality Score Line */}
                  <polyline
                    fill="none"
                    stroke="#236571"
                    strokeWidth="2"
                    points={performanceData.map((data, index) => 
                      `${60 + index * 50},${160 - (data.qualityScore * 30)}`
                    ).join(' ')}
                  />
                  
                  {/* Delivery Score Line */}
                  <polyline
                    fill="none"
                    stroke="#efc11a"
                    strokeWidth="2"
                    points={performanceData.map((data, index) => 
                      `${60 + index * 50},${160 - (data.deliveryScore * 30)}`
                    ).join(' ')}
                  />
                  
                  {/* Data points */}
                  {performanceData.map((data, index) => (
                    <g key={index}>
                      <circle cx={60 + index * 50} cy={160 - (data.qualityScore * 30)} r="3" fill="#236571" />
                      <circle cx={60 + index * 50} cy={160 - (data.deliveryScore * 30)} r="3" fill="#efc11a" />
                    </g>
                  ))}
                </svg>
                
                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-deep_green rounded-full"></div>
                    <span>Quality Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-web_yellow rounded-full"></div>
                    <span>Delivery Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Metrics Chart */}
            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-main_dark mb-4">Delivery Metrics</h3>
              <div className="h-64">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {deliveryData.map((data, index) => (
                    <g key={index}>
                      {/* On-time bars */}
                      <rect
                        x={50 + index * 80}
                        y={200 - (data.onTime * 1.5)}
                        width="30"
                        height={data.onTime * 1.5}
                        fill="#236571"
                      />
                      {/* Delayed bars */}
                      <rect
                        x={85 + index * 80}
                        y={200 - (data.delayed * 1.5)}
                        width="30"
                        height={data.delayed * 1.5}
                        fill="#efc11a"
                      />
                      {/* Week labels */}
                      <text x={80 + index * 80} y="220" className="text-xs fill-gray-500" textAnchor="middle">
                        {data.week}
                      </text>
                    </g>
                  ))}
                  
                  {/* Y-axis labels */}
                  <text x="10" y="20" className="text-xs fill-gray-500">100</text>
                  <text x="10" y="95" className="text-xs fill-gray-500">50</text>
                  <text x="10" y="170" className="text-xs fill-gray-500">0</text>
                </svg>
                
                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-deep_green rounded-full"></div>
                    <span>On-Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-web_yellow rounded-full"></div>
                    <span>Delayed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Performance Table */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-main_dark">Supplier Performance Table </h2>
              <span onClick={() => navigate('/purchasing/supplier/list')} className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-500/80">View All</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_gray/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Supplier</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">On-Time Delivery</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Quality Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Cost Performance</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {supplierTableData.map((supplier, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-main_dark">
                        {supplier.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-main_dark">{supplier.rating}</span>
                          <FaStar className="w-3 h-3 text-web_yellow" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.onTimeDelivery}%
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.qualityScore}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {supplier.costPerformance}%
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${supplier.statusColor}`}>
                          {supplier.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Supplier Feedback */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-main_dark mb-4">Submit Supplier Feedback</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Supplier
                </label>
                <select
                  value={feedbackSupplier}
                  onChange={(e) => setFeedbackSupplier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                >
                  <option value="">Choose supplier...</option>
                  <option>TechCorp Solutions</option>
                  <option>Global Materials Inc</option>
                  <option>Premier Logistics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                <select
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                >
                  <option value="">Select rating...</option>
                  <option>5 - Excellent</option>
                  <option>4 - Good</option>
                  <option>3 - Average</option>
                  <option>2 - Poor</option>
                  <option>1 - Very Poor</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Comments
              </label>
              <textarea
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                placeholder="Enter your feedback about the supplier's performance..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
              />
            </div>
            <div className="mt-6">
              <button className="px-6 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-medium">
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplierPerformanceEvaluation;
