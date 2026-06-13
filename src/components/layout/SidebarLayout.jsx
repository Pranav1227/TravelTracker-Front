import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Modal from '../ui/Modal';
import {
  Menu,
  X,
  LayoutDashboard,
  Trophy,
  Compass,
  ShieldCheck,
  Settings,
  HelpCircle,
  Bookmark,
  LogOut,
  Bell,
  Search,
  Sparkles,
  Map as MapIcon,
  FileText,
  Gem
} from 'lucide-react';

const SidebarLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const confirmLogout = () => {
    dispatch(logout());
    setLogoutModalOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const mainLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/explore', label: 'Explore', icon: MapIcon },
    { path: '/bucket-list', label: 'Bucket List', icon: Bookmark },
    { path: '/passport', label: 'Digital Passport', icon: FileText },
    { path: '/badges', label: 'Badges', icon: Trophy },
    { path: '/hidden-gems', label: 'Hidden Gems', icon: Gem },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin Queue', icon: ShieldCheck }] : []),
  ];

  const bottomLinks = [
    { path: '/profile', label: 'Settings', icon: Settings },
    { path: '/contact', label: 'Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen bg-white border-r border-zinc-200 flex flex-col z-50 transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'} w-64`}
      >
        {/* Logo & Close (Mobile) */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-[#1A365D] text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </div>
            <div className={`flex flex-col leading-tight transition-opacity duration-200 ${collapsed ? 'hidden md:opacity-0 md:w-0 overflow-hidden' : 'opacity-100'}`}>
              <span className="text-[15px] font-bold text-[#1A365D] tracking-tight">TravelTracker</span>
              <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">Elite Explorer</span>
            </div>
          </Link>
          <button className="md:hidden text-zinc-400 hover:text-zinc-600" onClick={() => setMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  active 
                    ? 'bg-[#1A365D] text-white shadow-md' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-[#1A365D]'
                }`}
                title={collapsed ? link.label : ''}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-zinc-400'}`} />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-zinc-100 space-y-4">
          <div className="space-y-1">
            {bottomLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors`}
                  title={collapsed ? link.label : ''}
                >
                  <Icon className="w-4 h-4 text-zinc-400" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
            <button
              onClick={() => setLogoutModalOpen(true)}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left`}
              title={collapsed ? 'Logout' : ''}
            >
              <LogOut className="w-4 h-4 text-zinc-400" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button className="hidden md:block text-zinc-500 hover:text-zinc-900 p-1" onClick={() => setCollapsed(!collapsed)}>
              <Menu className="w-5 h-5" />
            </button>
            <button className="md:hidden text-zinc-500 hover:text-zinc-900 p-1" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-[#1A365D] hidden md:block">TravelTracker</h1>
            
            {/* Search Bar - hidden on very small screens */}
            <div className="hidden sm:flex items-center bg-[#F7FAFC] border border-zinc-200 rounded-lg px-3 py-1.5 w-64 md:ml-4">
              <Search className="w-4 h-4 text-zinc-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-zinc-700 w-full placeholder-zinc-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/notifications" className="relative text-zinc-500 hover:text-zinc-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#ED8936] rounded-full border-2 border-white"></span>
            </Link>
            
            {user && (
              <Link to="/profile" className="w-8 h-8 rounded-full bg-[#1A365D] flex items-center justify-center text-white font-semibold text-xs border-2 border-white shadow-sm hover:scale-105 transition-transform">
                {user.name?.charAt(0).toUpperCase()}
              </Link>
            )}
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal 
        isOpen={logoutModalOpen} 
        onClose={() => setLogoutModalOpen(false)} 
        title="Confirm Logout"
        maxWidth="max-w-sm"
      >
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Ready to leave?</h3>
          <p className="text-sm text-zinc-500 mb-6">
            Are you sure you want to log out of TravelTracker?
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setLogoutModalOpen(false)} 
              className="flex-1 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmLogout} 
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SidebarLayout;
