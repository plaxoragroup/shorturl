import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, saveSettings, PlatformSettings } from '../../services/adminService';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const AdminSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: initialSettings, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: getSettings
  });

  const [settings, setSettings] = useState<PlatformSettings>({
    websiteName: '',
    maintenanceMode: false,
    enableGuestLinks: true
  });

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const saveMutation = useMutation({
    mutationFn: (newSettings: PlatformSettings) => saveSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      toast.success('Settings saved successfully');
    },
    onError: (err: any) => toast.error(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-surface-nearblack dark:text-white">
          Platform Settings
        </h1>
        <p className="mt-1 text-sm text-surface-mediumgray dark:text-slate-400">
          Configure global platform settings.
        </p>
      </div>

      <div className="rounded-xl border border-surface-border dark:border-surface-darkborder bg-white dark:bg-surface-darkcard shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="websiteName" className="block text-sm font-medium text-surface-nearblack dark:text-white">
              Website Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="websiteName"
                id="websiteName"
                className="block w-full rounded-lg border-0 py-2.5 text-surface-nearblack ring-1 ring-inset ring-surface-border placeholder:text-surface-mediumgray focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6 dark:bg-surface-darkbg dark:ring-surface-darkborder dark:text-white"
                value={settings.websiteName}
                onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="guestLinks" className="text-sm font-medium text-surface-nearblack dark:text-white">
                Enable Guest Links
              </label>
              <p className="text-sm text-surface-mediumgray dark:text-slate-400">
                Allow anonymous users to create short links.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.enableGuestLinks}
                onChange={(e) => setSettings({ ...settings, enableGuestLinks: e.target.checked })}
              />
              <div className="w-11 h-6 bg-surface-border peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-darkborder peer-checked:bg-brand-blue"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="maintenance" className="text-sm font-medium text-surface-nearblack dark:text-white">
                Maintenance Mode
              </label>
              <p className="text-sm text-surface-mediumgray dark:text-slate-400">
                Disable the platform temporarily for updates.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              />
              <div className="w-11 h-6 bg-surface-border peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-darkborder peer-checked:bg-brand-red"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-surface-border dark:border-surface-darkborder flex justify-end">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
