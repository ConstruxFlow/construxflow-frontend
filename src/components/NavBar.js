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
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // which desktop dropdown/megamenu is open
  const { authState, logout } = useContext(AuthContext);
  const profileRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();

  // Map role to profile image
  const getProfileImageByRole = (userRole) => {
    const roleImageMap = {
      Admin: "/assets/profile/admin.jpg",
      Site_Manager: "/assets/profile/site-manager.jpg",
      Inventory_Manager: "/assets/profile/invemtory-manager.jpg",
      Finance_Officer: "/assets/profile/finance-officer.jpg",
      Maintenance_Head: "/assets/profile/maintenance-head.jpg",
      Supplier: "/assets/profile/supplier.jpg",
      Purchasing_Manager: "/assets/profile/purchasing-manager.jpg"
    };
    return roleImageMap[userRole];
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const cancelLogout = () => setOpenModal(false);

  const handleOnProfile = () => navigate(profileURL);

  const toggleDropdown = (idx) => {
    setActiveDropdown(prev => (prev === idx ? null : idx));
  };

  // Helpers for rendering different dropdown types
  const renderStandardDropdown = (link) => (
    <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg py-2 z-50 min-w-[220px]">
      {link.subLinks?.map((sub, subIdx) => (
        <a
          key={subIdx}
          href={sub.path || sub.href}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            if (sub.onClick) {
              e.preventDefault();
              sub.onClick();
            }
            setActiveDropdown(null);
          }}
        >
          {sub.name}
        </a>
      ))}
    </div>
  );

  // Full-width Mega Menu
  const renderMegaMenu = (link) => {
    return (
      <div className="absolute left-0 top-full z-50">
        <div className="w-screen bg-white border-t border-gray-200 shadow-lg">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(link.megaSections || []).map((section, sIdx) => (
                <div key={sIdx}>
                  {section.title && (
                    <p className="text-sm font-semibold text-gray-900 mb-1">{section.title}</p>
                  )}
                  {section.description && (
                    <p className="text-sm text-gray-500 mb-4">{section.description}</p>
                  )}
                  <div className="space-y-3">
                    {(section.items || []).map((item, iIdx) => (
                      <a
                        key={iIdx}
                        href={item.path || item.href}
                        className="block rounded-md p-3 hover:bg-gray-50 transition-colors"
                        onClick={(e) => {
                          if (item.onClick) {
                            e.preventDefault();
                            item.onClick();
                          }
                          setActiveDropdown(null);
                        }}
                      >
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        {item.desc && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Optional footer row in the mega menu */}
            {link.megaFooter && (
              <div className="mt-8 border-t border-gray-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {link.megaFooter.map((f, fIdx) => (
                  <a
                    key={fIdx}
                    href={f.path || f.href}
                    className="flex items-center justify-between rounded-md p-3 hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      if (f.onClick) {
                        e.preventDefault();
                        f.onClick();
                      }
                      setActiveDropdown(null);
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{f.name}</p>
                      {f.desc && <p className="text-xs text-gray-500">{f.desc}</p>}
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="bg-main_dark w-full text-light_gray text-base font-normal" ref={navRef}>
        <div className="flex justify-between items-center md:h-[70px] h-[50px] px-4 md:px-4">
          {/* Logo */}
          <img
            src={logoSrc}
            alt="Logo"
            className="md:h-12 h-10 md:w-[80px] object-contain"
          />

          {/* Desktop Nav with click-to-open dropdowns and mega menus */}
          <div className="hidden md:flex space-x-7 items-stretch relative">
            {links.map((link, idx) => (
              <div key={idx} className="relative flex items-center">
                {link.subLinks || link.megamenu ? (
                  <>
                    <button
                      className="hover:text-web_yellow transition-colors cursor-pointer flex items-center space-x-1 py-2"
                      onClick={() => toggleDropdown(idx)}
                    >
                      <span>{link.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${activeDropdown === idx ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {activeDropdown === idx && (
                      link.megamenu ? renderMegaMenu(link) : renderStandardDropdown(link)
                    )}
                  </>
                ) : (
                  <a
                    href={link.path || link.href}
                    className="hover:text-web_yellow transition-colors cursor-pointer py-2"
                    onClick={(e) => {
                      if (link.onClick) {
                        e.preventDefault();
                        link.onClick();
                      }
                    }}
                  >
                    {link.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right: Profile or CTA */}
          <div className="hidden md:flex items-center space-x-4" ref={profileRef}>
            {authState?.user ? (
              <div className="relative mr-8">
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
                    className={`w-4 h-4 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div
                      onClick={handleOnProfile}
                      className="px-4 py-2 border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <p className="text-sm font-medium text-gray-900">Profile</p>
                      <p className="text-sm text-gray-500 truncate">{authState.user.email}</p>
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

          {/* Mobile Hamburger */}
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
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`md:hidden transition-all duration-300 bg-main_dark ${
            menuOpen ? "max-h-[80vh] py-4" : "max-h-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col items-stretch space-y-2 px-4">
            {links.map((link, idx) => (
              <div key={idx} className="border-b border-white/10 pb-2">
                {link.megamenu ? (
                  <>
                    <p className="text-lg text-light_gray mb-2">{link.name}</p>
                    {(link.megaSections || []).map((section, sIdx) => (
                      <div key={sIdx} className="mb-3">
                        {section.title && (
                          <p className="text-sm font-semibold text-white">{section.title}</p>
                        )}
                        {section.description && (
                          <p className="text-xs text-gray-400 mb-2">{section.description}</p>
                        )}
                        <div className="space-y-1">
                          {(section.items || []).map((item, iIdx) => (
                            <a
                              key={iIdx}
                              href={item.path || item.href}
                              className="block text-sm text-gray-300 hover:text-web_yellow"
                              onClick={(e) => {
                                if (item.onClick) {
                                  e.preventDefault();
                                  item.onClick();
                                }
                                setMenuOpen(false);
                              }}
                            >
                              {item.name}
                              {item.desc && (
                                <span className="block text-xs text-gray-500">{item.desc}</span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : link.subLinks ? (
                  <>
                    <p className="text-lg text-light_gray mb-1">{link.name}</p>
                    {link.subLinks.map((sub, subIdx) => (
                      <a
                        key={subIdx}
                        href={sub.path || sub.href}
                        className="block text-gray-300 hover:text-web_yellow text-sm"
                        onClick={(e) => {
                          if (sub.onClick) {
                            e.preventDefault();
                            sub.onClick();
                          }
                          setMenuOpen(false);
                        }}
                      >
                        {sub.name}
                      </a>
                    ))}
                  </>
                ) : (
                  <a
                    href={link.path || link.href}
                    className="text-lg text-light_gray hover:text-web_yellow"
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
                )}
              </div>
            ))}

            {/* Mobile Profile Section */}
            {authState?.user ? (
              <div className="pt-2">
                <div className="flex items-center space-x-3 py-2">
                  <img
                    src={getProfileImageByRole(authState?.user?.userRole)}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-web_yellow"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-light_gray">Profile</p>
                    <p className="text-xs text-gray-400 truncate">{authState.user.email}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {authState?.user?.userRole?.replace(/\_/g, ' ')}
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-400 hover:text-red-300 transition-colors"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </div>
            ) : (
              showButton && (
                <button
                  className="bg-web_yellow text-main_dark px-4 py-2 rounded-full mt-2"
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
