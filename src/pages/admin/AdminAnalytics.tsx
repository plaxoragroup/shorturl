import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllLinks } from '../../services/adminService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const AdminAnalytics: React.FC = () => {
  const { data: links = [], isLoading } = useQuery({
    queryKey: ['adminLinks'],
    queryFn: getAllLinks
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
      </div>
    );
  }

  // Get Top 10 links by clickCount
  const topLinks = [...links]
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 10)
    .map(link => ({
      name: `/${link.alias}`,
      clicks: link.clickCount
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-surface-nearblack dark:text-white">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-surface-mediumgray dark:text-slate-400">
          Global analytics and performance of all short links.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Top 10 Links Chart */}
        <div className="rounded-xl border border-surface-border dark:border-surface-darkborder bg-white dark:bg-surface-darkcard shadow-sm p-6">
          <h2 className="font-heading text-lg font-bold text-surface-nearblack dark:text-white mb-6">
            Top 10 Most Clicked Links
          </h2>
          {topLinks.length === 0 ? (
            <div className="text-center py-10 text-surface-mediumgray">No link data available.</div>
          ) : (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topLinks} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      background: 'var(--bg-surface-darkcard)' 
                    }}
                  />
                  <Bar dataKey="clicks" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Aggregate Stats Placeholder */}
        <div className="rounded-xl border border-surface-border dark:border-surface-darkborder bg-white dark:bg-surface-darkcard shadow-sm p-6">
          <h2 className="font-heading text-lg font-bold text-surface-nearblack dark:text-white mb-6">
            Future Analytics (Coming Soon)
          </h2>
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <p className="text-surface-mediumgray dark:text-slate-400">
              Browser, Device, and Location tracking will be available in future updates.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
