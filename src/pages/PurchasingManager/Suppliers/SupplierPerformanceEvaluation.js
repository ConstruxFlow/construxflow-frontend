import React, { useState, useEffect, useRef } from 'react';
import { FaDownload, FaStar, FaTruck, FaDollarSign, FaShieldAlt, FaEye, FaEdit, FaSpinner, FaChartBar, FaMapMarkerAlt, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { FaPlus } from "react-icons/fa6";
import NavBar from '../../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SupplierPerformanceEvaluation = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Last 6 Months');
  const [feedbackSupplier, setFeedbackSupplier] = useState('');
  const [feedbackRating, setFeedbackRating] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');
  
  // States for API data
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Refs for export
  const reportRef = useRef();
  
  const navigate = useNavigate();

  // Fetch supplier data from API
  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/supplier/all');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setSuppliers(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to fetch supplier data');
      }
    } catch (err) {
      console.error('Error fetching supplier data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely parse numeric values
  const parseNumeric = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Calculate overall metrics from real data only
  const calculateOverallMetrics = () => {
    if (suppliers.length === 0) {
      return {
        overallRating: 0,
        onTimeDelivery: 0,
        totalOrders: 0,
        avgDelayDays: 0,
        suppliersWithDeliveryCapability: 0
      };
    }

    const suppliersWithRating = suppliers.filter(s => s.rating_by_site_manager !== null);
    const suppliersWithDelivery = suppliers.filter(s => s.on_time_delivery_rate !== null);
    const suppliersWithOrders = suppliers.filter(s => s.past_orders_completed !== null);
    const suppliersWithDelay = suppliers.filter(s => s.avg_delay_days !== null);
    const suppliersWithCapability = suppliers.filter(s => s.delivery_Capabilities === 'yes');

    const totalRating = suppliersWithRating.reduce((sum, s) => 
      sum + parseNumeric(s.rating_by_site_manager), 0
    );
    const totalOnTime = suppliersWithDelivery.reduce((sum, s) => 
      sum + parseNumeric(s.on_time_delivery_rate), 0
    );
    const totalOrders = suppliersWithOrders.reduce((sum, s) => 
      sum + parseNumeric(s.past_orders_completed), 0
    );
    const totalDelay = suppliersWithDelay.reduce((sum, s) => 
      sum + parseNumeric(s.avg_delay_days), 0
    );

    return {
      overallRating: suppliersWithRating.length > 0 ? (totalRating / suppliersWithRating.length).toFixed(1) : 0,
      onTimeDelivery: suppliersWithDelivery.length > 0 ? Math.round(totalOnTime / suppliersWithDelivery.length) : 0,
      totalOrders: totalOrders,
      avgDelayDays: suppliersWithDelay.length > 0 ? (totalDelay / suppliersWithDelay.length).toFixed(1) : 0,
      suppliersWithDeliveryCapability: suppliersWithCapability.length
    };
  };

  const metrics = calculateOverallMetrics();

  // Get real data for rating distribution chart
  const getRatingDistributionData = () => {
    const ratingRanges = [
      { range: '4.5-5.0', min: 4.5, max: 5.0, count: 0, color: '#10B981' },
      { range: '4.0-4.4', min: 4.0, max: 4.4, count: 0, color: '#3B82F6' },
      { range: '3.0-3.9', min: 3.0, max: 3.9, count: 0, color: '#F59E0B' },
      { range: '2.0-2.9', min: 2.0, max: 2.9, count: 0, color: '#EF4444' },
      { range: '1.0-1.9', min: 1.0, max: 1.9, count: 0, color: '#8B5CF6' }
    ];

    suppliers.forEach(supplier => {
      const rating = parseNumeric(supplier.rating_by_site_manager);
      if (rating > 0) {
        const range = ratingRanges.find(r => rating >= r.min && rating <= r.max);
        if (range) range.count++;
      }
    });

    return ratingRanges;
  };

  // Get real data for delivery performance comparison
  const getDeliveryPerformanceData = () => {
    return suppliers
      .filter(s => s.on_time_delivery_rate !== null && s.company_name)
      .map(supplier => ({
        name: supplier.company_name.length > 15 
          ? supplier.company_name.substring(0, 15) + '...' 
          : supplier.company_name,
        fullName: supplier.company_name,
        onTimeRate: parseNumeric(supplier.on_time_delivery_rate),
        delayDays: parseNumeric(supplier.avg_delay_days),
        orders: parseNumeric(supplier.past_orders_completed)
      }))
      .sort((a, b) => b.onTimeRate - a.onTimeRate)
      .slice(0, 6);
  };

  // Transform supplier data for table display
  const getSupplierTableData = () => {
    return suppliers.map(supplier => {
      const rating = parseNumeric(supplier.rating_by_site_manager);
      const onTimeDelivery = parseNumeric(supplier.on_time_delivery_rate);
      const pastOrders = parseNumeric(supplier.past_orders_completed);
      
      // Determine status based on performance
      let status = 'New';
      let statusColor = 'bg-gray-100 text-gray-800';
      
      if (rating > 0 || onTimeDelivery > 0 || pastOrders > 0) {
        if (rating >= 4.5 && onTimeDelivery >= 90) {
          status = 'Excellent';
          statusColor = 'bg-green-100 text-green-800';
        } else if (rating >= 4.0 && onTimeDelivery >= 80) {
          status = 'Good';
          statusColor = 'bg-blue-100 text-blue-800';
        } else if (rating >= 3.0 && onTimeDelivery >= 70) {
          status = 'Average';
          statusColor = 'bg-yellow-100 text-yellow-800';
        } else {
          status = 'Needs Improvement';
          statusColor = 'bg-red-100 text-red-800';
        }
      }

      return {
        id: supplier.supplier_id,
        name: supplier.company_name || supplier.name,
        contactName: supplier.name,
        rating: rating,
        onTimeDelivery: onTimeDelivery,
        pastOrders: pastOrders,
        avgDelayDays: parseNumeric(supplier.avg_delay_days),
        deliveryCapabilities: supplier.delivery_Capabilities,
        quotationAcceptanceRate: parseNumeric(supplier.quotation_acceptance_rate),
        numberOfRatings: parseNumeric(supplier.number_of_existing_ratings),
        status,
        statusColor,
        email: supplier.email,
        phone: supplier.phone_number1,
        address: supplier.address,
        businessRegistration: supplier.business_Registration_Number
      };
    });
  };

  const supplierTableData = getSupplierTableData();
  const ratingDistribution = getRatingDistributionData();
  const deliveryPerformance = getDeliveryPerformanceData();

  // Get supplier options for dropdowns
  const getSupplierOptions = () => {
    return suppliers.map(supplier => ({
      id: supplier.supplier_id,
      name: supplier.company_name || supplier.name
    }));
  };

  // Export to PDF function
  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const currentDate = new Date().toLocaleDateString();
      
      // Add header
      pdf.setFontSize(20);
      pdf.text('Supplier Performance Evaluation Report', 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${currentDate}`, 20, 30);
      pdf.text(`Total Suppliers: ${suppliers.length}`, 20, 40);
      
      // Add metrics summary
      pdf.setFontSize(16);
      pdf.text('Performance Summary', 20, 55);
      
      pdf.setFontSize(12);
      pdf.text(`Average Rating: ${metrics.overallRating > 0 ? metrics.overallRating : 'N/A'}`, 20, 65);
      pdf.text(`Average On-Time Delivery: ${metrics.onTimeDelivery > 0 ? `${metrics.onTimeDelivery}%` : 'N/A'}`, 20, 75);
      pdf.text(`Total Orders: ${metrics.totalOrders}`, 20, 85);
      pdf.text(`Average Delay Days: ${metrics.avgDelayDays > 0 ? metrics.avgDelayDays : '0'}`, 20, 95);
      
      // Add supplier details table
      let yPosition = 110;
      pdf.setFontSize(14);
      pdf.text('Supplier Details', 20, yPosition);
      yPosition += 10;
      
      // Table headers
      pdf.setFontSize(10);
      pdf.text('Company Name', 20, yPosition);
      pdf.text('Contact', 70, yPosition);
      pdf.text('Rating', 110, yPosition);
      pdf.text('Delivery Rate', 140, yPosition);
      pdf.text('Status', 180, yPosition);
      yPosition += 5;
      
      // Add line under headers
      pdf.line(20, yPosition, 200, yPosition);
      yPosition += 5;
      
      // Add supplier data
      supplierTableData.forEach((supplier, index) => {
        if (yPosition > 270) { // Start new page if needed
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(supplier.name.substring(0, 25), 20, yPosition);
        pdf.text(supplier.contactName.substring(0, 20), 70, yPosition);
        pdf.text(supplier.rating > 0 ? supplier.rating.toFixed(1) : 'N/A', 110, yPosition);
        pdf.text(supplier.onTimeDelivery > 0 ? `${supplier.onTimeDelivery}%` : 'N/A', 140, yPosition);
        pdf.text(supplier.status, 180, yPosition);
        yPosition += 8;
      });
      
      // Save PDF
      pdf.save(`supplier-performance-report-${currentDate.replace(/\//g, '-')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report');
    } finally {
      setIsExporting(false);
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    try {
      setIsExporting(true);
      
      // Prepare data for Excel
      const excelData = supplierTableData.map(supplier => ({
        'Supplier ID': supplier.id,
        'Company Name': supplier.name,
        'Contact Person': supplier.contactName,
        'Email': supplier.email,
        'Phone': supplier.phone,
        'Address': supplier.address,
        'Business Registration': supplier.businessRegistration,
        'Rating': supplier.rating > 0 ? supplier.rating.toFixed(1) : 'N/A',
        'Number of Ratings': supplier.numberOfRatings || 0,
        'On-Time Delivery Rate (%)': supplier.onTimeDelivery > 0 ? supplier.onTimeDelivery : 'N/A',
        'Past Orders Completed': supplier.pastOrders || 0,
        'Average Delay Days': supplier.avgDelayDays >= 0 ? supplier.avgDelayDays : 'N/A',
        'Delivery Capabilities': supplier.deliveryCapabilities === 'yes' ? 'Available' : 'N/A',
        'Quotation Acceptance Rate (%)': supplier.quotationAcceptanceRate > 0 ? supplier.quotationAcceptanceRate : 'N/A',
        'Performance Status': supplier.status
      }));
      
      // Create summary sheet data
      const summaryData = [
        { Metric: 'Total Suppliers', Value: suppliers.length },
        { Metric: 'Average Rating', Value: metrics.overallRating > 0 ? metrics.overallRating : 'N/A' },
        { Metric: 'Average On-Time Delivery (%)', Value: metrics.onTimeDelivery > 0 ? `${metrics.onTimeDelivery}%` : 'N/A' },
        { Metric: 'Total Orders Completed', Value: metrics.totalOrders },
        { Metric: 'Average Delay Days', Value: metrics.avgDelayDays > 0 ? metrics.avgDelayDays : '0' },
        { Metric: 'Suppliers with Delivery Capability', Value: metrics.suppliersWithDeliveryCapability }
      ];
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Add summary sheet
      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Performance Summary');
      
      // Add detailed supplier data sheet
      const detailWs = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, detailWs, 'Supplier Details');
      
      // Add rating distribution sheet
      const ratingDistData = ratingDistribution.map(range => ({
        'Rating Range': range.range,
        'Number of Suppliers': range.count,
        'Percentage': supplierTableData.length > 0 ? ((range.count / supplierTableData.length) * 100).toFixed(1) + '%' : '0%'
      }));
      const ratingWs = XLSX.utils.json_to_sheet(ratingDistData);
      XLSX.utils.book_append_sheet(wb, ratingWs, 'Rating Distribution');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
      saveAs(data, `supplier-performance-report-${currentDate}.xlsx`);
      
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel report');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async () => {
    if (!feedbackSupplier || !feedbackRating) {
      alert('Please select a supplier and rating');
      return;
    }

    try {
      // TODO: Implement feedback submission API call
      console.log('Submitting feedback:', {
        supplier: feedbackSupplier,
        rating: feedbackRating,
        comments: feedbackComments
      });
      
      alert('Feedback submitted successfully!');
      setFeedbackSupplier('');
      setFeedbackRating('');
      setFeedbackComments('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          profileURL="/purchasing/profile"
          links={[
            { name: 'Dashboard', path: '/purchasing/dashboard' },
            { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
            { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
            { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
            { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
          ]}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FaSpinner className="animate-spin w-8 h-8 text-web_yellow mx-auto mb-4" />
            <p className="text-gray-600">Loading supplier data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar
          profileURL="/purchasing/profile"
          links={[
            { name: 'Dashboard', path: '/purchasing/dashboard' },
            { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
            { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
            { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
            { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
          ]}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-medium">Error loading supplier data</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={fetchSupplierData}
              className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar
        profileURL="/purchasing/profile"
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
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10" ref={reportRef}>
          {/* Page Header with Export Buttons */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h1 className="text-2xl sm:text-3xl font-semibold text-main_dark mb-1 tracking-tight">
                Supplier Performance Evaluation
              </h1>
              <p className="text-gray-600 text-sm">
                Monitor and analyze supplier performance metrics ({suppliers.length} suppliers registered)
              </p>
            </div>
            
            {/* Export Buttons */}
            <div className="flex gap-3 justify-center lg:justify-end">
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFilePdf className="w-4 h-4" />
                {isExporting ? 'Generating...' : 'Export PDF'}
              </button>
              
              <button
                onClick={exportToExcel}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFileExcel className="w-4 h-4" />
                {isExporting ? 'Generating...' : 'Export Excel'}
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-purewhite border border-gray-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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
                  {getSupplierOptions().map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Metric
                </label>
                <select
                  value={selectedTimePeriod}
                  onChange={(e) => setSelectedTimePeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent"
                >
                  <option>Overall Performance</option>
                  <option>Rating Only</option>
                  <option>Delivery Performance</option>
                  <option>Order History</option>
                </select>
              </div>
              <div>
                <button 
                  onClick={fetchSupplierData}
                  className="w-full px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-medium"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Performance Metrics Cards - Real Data Only */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
                <FaStar className="w-5 h-5 text-web_yellow" />
              </div>
              <div className="text-2xl font-bold text-main_dark">
                {metrics.overallRating > 0 ? metrics.overallRating : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                From {suppliers.filter(s => s.rating_by_site_manager !== null).length} rated suppliers
              </p>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Avg On-Time Delivery</h3>
                <FaTruck className="w-5 h-5 text-deep_green" />
              </div>
              <div className="text-2xl font-bold text-main_dark">
                {metrics.onTimeDelivery > 0 ? `${metrics.onTimeDelivery}%` : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                From {suppliers.filter(s => s.on_time_delivery_rate !== null).length} suppliers with data
              </p>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                <FaChartBar className="w-5 h-5 text-web_yellow" />
              </div>
              <div className="text-2xl font-bold text-main_dark">{metrics.totalOrders}</div>
              <p className="text-xs text-gray-500 mt-1">
                Completed across all suppliers
              </p>
            </div>

            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Avg Delay Days</h3>
                <FaShieldAlt className="w-5 h-5 text-deep_green" />
              </div>
              <div className="text-2xl font-bold text-main_dark">
                {metrics.avgDelayDays > 0 ? metrics.avgDelayDays : '0'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metrics.suppliersWithDeliveryCapability} have delivery capability
              </p>
            </div>
          </div>

          {/* Real Data Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Rating Distribution Chart - Real Data */}
            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-main_dark mb-4">Rating Distribution</h3>
              <div className="h-64 relative">
                {ratingDistribution.some(r => r.count > 0) ? (
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Y-axis labels */}
                    <text x="10" y="20" className="text-xs fill-gray-500">
                      {Math.max(...ratingDistribution.map(r => r.count))}
                    </text>
                    <text x="10" y="110" className="text-xs fill-gray-500">
                      {Math.ceil(Math.max(...ratingDistribution.map(r => r.count)) / 2)}
                    </text>
                    <text x="10" y="190" className="text-xs fill-gray-500">0</text>
                    
                    {/* Bars */}
                    {ratingDistribution.map((range, index) => {
                      const maxCount = Math.max(...ratingDistribution.map(r => r.count));
                      const barHeight = maxCount > 0 ? (range.count / maxCount) * 160 : 0;
                      return (
                        <g key={index}>
                          <rect
                            x={60 + index * 60}
                            y={180 - barHeight}
                            width="40"
                            height={barHeight}
                            fill={range.color}
                          />
                          <text 
                            x={80 + index * 60} 
                            y="200" 
                            className="text-xs fill-gray-500" 
                            textAnchor="middle"
                          >
                            {range.range}
                          </text>
                          <text 
                            x={80 + index * 60} 
                            y={175 - barHeight} 
                            className="text-xs fill-gray-700" 
                            textAnchor="middle"
                          >
                            {range.count}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FaChartBar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No rating data available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Performance Chart - Real Data */}
            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-main_dark mb-4">Top Delivery Performers</h3>
              <div className="h-64">
                {deliveryPerformance.length > 0 ? (
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Y-axis labels */}
                    <text x="10" y="20" className="text-xs fill-gray-500">100%</text>
                    <text x="10" y="110" className="text-xs fill-gray-500">50%</text>
                    <text x="10" y="190" className="text-xs fill-gray-500">0%</text>
                    
                    {/* Bars */}
                    {deliveryPerformance.map((supplier, index) => {
                      const barHeight = (supplier.onTimeRate / 100) * 160;
                      return (
                        <g key={index}>
                          <rect
                            x={50 + index * 55}
                            y={180 - barHeight}
                            width="40"
                            height={barHeight}
                            fill="#236571"
                          />
                          <text 
                            x={70 + index * 55} 
                            y="200" 
                            className="text-xs fill-gray-500" 
                            textAnchor="middle"
                            transform={`rotate(-45, ${70 + index * 55}, 200)`}
                          >
                            {supplier.name}
                          </text>
                          <text 
                            x={70 + index * 55} 
                            y={175 - barHeight} 
                            className="text-xs fill-gray-700" 
                            textAnchor="middle"
                          >
                            {supplier.onTimeRate}%
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FaTruck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No delivery performance data available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Supplier Performance Table - Enhanced with Real Data */}
          <div className="bg-purewhite border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-main_dark">Detailed Supplier Performance</h2>
              <span onClick={() => navigate('/purchasing/supplier/list')} className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-500/80">View All</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light_gray/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Delivery Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Avg Delay</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Capabilities</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-main_dark">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {supplierTableData.length > 0 ? (
                    supplierTableData.map((supplier, index) => (
                      <tr key={supplier.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm">
                          <div>
                            <div className="font-medium text-main_dark">{supplier.name}</div>
                            <div className="text-xs text-gray-500">{supplier.businessRegistration}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div>
                            <div className="font-medium text-main_dark">{supplier.contactName}</div>
                            <div className="text-xs text-gray-500">{supplier.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-main_dark">
                              {supplier.rating > 0 ? supplier.rating.toFixed(1) : 'N/A'}
                            </span>
                            {supplier.rating > 0 && <FaStar className="w-3 h-3 text-web_yellow" />}
                            {supplier.numberOfRatings > 0 && (
                              <span className="text-xs text-gray-400">({supplier.numberOfRatings})</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {supplier.onTimeDelivery > 0 ? `${supplier.onTimeDelivery}%` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {supplier.pastOrders || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {supplier.avgDelayDays >= 0 ? `${supplier.avgDelayDays} days` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            supplier.deliveryCapabilities === 'yes' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {supplier.deliveryCapabilities === 'yes' ? 'Available' : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${supplier.statusColor}`}>
                            {supplier.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No supplier data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplierPerformanceEvaluation;
