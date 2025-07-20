import React, { useState, useEffect } from 'react';
import { FaUser, FaCamera, FaEdit, FaLock, FaEye, FaEyeSlash, FaBell, FaPhone, FaEnvelope, FaBuilding, FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";
import { MdNotifications, MdSecurity, MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';

const ManagerProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Purchasing Manager',
    department: 'Procurement',
    address: '123 Business Ave, Suite 100\nCity, State 12345'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    weeklyReports: true,
    systemAlerts: false,
    orderUpdates: true
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field) => {
    setNotifications(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setPersonalInfo({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      jobTitle: 'Purchasing Manager',
      department: 'Procurement',
      address: '123 Business Ave, Suite 100\nCity, State 12345'
    });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar links={[
        { name: 'Dashboard', path: '/purchasing/dashboard' },
        { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
        { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
        { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
        { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
      ]} />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-6xl mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold text-main_dark mb-1 tracking-tight">
              Profile Management
            </h1>
            <p className="text-slatebluegray text-base">
              Manage your personal information and account settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-purewhite border border-gray-200 rounded-lg p-4 sticky top-6">
                {/* Profile Picture Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-web_yellow/20 to-light_brown/30 rounded-full flex items-center justify-center border-4 border-purewhite shadow-lg">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <FaUser className="text-3xl text-main_dark" />
                      )}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-web_yellow to-web_yellow/80 rounded-full flex items-center justify-center text-purewhite shadow-lg hover:scale-110 transition-transform">
                      <FaCamera className="text-xs" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-main_dark mt-3">John Smith</h3>
                  <p className="text-sm text-slatebluegray">Purchasing Manager</p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2 mb-6">
                  <h4 className="font-medium text-main_dark text-sm mb-3">Quick Actions</h4>
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'personal' 
                        ? 'bg-web_yellow/10 text-main_dark border border-web_yellow/20' 
                        : 'text-slatebluegray hover:bg-gray-50'
                    }`}
                  >
                    <MdEdit className="w-4 h-4" />
                    Change Password
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'notifications' 
                        ? 'bg-web_yellow/10 text-main_dark border border-web_yellow/20' 
                        : 'text-slatebluegray hover:bg-gray-50'
                    }`}
                  >
                    <FaBell className="w-4 h-4" />
                    Notification Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'privacy' 
                        ? 'bg-web_yellow/10 text-main_dark border border-web_yellow/20' 
                        : 'text-slatebluegray hover:bg-gray-50'
                    }`}
                  >
                    {/* <FaShield className="w-4 h-4" /> */}
                    Privacy Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <div className="bg-purewhite border border-gray-200 rounded-lg">
                {/* Personal Information Section */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                    <FaUser className="w-5 h-5 text-deep_green" />
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Job Title */}
                    <div>
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={personalInfo.jobTitle}
                        onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        Department
                      </label>
                      <select
                        value={personalInfo.department}
                        onChange={(e) => handlePersonalInfoChange('department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm"
                      >
                        <option value="Procurement">Procurement</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                        <option value="HR">Human Resources</option>
                        <option value="IT">Information Technology</option>
                      </select>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                        <textarea
                          value={personalInfo.address}
                          onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                          rows="3"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                    <FaBell className="w-5 h-5 text-deep_green" />
                    Notification Preferences
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-main_dark">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates and system changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailNotifications}
                          onChange={() => handleNotificationChange('emailNotifications')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-web_yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-web_yellow"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-main_dark">Weekly Reports</h4>
                        <p className="text-sm text-gray-600">Receive weekly summary reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReports}
                          onChange={() => handleNotificationChange('weeklyReports')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-web_yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-web_yellow"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-main_dark">System Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified about system maintenance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.systemAlerts}
                          onChange={() => handleNotificationChange('systemAlerts')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-web_yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-web_yellow"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-main_dark">Order Updates</h4>
                        <p className="text-sm text-gray-600">Notifications about order status changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.orderUpdates}
                          onChange={() => handleNotificationChange('orderUpdates')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-web_yellow/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-web_yellow"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Change Password Section */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                    <FaLock className="w-5 h-5 text-deep_green" />
                    Change Password
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Password */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-medium text-main_dark mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-web_yellow focus:border-web_yellow transition-colors text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handlePasswordUpdate}
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-deep_green to-deep_green/90 text-purewhite font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-web_yellow to-web_yellow/90 text-main_dark font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                    >
                      <FaSave className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerProfile;
