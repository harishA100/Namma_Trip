import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Bookmark, BookmarkCheck, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { destinationApi } from '../api/api';
import { Destination } from '../types';

const categories = ['All', 'Hill Stations', 'Beaches', 'Temples', 'Heritage', 'Food Trails', 'Adventure'];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestinations();
  }, [activeCategory]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const res = activeCategory === 'All'
        ? await destinationApi.getAll(0, 30)
        : await destinationApi.getAll(0, 30, activeCategory);
      setDestinations(res.data?.data?.content || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSearch = async (query?: string) => {
    const q = query || searchQuery;
    if (!q.trim()) { loadDestinations(); return; }
    setLoading(true);
    try {
      const res = await destinationApi.search(q);
      setDestinations(res.data?.data?.content || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSave = async (id: number) => {
    try {
      await destinationApi.toggleSave(id);
      setDestinations(destinations.map(d => d.id === id ? { ...d, savedByCurrentUser: !d.savedByCurrentUser } : d));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore <span className="gradient-text">Tamil Nadu</span></h1>
        <p className="text-[var(--color-text-muted)]">Discover incredible destinations across the cultural heartland of India</p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
        <input
          type="text" value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search destinations, categories..."
          className="input pl-12 py-3.5 text-base" id="explore-search"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'gradient-bg text-white shadow-lg shadow-[var(--color-primary)]/25'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-light)]'
            }`}>
            {cat === 'Hill Stations' ? '⛰️' : cat === 'Beaches' ? '🏖️' : cat === 'Temples' ? '🛕' :
              cat === 'Heritage' ? '🏛️' : cat === 'Food Trails' ? '🍛' : cat === 'Adventure' ? '🧗' : '🌏'} {cat}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton w-full h-48" />
              <div className="p-5 space-y-3">
                <div className="skeleton w-3/4 h-5" />
                <div className="skeleton w-full h-4" />
                <div className="skeleton w-1/2 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <motion.div key={dest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card overflow-hidden cursor-pointer group" onClick={() => navigate(`/feed/destination/${dest.id}`)}>
              <div className="relative h-48 overflow-hidden">
                <img src={dest.images} alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={(e) => { e.stopPropagation(); handleSave(dest.id); }}
                  className="absolute top-3 right-3 p-2 rounded-full glass hover:bg-white/20 transition-colors">
                  {dest.savedByCurrentUser
                    ? <BookmarkCheck className="w-4 h-4 text-[var(--color-secondary)]" />
                    : <Bookmark className="w-4 h-4 text-white" />
                  }
                </button>
                <div className="absolute bottom-3 left-3">
                  <span className="badge badge-primary text-xs">{dest.category}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-[var(--color-secondary)]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">{Number(dest.rating).toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">{dest.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Best: {dest.bestSeason}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && destinations.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">No destinations found</h3>
          <p className="text-[var(--color-text-muted)] text-sm">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
