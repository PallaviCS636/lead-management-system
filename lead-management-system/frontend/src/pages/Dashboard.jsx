import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import api from '../api/axios';

const STATUS_COLORS = {
  New: '#38bdf8',
  Contacted: '#f59e0b',
  Qualified: '#7c3aed',
  Converted: '#10b981',
  Lost: '#fb7185',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        setError('Could not load dashboard stats. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const pieData = stats
    ? Object.entries(stats.statusBreakdown).map(([name, value]) => ({ name, value }))
    : [];

  const trendData = stats?.dailyTrend?.map((d) => ({ date: d._id.slice(5), count: d.count })) || [];

  return (
    <Layout title="Dashboard" subtitle="Live overview of your lead pipeline">
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <StatCard label="Total" value={stats.totalLeads} icon="📈" gradient="bg-slate-700" />
            <StatCard label="New" value={stats.newLeads} icon="✨" gradient="bg-sky-500" />
            <StatCard label="Contacted" value={stats.contactedLeads} icon="📞" gradient="bg-amber-500" />
            <StatCard label="Qualified" value={stats.qualifiedLeads} icon="🎯" gradient="bg-violet-500" />
            <StatCard label="Converted" value={stats.convertedLeads} icon="🏆" gradient="bg-emerald-500" />
            <StatCard label="Lost" value={stats.lostLeads} icon="⚠️" gradient="bg-rose-500" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="card lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">New Leads — Last 14 Days</h3>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600">
                  {stats.upcomingFollowUps} follow-ups due this week
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }}
                    cursor={{ fill: '#f5f3ff' }}
                  />
                  <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} maxBarSize={36} name="New Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card lg:col-span-2">
              <h3 className="mb-4 text-sm font-bold text-slate-700">Pipeline Breakdown</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
