import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, FileText, BarChart3, Trash2, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { adminApi } from '../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') { navigate('/feed'); return; }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        adminApi.getAnalytics().catch(() => ({ data: { data: {} } })),
        adminApi.getUsers().catch(() => ({ data: { data: { content: [] } } })),
      ]);
      setAnalytics(analyticsRes.data?.data || {});
      setUsers(usersRes.data?.data?.content || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const chartData = analytics ? [
    { name: 'Users', value: analytics.totalUsers || 0 },
    { name: 'Trips', value: analytics.totalTrips || 0 },
    { name: 'Destinations', value: analytics.totalDestinations || 0 },
    { name: 'Posts', value: analytics.totalPosts || 0 },
  ] : [];

  const tabs = [
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'destinations', icon: MapPin, label: 'Destinations' },
    { id: 'posts', icon: FileText, label: 'Posts' },
  ];

  return (
    <div className="py-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-[var(--color-primary)]" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-[var(--color-text-muted)] text-sm">Manage your platform</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === t.id ? 'gradient-bg text-white' : 'text-[var(--color-text-muted)] hover:bg-white/5'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mx-auto" /></div>
      ) : (
        <>
          {/* Analytics */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: analytics?.totalUsers || 0, color: 'text-blue-400', icon: '👥' },
                  { label: 'Total Trips', value: analytics?.totalTrips || 0, color: 'text-green-400', icon: '🗺️' },
                  { label: 'Destinations', value: analytics?.totalDestinations || 0, color: 'text-purple-400', icon: '📍' },
                  { label: 'Active Trips', value: analytics?.activeTrips || 0, color: 'text-orange-400', icon: '🚀' },
                ].map((s, i) => (
                  <div key={i} className="card p-5">
                    <span className="text-2xl">{s.icon}</span>
                    <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="card p-5">
                <h3 className="font-semibold mb-4">Platform Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                      <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-sm font-medium text-[var(--color-text-muted)]">User</th>
                      <th className="text-left p-4 text-sm font-medium text-[var(--color-text-muted)]">Role</th>
                      <th className="text-left p-4 text-sm font-medium text-[var(--color-text-muted)]">Level</th>
                      <th className="text-left p-4 text-sm font-medium text-[var(--color-text-muted)]">XP</th>
                      <th className="text-right p-4 text-sm font-medium text-[var(--color-text-muted)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-semibold">
                              {u.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{u.name}</p>
                              <p className="text-xs text-[var(--color-text-muted)]">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : 'badge-primary'} text-xs`}>{u.role}</span>
                        </td>
                        <td className="p-4 text-sm">{u.travelLevel}</td>
                        <td className="p-4 text-sm text-[var(--color-secondary)]">{u.xpPoints}</td>
                        <td className="p-4 text-right">
                          <button onClick={async () => { await adminApi.deleteUser(u.id); loadData(); }}
                            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Destinations / Posts placeholder */}
          {(activeTab === 'destinations' || activeTab === 'posts') && (
            <div className="card p-12 text-center">
              <MapPin className="w-10 h-10 text-[var(--color-primary)] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{activeTab === 'destinations' ? 'Destination Management' : 'Post Moderation'}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">Manage your {activeTab} from here</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
