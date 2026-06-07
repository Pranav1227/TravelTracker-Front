import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getProfile } from './store/slices/authSlice';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';
import AuthModal from './components/auth/AuthModal';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import BadgesPage from './pages/BadgesPage';
import HiddenGemsPage from './pages/HiddenGemsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePlaces from './pages/admin/ManagePlaces';
import ReviewGems from './pages/admin/ReviewGems';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // Light mode only
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  // Fetch profile on mount if token exists
  useEffect(() => {
    if (user?.token) {
      dispatch(getProfile());
    }
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleAuthOpen = (tab = 'login') => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#09090b',
            border: '1px solid #e4e4e7',
            borderRadius: '8px',
          },
          success: {
            iconTheme: { primary: '#0d9488', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />

      <Navbar onAuthOpen={handleAuthOpen} />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialTab={authTab}
      />

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage onAuthOpen={handleAuthOpen} />
              )
            }
          />

          {/* Public Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
          <Route path="/hidden-gems" element={<ProtectedRoute><HiddenGemsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/places" element={<AdminRoute><ManagePlaces /></AdminRoute>} />
          <Route path="/admin/gems" element={<AdminRoute><ReviewGems /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
