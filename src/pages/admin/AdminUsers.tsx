import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Trash2, 
  ShieldAlert,
  ShieldCheck,
  UserCog
} from 'lucide-react';
import { getAllUsers, updateUserStatus, deleteUser } from '../../services/adminService';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAllUsers
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ uid, status }: { uid: string, status: 'active' | 'suspended' }) => 
      updateUserStatus(uid, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User status updated');
    },
    onError: (err: any) => toast.error(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User deleted successfully');
    },
    onError: (err: any) => toast.error(err.message)
  });

  const filteredUsers = users.filter(user => {
    const email = user.email || '';
    const name = user.name || '';
    return email.toLowerCase().includes(searchTerm.toLowerCase()) || 
           name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-nearblack dark:text-white">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-surface-mediumgray dark:text-slate-400">
            View all registered users and manage their access.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 relative max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-surface-mediumgray" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-surface-nearblack ring-1 ring-inset ring-surface-border placeholder:text-surface-mediumgray focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-surface-darkcard dark:ring-surface-darkborder dark:text-white"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-surface-border dark:border-surface-darkborder bg-white dark:bg-surface-darkcard shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-border dark:divide-surface-darkborder">
            <thead>
              <tr className="bg-surface-offwhite dark:bg-slate-800/50">
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-surface-darkborder">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-surface-mediumgray">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-surface-mediumgray">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-surface-offwhite/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-brand-blue/10 flex items-center justify-center">
                          <span className="text-brand-blue font-bold text-sm">
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-surface-nearblack dark:text-white">
                            {user.name || 'Unknown Name'}
                          </div>
                          <div className="text-sm text-surface-mediumgray dark:text-slate-400">
                            {user.email || 'No Email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-surface-darkgray bg-surface-offwhite ring-1 ring-inset ring-surface-border dark:bg-slate-800 dark:text-slate-300 dark:ring-surface-darkborder">
                        {user.role === 'admin' && <UserCog className="h-3 w-3" />}
                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-darkgray dark:text-slate-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-darkgray dark:text-slate-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        user.status === 'active'
                          ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20" 
                          : "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
                      )}>
                        {user.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => {
                            if(user.role === 'admin') {
                              toast.error("Cannot suspend an admin");
                              return;
                            }
                            toggleStatusMutation.mutate({ 
                              uid: user.uid, 
                              status: user.status === 'active' ? 'suspended' : 'active' 
                            });
                          }}
                          className="text-surface-mediumgray hover:text-brand-blue dark:text-slate-400 dark:hover:text-brand-cyan"
                          title={user.status === 'active' ? "Suspend User" : "Activate User"}
                        >
                          {user.status === 'active' ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if(user.role === 'admin') {
                              toast.error("Cannot delete an admin");
                              return;
                            }
                            if(window.confirm(`Are you sure you want to delete ${user.email} permanently?`)) {
                              deleteMutation.mutate(user.uid);
                            }
                          }}
                          className="text-surface-mediumgray hover:text-brand-red dark:text-slate-400 dark:hover:text-red-400"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
