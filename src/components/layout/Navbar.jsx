import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  HiBars3,
  HiXMark,
  HiArrowRightOnRectangle,
  HiUserCircle,
  HiShieldCheck,
} from 'react-icons/hi2';

const Navbar = ({ onAuthOpen }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = user
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/explore', label: 'Explore' },
        { path: '/badges', label: 'Badges' },
        { path: '/hidden-gems', label: 'Hidden Gems' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
      ]
    : [
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
      ];

  const adminLinks = user?.role === 'admin'
    ? [
        { path: '/admin', label: 'Admin' },
      ]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to={user ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-950 text-white group-hover:bg-zinc-800 transition-colors shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-white"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </div>
            <span className="text-base font-bold text-zinc-900 tracking-tight">
              TravelTracker
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <HiShieldCheck className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors duration-200 border border-zinc-200"
                >
                  <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-zinc-700 hidden sm:block">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-lg py-1 animate-slide-down shadow-lg">
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium">
                          <HiShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      )}
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                      >
                        <HiUserCircle className="w-4 h-4 text-zinc-400" />
                        Profile Settings
                      </Link>
                    </div>

                    <div className="border-t border-zinc-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <HiArrowRightOnRectangle className="w-4 h-4 flex-shrink-0" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAuthOpen('login')}
                  className="btn-ghost text-sm !px-3 !py-1.5"
                >
                  Log In
                </button>
                <button
                  onClick={() => onAuthOpen('signup')}
                  className="btn-primary text-sm !px-4 !py-1.5"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              {mobileOpen ? (
                <HiXMark className="w-5 h-5" />
              ) : (
                <HiBars3 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200 animate-slide-down bg-white">
          <div className="px-4 py-2 space-y-0.5">
            {[...navLinks, ...adminLinks].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
