import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

/* ── Google / Facebook SVGs ─────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* ── Input ───────────────────────────────────────────────────────────────── */
const Input = ({ id, type, value, onChange, placeholder, required, rightEl }: any) => (
  <div style={{ position: 'relative' }}>
    <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
      style={{
        width: '100%', height: '48px', borderRadius: '12px',
        border: '1.5px solid #E5E7EB', background: '#F9FAFB',
        padding: '0 44px 0 16px', fontSize: '14px', color: '#111827',
        outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        transition: 'border-color 0.2s, background 0.2s',
      }}
      onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; e.target.style.background = '#fff'; }}
      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F9FAFB'; }}
    />
    {rightEl && (
      <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
        {rightEl}
      </div>
    )}
  </div>
);

/* ── Social row ──────────────────────────────────────────────────────────── */
const SocialRow = () => (
  <div style={{ display: 'flex', gap: '12px' }}>
    {[{ icon: <GoogleIcon />, label: 'Google' }, { icon: <FacebookIcon />, label: 'Facebook' }].map(({ icon, label }) => (
      <button key={label} type="button" style={{
        flex: 1, height: '46px', borderRadius: '12px', border: '1.5px solid #E5E7EB',
        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s', fontFamily: 'inherit',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.background = '#FFF8F5'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}
      >
        {icon} {label}
      </button>
    ))}
  </div>
);

/* ── Divider ─────────────────────────────────────────────────────────────── */
const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
    <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>OR CONTINUE WITH</span>
    <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════
   LEFT PANEL — Instagram-Style Stories Showcase
══════════════════════════════════════════════════════════════════════════ */

/* ── Feature Panel ───────────────────────────────────────────────────────── */
const FeatureRow = ({ emoji, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    style={{
      display: 'flex', alignItems: 'flex-start', gap: '14px',
      padding: '12px 0',
      cursor: 'default',
    }}
  >
    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
      {emoji}
    </div>
    <div>
      <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '3px' }}>{title}</div>
      <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.4 }}>{desc}</div>
    </div>
  </motion.div>
);

/* ── Stories Data ────────────────────────────────────────────────────────── */
const STORIES = [
  {
    id: 'ai',
    bg: '/kodaikanal.jpg',
    badge: '✨ AI TRIP PLANNER',
    title: 'Smart Itineraries',
    desc: 'Get personalized travel plans in seconds based on your preferences.',
    cta: 'Try AI Planner'
  },
  {
    id: 'companion',
    bg: '/beach.png',
    badge: '💕 TRAVEL MATCH',
    title: 'Find Companions',
    desc: 'Connect with like-minded travelers heading to the same destination.',
    cta: 'Find a Match'
  },
  {
    id: 'community',
    bg: '/weekends.png',
    badge: '🌟 COMMUNITY',
    title: 'Travel Stories',
    desc: 'Join exclusive group trips and discover hidden gems together.',
    cta: 'Join Community'
  },
  {
    id: 'destinations',
    bg: '/meenakshi.jpg',
    badge: '📍 DESTINATIONS',
    title: 'Hidden Gems',
    desc: 'Experience the architectural marvels and spiritual heart of Tamil Nadu.',
    cta: 'Explore Now'
  },
  {
    id: 'food',
    bg: '/food.png',
    badge: '🍽️ FOOD DISCOVERY',
    title: 'Local Experiences',
    desc: 'Savor authentic South Indian cuisine and discover local eateries.',
    cta: 'Discover Food'
  }
];

const StoryCard = ({ story }: { story: typeof STORIES[0] }) => (
  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
    <img src={story.bg} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    
    {/* Gradients for readability */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)' }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }} />
    
    {/* Story progress bar (visual only) */}
    <div style={{ position: 'absolute', top: '12px', left: '16px', right: '16px', display: 'flex', gap: '6px' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ height: '3px', flex: 1, borderRadius: '999px', background: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)' }} />
      ))}
    </div>

    {/* Badge */}
    <div style={{ position: 'absolute', top: '28px', left: '20px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 12px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{story.badge}</span>
    </div>

    {/* Content */}
    <div style={{ position: 'absolute', bottom: '32px', left: '24px', right: '24px' }}>
      <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.1 }}>{story.title}</h3>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: '0 0 20px', lineHeight: 1.4, fontWeight: 500 }}>{story.desc}</p>
      
      <div style={{ width: '100%', height: '48px', background: '#FF6B35', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: '#fff' }}>
        {story.cta}
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════════
   LOGIN PAGE
════════════════════════════════════════════════════════════════════════════ */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [activeCard, setActiveCard] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const t = setInterval(() => setActiveCard(p => (p + 1) % STORIES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(email, password); navigate('/feed'); }
    catch (err: any) { setError(err.response?.data?.message || 'Invalid email or password'); }
    finally { setLoading(false); }
  };

  /* Get position styles based on offset from active card */
  const getCardStyle = (offset: number) => {
    switch (offset) {
      case 0: // Front
        return { x: 0, scale: 1, zIndex: 50, opacity: 1 };
      case 1: // Second (behind)
        return { x: 40, scale: 0.92, zIndex: 40, opacity: 1 };
      case 2: // Third (further behind)
        return { x: 80, scale: 0.84, zIndex: 30, opacity: 1 };
      case 3: // Hidden back
        return { x: 80, scale: 0.84, zIndex: 20, opacity: 0 };
      case 4: // Moving from front to back (swings to the right)
        return hasMounted ? {
          x: [0, 320, 80],
          scale: [1, 0.9, 0.84],
          zIndex: [50, 20, 20],
          opacity: [1, 1, 0] // Fades out as it goes behind
        } : { x: 80, scale: 0.84, zIndex: 20, opacity: 0 };
      default:
        return { x: 80, scale: 0.84, zIndex: 10, opacity: 0 };
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ══ LEFT PANEL — Animated Product Showcase ══════════════════════════ */}
      <div style={{
        width: '60%', flexShrink: 0,
        background: 'linear-gradient(145deg, #FFE4D6 0%, #FFD0B8 60%, #FECDB8 100%)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 32px', overflow: 'hidden', position: 'relative',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0, zIndex: 10, position: 'relative' }}>
          <img src="/logo.jpg" alt="Namma Trip" style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#FF6B35' }}>Namma Trip</span>
        </Link>

        {/* Showcase area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '60px', position: 'relative', marginTop: '12px' }}>

          {/* Left Text & Feature Column */}
          <div style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 12px', lineHeight: 1.2 }}>
              <span style={{ color: '#FF6B35' }}>Welcome Back</span> Explorer
            </h2>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: '0 0 36px', fontWeight: 500, lineHeight: 1.5 }}>
              Continue planning your next unforgettable Tamil Nadu journey.
            </p>

            <div style={{ fontSize: '12px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Why Travelers Love Namma Trip
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <FeatureRow emoji="⭐" title="4.8 Average Rating" desc="Trusted by thousands of travelers" delay={0.2} />
              <FeatureRow emoji="📍" title="50+ Verified Destinations" desc="Explore authentic Tamil Nadu experiences" delay={0.4} />
              <FeatureRow emoji="🤖" title="AI Trip Planning" desc="Generate itineraries instantly" delay={0.6} />
              <FeatureRow emoji="👥" title="1,000+ Active Travelers" desc="Connect with local explorers" delay={0.8} />
            </div>
          </div>

          {/* Right Cards Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Feature Highlights
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                Travel smarter with AI-powered experiences.
              </div>
            </div>

            {/* Card stack container */}
          <div style={{ position: 'relative', width: '300px', height: '520px', zIndex: 10 }}>
            {STORIES.map((story, index) => {
              const offset = (index - activeCard + STORIES.length) % STORIES.length;
              return (
                <motion.div
                  key={story.id}
                  initial={false}
                  animate={getCardStyle(offset)}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeInOut", 
                    times: offset === 4 ? [0, 0.5, 1] : undefined 
                  }}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '300px', height: '520px',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
                    transformOrigin: 'center center',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  <StoryCard story={story} />
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>

      {/* ══ RIGHT PANEL — Auth Card (unchanged) ════════════════════════════ */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px', overflowY: 'auto',
        background: '#F8F4F1',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%', maxWidth: '440px',
            background: '#fff',
            borderRadius: '24px',
            padding: '36px 36px 28px',
            boxShadow: '0 8px 48px rgba(0,0,0,0.10)',
            border: '1px solid #EAE3DE',
          }}
        >
          {/* Brand label */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FF6B35' }}>Namma Trip</span>
          </div>

          {/* Headings */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>Welcome Back</h1>
            <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500, margin: 0 }}>
              Sign in to continue exploring Tamil Nadu.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Email Address
              </label>
              <Input
                id="login-email" type="email" value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="explorer@nammatrip.com" required
                rightEl={
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                }
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Password</label>
                <a href="#" style={{ fontSize: '12px', fontWeight: 600, color: '#FF6B35', textDecoration: 'none' }}>Forgot Password?</a>
              </div>
              <Input
                id="login-password" type={showPw ? 'text' : 'password'}
                value={password} onChange={(e: any) => setPassword(e.target.value)}
                placeholder="••••••••" required
                rightEl={
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 0 }}>
                    {showPw ? <EyeOff style={{ width: '17px', height: '17px' }} /> : <Eye style={{ width: '17px', height: '17px' }} />}
                  </button>
                }
              />
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#FF6B35', cursor: 'pointer', flexShrink: 0 }} />
              <label htmlFor="remember" style={{ fontSize: '13px', color: '#374151', fontWeight: 500, cursor: 'pointer' }}>Remember Me</label>
            </div>

            {/* Sign In */}
            <button type="submit" disabled={loading} id="login-submit" style={{
              width: '100%', height: '52px',
              background: '#FF6B35', color: '#fff',
              border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s, transform 0.1s',
              opacity: loading ? 0.7 : 1, marginBottom: '20px',
              fontFamily: 'inherit',
            }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#E05320'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FF6B35'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {loading && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div style={{ marginBottom: '16px' }}><Divider /></div>

            {/* Social */}
            <div style={{ marginBottom: '20px' }}><SocialRow /></div>

            {/* Create account */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#6B7280', fontWeight: 500, margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#FF6B35', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
            </p>
          </form>
        </motion.div>

        {/* Footer */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="#" style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500, textDecoration: 'none' }}>Privacy Policy</a>
          <span style={{ fontSize: '12px', color: '#D1D5DB' }}>•</span>
          <a href="#" style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500, textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </div>
  );
}
