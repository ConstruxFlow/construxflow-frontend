import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaEdit, FaPhone, FaEnvelope, FaBuilding, FaMapMarkerAlt, FaIdBadge, FaUserTag } from "react-icons/fa";
import { MdVerified, MdWork, MdLocationOn } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthContext';
import NavBar from '../../components/NavBar';

const ManagerProfileView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { authState } = useContext(AuthContext);
  
  const [userProfile, setUserProfile] = useState({
    userName: '',
    email: '',
    phoneNumber1: '',
    phoneNumber2: '',
    address: '',
    managerId: '',
    userRole: '',
    firebaseUid: '',
    userId: ''
  });

  useEffect(() => {
    if (authState?.user) {
      console.log(authState.user);
      setUserProfile({
        userName: authState.user.userName || 'N/A',
        email: authState.user.email || 'N/A',
        phoneNumber1: authState.user.phoneNumber1 || 'N/A',
        phoneNumber2: authState.user.phoneNumber2 || 'N/A',
        address: authState.user.address || 'N/A',
        managerId: authState.user.managerId || 'N/A',
        userRole: authState.user.userRole || 'N/A',
        firebaseUid: authState.user.firebaseUid || 'N/A',
        userId: authState.user.userId || 'N/A'
      });
      setLoading(false);
    }
  }, [authState]);

  const formatPhoneNumber = (phone) => {
    if (!phone || phone === 'N/A') return 'N/A';
    return `+94 ${phone}`;
  };

  const formatUserRole = (role) => {
    if (!role || role === 'N/A') return 'N/A';
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getInitials = (userName) => {
    if (!userName || userName === 'N/A') return 'U';
    return userName.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purewhite font-poppins">
        <NavBar 
        profileURL="/financial/profile"
        links={[
          { name: 'Dashboard', path: '/purchasing/dashboard' },
          { name: 'Material Requests', path: '/purchasing/materialrequests/overview' },
          { name: 'Suppliers', path: '/purchasing/supplier/dashboard' },
          { name: 'Quotation Requests', path: '/purchasing/quotationrequest/overview' },
          { name: 'Purchasing Orders', path: '/purchasing/orders/overview' },
        ]} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-web_yellow"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {/* Header Navigation */}
      <NavBar profileURL="/financial/profile" links={[
        { name: 'Dashboard', path: '/financial/dashboard' },
          { name: 'Payment Approvals', path: '/financial/payment-list' },
          { name: 'Purchase Orders', path: '/financial/purchase-order-list' },
          { name: 'Projects', path: '/financial/financial-projects' },
      ]} />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-6xl mx-auto px-2 sm:px-3 lg:px-10">
          {/* Page Header */}
          <div className="mb-6 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-main_dark mb-1 tracking-tight">
                  My Profile
                </h1>
                <p className="text-slatebluegray text-base">
                  View your personal information and account details
                </p>
              </div>
              <button
                onClick={() => navigate('/profile/edit')}
                className="px-6 py-2 bg-gradient-to-r from-web_yellow to-web_yellow/90 text-main_dark font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 text-sm flex items-center gap-2 justify-center lg:justify-start"
              >
                <FaEdit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Profile Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-purewhite border border-gray-200 rounded-lg p-6 shadow-sm">
                {/* Profile Picture Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-web_yellow/20 to-light_brown/30 rounded-full flex items-center justify-center border-4 border-purewhite shadow-lg">
                      <span className="text-4xl font-bold text-main_dark">
                        {getInitials(userProfile.userName)}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-deep_green to-deep_green/80 rounded-full flex items-center justify-center text-purewhite shadow-lg">
                      <MdVerified className="text-lg" />
                    </div>
                  </div>
                  <h2 className="font-bold text-xl text-main_dark mt-4 capitalize">
                    {userProfile.userName}
                  </h2>
                  <p className="text-deep_green font-medium">
                    {formatUserRole(userProfile.userRole)}
                  </p>
                  <p className="text-sm text-slatebluegray mt-1">
                    ID: {userProfile.managerId}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-main_dark mb-4 text-sm">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slatebluegray">Account Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slatebluegray">User ID</span>
                      <span className="text-sm font-medium text-main_dark">#{userProfile.userId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slatebluegray">Role</span>
                      <span className="text-sm font-medium text-main_dark">
                        {formatUserRole(userProfile.userRole)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-8">
              <div className="bg-purewhite border border-gray-200 rounded-lg shadow-sm">
                {/* Personal Information Section */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-main_dark mb-6 flex items-center gap-2">
                    <FaUser className="w-5 h-5 text-deep_green" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slatebluegray flex items-center gap-2">
                        <FaUserTag className="w-4 h-4" />
                        Username
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-main_dark font-medium">{userProfile.userName}</span>
                      </div>
                    </div>

                    {/* Manager ID */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slatebluegray flex items-center gap-2">
                        <FaIdBadge className="w-4 h-4" />
                        Manager ID
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-main_dark font-medium">{userProfile.managerId}</span>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slatebluegray flex items-center gap-2">
                        <FaEnvelope className="w-4 h-4" />
                        Email Address
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-main_dark font-medium">{userProfile.email}</span>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slatebluegray flex items-center gap-2">
                        <MdWork className="w-4 h-4" />
                        Role
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-main_dark font-medium">
                          {formatUserRole(userProfile.userRole)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-main_dark mb-6 flex items-center gap-2">
                    <FaPhone className="w-5 h-5 text-deep_green" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Phone */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slatebluegray flex items-center gap-2">
                        <FaPhone className="w-4 h-4" />
                        Primary Phone
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-main_dark font-medium">
                          {formatPhoneNumber(userProfile.phoneNumber1)}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Phone */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slatebluegray flex items-center gap-2">
                        <FaPhone className="w-4 h-4" />
                        Secondary Phone
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-main_dark font-medium">
                          {userProfile.phoneNumber2 && userProfile.phoneNumber2 !== 'N/A' 
                            ? formatPhoneNumber(userProfile.phoneNumber2) 
                            : 'Not provided'}
                        </span>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slatebluegray flex items-center gap-2">
                        <MdLocationOn className="w-4 h-4" />
                        Address
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-main_dark font-medium">{userProfile.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Information Section */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-main_dark mb-6 flex items-center gap-2">
                    <FaBuilding className="w-5 h-5 text-deep_green" />
                    System Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User ID */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slatebluegray">
                        System User ID
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-main_dark font-medium">#{userProfile.userId}</span>
                      </div>
                    </div>

                    {/* Firebase UID */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slatebluegray">
                        Firebase UID
                      </label>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-main_dark font-mono text-xs break-all">
                          {userProfile.firebaseUid}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="mt-6">
            <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h3 className="font-semibold text-main_dark mb-1">Need to make changes?</h3>
                  <p className="text-sm text-slatebluegray">
                    Update your profile information, change your password, or modify notification settings.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="px-6 py-2 bg-gradient-to-r from-web_yellow to-web_yellow/90 text-main_dark font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 text-sm flex items-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate('/profile/settings')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Account Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerProfileView;
