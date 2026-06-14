import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, Bookmark, BookmarkCheck, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { destinationApi } from '../api/api';
import { Destination } from '../types';

export default function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDestination();
  }, [id]);

  const loadDestination = async () => {
    try {
      const res = await destinationApi.getById(Number(id));
      setDestination(res.data.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!destination) return;
    try {
      await destinationApi.toggleSave(destination.id);
      setDestination({ ...destination, savedByCurrentUser: !destination.savedByCurrentUser });
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mx-auto" /></div>;
  if (!destination) return <div className="py-12 text-center">Destination not found</div>;

  return (
    <div className="py-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-white transition-colors mb-4 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Hero Image */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-6">
        <img src={destination.images} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="badge badge-primary mb-2">{destination.category}</span>
          <h1 className="text-4xl font-bold text-white mb-2">{destination.name}</h1>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[var(--color-secondary)] fill-current" /> {Number(destination.rating).toFixed(1)}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Best: {destination.bestSeason}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Tamil Nadu</span>
          </div>
        </div>
        <button onClick={handleSave}
          className="absolute top-4 right-4 p-3 rounded-xl glass hover:bg-white/20 transition-colors">
          {destination.savedByCurrentUser
            ? <BookmarkCheck className="w-5 h-5 text-[var(--color-secondary)]" />
            : <Bookmark className="w-5 h-5 text-white" />
          }
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">{destination.description}</p>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card p-5">
            <h3 className="font-semibold mb-4">Plan a Trip</h3>
            <button onClick={() => navigate('/feed/planner')}
              className="btn-primary w-full flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Plan with AI
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="card p-5">
            <h3 className="font-semibold mb-3">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Category</span>
                <span className="font-medium">{destination.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Best Season</span>
                <span className="font-medium">{destination.bestSeason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Rating</span>
                <span className="font-medium flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[var(--color-secondary)] fill-current" />
                  {Number(destination.rating).toFixed(1)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
