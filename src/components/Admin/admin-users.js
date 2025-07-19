import React, { useState } from 'react';
import { Users, UserPlus, Clock, CheckCircle, Plus, X, Mail, Lock, Download, Clipboard } from 'lucide-react';

const UserDashboard = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', status: 'Active', role: 'Team Member' });
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      status: 'Active',
      role: 'Inventory Manager',
      avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=John%20Smith'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      status: 'Pending',
      role: 'Supply Chain Coordinator',
      avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Sarah%20Johnson'
    }
  ]);

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: users.length + 1,
        ...newUser,
        role: newUser.role || 'Team Member',
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${newUser.name}`
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', status: 'Active', role: 'Team Member' });
      setShowAddUser(false);
    }
  };

  const handleBulkAction = (action) => {
    alert(`Performing bulk action: ${action}`);
    // Placeholder for actual bulk action logic (e.g., API calls)
  };

  const stats = [
    { title: 'Total Users', value: '2,847', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Users', value: '1,234', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'New This Month', value: '156', icon: UserPlus, color: 'bg-purple-500' },
    { title: 'Pending Approval', value: '23', icon: Clock, color: 'bg-yellow-500' }
  ];

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
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 sm:px-14 lg:px-16 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-main_dark mt-1">{stat.value}</p>
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
          {/* Recent Users */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
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
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { action: 'New user registered', time: '2 minutes ago', color: 'bg-blue-500' },
                { action: 'Site visit logged', time: '30 minutes ago', color: 'bg-teal-500' },
                { action: 'User profile updated', time: '1 hour ago', color: 'bg-green-500' },
                { action: 'Bulk email sent', time: '2 hours ago', color: 'bg-indigo-500' },
                { action: 'Password reset initiated', time: '3 hours ago', color: 'bg-orange-500' }
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
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Bulk Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleBulkAction('Send Emails')}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
                <span>Send Emails</span>
              </button>
              <button
                onClick={() => handleBulkAction('Suspend/Activate Accounts')}
                className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
              >
                <Users className="w-5 h-5" />
                <span>Suspend/Activate</span>
              </button>
              <button
                onClick={() => handleBulkAction('Reset Passwords')}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                <Lock className="w-5 h-5" />
                <span>Reset Passwords</span>
              </button>
              <button
                onClick={() => handleBulkAction('Export User List')}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                <span>Export User List</span>
              </button>
            </div>
          </div>

          {/* Site Manager Overview */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Site Manager Overview</h3>
            <div className="space-y-4">
              {siteManagers.map((manager) => (
                <div
                  key={manager.id}
                  className="p-4 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-4 mb-2">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${manager.name}`}
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