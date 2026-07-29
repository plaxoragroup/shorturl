import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Link as LinkIcon, 
  UserCircle,
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { cn } from '../../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Links', href: '/admin/links', icon: LinkIcon },
  { name: 'Guest Links', href: '/admin/guest-links', icon: UserCircle },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-surface-nearblack/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-surface-darkcard border-r border-surface-border dark:border-surface-darkborder transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-surface-border dark:border-surface-darkborder">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue text-white font-bold">
                <LinkIcon size={18} />
              </div>
              <span className="font-heading text-lg font-bold text-surface-nearblack dark:text-white">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/admin'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-brand-cyan"
                      : "text-surface-darkgray dark:text-slate-400 hover:bg-surface-offwhite hover:text-surface-nearblack dark:hover:bg-slate-800 dark:hover:text-white"
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-surface-border dark:border-surface-darkborder">
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-darkgray dark:text-slate-400 transition-colors hover:bg-surface-offwhite hover:text-brand-red dark:hover:bg-slate-800 dark:hover:text-red-400"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
