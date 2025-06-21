import React, { useState } from 'react';

const NavBar = ({
  links = [],
  showButton = false,
  buttonLabel = "Get Started",
  onButtonClick,
  logoSrc = "/logo1.png"
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-main_dark w-full text-light_gray text-base font-normal">
      <div className="flex justify-between items-center md:h-[70px] h-[50px] px-4 md:px-4">
        {/* Logo */}
        <img src={logoSrc} alt="Logo" className="md:h-12 h-10 md:w-[80px] object-contain" />

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-7">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="hover:text-web_yellow transition-colors"
              target={link.target || "_self"}
              rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Button */}
        {showButton && (
          <button
            className="hidden md:inline-block bg-web_yellow text-main_dark px-4 py-2 rounded-full ml-4"
            onClick={onButtonClick}
          >
            {buttonLabel}
          </button>
        )}

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav Links */}
      <div
        className={`md:hidden transition-all duration-300 bg-main_dark ${
          menuOpen ? 'max-h-96 py-4' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="hover:text-web_yellow text-lg transition-colors"
              target={link.target || "_self"}
              rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          {showButton && (
            <button
              className="bg-web_yellow text-main_dark px-4 py-2 rounded-full"
              onClick={() => {
                setMenuOpen(false);
                onButtonClick && onButtonClick();
              }}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
