import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Bot, Menu, X, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const Navbar = ({ token, setToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    setToken(null);
  };

  useEffect(() => {
    setIsOpen(false);
    setActiveSubmenu(null);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseLinkClasses =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center";
  const activeLinkClasses =
    "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg";
  const inactiveLinkClasses =
    "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-white";
  const submenuLinkClasses =
    "px-4 py-2 text-sm transition-all duration-300 block text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-white";

  const getNavLinkClass = ({ isActive }) =>
    `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`;

  const toggleMobileMenu = () => setIsOpen(!isOpen);

  const toggleSubmenu = (menu) =>
    setActiveSubmenu(activeSubmenu === menu ? null : menu);

  const featuresSubmenu = [
    { name: "AI Predictions", path: "/features/predictions" },
    { name: "Real-time Data", path: "/features/realtime" },
    { name: "Custom Models", path: "/features/custom" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 border-b ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border-gray-200 dark:border-gray-800'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center text-white">
          <Bot className="h-8 w-8 text-indigo-400 mr-2" />
          <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            ForeSight
          </span>
        </NavLink>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <NavLink to="/" className={getNavLinkClass} end>Home</NavLink>

          <div className="relative">
            <button
              onClick={() => toggleSubmenu('features')}
              className={`${baseLinkClasses} ${inactiveLinkClasses}`}
            >
              Features
              {activeSubmenu === 'features' ? <ChevronUp /> : <ChevronDown />}
            </button>

            {activeSubmenu === 'features' && (
              <div className="absolute bg-white dark:bg-gray-800 rounded-md mt-2 w-56 shadow-xl border border-gray-200 dark:border-gray-700 py-2">
                {featuresSubmenu.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={submenuLinkClasses}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
          <NavLink to="/documentation" className={getNavLinkClass}>Docs</NavLink>

          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
            >
              Login
            </NavLink>
          )}

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-gray-700 ml-2"
          >
            {theme === 'dark' ? <Sun className="text-white" /> : <Moon className="text-white" />}
          </button>
        </div>

        {/* Mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-700 dark:text-white"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 p-4 space-y-2 border-b border-gray-200 dark:border-gray-800 shadow-lg">
          <NavLink to="/" className={getNavLinkClass}>Home</NavLink>
          <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
          {token ? (
            <button onClick={handleLogout} className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded">
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="block bg-indigo-600 text-white px-4 py-2 rounded text-center">
              Login / Signup
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
