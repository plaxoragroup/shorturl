import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import RedirectHandler from './pages/RedirectHandler';
import { AuthProvider } from './contexts/AuthContext';

// Admin Imports
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './pages/admin/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLinks from './pages/admin/AdminLinks';
import AdminGuestLinks from './pages/admin/AdminGuestLinks';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes (No Navbar/Footer) */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="links" element={<AdminLinks />} />
              <Route path="guest-links" element={<AdminGuestLinks />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Public & User Routes */}
          <Route
            path="/*"
            element={
              <div className="app-wrapper flex flex-col min-h-screen">
                <Navbar theme={theme} toggleTheme={toggleTheme} />
                <main className="main-content flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/:shortcode" element={<RedirectHandler />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
