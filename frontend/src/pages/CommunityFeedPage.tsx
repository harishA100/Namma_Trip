import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/* ── Data ────────────────────────────────────────────────────────────────── */
const SIDEBAR_W_COLLAPSED = 72;
const SIDEBAR_W_EXPANDED  = 200;

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home Feed',     path: '/feed' },
  { icon: '🧭', label: 'Explore',       path: '/feed/explore' },
  { icon: '✨', label: 'Smart Planner', path: '/feed/planner' },
  { icon: '📖', label: 'Travel Stories',path: '#' },
  { icon: '🎥', label: 'Travel Reels',  path: '#' },
  { icon: '🔖', label: 'Saved',         path: '#' },
];

const NAV_BOTTOM = [
  { icon: '👤', label: 'Profile',  path: '/feed/profile' },
  { icon: '⚙️', label: 'Settings', path: '#' },
];

const STORIES = [
  { id: 0, name: 'Your Story', img: null,                 add: true },
  { id: 1, name: 'Arjun',      img: '/ooty.jpg' },
  { id: 2, name: 'Priya',      img: '/madurai_temple.png' },
  { id: 3, name: 'Meena',      img: '/kodaikanal.jpg' },
  { id: 4, name: 'Karthik',    img: '/meenakshi.jpg' },
  { id: 5, name: 'Deepa',      img: '/beach.png' },
  { id: 6, name: 'Vijay',      img: '/yercaud_coffee.png' },
  { id: 7, name: 'Rani',       img: '/weekends.png' },
  { id: 8, name: 'Gopal',      img: '/beach.png' },
  { id: 9, name: 'Srinath',    img: '/ooty.jpg' },
];

const POSTS_INIT = [
  {
    id: 1, user: 'Priya Travels', avatar: '/madurai_temple.png',
    location: 'Ooty', time: '2 hours ago',
    caption: 'Waking up to this view in Nilgiris! The toy train journey was absolutely worth every second. Highly recommend the morning departure.',
    tags: ['#Ooty', '#Nilgiris', '#TamilNadu'],
    image: '/ooty_train.png', likes: '1.2k', comments: 84, shares: 240,
    liked: false, saved: false, followed: false,
  },
  {
    id: 2, user: 'Nature Explorer', avatar: '/weekends.png',
    location: 'Madurai', time: '5 hours ago',
    caption: 'Exploring the hidden corridors of history in Madurai. The architecture here tells stories of centuries past.',
    tags: ['#Madurai', '#Heritage', '#TamilNadu'],
    image: '/madurai_temple.png', likes: '3.4k', comments: 156, shares: 412,
    liked: true, saved: false, followed: false,
  },
  {
    id: 3, user: 'Kodai Dreams', avatar: '/kodaikanal.jpg',
    location: 'Kodaikanal', time: '8 hours ago',
    caption: 'Sunrise at Kodaikanal Lake is something words cannot describe. The mist, the silence, the golden light — pure magic.',
    tags: ['#Kodaikanal', '#LakeSunrise', '#TamilNadu'],
    image: '/kodaikanal.jpg', likes: '2.1k', comments: 98, shares: 315,
    liked: false, saved: true, followed: false,
  },
  {
    id: 4, user: 'Beach Walker', avatar: '/beach.png',
    location: 'Rameswaram', time: '1 day ago',
    caption: "Walking along Rameswaram's sacred shores at dawn. The spiritual energy here is unlike anything else in the world.",
    tags: ['#Rameswaram', '#BeachWalk', '#SacredSouth'],
    image: '/rameswaram_beach.png', likes: '987', comments: 67, shares: 189,
    liked: false, saved: false, followed: true,
  },
  {
    id: 5, user: 'Coffee Trails', avatar: '/yercaud_coffee.png',
    location: 'Yercaud', time: '2 days ago',
    caption: 'Found the most incredible coffee estate in Yercaud. The aroma of freshly picked beans and the cool misty air — absolute bliss!',
    tags: ['#Yercaud', '#CoffeeTrails', '#Salem'],
    image: '/yercaud_coffee.png', likes: '1.8k', comments: 113, shares: 278,
    liked: true, saved: true, followed: false,
  },
];

const TRENDING = [
  { name: 'Ooty Hills',         count: '1.2k posts today', img: '/ooty.jpg' },
  { name: 'Madurai Meenakshi',  count: '840 posts today',  img: '/meenakshi.jpg' },
  { name: 'Kodaikanal Lake',    count: '650 posts today',  img: '/kodaikanal.jpg' },
  { name: 'Rameswaram Beach',   count: '520 posts today',  img: '/rameswaram_beach.png' },
  { name: 'Yercaud Trails',     count: '340 posts today',  img: '/yercaud_coffee.png' },
  { name: 'Hogenakkal Falls',   count: '290 posts today',  img: '/weekends.png' },
];

const SUGGESTED = [
  { name: 'Nature Explorer',   bio: 'Backpacker',    followers: '4k',  img: '/weekends.png',       followed: false },
  { name: 'Astro Photographer',bio: 'Nightscapes',   followers: '12k', img: '/beach.png',          followed: true },
  { name: 'Foodie Traveller',  bio: 'Local Cuisine', followers: '8k',  img: '/food.png',           followed: false },
  { name: 'Solo Wanderer',      bio: 'Vlogger',       followers: '15k', img: '/logo.jpg',           followed: false },
  { name: 'Tamil Heritage',     bio: 'Historian',     followers: '9k',  img: '/madurai_temple.png', followed: false },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function parseCount(c: string) {
  return c.endsWith('k') ? Math.round(parseFloat(c) * 1000) : (parseInt(c) || 0);
}
function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/* ══════════════════════════════════════════════════════════════════════════
   COLLAPSIBLE SIDEBAR
══════════════════════════════════════════════════════════════════════════ */
function Sidebar({ onWidthChange }: { onWidthChange: (w: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const w = expanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED;

  useEffect(() => { onWidthChange(w); }, [w]);

  const isActive = (path: string) => path === '/feed'
    ? location.pathname === '/feed'
    : location.pathname.startsWith(path);

  return (
    <motion.aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      animate={{ width: w }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', top: 60, left: 0, bottom: 0, zIndex: 80,
        background: '#fff',
        borderRight: '1px solid #F0EDE9',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        paddingTop: '16px',
        paddingBottom: '16px',
      }}
    >
      {/* Logo row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 18px', marginBottom: '20px', height: '40px', flexShrink: 0,
        overflow: 'hidden',
      }}>
        <img src="/logo.jpg" alt="NT"
          style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
        <motion.span
          animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -8 }}
          transition={{ duration: 0.2, delay: expanded ? 0.08 : 0 }}
          style={{ fontWeight: 900, fontSize: '16px', color: '#FF6B35', whiteSpace: 'nowrap', overflow: 'hidden' }}
        >
          Namma Trip
        </motion.span>
      </div>

      {/* Section label */}
      <motion.div
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          fontSize: '10px', fontWeight: 700, color: '#C4B9B2',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          padding: '0 20px', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden',
        }}
      >
        Navigation
      </motion.div>

      {/* Primary Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px', overflow: 'hidden' }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.label} to={item.path}
              title={!expanded ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                gap: expanded ? '12px' : '0',
                padding: '10px',
                justifyContent: expanded ? 'flex-start' : 'center',
                borderRadius: '14px',
                textDecoration: 'none',
                background: active ? '#FF6B35' : 'transparent',
                color: active ? '#fff' : '#4B5563',
                fontWeight: active ? 700 : 500,
                fontSize: '14px',
                transition: 'background 0.15s, color 0.15s',
                whiteSpace: 'nowrap', overflow: 'hidden',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#FFF4EE'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
              <motion.span
                animate={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}

        {/* Divider */}
        <div style={{ height: '1px', background: '#F0EDE9', margin: '10px 4px', flexShrink: 0 }} />

        {NAV_BOTTOM.map(item => (
          <Link key={item.label} to={item.path}
            title={!expanded ? item.label : undefined}
            style={{
              display: 'flex', alignItems: 'center',
              gap: expanded ? '12px' : '0',
              padding: '10px',
              justifyContent: expanded ? 'flex-start' : 'center',
              borderRadius: '14px',
              textDecoration: 'none', color: '#4B5563',
              fontWeight: 500, fontSize: '14px',
              transition: 'background 0.15s',
              whiteSpace: 'nowrap', overflow: 'hidden', flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF4EE'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
            <motion.span
              animate={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              {item.label}
            </motion.span>
          </Link>
        ))}
      </nav>

      {/* Sign Out */}
      <div style={{ padding: '0 10px', flexShrink: 0 }}>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          title={!expanded ? 'Sign Out' : undefined}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: expanded ? 'flex-start' : 'center',
            gap: expanded ? '10px' : '0',
            padding: '10px', borderRadius: '14px',
            background: 'none', border: '1.5px solid #F0EDE9',
            color: '#9CA3AF', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.15s', overflow: 'hidden',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.color = '#FF6B35'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#F0EDE9'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <span style={{ fontSize: '16px', flexShrink: 0 }}>🚪</span>
          <motion.span
            animate={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            Sign Out
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function CommunityFeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarW, setSidebarW]     = useState(SIDEBAR_W_COLLAPSED);
  const [posts, setPosts]           = useState(POSTS_INIT);
  const [suggested, setSuggested]   = useState(SUGGESTED);
  const [trendTab, setTrendTab]     = useState<'Today' | 'Week'>('Today');
  const [fabOpen, setFabOpen]       = useState(false);
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [searchVal, setSearchVal]   = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const storiesRef = useRef<HTMLDivElement>(null);

  const [hoveredStory, setHoveredStory] = useState<number | null>(null);
  const [viewedStories, setViewedStories] = useState<number[]>([2, 4, 6]); // Priya, Karthik, Vijay start as viewed
  const [storiesHovered, setStoriesHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const yourStory = STORIES.find(s => s.id === 0);
  const otherStories = STORIES.filter(s => s.id !== 0);
  const unviewed = otherStories.filter(s => !viewedStories.includes(s.id));
  const viewed = otherStories.filter(s => viewedStories.includes(s.id));
  const orderedStories = [
    ...(yourStory ? [yourStory] : []),
    ...unviewed,
    ...viewed
  ];

  const checkScroll = () => {
    if (storiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    const t = setTimeout(checkScroll, 300);
    return () => {
      window.removeEventListener('resize', checkScroll);
      clearTimeout(t);
    };
  }, []);

  const scrollStories = (dir: 'left' | 'right') => {
    if (storiesRef.current) {
      const amt = 320;
      storiesRef.current.scrollBy({
        left: dir === 'left' ? -amt : amt,
        behavior: 'smooth',
      });
    }
  };

  const handleStoryClick = (id: number) => {
    setActiveStory(id);
    if (id !== 0 && !viewedStories.includes(id)) {
      setViewedStories(prev => [...prev, id]);
    }
  };

  /* ── helpers ── */
  const toggleLike  = (id: number) =>
    setPosts(p => p.map(x => x.id === id
      ? { ...x, liked: !x.liked, likes: x.liked ? formatCount(parseCount(x.likes)-1) : formatCount(parseCount(x.likes)+1) }
      : x));
  const toggleSave  = (id: number) =>
    setPosts(p => p.map(x => x.id === id ? { ...x, saved: !x.saved } : x));
  const toggleFollow = (id: number) =>
    setPosts(p => p.map(x => x.id === id ? { ...x, followed: !x.followed } : x));
  const toggleSugFollow = (i: number) =>
    setSuggested(s => s.map((x, idx) => idx === i ? { ...x, followed: !x.followed } : x));

  /* close FAB on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('#nt-fab')) setFabOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const RIGHT_W = 340;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F3', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      {/* ══ STICKY HEADER ══════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 60,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #F0EDE9',
        display: 'flex', alignItems: 'center',
        padding: '0 20px 0 0',
        gap: 0,
      }}>
        {/* Spacer matching collapsed sidebar */}
        <div style={{ width: sidebarW, flexShrink: 0, transition: 'width 0.28s ease' }} />

        {/* Search */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
          <div style={{ width: '100%', maxWidth: 700, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}
              width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search destinations, creators, or plans..."
              style={{
                width: '100%', height: 42, borderRadius: 21,
                border: searchFocused ? '2px solid #FF6B35' : '1.5px solid #EDE9E4',
                background: searchFocused ? '#fff' : '#F8F6F3',
                padding: '0 16px 0 44px', fontSize: 13.5, color: '#0F172A',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                boxShadow: searchFocused ? '0 0 0 4px rgba(255,107,53,0.12)' : 'none',
              }}
            />
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {/* Notif */}
          <HeaderBtn>
            <div style={{ position: 'relative' }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#FF6B35', borderRadius: '50%', border: '1.5px solid #fff' }} />
            </div>
          </HeaderBtn>
          {/* Messages */}
          <HeaderBtn>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </HeaderBtn>

          {/* Profile chip */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/feed/profile')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 14px 6px 6px',
              borderRadius: 24,
              background: '#FFF4EE',
              border: '1.5px solid #FFD5C2',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', border: '2px solid #FF6B35', flexShrink: 0 }}>
              <img src="/logo.jpg" alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>{user?.name || 'Test Explorer'}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                ⭐ Premium Traveler
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ══ BODY ═══════════════════════════════════════════════════════════ */}
      <Sidebar onWidthChange={setSidebarW} />

      <div style={{
        marginLeft: sidebarW,
        marginRight: RIGHT_W,
        paddingTop: 60,
        transition: 'margin-left 0.28s ease',
        display: 'flex', justifyContent: 'center',
      }}>
        <main style={{ width: '100%', maxWidth: 900, padding: '20px 20px 80px' }}>

          {/* ── Stories ─────────────────────────────────────────────────── */}
          <section
            onMouseEnter={() => setStoriesHovered(true)}
            onMouseLeave={() => setStoriesHovered(false)}
            style={{
              position: 'relative',
              background: '#fff', borderRadius: 24,
              padding: '0 20px', marginBottom: 18,
              height: 126,
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            {/* Left navigation control */}
            <AnimatePresence>
              {storiesHovered && canScrollLeft && (
                <motion.button
                  key="prev-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollStories('left')}
                  title="Previous Stories"
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    color: '#FF6B35',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  ←
                </motion.button>
              )}
            </AnimatePresence>

            {/* Right navigation control */}
            <AnimatePresence>
              {storiesHovered && canScrollRight && (
                <motion.button
                  key="next-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollStories('right')}
                  title="Next Stories"
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    color: '#FF6B35',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  →
                </motion.button>
              )}
            </AnimatePresence>

            <div
              ref={storiesRef}
              onScroll={checkScroll}
              className="no-scrollbar"
              style={{
                display: 'flex', gap: 20, overflowX: 'auto',
                scrollbarWidth: 'none', paddingBottom: 2,
                width: '100%',
              }}
            >
              {orderedStories.map((story) => {
                const isViewed = story.add ? false : viewedStories.includes(story.id);
                const isHovered = hoveredStory === story.id;
                
                return (
                  <motion.button
                    key={story.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStoryClick(story.id)}
                    onMouseEnter={() => setHoveredStory(story.id)}
                    onMouseLeave={() => setHoveredStory(null)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 6, background: 'none', border: 'none', cursor: 'pointer',
                      padding: 0, flexShrink: 0,
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
                      transition: 'transform 250ms ease',
                    }}
                  >
                    {/* Story bubble container */}
                    {story.add ? (
                      <div style={{
                        width: 76,
                        height: 76,
                        borderRadius: '50%',
                        background: '#FFF4EE',
                        border: '2px dashed #FF6B35',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        boxShadow: isHovered ? '0 0 10px rgba(255,107,53,0.2)' : 'none',
                        transition: 'all 250ms ease',
                      }}>
                        <span style={{ fontSize: 22, color: '#FF6B35', fontWeight: 300 }}>+</span>
                      </div>
                    ) : (
                      <div style={{
                        width: 76,
                        height: 76,
                        borderRadius: '50%',
                        background: isViewed
                          ? '#E5E7EB'
                          : 'linear-gradient(135deg, #FF6B35, #FF9A35, #FFCD3C)',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        boxShadow: isHovered ? '0 0 12px rgba(255,107,53,0.3)' : 'none',
                        filter: isHovered ? 'brightness(1.08)' : 'brightness(1)',
                        transition: 'all 250ms ease',
                      }}>
                        <img
                          src={story.img!}
                          alt={story.name}
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            border: '2px solid #fff',
                            objectFit: 'cover',
                            display: 'block',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    )}

                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: isHovered ? '#FF6B35' : '#374151',
                      whiteSpace: 'nowrap',
                      transition: 'color 250ms ease',
                    }}>
                      {story.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* ── Post Feed ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: idx * 0.06 }}
                whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)' }}
                style={{
                  background: '#fff',
                  borderRadius: 24,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'box-shadow 250ms ease',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '18px 20px 14px', gap: 14 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%', overflow: 'hidden',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #FF6B35, #FFB35A)',
                    padding: 2,
                  }}>
                    <img src={post.avatar} alt={post.user}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{post.user}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth={2.5}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx={12} cy={10} r={3} />
                      </svg>
                      <span style={{ color: '#FF6B35', fontWeight: 600 }}>{post.location}</span>
                      <span>·</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFollow(post.id)}
                      style={{
                        padding: '7px 20px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                        border: post.followed ? '1.5px solid #FF6B35' : '1.5px solid #E2E8F0',
                        background: post.followed ? 'linear-gradient(135deg, #FF6B35, #FF9A35)' : '#fff',
                        color: post.followed ? '#fff' : '#374151',
                        cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: post.followed ? '0 2px 10px rgba(255,107,53,0.3)' : 'none',
                        transition: 'all 0.18s',
                      }}
                    >
                      {post.followed ? '✓ Following' : 'Follow'}
                    </motion.button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 20, lineHeight: 1, padding: '4px 2px', letterSpacing: 1 }}>
                      ···
                    </button>
                  </div>
                </div>

                {/* Caption */}
                <div style={{ padding: '0 20px 14px' }}>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 10px' }}>
                    {post.caption}
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 13, color: '#FF6B35', fontWeight: 700,
                        background: '#FFF4EE', padding: '3px 10px', borderRadius: 20, cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#FFDECF')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#FFF4EE')}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#F0EDE9' }}>
                  <img
                    src={post.image} alt={post.location}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'filter 250ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.02)')}
                    onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 4, borderTop: '1px solid #F8F6F3' }}>
                  <ActionBtn
                    active={post.liked} activeColor="#FF6B35"
                    onClick={() => toggleLike(post.id)}
                  >
                    <motion.span whileTap={{ scale: 1.4 }} style={{ display: 'block', fontSize: 18 }}>
                      {post.liked ? '❤️' : '🤍'}
                    </motion.span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{post.likes}</span>
                  </ActionBtn>

                  <ActionBtn>
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{post.comments}</span>
                  </ActionBtn>

                  <ActionBtn>
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16,6 12,2 8,6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{post.shares}</span>
                  </ActionBtn>

                  <div style={{ flex: 1 }} />

                  {/* Save */}
                  <motion.button
                    whileTap={{ scale: 1.25 }} whileHover={{ scale: 1.1 }}
                    onClick={() => toggleSave(post.id)}
                    style={{
                      background: post.saved ? '#FFF4EE' : 'none', border: 'none', cursor: 'pointer',
                      color: post.saved ? '#FF6B35' : '#9CA3AF',
                      padding: '8px 10px', borderRadius: 12,
                      transition: 'color 0.15s, background 0.15s',
                    }}
                  >
                    <svg width={20} height={20} viewBox="0 0 24 24"
                      fill={post.saved ? '#FF6B35' : 'none'} stroke="currentColor" strokeWidth={2}>
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </motion.button>
                </div>
              </motion.article>
            ))}

            {/* Load more */}
            <div style={{ textAlign: 'center', padding: '10px 0 40px' }}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(255,107,53,0.18)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '12px 36px', borderRadius: 24,
                  border: '1.5px solid #FFB79A', background: '#fff',
                  fontSize: 14, fontWeight: 700, color: '#FF6B35',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.18s',
                }}
              >
                Load more posts
              </motion.button>
            </div>
          </div>
        </main>
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
      <aside style={{
        width: RIGHT_W,
        position: 'fixed', top: 60, right: 0, bottom: 0,
        overflowY: 'auto', padding: '20px 18px',
        display: 'flex', flexDirection: 'column', gap: 14,
        scrollbarWidth: 'none',
        background: '#F8F6F3',
      }}>

        {/* 1. Trending */}
        <RightCard title="Trending" extra={
          <div style={{ display: 'flex', gap: 4 }}>
            {(['Today', 'Week'] as const).map(t => (
              <button key={t} onClick={() => setTrendTab(t)} style={{
                padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                background: trendTab === t ? '#FF6B35' : '#F3F4F6',
                color: trendTab === t ? '#fff' : '#6B7280',
                transition: 'all 0.15s',
              }}>{t}</button>
            ))}
          </div>
        }>
          <div style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: '4px',
            paddingTop: '4px',
          }}>
            {TRENDING.map((item, i) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.03, y: -2 }}
                style={{
                  width: 120,
                  height: 150,
                  borderRadius: 14,
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
              >
                <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                }} />
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: '#FF6B35',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 900,
                  color: '#fff',
                }}>
                  {i+1}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  right: 8,
                  color: '#fff',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{item.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{item.count}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </RightCard>

        {/* 2. Suggested Travelers */}
        <AnimatePresence initial={false}>
          {!fabOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <RightCard title="Suggested Travelers">
                <div style={{
                  display: 'flex',
                  gap: 12,
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  paddingBottom: '4px',
                  paddingTop: '4px',
                }}>
                  {suggested.map((s, i) => (
                    <div
                      key={s.name}
                      style={{
                        width: 110,
                        height: 146,
                        borderRadius: 14,
                        border: '1.5px solid #F0EDE9',
                        background: '#fff',
                        padding: '12px 8px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', overflow: 'hidden',
                        border: '2px solid #FFD5C2',
                        flexShrink: 0,
                      }}>
                        <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ width: '100%', textAlign: 'center', marginTop: 4 }}>
                        <div style={{
                          fontSize: 11, fontWeight: 700, color: '#0F172A',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {s.name}
                        </div>
                        <div style={{
                          fontSize: 9, color: '#9CA3AF',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          marginTop: 1,
                        }}>
                          {s.bio}
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }}
                        onClick={() => toggleSugFollow(i)}
                        style={{
                          width: '100%',
                          padding: '4px 0',
                          borderRadius: 12,
                          fontSize: 10,
                          fontWeight: 700,
                          border: s.followed ? 'none' : '1.5px solid #FF6B35',
                          background: s.followed ? 'linear-gradient(135deg, #FF6B35, #FF9A35)' : 'transparent',
                          color: s.followed ? '#fff' : '#FF6B35',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          boxShadow: s.followed ? '0 2px 6px rgba(255,107,53,0.25)' : 'none',
                          transition: 'all 0.18s',
                          marginTop: 6,
                        }}
                      >
                        {s.followed ? '✓' : 'Follow'}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </RightCard>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* ══ FAB ══════════════════════════════════════════════════════════════ */}
      <div
        id="nt-fab"
        onMouseEnter={() => setFabOpen(true)}
        onMouseLeave={() => setFabOpen(false)}
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 300 }}
      >
        <AnimatePresence>
          {fabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15, transition: { duration: 0.2, ease: 'easeIn' } }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                position: 'absolute', bottom: 68, right: 0,
                display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
              }}
            >
              {[
                { label: 'Create Post',  icon: '✍️', action: () => {} },
                { label: 'Create Story', icon: '📖', action: () => {} },
                { label: 'Create Reel',  icon: '🎥', action: () => {} },
                { label: 'AI Planner',   icon: '✨', action: () => {} },
              ].map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.04, x: -2 }}
                  onClick={() => { setFabOpen(false); item.action(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    width: 180,
                    height: 44,
                    padding: '0 20px', borderRadius: 22,
                    background: '#fff', border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontSize: 14, fontWeight: 700, color: '#0F172A',
                    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FFF4EE')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.12, boxShadow: '0 10px 32px rgba(255,107,53,0.50)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setFabOpen(o => !o)}
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: fabOpen ? '#0F172A' : 'linear-gradient(135deg, #FF6B35, #FF9A35)',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(255,107,53,0.40)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', transition: 'background 0.22s',
          }}
        >
          <motion.span
            animate={{ rotate: fabOpen ? 45 : 0 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'block', fontSize: 28, fontWeight: 300, lineHeight: 1 }}
          >
            +
          </motion.span>
        </motion.button>
      </div>

      {/* ══ STORY VIEWER MODAL ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeStory !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveStory(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 500,
              background: 'rgba(0,0,0,0.88)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.82, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ width: 360, height: 640, borderRadius: 28, overflow: 'hidden', position: 'relative' }}
            >
              {!STORIES[activeStory]?.add && STORIES[activeStory]?.img && (
                <>
                  {/* Progress bar */}
                  <div style={{ position: 'absolute', top: 12, left: 12, right: 12, height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.3)', zIndex: 10, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5 }}
                      style={{ height: '100%', background: '#fff', borderRadius: 3 }}
                    />
                  </div>
                  <img src={STORIES[activeStory].img!} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 24px 28px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', color: '#fff' }}>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{STORIES[activeStory].name}</div>
                    <div style={{ fontSize: 13, opacity: 0.75, marginTop: 3 }}>Tamil Nadu, India</div>
                  </div>
                  <button onClick={() => setActiveStory(null)} style={{
                    position: 'absolute', top: 28, right: 14, width: 32, height: 32,
                    background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%',
                    color: '#fff', cursor: 'pointer', fontSize: 18, zIndex: 11,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>×</button>
                </>
              )}
              {STORIES[activeStory]?.add && (
                <div style={{ background: '#fff', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{ fontSize: 52 }}>📸</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>Create Your Story</div>
                  <div style={{ fontSize: 14, color: '#6B7280' }}>Share your Tamil Nadu adventure</div>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveStory(null)}
                    style={{ padding: '12px 30px', background: 'linear-gradient(135deg,#FF6B35,#FF9A35)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(255,107,53,0.35)' }}>
                    Add Photo
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Small shared components ─────────────────────────────────────────────── */
function HeaderBtn({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, background: '#FFF4EE' } as any}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', color: '#374151',
        padding: '8px', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
      }}
    >
      {children}
    </motion.button>
  );
}

function ActionBtn({ children, active = false, activeColor = '#FF6B35', onClick }: {
  children: React.ReactNode; active?: boolean; activeColor?: string; onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        background: 'none', border: 'none', cursor: 'pointer',
        color: active ? activeColor : '#6B7280',
        padding: '8px 12px', borderRadius: 14,
        fontFamily: 'inherit',
        transition: 'color 0.15s, background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = active ? '#FFF4EE' : '#F3F4F6')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      {children}
    </motion.button>
  );
}

function RightCard({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '16px 14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{title}</span>
        {extra}
      </div>
      {children}
    </div>
  );
}
