import React, { useEffect, useState } from 'react';
import { Menu, Search, Sun, Moon, Bell } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface AdminHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ setSidebarOpen }) => {
  const { currentUser } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // Keep theme state in sync if changed elsewhere
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-surface-border dark:border-surface-darkborder bg-white/90 dark:bg-surface-darkcard/90 px-4 backdrop-blur-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-surface-darkgray dark:text-slate-400 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-surface-border dark:bg-surface-darkborder lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-surface-mediumgray dark:text-slate-500"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-surface-nearblack dark:text-white placeholder:text-surface-mediumgray dark:placeholder:text-slate-500 focus:ring-0 sm:text-sm"
            placeholder="Search users, links, or logs..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-surface-mediumgray dark:text-slate-400 hover:text-surface-nearblack dark:hover:text-white transition-colors"
            onClick={toggleTheme}
          >
            <span className="sr-only">Toggle theme</span>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="-m-2.5 p-2.5 text-surface-mediumgray dark:text-slate-400 hover:text-surface-nearblack dark:hover:text-white transition-colors"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-surface-border dark:lg:bg-surface-darkborder" aria-hidden="true" />

          {/* Profile dropdown Placeholder */}
          <div className="flex items-center gap-x-4">
            <div className="h-8 w-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-sm">
              {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-2 text-sm font-semibold leading-6 text-surface-nearblack dark:text-white" aria-hidden="true">
                {currentUser?.displayName || 'Admin User'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
