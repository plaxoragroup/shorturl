import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Link as LinkIcon, 
  MousePointerClick, 
  UserPlus 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getPlatformStats, getRecentLogs } from '../../services/adminService';

const chartData = [
  { name: 'Mon', clicks: 4000 },
  { name: 'Tue', clicks: 3000 },
  { name: 'Wed', clicks: 2000 },
  { name: 'Thu', clicks: 2780 },
  { name: 'Fri', clicks: 1890 },
  { name: 'Sat', clicks: 2390 },
  { name: 'Sun', clicks: 3490 },
];

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getPlatformStats,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const { data: recentActivity = [], isLoading: logsLoading } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: () => getRecentLogs(5),
    refetchInterval: 30000
  });

  if (statsLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Users', value: stats?.totalUsers || 0, icon: Users },
    { name: 'Total Links', value: stats?.totalLinks || 0, icon: LinkIcon },
    { name: 'Total Clicks', value: stats?.totalClicks || 0, icon: MousePointerClick },
    { name: 'Guest Links', value: stats?.guestLinks || 0, icon: UserPlus },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-surface-nearblack dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-surface-mediumgray dark:text-slate-400">
          Monitor your platform's key metrics and recent activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="rounded-2xl border border-surface-border dark:border-surface-darkborder bg-white dark:bg-surface-darkcard p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-mediumgray dark:text-slate-400">
                  {stat.name}
                </p>
                <p className="mt-2 font-heading text-3xl font-extrabold text-surface-nearblack dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-brand-cyan">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="lg:col-span-2 rounded-2xl border border-surface-border dark:border-surface-darkborder bg-white dark:bg-surface-darkcard p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-surface-nearblack dark:text-white mb-6">
            Click Analytics (Demo Data)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
                  }}
                />
                <Bar dataKey="clicks" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="rounded-2xl border border-surface-border dark:border-surface-darkborder bg-white dark:bg-surface-darkcard p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-surface-nearblack dark:text-white mb-6">
            Recent Admin Activity
          </h2>
          {logsLoading ? (
             <div className="text-center py-4 text-surface-mediumgray">Loading logs...</div>
          ) : recentActivity.length === 0 ? (
             <div className="text-center py-4 text-surface-mediumgray text-sm">No recent activity found.</div>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-surface-border dark:bg-surface-darkborder"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white dark:ring-surface-darkcard
                              ${activity.type === 'danger' ? 'bg-brand-red text-white' : ''}
                              ${activity.type === 'warning' ? 'bg-brand-yellow text-white' : ''}
                              ${activity.type === 'info' ? 'bg-brand-blue text-white' : ''}
                              ${activity.type === 'success' ? 'bg-brand-green text-white' : ''}
                            `}
                          >
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm font-medium text-surface-nearblack dark:text-white">
                              {activity.action}
                            </p>
                            <p className="text-xs text-surface-mediumgray dark:text-slate-400 mt-0.5">
                              {activity.target}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-surface-mediumgray dark:text-slate-500">
                            {new Date(activity.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
