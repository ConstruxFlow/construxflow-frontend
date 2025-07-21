import React, { useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaIdCard, 
  FaLock, 
  FaUserTie,
  FaSave,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaRandom,
  FaCopy
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import LoadingOverlay from '../../components/LoadingOverlay';

const ManagerReg = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone_number1: '',
    phone_number2: '',
    address: '',
    userRole: '',
    managerId: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const userRoles = [
    { value: 'Purchasing_Manager', label: 'Purchasing Manager', prefix: 'PM' },
    { value: 'Site_Manager', label: 'Site Manager', prefix: 'SM' },
    { value: 'Inventory_Manager', label: 'Inventory Manager', prefix: 'IM' },
    { value: 'Finance_Officer', label: 'Finance Officer', prefix: 'FO' },
    { value: 'Maintenance_Head', label: 'Maintenance Head', prefix: 'MH' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-generate manager ID when role changes
    if (name === 'userRole') {
      const selectedRole = userRoles.find(role => role.value === value);
      if (selectedRole) {
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        setFormData(prev => ({
          ...prev,
          managerId: `${selectedRole.prefix}${randomNum}`
        }));
      }
    }

    // Check password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return Math.min(score, 100);
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  // Password generation function
  const generateSecurePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Fill the rest with random characters from all categories
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = password.length; i < 12; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password to avoid predictable patterns
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setFormData(prev => ({
      ...prev,
      password: newPassword
    }));
    setPasswordStrength(calculatePasswordStrength(newPassword));
    toast.success('Strong password generated successfully!');
  };

  const handleCopyPassword = async () => {
    if (formData.password) {
      try {
        await navigator.clipboard.writeText(formData.password);
        toast.success('Password copied to clipboard!');
      } catch (err) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = formData.password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Password copied to clipboard!');
      }
    } else {
      toast.warning('No password to copy');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Username is required';
    } else if (formData.user_name.length < 3) {
      newErrors.user_name = 'Username must be at least 3 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone number validation
    if (!formData.phone_number1.trim()) {
      newErrors.phone_number1 = 'Primary phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone_number1)) {
      newErrors.phone_number1 = 'Please enter a valid 10-digit phone number';
    }

    // Secondary phone validation (optional but must be valid if provided)
    if (formData.phone_number2.trim() && !/^\d{10}$/.test(formData.phone_number2)) {
      newErrors.phone_number2 = 'Please enter a valid 10-digit phone number';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    // Role validation
    if (!formData.userRole) {
      newErrors.userRole = 'User role is required';
    }

    // Manager ID validation
    if (!formData.managerId.trim()) {
      newErrors.managerId = 'Manager ID is required';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 50) {
      newErrors.password = 'Password is too weak. Use a combination of uppercase, lowercase, numbers, and special characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    try {
      const submitData = {
        ...formData,
        phone_number1: parseInt(formData.phone_number1),
        phone_number2: formData.phone_number2 ? parseInt(formData.phone_number2) : null
      };
      setLoadingProgress(30); // Simulate progress

      const response = await fetch('http://localhost:8080/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      setLoadingProgress(50); // Simulate progress
      setLoadingProgress(80); // Simulate progress

      if (response.ok) {
        const result = await response.json();
        setLoadingProgress(100); // Simulate progress
        toast.success(`Manager ${formData.user_name} has been successfully registered!`);
        navigate('/admin-users');
        // Reset form
        setFormData({
          user_name: '',
          email: '',
          phone_number1: '',
          phone_number2: '',
          address: '',
          userRole: '',
          managerId: '',
          password: ''
        });
        setPasswordStrength(0);
        
        // Optionally navigate to managers list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to register manager');
      }
    } catch (error) {
      toast.error('Network error: Failed to register manager');
      console.error('Registration error:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      user_name: '',
      email: '',
      phone_number1: '',
      phone_number2: '',
      address: '',
      userRole: '',
      managerId: '',
      password: ''
    });
    setErrors({});
    setPasswordStrength(0);
  };

  const generateManagerId = () => {
    if (formData.userRole) {
      const selectedRole = userRoles.find(role => role.value === formData.userRole);
      if (selectedRole) {
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        setFormData(prev => ({
          ...prev,
          managerId: `${selectedRole.prefix}${randomNum}`
        }));
      }
    } else {
      toast.warning('Please select a user role first');
    }
  };

  return (
    <div className="min-h-screen bg-purewhite font-poppins">
      {isLoading && (
        <LoadingOverlay
          progress={loadingProgress}
          message="Processing..."
        />
      )}
      
      <NavBar
        links={[
          { name: "Dashboard", href: "/admin", active: true },
          { name: "Supply Chain", href: "/supplychain" },
          { name: "Inventory", href: "/admin-inventory" },
          { name: "Users", href: "/admin-users" },
          
        ]}
      />

      <main className="py-4 sm:py-6">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/admin-users')}
              className="text-gray-600 hover:text-main_dark transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main_dark mb-2">
                Add New Manager
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Register a new manager to the system
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Registration Form - Takes up 2/3 of the width on large screens */}
            <div className="xl:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                      <FaUser className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                              errors.user_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter username"
                          />
                        </div>
                        {errors.user_name && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <FaTimes className="w-3 h-3" />
                            {errors.user_name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter email address"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <FaTimes className="w-3 h-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Primary Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaPhone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone_number1"
                            value={formData.phone_number1}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                              errors.phone_number1 ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter 10-digit phone number"
                            maxLength="10"
                          />
                        </div>
                        {errors.phone_number1 && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <FaTimes className="w-3 h-3" />
                            {errors.phone_number1}
                          </p>
                        )}
                      </div>

                      {/* Secondary Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Phone Number (Optional)
                        </label>
                        <div className="relative">
                          <FaPhone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone_number2"
                            value={formData.phone_number2}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                              errors.phone_number2 ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter 10-digit phone number"
                            maxLength="10"
                          />
                        </div>
                        {errors.phone_number2 && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <FaTimes className="w-3 h-3" />
                            {errors.phone_number2}
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                              errors.address ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter complete address"
                          />
                        </div>
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <FaTimes className="w-3 h-3" />
                            {errors.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Role and Access Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                      <FaUserTie className="w-5 h-5" />
                      Role & Access Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* User Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Role <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="userRole"
                          value={formData.userRole}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                            errors.userRole ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Role</option>
                          {userRoles.map(role => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        {errors.userRole && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <FaTimes className="w-3 h-3" />
                            {errors.userRole}
                          </p>
                        )}
                      </div>

                      {/* Manager ID */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Manager ID <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <FaIdCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              name="managerId"
                              value={formData.managerId}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                                errors.managerId ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Manager ID"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={generateManagerId}
                            className="px-4 py-2 bg-deep_green text-white rounded-md hover:bg-deep_green/90 transition-colors text-sm"
                          >
                            Generate
                          </button>
                        </div>
                        {errors.managerId && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <FaTimes className="w-3 h-3" />
                            {errors.managerId}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                          <FaInfoCircle className="w-3 h-3" />
                          Auto-generated based on role selection
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                      <FaLock className="w-5 h-5" />
                      Security Information
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="px-4 py-2 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors text-sm flex items-center gap-2"
                            title="Generate secure password"
                          >
                            <FaRandom className="w-4 h-4" />
                            Generate
                          </button>
                          <button
                            type="button"
                            onClick={handleCopyPassword}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                            title="Copy password to clipboard"
                            disabled={!formData.password}
                          >
                            <FaCopy className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {formData.password && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-600">Password strength:</span>
                              <span className={`text-sm font-medium ${
                                passwordStrength < 50 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {getPasswordStrengthText(passwordStrength)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                                style={{ width: `${passwordStrength}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <FaTimes className="w-3 h-3" />
                            {errors.password}
                          </p>
                        )}
                        
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Password must contain:</p>
                          <ul className="list-disc ml-5 mt-1">
                            <li>At least 8 characters</li>
                            <li>Uppercase and lowercase letters</li>
                            <li>Numbers and special characters</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 sm:flex-none px-6 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaSave className="w-4 h-4" />
                      {isLoading ? 'Registering...' : 'Register Manager'}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar - Takes up 1/3 of the width on large screens */}
            <div className="xl:col-span-1 space-y-6">
              {/* Password Generation Info Card */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                  <FaRandom className="w-5 h-5 text-green-600" />
                  Password Features
                </h4>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-green-100">
                    <h5 className="font-semibold text-main_dark mb-2">Auto-Generate</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Automatically generates secure passwords with:
                    </p>
                    <ul className="text-sm text-gray-600 list-disc ml-5">
                      <li>12 characters minimum</li>
                      <li>Mixed case letters</li>
                      <li>Numbers and symbols</li>
                      <li>Randomized order</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-100">
                    <h5 className="font-semibold text-main_dark mb-2">Copy to Clipboard</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Easy password sharing:
                    </p>
                    <ul className="text-sm text-gray-600 list-disc ml-5">
                      <li>One-click copy</li>
                      <li>Secure handling</li>
                      <li>Success notifications</li>
                      <li>Cross-browser support</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Role Information Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-main_dark mb-4 flex items-center gap-2">
                  <FaInfoCircle className="w-5 h-5 text-blue-600" />
                  Role Descriptions
                </h4>
                <div className="space-y-3">
                  {userRoles.map(role => (
                    <div key={role.value} className="bg-white p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {role.prefix}
                        </span>
                        <h5 className="font-semibold text-main_dark text-sm">{role.label}</h5>
                      </div>
                      <p className="text-xs text-gray-600">
                        {role.value === 'Purchasing_Manager' && 'Manages procurement processes and supplier relationships'}
                        {role.value === 'Site_Manager' && 'Oversees on-site operations and project execution'}
                        {role.value === 'Inventory_Manager' && 'Manages inventory levels and stock control'}
                        {role.value === 'Finance_Officer' && 'Handles financial operations and payment approvals'}
                        {role.value === 'Maintenance_Head' && 'Manages maintenance operations and equipment'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerReg;
