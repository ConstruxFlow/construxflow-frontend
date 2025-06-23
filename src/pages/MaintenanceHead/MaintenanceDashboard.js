import React from 'react';
import { Calendar, AlertTriangle, CheckCircle, Clock, AlertCircle, Eye, Plus, FileText } from 'lucide-react';
import ScheduleOverview from '../../components/MaintenanceHead/ScheduleOverview';

const MaintenanceDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Maintenance Dashboard</h1>
          <p className="text-gray-600">Welcome back, John. Here's your Maintenance overview.</p>
        </div>

        {/* Alert Banner */}
        <div className="bg-yellow-400 border border-yellow-500 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-800 mr-2" />
            <span className="text-yellow-800 font-medium">3 new maintenance requests require your attention</span>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-900 transition-colors">
            View All
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tasks */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">142</p>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-green-600">+12% from last month</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">89</p>
              </div>
              <div className="bg-green-600 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-green-600">+8% completion rate</p>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">23</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600">Next 7 days</p>
          </div>

          {/* Overdue */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">7</p>
              </div>
              <div className="bg-red-500 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-red-600">Needs attention</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <ScheduleOverview/>
            
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Priority Tasks */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Priority Tasks</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">HVAC Repair - Building A</p>
                    <p className="text-xs text-gray-500">Due Today</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Elevator Maintenance</p>
                    <p className="text-xs text-gray-500">Tomorrow</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Fire Safety Check</p>
                    <p className="text-xs text-gray-500">Dec 20</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Team Status</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Mike Johnson</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Sarah Davis</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">On Task</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Tom Wilson</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Off Duty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Schedule Maintenance</span>
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Request Material</span>
              </button>
              <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>View Logs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
