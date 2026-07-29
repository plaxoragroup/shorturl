import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Trash2, 
  ExternalLink,
  Ban,
  CheckCircle,
  Copy
} from 'lucide-react';
import { getAllLinks, updateLinkStatus, deleteLinkByAdmin } from '../../services/adminService';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const AdminLinks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['adminLinks'],
    queryFn: getAllLinks
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ alias, isActive }: { alias: string, isActive: boolean }) => 
      updateLinkStatus(alias, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLinks'] });
      toast.success('Link status updated');
    },
    onError: (err: any) => toast.error(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLinkByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLinks'] });
      toast.success('Link deleted successfully');
    },
    onError: (err: any) => toast.error(err.message)
  });

  const filteredLinks = links
    .filter(link => !link.isGuest) // only registered user links
    .filter(link => 
      link.alias.toLowerCase().includes(searchTerm.toLowerCase()) || 
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCopy = (alias: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${alias}`);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-nearblack dark:text-white">
            Manage Links
          </h1>
          <p className="mt-1 text-sm text-surface-mediumgray dark:text-slate-400">
            View and manage all links created by registered users.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 relative max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-surface-mediumgray" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-surface-nearblack ring-1 ring-inset ring-surface-border placeholder:text-surface-mediumgray focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-surface-darkcard dark:ring-surface-darkborder dark:text-white"
            placeholder="Search links..."
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
                  Alias
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">
                  Owner ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">
                  Clicks
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
                    Loading links...
                  </td>
                </tr>
              ) : filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-surface-mediumgray">
                    No links found.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-surface-offwhite/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-surface-nearblack dark:text-white">
                          /{link.alias}
                        </span>
                        <button 
                          onClick={() => handleCopy(link.alias)}
                          className="text-surface-mediumgray hover:text-brand-blue"
                          title="Copy Link"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-[200px] lg:max-w-xs">
                        <a 
                          href={link.originalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-brand-blue hover:underline truncate"
                        >
                          {link.originalUrl}
                        </a>
                        <ExternalLink className="h-3 w-3 flex-shrink-0 text-surface-mediumgray" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-darkgray dark:text-slate-400">
                      <span className="truncate w-24 block" title={link.ownerId || 'N/A'}>
                        {link.ownerId || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-darkgray dark:text-slate-400">
                      {link.clickCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        link.isActive 
                          ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20" 
                          : "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
                      )}>
                        {link.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => toggleStatusMutation.mutate({ alias: link.alias, isActive: !link.isActive })}
                          className="text-surface-mediumgray hover:text-brand-blue dark:text-slate-400 dark:hover:text-brand-cyan"
                          title={link.isActive ? "Disable Link" : "Enable Link"}
                        >
                          {link.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this link permanently?')) {
                              deleteMutation.mutate(link.alias);
                            }
                          }}
                          className="text-surface-mediumgray hover:text-brand-red dark:text-slate-400 dark:hover:text-red-400"
                          title="Delete Link"
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

export default AdminLinks;
