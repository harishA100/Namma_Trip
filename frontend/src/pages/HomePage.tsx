import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Plus, MapPin, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { postApi, destinationApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { TravelPost, Destination } from '../types';

const festivals = [
  { name: 'Pongal', month: 'January', icon: '🎋', color: 'from-amber-500 to-orange-600' },
  { name: 'Chithirai Thiruvizha', month: 'April', icon: '🛕', color: 'from-pink-500 to-rose-600' },
  { name: 'Jallikattu', month: 'January', icon: '🐂', color: 'from-red-500 to-rose-600' },
  { name: 'Natyanjali', month: 'February', icon: '💃', color: 'from-purple-500 to-violet-600' },
];

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<TravelPost[]>([]);
  const [trending, setTrending] = useState<Destination[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postRes, trendRes] = await Promise.all([
        postApi.getFeed(0, 10).catch(() => ({ data: { data: { content: [] } } })),
        destinationApi.getTrending().catch(() => ({ data: { data: [] } })),
      ]);
      setPosts(postRes.data?.data?.content || []);
      setTrending(trendRes.data?.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newCaption.trim()) return;
    try {
      await postApi.create({ caption: newCaption });
      setNewCaption('');
      setShowCreate(false);
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleLike = async (postId: number) => {
    try {
      await postApi.toggleLike(postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, likedByCurrentUser: !p.likedByCurrentUser, likeCount: p.likedByCurrentUser ? p.likeCount - 1 : p.likeCount + 1 } : p));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border-[var(--color-primary)]/20">
          <h1 className="text-2xl font-bold mb-1">
            Vanakkam, <span className="gradient-text">{user?.name}!</span> 👋
          </h1>
          <p className="text-[var(--color-text-secondary)]">What's your next Tamil Nadu adventure?</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Share Post
            </button>
          </div>
        </motion.div>

        {/* Create Post Modal */}
        {showCreate && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-5">
            <h3 className="font-semibold mb-3">Share your travel moment ✨</h3>
            <textarea value={newCaption} onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Tell us about your experience..." rows={3}
              className="input resize-none mb-3" id="create-post-caption" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
              <button onClick={handleCreatePost} className="btn-primary text-sm py-2 px-4 flex items-center gap-1">
                <Send className="w-3.5 h-3.5" /> Post
              </button>
            </div>
          </motion.div>
        )}

        {/* Festival Highlights */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--color-secondary)]" /> Festival Highlights
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {festivals.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="card p-4 text-center cursor-pointer hover:scale-105 transition-transform">
                <span className="text-3xl">{f.icon}</span>
                <p className="text-sm font-semibold mt-2">{f.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{f.month}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" /> Travel Feed
          </h2>

          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="skeleton w-32 h-4" />
                </div>
                <div className="skeleton w-full h-48 rounded-xl" />
                <div className="skeleton w-3/4 h-4" />
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
                    {post.userName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{post.userName}</p>
                    {post.destinationName && (
                      <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {post.destinationName}
                      </p>
                    )}
                  </div>
                  <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {post.images && (
                  <img src={post.images} alt="" className="w-full h-64 object-cover rounded-xl mb-3" />
                )}
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">{post.caption}</p>
                <div className="flex items-center gap-4 text-[var(--color-text-muted)]">
                  <button onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${post.likedByCurrentUser ? 'text-red-400' : 'hover:text-red-400'}`}>
                    <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-current' : ''}`} />
                    {post.likeCount}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm hover:text-[var(--color-primary)] transition-colors">
                    <MessageCircle className="w-4 h-4" /> {post.commentCount}
                  </button>
                  <button className="ml-auto hover:text-[var(--color-secondary)] transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">🌴</div>
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-[var(--color-text-muted)] text-sm">Be the first to share your travel experience!</p>
              <button onClick={() => setShowCreate(true)} className="btn-primary mt-4 text-sm">Create Post</button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* User Card */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary text-xs">{user?.travelLevel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-light)]/50">
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--color-secondary)]">{user?.xpPoints || 0}</p>
              <p className="text-xs text-[var(--color-text-muted)]">XP Points</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-lg font-bold">{user?.travelLevel}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Level</p>
            </div>
          </div>
        </div>

        {/* Trending Destinations */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" /> Trending Destinations
          </h3>
          <div className="space-y-3">
            {trending.slice(0, 5).map((d, i) => (
              <div key={d.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={d.images} alt={d.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{d.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{d.category}</p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-secondary)]">⭐ {Number(d.rating).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
