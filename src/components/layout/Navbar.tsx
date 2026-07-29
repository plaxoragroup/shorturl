import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Moon, Sun } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-surface-darkcard/90 backdrop-blur-md border-b border-surface-border dark:border-surface-darkborder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:bg-brand-purple transition-all duration-300">
            <i className="fa-solid fa-link text-lg"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-surface-nearblack dark:text-white leading-none">
              Plaxora<span className="text-brand-blue">Links</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-purple mt-0.5">Link Ecosystem</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-surface-darkgray dark:text-slate-300">
          <a href="#features" className="hover:text-brand-blue dark:hover:text-brand-cyan transition-colors">Features</a>
          <a href="#comparisons" className="hover:text-brand-blue dark:hover:text-brand-cyan transition-colors">Comparisons</a>
          <a href="#pseo-hub" className="hover:text-brand-blue dark:hover:text-brand-cyan transition-colors">Solutions</a>
          <a href="#blog-hub" className="hover:text-brand-blue dark:hover:text-brand-cyan transition-colors">Blog Strategy</a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          
          <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-surface-border dark:border-surface-darkborder bg-surface-offwhite dark:bg-slate-800 text-surface-darkgray dark:text-slate-200 hover:text-brand-blue transition-colors" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {currentUser ? (
            <div className="hidden sm:flex items-center space-x-3">
              <Link to="/dashboard" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-blue bg-blue-50 hover:bg-blue-100 transition-colors">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-surface-nearblack hover:bg-slate-800 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2.5 text-sm font-semibold text-surface-darkgray hover:text-brand-blue transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:bg-brand-purple transition-all duration-200 shadow-md">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2.5 rounded-xl border border-surface-border dark:border-surface-darkborder text-surface-darkgray dark:text-slate-300">
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-surface-border dark:border-surface-darkborder bg-white dark:bg-surface-darkcard px-4 py-4 space-y-3">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-surface-darkgray dark:text-slate-200 hover:text-brand-blue">Platform Features</a>
          <a href="#comparisons" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-surface-darkgray dark:text-slate-200 hover:text-brand-blue">Competitor Comparison</a>
          <a href="#pseo-hub" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-surface-darkgray dark:text-slate-200 hover:text-brand-blue">Solutions</a>
          
          <div className="border-t border-surface-border dark:border-surface-darkborder pt-3 mt-3 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-center w-full px-4 py-2 rounded-xl text-sm font-semibold text-brand-blue bg-blue-50">Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-white bg-surface-nearblack">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center w-full px-4 py-2 rounded-xl text-sm font-semibold border border-surface-border">Login</Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block text-center w-full px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-blue">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
