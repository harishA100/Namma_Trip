import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Award, Calendar, Bookmark, ChevronRight, Settings, Camera, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { tripApi, destinationApi, userApi } from '../api/api';
import { Trip, Destination } from '../types';

const levelColors: Record<string, string> = {
  Explorer: 'from-blue-500 to-cyan-500',
  Wanderer: 'from-green-500 to-emerald-500',
  Adventurer: 'from-purple-500 to-violet-500',
  Voyager: 'from-orange-500 to-amber-500',
  Legend: 'from-yellow-400 to-red-500',
};

const achievements = [
  { name: 'First Trip', icon: '🎒', desc: 'Complete your first trip', unlocked: true },
  { name: 'Temple Run', icon: '🛕', desc: 'Visit 5 temples', unlocked: false },
  { name: 'Beach Bum', icon: '🏖️', desc: 'Visit 3 beaches', unlocked: false },
  { name: 'Foodie', icon: '🍛', desc: 'Try 10 local dishes', unlocked: false },
  { name: 'Explorer Pro', icon: '🧭', desc: 'Visit 10 destinations', unlocked: false },
  { name: 'Social Butterfly', icon: '🦋', desc: 'Share 5 posts', unlocked: false },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [saved, setSaved] = useState<Destination[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('trips');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [tripRes, savedRes, statsRes] = await Promise.all([
        tripApi.getUserTrips().catch(() => ({ data: { data: [] } })),
        destinationApi.getSaved().catch(() => ({ data: { data: [] } })),
        userApi.getStats().catch(() => ({ data: { data: {} } })),
      ]);
      setTrips(tripRes.data?.data || []);
      setSaved(savedRes.data?.data || []);
      setStats(statsRes.data?.data || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const xpForNextLevel = user?.travelLevel === 'Explorer' ? 500 : user?.travelLevel === 'Wanderer' ? 1500 : user?.travelLevel === 'Adventurer' ? 3000 : 5000;
  const xpProgress = Math.min(((user?.xpPoints || 0) / xpForNextLevel) * 100, 100);

  return (
    <div className="py-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${levelColors[user?.travelLevel || 'Explorer']} opacity-10`} />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/10">
              {user?.name?.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[var(--color-surface)] border border-white/10">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-[var(--color-text-muted)] text-sm">{user?.email}</p>
            {user?.bio && <p className="text-sm text-[var(--color-text-secondary)] mt-1">{user?.bio}</p>}
            <div className="flex items-center gap-3 mt-3 justify-center md:justify-start">
              <span className={`badge bg-gradient-to-r ${levelColors[user?.travelLevel || 'Explorer']} text-white`}>
                {user?.travelLevel}
              </span>
              <span className="text-sm text-[var(--color-secondary)] font-semibold">⚡ {user?.xpPoints} XP</span>
            </div>
            {/* XP Progress Bar */}
            <div className="mt-3 max-w-xs">
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                <span>{user?.xpPoints} XP</span>
                <span>{xpForNextLevel} XP</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full bg-gradient-to-r ${levelColors[user?.travelLevel || 'Explorer']}`} />
              </div>
            </div>
          </div>
          <button className="btn-secondary text-sm py-2 px-4 flex items-center gap-1">
            <Settings className="w-4 h-4" /> Edit
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Trips', value: stats?.totalTrips || 0, icon: '🗺️' },
          { label: 'XP Points', value: user?.xpPoints || 0, icon: '⚡' },
          { label: 'Level', value: user?.travelLevel || 'Explorer', icon: '🏆' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="card p-4 text-center">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {[
          { id: 'trips', label: 'My Trips' },
          { id: 'saved', label: 'Saved' },
          { id: 'achievements', label: 'Achievements' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === t.id ? 'gradient-bg text-white' : 'text-[var(--color-text-muted)] hover:bg-white/5'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Trips */}
      {activeTab === 'trips' && (
        <div className="space-y-3">
          {trips.map((trip, i) => (
            <motion.div key={trip.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/feed/trip/${trip.id}`)}
              className="card p-4 flex items-center gap-4 cursor-pointer">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white text-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{trip.destination}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{trip.duration} days · ₹{Number(trip.budget).toLocaleString()}</p>
              </div>
              <span className={`badge ${trip.status === 'ACTIVE' ? 'badge-success' : trip.status === 'COMPLETED' ? 'badge-primary' : 'badge-warning'} text-xs`}>
                {trip.status}
              </span>
              <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
            </motion.div>
          ))}
          {trips.length === 0 && (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="font-semibold mb-1">No trips yet</p>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">Plan your first Tamil Nadu adventure!</p>
              <button onClick={() => navigate('/feed/planner')} className="btn-primary text-sm">Start Planning</button>
            </div>
          )}
        </div>
      )}

      {/* Saved */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {saved.map((dest, i) => (
            <motion.div key={dest.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/feed/destination/${dest.id}`)}
              className="card p-4 flex items-center gap-4 cursor-pointer">
              <img src={dest.images} alt={dest.name} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <p className="font-semibold">{dest.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{dest.category} · ⭐ {Number(dest.rating).toFixed(1)}</p>
              </div>
            </motion.div>
          ))}
          {saved.length === 0 && (
            <div className="col-span-2 card p-12 text-center">
              <Bookmark className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-text-muted)]">No saved destinations yet</p>
            </div>
          )}
        </div>
      )}

      {/* Achievements */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className={`card p-5 text-center ${a.unlocked ? '' : 'opacity-40'}`}>
              <span className="text-4xl">{a.icon}</span>
              <p className="font-semibold mt-2 text-sm">{a.name}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{a.desc}</p>
              {a.unlocked && <span className="badge badge-success text-xs mt-2">Unlocked</span>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
