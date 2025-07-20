import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash, FaRandom, FaCopy, FaTimes } from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import { generateNextSupplierId } from "./Functions";
import { toast } from "react-toastify";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useNavigate } from "react-router-dom";

const SupplierRegPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const [supplierData, setSupplierData] = useState({
    companyName: "",
    businessRegNumber: "",
    registrationNumber: "",
    user_name: "",
    email: "",
    phone_number1: "",
    phone_number2: "",
    street: "",
    city: "",
    district: "",
    province: "",
    primaryCategory: "Electronics",
    password: "", // Add password field
  });

  const [SuppliersLatestId, setSuppliersLatestId] = useState("");

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    return Math.min(score, 100);
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
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
    setSupplierData(prev => ({
      ...prev,
      password: newPassword
    }));
    setPasswordStrength(calculatePasswordStrength(newPassword));
    toast.success('Strong password generated successfully!');
  };

  const handleCopyPassword = async () => {
    if (supplierData.password) {
      try {
        await navigator.clipboard.writeText(supplierData.password);
        toast.success('Password copied to clipboard!');
      } catch (err) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = supplierData.password;
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

  // Form validation functions
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'companyName':
        if (!value.trim()) error = 'Company name is required';
        else if (value.length < 2) error = 'Company name must be at least 2 characters';
        break;
      
      case 'businessRegNumber':
        if (!value.trim()) error = 'Business registration number is required';
        else if (value.length < 5) error = 'Business registration number must be at least 5 characters';
        break;
      
      case 'user_name':
        if (!value.trim()) error = 'Contact name is required';
        else if (value.length < 2) error = 'Contact name must be at least 2 characters';
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Contact name should only contain letters and spaces';
        break;
      
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
        break;
      
      case 'phone_number1':
        if (!value.trim()) error = 'Primary phone number is required';
        else if (!/^\d{10,15}$/.test(value.replace(/\D/g, ''))) error = 'Phone number must be 10-15 digits';
        break;
      
      case 'phone_number2':
        if (value && !/^\d{10,15}$/.test(value.replace(/\D/g, ''))) error = 'Phone number must be 10-15 digits';
        break;
      
      case 'street':
        if (!value.trim()) error = 'Street address is required';
        else if (value.length < 5) error = 'Street address must be at least 5 characters';
        break;
      
      case 'city':
        if (!value.trim()) error = 'City is required';
        else if (value.length < 2) error = 'City must be at least 2 characters';
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = 'City should only contain letters and spaces';
        break;
      
      case 'district':
        if (!value.trim()) error = 'District is required';
        else if (value.length < 2) error = 'District must be at least 2 characters';
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = 'District should only contain letters and spaces';
        break;
      
      case 'province':
        if (!value.trim()) error = 'Province is required';
        else if (value.length < 2) error = 'Province must be at least 2 characters';
        else if (!/^[a-zA-Z\s]+$/.test(value)) error = 'Province should only contain letters and spaces';
        break;
      
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
          error = 'Password must contain uppercase, lowercase, number, and special character';
        }
        break;
      
      default:
        break;
    }

    return error;
  };

  const validateAllFields = () => {
    const newErrors = {};
    const requiredFields = [
      'companyName', 'businessRegNumber', 'user_name', 'email', 
      'phone_number1', 'street', 'city', 'district', 'province', 'password'
    ];

    requiredFields.forEach(field => {
      const error = validateField(field, supplierData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getlatestSupplierId = async () => {
    const response = await fetch(
      "http://localhost:8080/api/supplier/latest-id",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (data.status === "success") {
      setSuppliersLatestId(data.data);
    } else if (
      data.message === "No suppliers found" ||
      data.status === "error"
    ) {
      setSupplierData((prevState) => ({
        ...prevState,
        registrationNumber: "S001",
      }));
    } else {
      toast.error(
        "An unexpected error occurred while fetching the latest supplier ID"
      );
    }
  };

  useEffect(() => {
    getlatestSupplierId();
  }, []);

  const [newSupplierId, setNewSupplierId] = useState("");
  useEffect(() => {
    if (SuppliersLatestId) {
      const nextId = generateNextSupplierId(SuppliersLatestId);
      setNewSupplierId(nextId);
      setSupplierData((prevState) => ({
        ...prevState,
        registrationNumber: nextId,
      }));
    }
  }, [SuppliersLatestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setSupplierData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Calculate password strength for password field
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateAllFields()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    // Initialize loading state
    setIsLoading(true);
    setLoadingProgress(0);

    // Progress tracking interval for smooth animation
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 5;
      });
    }, 200);

    try {
      // Step 1: Data preparation (10% progress)
      setLoadingProgress(10);

      const submissionData = {
        supplierId: supplierData.registrationNumber,
        user_name: supplierData.user_name,
        email: supplierData.email,
        phone_number1: supplierData.phone_number1,
        phone_number2: supplierData.phone_number2,
        address: `${supplierData.street}, ${supplierData.city}, ${supplierData.district}, ${supplierData.province}`,
        userRole: "Supplier",
        password: supplierData.password, // Use generated/entered password
      };

      console.log("Submitting supplier data:", submissionData);
      
      // Step 2: Validation (20% progress)
      setLoadingProgress(20);

      // Step 3: User registration API call (40% progress)
      setLoadingProgress(40);

      const response = await fetch("http://localhost:8080/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `User registration failed with status: ${response.status}`
        );
      }

      // Step 4: Process user registration response (60% progress)
      setLoadingProgress(60);
      const userData = await response.json();

      // Step 5: Supplier registration API call (80% progress)
      setLoadingProgress(80);

      const supplierResponse = await fetch(
        "http://localhost:8080/api/supplier/Register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplier_id: submissionData.supplierId,
            name: submissionData.user_name,
            company_name: supplierData.companyName,
            business_registration_number: supplierData.businessRegNumber,
          }),
        }
      );

      if (!supplierResponse.ok) {
        const errorData = await supplierResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Supplier registration failed with status: ${supplierResponse.status}`
        );
      }

      // Step 6: Process supplier registration response (95% progress)
      setLoadingProgress(95);
      const supplierResponseData = await supplierResponse.json();

      // Step 7: Complete (100% progress)
      setLoadingProgress(100);

      // Show completion briefly before hiding overlay
      setTimeout(() => {
        if (supplierResponseData.status === "success") {
          toast.success("Supplier registered successfully!");
          navigate('/purchasing/supplier/list');
        } else {
          toast.error(
            "Failed to register supplier: " + supplierResponseData.message
          );
        }

        setIsLoading(false);
        setLoadingProgress(0);
      }, 800);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed: " + error.message);
      setIsLoading(false);
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

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

      {isLoading && (
        <LoadingOverlay
          progress={loadingProgress}
          message="Registering supplier details..."
        />
      )}

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-full mx-auto px-2 sm:px-3 lg:px-10">
          {/* Back Button and Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-main_dark mb-4">
                <FaArrowLeft />
                <span className="text-sm">Back</span>
              </button>
              <h1 className="text-2xl font-bold text-main_dark">
                Supplier Registration
              </h1>
              <p className="text-gray-600 text-sm">
                Register new suppliers and manage existing supplier profiles
              </p>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Register New Supplier */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleOnSubmit}>
                {/* Company Information */}
                <div className="bg-light_brown/30 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold text-main_dark mb-4">
                    Company Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Enter company name"
                        value={supplierData.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.companyName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Registration Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="businessRegNumber"
                        placeholder="Enter business registration number"
                        value={supplierData.businessRegNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.businessRegNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.businessRegNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.businessRegNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        placeholder="Enter registration number"
                        value={supplierData.registrationNumber}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-purewhite border border-gray-200 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-semibold text-main_dark mb-4">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Contact Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="user_name"
                        placeholder="Enter contact name"
                        value={supplierData.user_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.user_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.user_name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.user_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={supplierData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone_number1"
                        placeholder="Enter phone number"
                        value={supplierData.phone_number1}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.phone_number1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone_number1 && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.phone_number1}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number 2
                      </label>
                      <input
                        type="tel"
                        name="phone_number2"
                        placeholder="Enter Phone number 2"
                        value={supplierData.phone_number2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.phone_number2 ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone_number2 && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.phone_number2}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={supplierData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
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
                        disabled={!supplierData.password}
                      >
                        <FaCopy className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {supplierData.password && (
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

                {/* Address Details */}
                <div className="bg-purewhite border border-gray-200 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-main_dark mb-4">
                    Address Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        placeholder="Enter street address"
                        value={supplierData.street}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.street ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.street && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.street}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={supplierData.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="district"
                        placeholder="Enter district"
                        value={supplierData.district}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.district ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.district && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.district}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="province"
                        placeholder="Enter province"
                        value={supplierData.province}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-web_yellow focus:border-transparent ${
                          errors.province ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.province && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FaTimes className="w-3 h-3" />
                          {errors.province}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column - Supplier Summary */}
            <div>
              <div className="bg-purewhite border border-gray-200 overflow-hidden rounded-lg sticky top-10">
                <h2 className="text-lg font-semibold bg-web_yellow/10 p-6 text-main_dark mb-4">
                  Registration Summary
                </h2>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium text-main_dark">
                        {supplierData.companyName || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration No:</span>
                      <span className="font-medium text-main_dark">
                        {supplierData.registrationNumber || "Not specified"}
                      </span>
                    </div>

                    <hr className="border-gray-300" />

                    <div>
                      <h4 className="font-semibold text-main_dark mb-2">
                        Contact:
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>{supplierData.user_name || "Not specified"}</p>
                        <p>{supplierData.email || "Not specified"}</p>
                        <p>{supplierData.phone_number1 || "Not specified"}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-main_dark mb-2">
                        Address:
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>{supplierData.street || "Street not specified"}</p>
                        <p>
                          {supplierData.city || "City not specified"},{" "}
                          {supplierData.district || "District not specified"}
                        </p>
                        <p>
                          {supplierData.province || "Province not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-web_yellow text-main_dark rounded-md hover:bg-web_yellow/90 transition-colors font-semibold flex items-center justify-center gap-2"
                      onClick={handleOnSubmit}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Register Supplier
                    </button>

                    <button 
                      type="button"
                      onClick={() => navigate(-1)}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
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

export default SupplierRegPage;
