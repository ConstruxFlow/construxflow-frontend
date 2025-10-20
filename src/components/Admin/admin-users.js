import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Clock, CheckCircle, Plus, X, Mail, Lock, Download } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function ActionTile({ onClick, icon, label, iconColorClass, hoverClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 bg-white border border-light_gray rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none w-full text-left ${hoverClass}`}
    >
      <span className={`rounded-full p-2 bg-light_gray/40 flex items-center justify-center ${iconColorClass}`}>
        {icon}
      </span>
      <span className="font-medium text-base text-main_dark">{label}</span>
    </button>
  );
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', status: 'Active', role: 'Team Member' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Users are loaded from backend (managers)
  const [users, setUsers] = useState([]);

  // Stats placeholders
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '-', icon: Users, color: 'bg-light_brown' },
    { title: 'Active Users', value: '-', icon: CheckCircle, color: 'bg-deep_green' },
    { title: 'New This Month', value: '-', icon: UserPlus, color: 'bg-web_yellow' },
    { title: 'Pending Approval', value: '23', icon: Clock, color: 'bg-light_gray' }
  ]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        setStats([
          { title: 'Total Users', value: data.totalUsers.toString(), icon: Users, color: 'bg-light_brown' },
          { title: 'Active Users', value: data.activeUsers.toString(), icon: CheckCircle, color: 'bg-deep_green' },
          { title: 'New This Month', value: data.newThisMonth.toString(), icon: UserPlus, color: 'bg-web_yellow' },
          { title: 'Pending Approval', value: '23', icon: Clock, color: 'bg-light_gray' }
        ]);

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Fetch managers from backend (manager_id, user_name, email, userRole)
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/managers`);
        if (!res.ok) throw new Error(`Managers API error: ${res.status}`);
        const managers = await res.json();

        // Map backend DTO -> UI structure
        const mapped = managers.map((u) => ({
          id: u.managerId,
          name: u.userName,
          email: u.email,
          role: u.userRole || 'Manager',
          status: 'Active',
          avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(u.userName)}&backgroundColor=236571`
        }));

        setUsers(mapped);
        setError(null);
      } catch (err) {
        console.error('Error fetching managers:', err);
        setError((prev) => prev || 'Failed to load manager details');
      }
    };

    fetchManagers();
  }, []);

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: users.length + 1,
        ...newUser,
        role: newUser.role || 'Team Member',
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(newUser.name)}`
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', status: 'Active', role: 'Team Member' });
      setShowAddUser(false);
    }
  };

  const handleBulkAction = (action) => {
    alert(`Performing bulk action: ${action}`);
  };

  // Existing dummy Site Manager Overview data
  const siteManagers = [
    {
      id: 1,
      name: 'John Smith',
      visits: 12,
      notes: 'Updated safety protocols',
      sites: [{ name: 'Downtown Bridge', status: 'Active' }, { name: 'Highway Expansion', status: 'Needs Attention' }]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      visits: 8,
      notes: 'Reviewed material delivery schedule',
      sites: [{ name: 'Commercial Complex', status: 'Active' }]
    }
  ];

  return (
    <div className="min-h-screen bg-purewhite font-sans">
      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 sm:px-14 lg:px-16 py-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">User details</h2>
        <p className="text-gray-600 mb-8 text-base">
          Manage your team members, track their activities, and perform bulk actions to streamline operations.
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-purewhite border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-main_dark mt-1">
                    {loading ? (
                      <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manager Details */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Manager Details</h3>
              <button
                onClick={() => navigate('/admin-managers')}
                className="flex items-center space-x-2 bg-web_yellow text-main_dark px-3 py-2 rounded-lg font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Managers</span>
              </button>
            </div>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-sm text-gray-500">No managers to display.</div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { action: 'New user registered', time: '2 minutes ago', color: 'bg-light_brown' },
                { action: 'Site visit logged', time: '30 minutes ago', color: 'bg-deep_green' },
                { action: 'User profile updated', time: '1 hour ago', color: 'bg-green-500' },
                { action: 'Bulk email sent', time: '2 hours ago', color: 'bg-web_yellow' },
                { action: 'Password reset initiated', time: '3 hours ago', color: 'bg-light_gray' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-3 h-3 ${activity.color} rounded-full mt-1.5`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Actions Panel */}
          <div className="lg:col-span-2 bg-purewhite border border-gray-200 rounded-xl p-5 shadow mb-6">
            <div className="font-semibold text-main_dark text-lg mb-4 border-b border-light_gray/60 pb-1">
              Bulk Actions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <ActionTile
                onClick={() => handleBulkAction('Send Emails')}
                icon={<Mail className="text-xl" />}
                iconColorClass="text-deep_green"
                label="Send Emails"
                hoverClass="hover:bg-deep_green/10"
              />
              <ActionTile
                onClick={() => handleBulkAction('Suspend/Activate Accounts')}
                icon={<Users className="text-xl" />}
                iconColorClass="text-light_brown"
                label="Suspend/Activate"
                hoverClass="hover:bg-light_brown/15"
              />
              <ActionTile
                onClick={() => handleBulkAction('Reset Passwords')}
                icon={<Lock className="text-xl" />}
                iconColorClass="text-main_dark"
                label="Reset Passwords"
                hoverClass="hover:bg-light_gray/70"
              />
              <ActionTile
                onClick={() => handleBulkAction('Export User List')}
                icon={<Download className="text-xl" />}
                iconColorClass="text-web_yellow"
                label="Export User List"
                hoverClass="hover:bg-web_yellow/15"
              />
            </div>
          </div>

          {/* Site Manager Overview (unchanged) */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Site Manager Overview</h3>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  name: 'John Smith',
                  visits: 12,
                  notes: 'Updated safety protocols',
                  sites: [{ name: 'Downtown Bridge', status: 'Active' }, { name: 'Highway Expansion', status: 'Needs Attention' }]
                },
                {
                  id: 2,
                  name: 'Sarah Johnson',
                  visits: 8,
                  notes: 'Reviewed material delivery schedule',
                  sites: [{ name: 'Commercial Complex', status: 'Active' }]
                }
              ].map((manager) => (
                <div
                  key={manager.id}
                  className="p-4 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-4 mb-2">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${manager.name}&backgroundColor=236571`}
                      alt={manager.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{manager.name}</p>
                      <p className="text-sm text-gray-600">Visits: {manager.visits}</p>
                      <p className="text-sm text-gray-600">Notes: {manager.notes}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {manager.sites.map((site, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">{site.name}</p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            site.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {site.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Team Member</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Supply Chain Coordinator">Supply Chain Coordinator</option>
                  <option value="Team Member">Team Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;