import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, Star, MapPin, Navigation, Users } from 'lucide-react';
import { motion } from 'framer-motion';

/* ── Reusable Google SVG ──────────────────────────────────────────────────── */
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

/* ── Shared floating pill ─────────────────────────────────────────────────── */
const Pill = ({ icon: Icon, label, delay }: { icon: any; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '7px',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '999px',
      padding: '8px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      whiteSpace: 'nowrap',
      border: '1px solid rgba(255,255,255,0.8)',
    }}
  >
    <Icon style={{ width: '13px', height: '13px', color: '#FF6B35', flexShrink: 0, fill: Icon === Star ? '#FF6B35' : 'none' }} />
    <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{label}</span>
  </motion.div>
);

/* ── Shared input ─────────────────────────────────────────────────────────── */
const Input = ({
  id, type, value, onChange, placeholder, required, rightEl, onFocus, onBlur,
}: {
  id: string; type: string; value: string; onChange: (e: any) => void;
  placeholder: string; required?: boolean; rightEl?: React.ReactNode;
  onFocus?: (e: any) => void; onBlur?: (e: any) => void;
}) => (
  <div style={{ position: 'relative' }}>
    <input
      id={id} type={type} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      style={{
        width: '100%', height: '50px', boxSizing: 'border-box',
        border: '1.5px solid #E5E7EB', borderRadius: '12px',
        padding: rightEl ? '0 44px 0 16px' : '0 16px',
        fontSize: '14px', color: '#111827', outline: 'none',
        background: '#fff', transition: 'border-color 0.2s',
        fontFamily: 'inherit',
      }}
      onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; onFocus?.(e); }}
      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; onBlur?.(e); }}
    />
    {rightEl && (
      <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
        {rightEl}
      </div>
    )}
  </div>
);

/* ── Shared social buttons ────────────────────────────────────────────────── */
const SocialRow = () => (
  <div style={{ display: 'flex', gap: '12px' }}>
    {[
      { icon: <GoogleIcon />, label: 'Google' },
      { icon: <FacebookIcon />, label: 'Facebook' },
    ].map(({ icon, label }) => (
      <button key={label} type="button" style={{
        flex: 1, height: '48px', border: '1.5px solid #E5E7EB', borderRadius: '12px',
        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        fontSize: '13px', fontWeight: 700, color: '#374151', cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {icon}{label}
      </button>
    ))}
  </div>
);

/* ── Divider ──────────────────────────────────────────────────────────────── */
const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
    <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
      OR CONTINUE WITH
    </span>
    <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(email, password); navigate('/feed'); }
    catch (err: any) { setError(err.response?.data?.message || 'Invalid email or password'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden',
      background: '#F8F4F1', fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ══ LEFT PANEL — 60% ═════════════════════════════════════════════════ */}
      <div style={{
        width: '60%', flexShrink: 0,
        background: 'linear-gradient(135deg, #FFE4D6 0%, #FECDB8 100%)',
        display: 'flex', flexDirection: 'column',
        padding: '28px 36px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0, zIndex: 10, position: 'relative' }}>
          <img src="/logo.jpg" alt="Namma Trip" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#FF6B35' }}>Namma Trip</span>
        </Link>

        {/* Collage — fills remaining height, strictly overflow:hidden */}
        <div style={{ flex: 1, position: 'relative', marginTop: '20px', overflow: 'hidden' }}>

          {/* ── Temple image: top-left, dominant ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '54%', height: '52%',
              borderRadius: '18px', overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
            }}
          >
            <img src="/meenakshi.jpg" alt="Meenakshi Temple" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* ── Ooty: top-right ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            style={{
              position: 'absolute', top: 0, right: 0,
              width: '43%', height: '43%',
              borderRadius: '18px', overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
            }}
          >
            <img src="/ooty.jpg" alt="Ooty Hills" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* ── Pills: float between the two images ─────────────────────── */}
          {/* Rating pill — right of temple, top-right zone */}
          <motion.div
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            style={{ position: 'absolute', top: '4%', left: '56%', zIndex: 20 }}
          >
            <Pill icon={Star} label="4.8 Rating" delay={0} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.52 }}
            style={{ position: 'absolute', top: '14%', left: '56%', zIndex: 20 }}
          >
            <Pill icon={MapPin} label="50+ Destinations" delay={0} />
          </motion.div>

          {/* ── Kodaikanal: bottom-right peek ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '43%', height: '34%',
              borderRadius: '18px', overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
            }}
          >
            <img src="/kodaikanal.jpg" alt="Kodaikanal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* Pills: AI & Travelers — between kodaikanal and content card */}
          <motion.div
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.58 }}
            style={{ position: 'absolute', bottom: '37%', right: '45%', zIndex: 20 }}
          >
            <Pill icon={Navigation} label="AI Trip Planning" delay={0} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.64 }}
            style={{ position: 'absolute', bottom: '24%', right: '45%', zIndex: 20 }}
          >
            <Pill icon={Users} label="1,000+ Travelers" delay={0} />
          </motion.div>

          {/* ── White glass card: bottom-left ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              position: 'absolute', bottom: 0, left: 0,
              width: '53%', zIndex: 10,
              background: 'rgba(255,255,255,0.94)',
              backdropFilter: 'blur(16px)',
              borderRadius: '22px',
              padding: '22px 26px',
              boxShadow: '0 20px 56px rgba(0,0,0,0.12)',
              border: '1px solid rgba(255,255,255,0.8)',
            }}
          >
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#FF6B35', lineHeight: 1.15, marginBottom: '8px' }}>
              Welcome<br />Back Explorer
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
              Continue planning your next unforgettable Tamil Nadu journey. Your curated adventures await.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — 40% ════════════════════════════════════════════════ */}
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
                onChange={(e) => setEmail(e.target.value)}
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
                value={password} onChange={(e) => setPassword(e.target.value)}
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
