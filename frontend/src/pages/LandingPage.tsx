import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Palmtree,
  Mountain,
  Luggage,
  Utensils,
  Star,
  Bookmark,
  MapPin,
  ChevronRight,
  Globe,
  Share2,
  ArrowRight,
  Navigation,
  Users,
  TrendingUp,
} from 'lucide-react';

/* ─── Shared container (max-width 1280px, centred, 32px side padding) ──── */
const CONTAINER: React.CSSProperties = {
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: '32px',
  paddingRight: '32px',
};

/* ─── Reusable fade-up animation variant ───────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Experience category data ─────────────────────────────────────────── */
const experiences = [
  { name: 'Temple Trails', desc: 'Spiritual journeys', img: '/meenakshi.jpg', fg: '#FF6B35' },
  { name: 'Beach Escapes', desc: 'Coastal relaxation', img: '/beach.png', fg: '#0D9488' },
  { name: 'Hill Stations', desc: 'Mountain retreats', img: '/ooty.jpg', fg: '#4F46E5' },
  { name: 'Weekends', desc: 'Quick refreshing trips', img: '/weekends.png', fg: '#D97706' },
  { name: 'Food & Culture', desc: 'Local authentic bites', img: '/food.png', fg: '#E11D48' },
];

/* ─── Trust stats data ────────────────────────────────────────────── */
const stats = [
  { Icon: Star, value: '4.8★', label: 'Average Rating' },
  { Icon: MapPin, value: '50+', label: 'Destinations' },
  { Icon: Navigation, value: 'AI', label: 'Powered Trip Planning' },
  { Icon: Users, value: '1,000+', label: 'Happy Travelers' },
];

/* ─── Popular destinations data ─────────────────────────────────────────── */
const destinations = [
  { name: 'Ooty', sub: 'Queen of Hill Stations', img: '/ooty.jpg', rating: '4.9', tag: 'Hill Station' },
  { name: 'Kodaikanal', sub: 'Princess of Hills', img: '/kodaikanal.jpg', rating: '4.8', tag: 'Hill Station' },
  { name: 'Madurai', sub: 'Temple City of Tamil Nadu', img: '/meenakshi.jpg', rating: '4.9', tag: 'Heritage City' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dash = isAuthenticated ? '/feed' : '/login';

  return (
    <div className="min-h-screen bg-[#F8F4F1] text-[#111827] font-sans selection:bg-[#FF6B35] selection:text-white">

      {/* ══════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full bg-[#F8F4F1]/90 backdrop-blur-xl border-b border-[#EAE3DE]/60">
        <div
          className="flex items-center justify-between h-[76px]"
          style={{ paddingLeft: '64px', paddingRight: '64px' }}
        >

          {/* Logo + wordmark */}
          <Link to="/" className="flex items-center group" style={{ gap: '12px' }}>
            <img
              src="/logo.jpg"
              alt="Namma Trip"
              style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }}
              className="shadow-md group-hover:shadow-lg transition-shadow"
            />
            <span
              className="text-[#FF6B35] tracking-tight"
              style={{ fontSize: '30px', fontWeight: 700, lineHeight: 1 }}
            >
              Namma Trip
            </span>
          </Link>

          {/* Nav links — centered */}
          <nav className="hidden md:flex items-center text-sm font-semibold text-[#4B5563]" style={{ gap: '40px' }}>
            <Link to="/" className="text-[#111827] relative py-1">
              Home
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF6B35] rounded-full" />
            </Link>
            {['Destinations', 'Trips', 'Explore', 'About'].map((l) => (
              <Link
                key={l}
                to="/login"
                className="hover:text-[#111827] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#FF6B35] after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {l}
              </Link>
            ))}
          </nav>

          {/* Auth actions */}
          <div className="flex items-center" style={{ gap: '24px' }}>
            {isAuthenticated ? (
              <Link
                to="/feed"
                className="bg-[#FF6B35] hover:bg-[#E05320] text-white font-bold rounded-full shadow-lg shadow-[#FF6B35]/25 transition-all hover:scale-[1.04] active:scale-[0.97]"
                style={{ height: '44px', display: 'inline-flex', alignItems: 'center', paddingLeft: '24px', paddingRight: '24px', fontSize: '14px' }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[#4B5563] hover:text-[#111827] font-semibold transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#FF6B35] hover:bg-[#E05320] text-white font-bold rounded-full shadow-lg shadow-[#FF6B35]/25 transition-all hover:scale-[1.04] active:scale-[0.97]"
                  style={{ height: '44px', display: 'inline-flex', alignItems: 'center', paddingLeft: '24px', paddingRight: '24px', fontSize: '14px' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section style={{ overflow: 'visible' }}>
        <div style={CONTAINER}>
          <motion.div
            initial="hidden"
            animate="visible"
            style={{ paddingTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            {/* Eyebrow pill */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold px-4 py-2 rounded-full mb-6 border border-[#FF6B35]/20"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Tamil Nadu's #1 Travel Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={0.05}
              className="font-black tracking-tight text-[#111827] leading-[1.04] text-[42px] sm:text-[58px] lg:text-[72px]"
              style={{ maxWidth: '900px' }}
            >
              Discover Tamil Nadu <br />
              <span className="text-[#FF6B35]">Like Never Before</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              custom={0.1}
              className="text-[#4B5563] text-base sm:text-lg lg:text-xl font-medium leading-relaxed"
              style={{ marginTop: '28px', maxWidth: '680px' }}
            >
              Plan unforgettable journeys, discover hidden gems, create itineraries, and explore Tamil Nadu with one smart travel companion.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              custom={0.15}
              style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}
            >
              <button
                onClick={() => navigate(dash)}
                className="bg-[#FF6B35] hover:bg-[#E05320] text-white font-bold rounded-full shadow-lg shadow-[#FF6B35]/30 transition-all cursor-pointer hover:scale-[1.04] active:scale-[0.97]"
                style={{ height: '52px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '28px', paddingRight: '28px', fontSize: '15px', lineHeight: 1 }}
              >
                Start Exploring
              </button>
              <button
                onClick={() => navigate(dash)}
                className="bg-white hover:bg-slate-50 text-[#111827] border border-[#EAE3DE] font-bold rounded-full shadow-sm hover:shadow transition-all cursor-pointer hover:scale-[1.04] active:scale-[0.97]"
                style={{ height: '52px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '28px', paddingRight: '28px', fontSize: '15px', lineHeight: 1 }}
              >
                View Destinations
              </button>
            </motion.div>

            {/* ── DESTINATION SHOWCASE ───────────────────────────────── */}
            <div style={{ marginTop: '56px', width: '100%', display: 'flex', justifyContent: 'center', overflow: 'visible', paddingBottom: '56px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

                {/* LEFT CARD */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    flexShrink: 0, width: '300px', height: '420px',
                    marginRight: '-60px',
                    transform: 'rotate(-8deg) translateY(40px)',
                    zIndex: 5,
                    backgroundColor: '#fff', border: '1px solid #EAE3DE',
                    borderRadius: '24px', padding: '12px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.09)',
                    overflow: 'hidden', cursor: 'pointer',
                  }}
                  whileHover={{ y: 32, scale: 1.04, transition: { duration: 0.25 } }}
                >
                  <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                    <img src="/ooty.jpg" alt="Ooty Hills" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                      <h3 className="font-bold text-base leading-tight">Ooty Hills</h3>
                      <p className="text-white/70 text-[11px] font-medium mt-0.5">Queen of Hill Stations</p>
                    </div>
                  </div>
                </motion.div>

                {/* CENTER CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, type: 'spring', stiffness: 70 }}
                  style={{
                    flexShrink: 0, width: '420px', height: '560px',
                    zIndex: 10,
                    backgroundColor: '#fff', border: '1px solid #EAE3DE',
                    borderRadius: '32px', padding: '16px',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.15)',
                    overflow: 'hidden', cursor: 'pointer',
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                >
                  <div style={{ width: '100%', height: '100%', borderRadius: '22px', overflow: 'hidden', position: 'relative' }}>
                    <img src="/meenakshi.jpg" alt="Meenakshi Temple" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      4.9
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white text-left">
                      <h3 className="font-bold text-2xl tracking-tight leading-tight">Meenakshi Temple</h3>
                      <p className="text-white/75 text-xs font-medium mt-1">Experience the architectural marvel of Madurai</p>
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(dash); }}
                          className="flex-1 bg-[#FF6B35] hover:bg-[#E05320] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-[#FF6B35]/25 transition-all cursor-pointer text-center hover:scale-[1.03]"
                        >
                          Explore Now
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT CARD */}
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    flexShrink: 0, width: '300px', height: '420px',
                    marginLeft: '-60px',
                    transform: 'rotate(8deg) translateY(40px)',
                    zIndex: 5,
                    backgroundColor: '#fff', border: '1px solid #EAE3DE',
                    borderRadius: '24px', padding: '12px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.09)',
                    overflow: 'hidden', cursor: 'pointer',
                  }}
                  whileHover={{ y: 32, scale: 1.04, transition: { duration: 0.25 } }}
                >
                  <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                    <img src="/kodaikanal.jpg" alt="Kodaikanal" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                      <h3 className="font-bold text-base leading-tight">Kodaikanal</h3>
                      <p className="text-white/70 text-[11px] font-medium mt-0.5">Princess of Hill Stations</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge — Madurai */}
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  style={{
                    position: 'absolute', left: '-16px', top: '72px', zIndex: 20,
                    background: '#fff', border: '1px solid #EAE3DE', borderRadius: '16px',
                    padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center text-[#FF6B35]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-left leading-none">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#9CA3AF] block">Destination</span>
                    <span className="text-sm font-bold text-[#111827] block mt-0.5">Madurai</span>
                  </div>
                </motion.div>

                {/* Floating badge — Verified */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  style={{
                    position: 'absolute', right: '-16px', bottom: '72px', zIndex: 20,
                    background: '#fff', border: '1px solid #EAE3DE', borderRadius: '999px',
                    padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
                    minHeight: '44px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }} className="-space-x-2">
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#94A3B8', border: '2px solid #fff', flexShrink: 0 }} />
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#64748B', border: '2px solid #fff', flexShrink: 0, marginLeft: '-8px' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>Verified</span>
                </motion.div>

              </div>
            </div>
            {/* ── end showcase ──────────────────────────────── */}

            {/* ── TRUST STATS ROW ───────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={{
                marginTop: '0px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '14px',
              }}
            >
              {stats.map(({ Icon, value, label }, i) => (
                <div
                  key={i}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '12px',
                    background: '#fff', border: '1px solid #EAE3DE',
                    borderRadius: '999px', padding: '0 22px',
                    height: '52px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    flexShrink: 0,
                  }}
                >
                  <Icon className="text-[#FF6B35]" style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280', lineHeight: 1 }}>{label}</span>
                </div>
              ))}
            </motion.div>
            {/* ── end trust stats ────────────────────────────── */}

          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CURATED EXPERIENCES  (120px gap from showcase)
      ══════════════════════════════════════════════════════════ */}
      <section style={{ ...CONTAINER, marginTop: '120px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <span
              className="text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase block"
              style={{ marginBottom: '8px' }}
            >
              Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
              Curated Experiences Tailored for You
            </h2>
          </div>
          <Link
            to={isAuthenticated ? '/feed/explore' : '/login'}
            className="text-sm font-bold text-[#FF6B35] hover:text-[#E05320] transition-colors flex items-center gap-1.5 group"
            style={{ flexShrink: 0, marginLeft: '32px', paddingBottom: '4px' }}
          >
            View all experiences
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 5-column image-based cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          {experiences.map(({ name, desc, img, fg }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -7, boxShadow: '0 20px 48px rgba(0,0,0,0.11)', transition: { duration: 0.2 } }}
              onClick={() => navigate(isAuthenticated ? '/feed/explore' : '/login')}
              style={{
                background: '#fff',
                border: '1px solid rgba(234,227,222,0.8)',
                borderRadius: '18px',
                height: '230px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* Image — 57% of card height */}
              <div style={{ height: '131px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                <img
                  src={img}
                  alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="hover:scale-105"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.28))' }} />
              </div>

              {/* Text — remaining 43% */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: '13px', color: fg, lineHeight: 1.2, marginBottom: '4px' }}>{name}</h3>
                <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, lineHeight: 1.3 }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          POPULAR DESTINATIONS  (120px gap from categories)
      ══════════════════════════════════════════════════════════ */}
      <section style={{ ...CONTAINER, marginTop: '120px' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <span
            className="text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase block"
            style={{ marginBottom: '8px' }}
          >
            Popular Destinations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            Popular Destinations Across Tamil Nadu
          </h2>
          <p className="text-[#6B7280] text-base font-medium leading-relaxed" style={{ marginTop: '12px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
            Explore the most loved travel destinations chosen by thousands of travelers.
          </p>
        </motion.div>

        {/* 3-column destination cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '28px',
          }}
        >
          {destinations.map(({ name, sub, img, rating, tag }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              onClick={() => navigate(dash)}
              style={{
                background: '#fff',
                border: '1px solid #EAE3DE',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              {/* Image area */}
              <div style={{ position: 'relative', height: '270px', overflow: 'hidden' }}>
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                {/* All top badges in a row — 24px from edges */}
                <div style={{
                  position: 'absolute', top: '16px', left: '16px', right: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                }}>
                  {/* Rating */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                    color: '#fff', padding: '6px 12px', borderRadius: '999px',
                    fontSize: '12px', fontWeight: 700, lineHeight: 1, flexShrink: 0,
                  }}>
                    <Star style={{ width: '13px', height: '13px', fill: '#FBBF24', color: '#FBBF24', flexShrink: 0 }} />
                    {rating}
                  </div>

                  {/* Tag + Save — right side */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center',
                      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                      color: '#111827', padding: '5px 10px', borderRadius: '999px',
                      fontSize: '11px', fontWeight: 700, lineHeight: 1,
                    }}>
                      {tag}
                    </div>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        color: '#4B5563', border: 'none', cursor: 'pointer', flexShrink: 0,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                      }}
                      className="hover:text-[#FF6B35] transition-colors"
                    >
                      <Bookmark style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card content */}
              <div style={{ padding: '20px 24px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#111827', lineHeight: 1.2, marginBottom: '6px' }}>{name}</h3>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 500, color: '#6B7280', lineHeight: 1 }}>
                      <MapPin style={{ width: '13px', height: '13px', color: '#FF6B35', flexShrink: 0 }} />
                      {sub}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(dash); }}
                    style={{
                      flexShrink: 0, marginLeft: '12px',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      height: '36px', padding: '0 16px',
                      background: 'rgba(255,107,53,0.10)', borderRadius: '999px',
                      fontSize: '13px', fontWeight: 700, color: '#FF6B35',
                      border: 'none', cursor: 'pointer', lineHeight: 1,
                      transition: 'all 0.2s',
                    }}
                    className="hover:bg-[#FF6B35] hover:text-white"
                  >
                    Explore
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See all destinations link */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link
            to={isAuthenticated ? '/feed' : '/login'}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B35] hover:text-[#E05320] transition-colors group"
          >
            See all destinations across Tamil Nadu
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA  (120px gap from popular destinations)
      ══════════════════════════════════════════════════════════ */}
      <section style={{ ...CONTAINER, marginTop: '120px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{
            background: 'linear-gradient(135deg, #2D221E 0%, #1F1714 100%)',
            borderRadius: '32px',
            minHeight: '440px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.20)',
            padding: '72px 40px',
          }}
        >
          {/* Dot grid */}
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              pointerEvents: 'none',
            }}
          />

          {/* Orange glow behind heading */}
          <div
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px', height: '300px',
              background: 'radial-gradient(ellipse, rgba(255,107,53,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Floating location pins */}
          {[
            { t: '20%', l: '12%', s: '28px' },
            { t: '55%', l: '8%', s: '20px' },
            { t: '25%', r: '10%', s: '24px' },
            { t: '60%', r: '14%', s: '18px' },
          ].map((pin, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: pin.t, left: pin.l, right: pin.r,
                width: pin.s, height: pin.s,
                background: 'rgba(255,107,53,0.25)',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Low-opacity route lines (SVG) */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none', zIndex: 1 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M80 200 Q300 80 600 180 Q800 260 1100 120" stroke="#FF6B35" strokeWidth="1.5" fill="none" strokeDasharray="6 6" />
            <path d="M120 350 Q350 240 650 300 Q900 360 1150 250" stroke="#FF6B35" strokeWidth="1" fill="none" strokeDasharray="4 8" />
          </svg>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Your Next Adventure <br />Awaits
            </h2>
            <p
              className="text-sm sm:text-base font-medium leading-relaxed text-white/75"
              style={{ marginTop: '24px', maxWidth: '420px' }}
            >
              Join thousands of travelers who are discovering the hidden magic of Tamil Nadu every single day.
            </p>
            <div style={{ marginTop: '36px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate(dash)}
                className="bg-[#FF6B35] hover:bg-[#E05320] text-white font-bold rounded-full shadow-lg shadow-[#FF6B35]/25 transition-all cursor-pointer hover:scale-[1.04] active:scale-[0.97]"
                style={{ height: '52px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '28px', paddingRight: '28px', fontSize: '15px', lineHeight: 1 }}
              >
                Download Mobile App
              </button>
              <button
                onClick={() => navigate(dash)}
                className="bg-transparent hover:bg-white/10 text-white border border-white/25 font-bold rounded-full transition-all cursor-pointer hover:scale-[1.04] active:scale-[0.97]"
                style={{ height: '52px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '28px', paddingRight: '28px', fontSize: '15px', lineHeight: 1 }}
              >
                Get Early Access
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER  (120px gap from CTA)
      ══════════════════════════════════════════════════════════ */}
      <footer style={{ marginTop: '120px', background: '#fff', borderTop: '1px solid #EAE3DE' }}>
        <div style={{ ...CONTAINER, paddingTop: '64px', paddingBottom: '48px' }}>

          {/* 4-column grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
              gap: '48px',
              paddingBottom: '56px',
            }}
          >
            {/* Col 1 — Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2.5 mb-3">
                <img src="/logo.jpg" alt="Namma Trip" className="w-8 h-8 rounded-xl object-cover shadow-sm" />
                <span className="text-xl font-black tracking-tight text-[#FF6B35]">Namma Trip</span>
              </Link>
              <p className="text-xs font-semibold text-[#9CA3AF] mb-4">Tamil Nadu Travel Companion</p>
              <p
                className="text-sm text-[#6B7280] font-medium leading-relaxed"
                style={{ maxWidth: '260px', marginBottom: '24px' }}
              >
                Discover the soul of Tamil Nadu. We curate authentic travel experiences for the modern traveler.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[Globe, Share2].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full border border-[#EAE3DE] flex items-center justify-center text-[#6B7280] hover:text-[#FF6B35] hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 — Explore */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]" style={{ marginBottom: '16px' }}>Explore</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Home', 'Destinations', 'Trips', 'Explore'].map((l) => (
                  <Link key={l} to={l === 'Home' ? '/' : '/login'} className="text-sm font-semibold text-[#4B5563] hover:text-[#FF6B35] transition-colors">
                    {l}
                  </Link>
                ))}
              </div>
            </div>

            {/* Col 3 — Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]" style={{ marginBottom: '16px' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['About', 'Contact', 'Privacy Policy', 'Terms of Service'].map((l) => (
                  <Link key={l} to="/login" className="text-sm font-semibold text-[#4B5563] hover:text-[#FF6B35] transition-colors">
                    {l}
                  </Link>
                ))}
              </div>
            </div>

            {/* Col 4 — Newsletter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]" style={{ marginBottom: '16px' }}>Stay Updated</h4>
              <p className="text-xs text-[#6B7280] font-medium leading-relaxed" style={{ marginBottom: '16px' }}>
                Get the latest travel guides and offers.
              </p>
              <form onSubmit={(e) => e.preventDefault()} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-[#F8F4F1] border border-[#EAE3DE] focus:border-[#FF6B35] rounded-xl py-3 pl-4 pr-12 text-sm outline-none transition-all text-[#111827] font-medium placeholder:text-[#9CA3AF]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 w-9 h-9 bg-[#FF6B35] hover:bg-[#E05320] text-white rounded-lg flex items-center justify-center transition-all cursor-pointer hover:scale-[1.05]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: '1px solid #EAE3DE', paddingTop: '28px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '8px',
            }}
          >
            <p className="text-xs text-[#9CA3AF] font-bold">© 2024 Namma Trip. Explore the Soul of Tamil Nadu.</p>
            <p className="text-xs text-[#9CA3AF] font-semibold">Built for travelers exploring Tamil Nadu.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
