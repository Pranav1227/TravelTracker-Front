import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../../store/slices/authSlice';
import { X, Eye, EyeOff, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Close modal on successful auth
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      toast.success(`Welcome${user.name ? ', ' + user.name : ''}!`);
    }
  }, [user, isOpen, onClose]);

  // Show errors via toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      );
    } else {
      dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      );
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    dispatch(clearError());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-xl overflow-hidden animate-scale-in shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-7 h-7 text-zinc-900" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">
            {activeTab === 'login' ? 'Welcome Back' : 'Join the Adventure'}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {activeTab === 'login'
              ? 'Sign in to continue your exploration'
              : 'Start tracking your world adventures'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex mx-8 mb-6 bg-zinc-100 rounded-lg p-1">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => switchTab('signup')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'signup'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {/* Name - signup only */}
          {activeTab === 'signup' && (
            <div className="animate-slide-down">
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
                placeholder="John Doe"
                className="input-field"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="••••••••"
                className="input-field pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password - signup only */}
          {activeTab === 'signup' && (
            <div className="animate-slide-down">
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-3 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {activeTab === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : activeTab === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>

          {/* Switch prompt */}
          <p className="text-center text-sm text-zinc-500">
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className="text-zinc-900 hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-zinc-900 hover:underline font-medium"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
