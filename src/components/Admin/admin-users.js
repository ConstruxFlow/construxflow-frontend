import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Clock, CheckCircle, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function ActionTile({ onClick, icon, label, iconColorClass, hoverClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 bg-white border border-light_gray rounded-lg shadow-sm
        hover:shadow-md transition-all focus:outline-none w-full text-left ${hoverClass}`}
    >
      <span className={`rounded-full p-2 bg-light_gray/40 flex items-center justify-center ${iconColorClass}`}>
        {icon}
      </span>
      <span className="font-medium text-base text-main_dark">{label}</span>
    </button>
  );
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', status: 'Active', role: 'Team Member' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const roleMap = {
    'Purchasing_Manager': "Purchasing Manager",
    'Inventory_Manager': "Inventory Manager",
    'Site_Manager': "Site Manager",
    'Maintenance_Head': "Maintenance Head",
    'Finance_Officer': "Finance Officer"
  };

  const [stats, setStats] = useState([
    { title: 'Total Users', value: '-', icon: Users, color: 'bg-light_brown' },
    { title: 'Active Users', value: '-', icon: CheckCircle, color: 'bg-deep_green' },
    { title: 'New This Month', value: '-', icon: UserPlus, color: 'bg-web_yellow' },
    { title: 'Pending Approval', value: '-', icon: Clock, color: 'bg-light_gray' }
  ]);

  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/user/all-users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();

        const totalUsers = data.length;
        const activeUsers = data.filter(user => user.status === 'Active' || !user.status).length || totalUsers;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const newThisMonth = data.filter(user => {
          if (!user.created_at) return false;
          const created = new Date(user.created_at);
          return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
        }).length;

        const pendingApproval = data.filter(user => user.status === 'Pending').length;

        const managers = data.filter(user =>
          ['Purchasing_Manager', 'Inventory_Manager', 'Site_Manager', 'Maintenance_Head', 'Finance_Officer'].includes(user.userRole)
        );

        const usersFormatted = managers.map(user => ({
          id: user.userId,
          name: user.userName,
          email: user.email,
          role: roleMap[user.userRole] || user.userRole,
          status: user.status || 'Active',
          avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.userName)}&backgroundColor=236571`
        }));

        setUsers(usersFormatted);

        setStats([
          { title: 'Total Users', value: totalUsers.toString(), icon: Users, color: 'bg-light_brown' },
          { title: 'Active Users', value: activeUsers.toString(), icon: CheckCircle, color: 'bg-deep_green' },
          { title: 'New This Month', value: newThisMonth.toString(), icon: UserPlus, color: 'bg-web_yellow' },
          { title: 'Pending Approval', value: pendingApproval.toString(), icon: Clock, color: 'bg-light_gray' }
        ]);

        setError(null);
      } catch (err) {
        console.error('Error fetching users and stats:', err);
        setError('Failed to load users and stats');
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateStats();
  }, []);

  // Fetch Site Manager Overview (manager name + projects)
  useEffect(() => {
    const fetchSiteManagerOverview = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/site-manager-overview`);
        if (!res.ok) throw new Error(`Overview API error: ${res.status}`);
        const data = await res.json(); // [{ managerId, managerName, projectId, projectName, progressStatus }]

        // Group by managerId to fit UI shape
        const groupedMap = new Map();
        data.forEach(row => {
          const mId = row.managerId || 'unknown';
          if (!groupedMap.has(mId)) {
            groupedMap.set(mId, {
              id: mId,
              name: row.managerName || 'Unknown Manager',
              visits: 0,     // UI expects visits; derivation: number of projects
              notes: '',     // UI expects notes; not provided, keep blank or derive simple message
              sites: []
            });
          }
          const manager = groupedMap.get(mId);
          manager.sites.push({
            name: row.projectName,
            status: row.progressStatus || 'Unknown'
          });
        });

        const grouped = Array.from(groupedMap.values()).map(m => ({
          ...m,
          visits: m.sites.length,
          notes: m.sites.some(s => (s.status || '').toLowerCase().includes('hold')) 
            ? 'Some projects on hold'
            : ''
        }));

        setSiteManagers(grouped);
      } catch (err) {
        console.error('Error fetching Site Manager Overview:', err);
        setError((prev) => prev || 'Failed to load site manager overview');
      }
    };
    fetchSiteManagerOverview();
  }, []);

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: users.length + 1,
        ...newUser,
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(newUser.name)}&backgroundColor=236571`
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', status: 'Active', role: 'Team Member' });
      setShowAddUser(false);
    }
  };

  const handleBulkAction = (action) => {
    alert(`Performing bulk action: ${action}`);
  };

  return (
    <div className="min-h-screen bg-purewhite font-sans">
      <main className="max-w-full mx-auto px-4 sm:px-14 lg:px-16 py-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">User details</h2>
        <p className="text-gray-600 mb-8 text-base">
          Manage your team members, track their activities, and perform bulk actions to streamline operations.
        </p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
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
        <div>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
