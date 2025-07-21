import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";

const NavBar = ({
  links = [],
  showButton = false,
  buttonLabel = "Get Started",
  onButtonClick,
  logoSrc = "/logo1.png",
  profileURL = ''
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { authState, logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  

  // Function to get profile image based on user role
  const getProfileImageByRole = (userRole) => {
    const roleImageMap = {
      Admin: "/assets/profile/admin.jpg",
      Site_Manager: "/assets/profile/site-manager.jpg",
      Inventory_Manager: "/assets/profile/inventory-manager.jpg",
      Finance_Officer: "/assets/profile/finance-officer.jpg",
      Maintenance_Head: "/assets/profile/maintenance-head.jpg",
      Supplier: "/assets/profile/supplier.jpg",
      Purchasing_Manager: "/assets/profile/purchasing-manager.jpg"
    };
    
    // Return specific image for role, or default image if role not found
    return roleImageMap[userRole];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setProfileDropdownOpen(false);
    setMenuOpen(false);
    setOpenModal(true);
  };

  const confirmLogout = () => {
    logout();
    setOpenModal(false);
    toast.success("Logged out successfully!");
    navigate('/');
  };

  const cancelLogout = () => {
    setOpenModal(false);
  };

  const handleOnProfile = () => {
    navigate(profileURL);
  };

  return (
    <>
      <nav className="bg-main_dark w-full text-light_gray text-base font-normal">
        <div className="flex justify-between items-center md:h-[70px] h-[50px] px-4 md:px-4">
          {/* Logo */}
          <img
            src={logoSrc}
            alt="Logo"
            className="md:h-12 h-10 md:w-[80px] object-contain"
          />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-7">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.path || link.href}
                className="hover:text-web_yellow transition-colors cursor-pointer"
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Show button or profile based on auth state */}
            {authState?.user ? (
              // User Profile Dropdown
              <div className="relative mr-8" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={getProfileImageByRole(authState?.user?.userRole)}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-web_yellow"
                  />
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div onClick={handleOnProfile} className="px-4 py-2 border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-gray-900">
                        Profile
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {authState.user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Show button when user is not logged in
              showButton && (
                <button
                  className="bg-web_yellow text-main_dark px-4 py-2 rounded-full"
                  onClick={onButtonClick}
                >
                  {buttonLabel}
                </button>
              )
            )}
          </div>

          {/* Hamburger Icon */}
          <button
            className="md:hidden flex items-center justify-center h-10 w-10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-7 h-7 text-light_gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav Links */}
        <div
          className={`md:hidden transition-all duration-300 bg-main_dark ${
            menuOpen ? "max-h-96 py-4" : "max-h-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="hover:text-web_yellow text-lg transition-colors cursor-pointer"
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                  setMenuOpen(false);
                }}
              >
                {link.name}
              </a>
            ))}
            
            {/* Mobile Profile Section */}
            {authState?.user ? (
              <>
                <div className="flex items-center space-x-3 py-2">
                  <img
                    src={getProfileImageByRole(authState?.user?.userRole)}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-web_yellow"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-light_gray">
                      Profile
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {authState.user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {authState?.user?.userRole?.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-400 hover:text-red-300 transition-colors"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </>
            ) : (
              showButton && (
                <button
                  className="bg-web_yellow text-main_dark px-4 py-2 rounded-full"
                  onClick={() => {
                    setMenuOpen(false);
                    onButtonClick && onButtonClick();
                  }}
                >
                  {buttonLabel}
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal show={openModal} size="md" onClose={cancelLogout} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={confirmLogout}>
                Yes, I'm sure
              </Button>
              <Button color="alternative" onClick={cancelLogout}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default NavBar;
