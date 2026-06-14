import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

/* ── Shared icons ─────────────────────────────────────────────────────────── */
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

/* ════════════════════════════════════════════════════════════════════════════
   REGISTER PAGE
════════════════════════════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [agreed,   setAgreed]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (!agreed) { setError('Please accept the Terms & Conditions'); return; }
    setError(''); setLoading(true);
    try { await register(name, email, password); navigate('/feed'); }
    catch (err: any) { setError(err.response?.data?.message || 'Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  /* shared input style */
  const inp: React.CSSProperties = {
    width: '100%', height: '48px', boxSizing: 'border-box',
    border: '1.5px solid #E5E7EB', borderRadius: '12px',
    padding: '0 40px 0 14px', fontSize: '14px', color: '#111827',
    outline: 'none', background: '#fff', transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px',
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
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0, zIndex: 10 }}>
          <img src="/logo.jpg" alt="Namma Trip" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#FF6B35' }}>Namma Trip</span>
        </Link>

        {/* Collage */}
        <div style={{ flex: 1, position: 'relative', marginTop: '20px', overflow: 'hidden' }}>

          {/* ── Top-left: Meenakshi Temple ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '50%', height: '44%',
              borderRadius: '18px', overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
            }}
          >
            <img src="/meenakshi.jpg" alt="Meenakshi Temple" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* ── Top-right: Kodaikanal Lake ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            style={{
              position: 'absolute', top: 0, right: 0,
              width: '47%', height: '44%',
              borderRadius: '18px', overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
            }}
          >
            <img src="/kodaikanal.jpg" alt="Kodaikanal Lake" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

            {/* 4.9/5 User Rating badge — floats inside image, top-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{
                position: 'absolute', top: '10px', right: '10px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '14px',
                padding: '8px 14px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', marginBottom: '2px' }}>
                <Star style={{ width: '13px', height: '13px', fill: '#FF6B35', color: '#FF6B35' }} />
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>4.9/5</span>
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 600, letterSpacing: '0.02em' }}>User Rating</div>
            </motion.div>
          </motion.div>

          {/* ── Bottom-left: Ooty Hills ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            style={{
              position: 'absolute', top: '47%', left: 0,
              width: '50%', height: '32%',
              borderRadius: '18px', overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
            }}
          >
            <img src="/ooty.jpg" alt="Ooty Hills" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

            {/* 1,240+ Active Trips badge — bottom-left inside Ooty image */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.62 }}
              style={{
                position: 'absolute', bottom: '10px', left: '10px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '7px 12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
                border: '1px solid rgba(255,255,255,0.8)',
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#FF6B35', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
                Active Trips
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>1,240+</div>
            </motion.div>
          </motion.div>

          {/* ── Bottom-right: Weekends image ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            style={{
              position: 'absolute', top: '47%', right: 0,
              width: '47%', height: '32%',
              borderRadius: '18px', overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
            }}
          >
            <img src="/weekends.png" alt="Weekend Getaway" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* ── White content card — bottom, below all images ───────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '18px 24px',
              boxShadow: '0 20px 56px rgba(0,0,0,0.12)',
              border: '1px solid rgba(255,255,255,0.8)',
              zIndex: 10,
            }}
          >
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', lineHeight: 1.2, marginBottom: '6px' }}>
              Start Your Journey Today
            </h2>
            <p style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, lineHeight: 1.6, margin: 0, maxWidth: '480px' }}>
              Join thousands of travelers discovering the hidden beauty of Tamil Nadu. From the misty hills of Kodaikanal to the majestic temples of Madurai, your curated adventure begins here.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — 40% ════════════════════════════════════════════════ */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 24px', overflowY: 'auto',
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
            padding: '22px 30px 20px',
            boxShadow: '0 8px 48px rgba(0,0,0,0.10)',
            border: '1px solid #EAE3DE',
          }}
        >
          {/* Logo badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '13px',
              background: '#FF6B35',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255,107,53,0.35)',
            }}>
              <img src="/logo.jpg" alt="Namma Trip" style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Headings */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Create Account</h1>
            <p style={{ fontSize: '12px', color: '#FF6B35', fontWeight: 600, margin: 0 }}>Enter your details to register</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: '12px', padding: '9px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: '12px' }}>
              <label style={lbl}>Full Name</label>
              <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="John Doe" required style={{ ...inp, padding: '0 14px' }}
                onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '12px' }}>
              <label style={lbl}>Email Address</label>
              <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com" required style={{ ...inp, padding: '0 14px' }}
                onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Password — full width */}
            <div style={{ marginBottom: '12px' }}>
              <label style={lbl}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="register-password" type={showPw ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={inp}
                  onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 0 }}>
                  {showPw ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            {/* Confirm Password — full width, stacked */}
            <div style={{ marginBottom: '12px' }}>
              <label style={lbl}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input id="register-confirm" type={showCf ? 'text' : 'password'} value={confirm}
                  onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required style={inp}
                  onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
                <button type="button" onClick={() => setShowCf(!showCf)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 0 }}>
                  {showCf ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#FF6B35', cursor: 'pointer', flexShrink: 0 }} />
              <label htmlFor="terms" style={{ fontSize: '13px', color: '#374151', fontWeight: 500, cursor: 'pointer' }}>
                I agree to{' '}
                <a href="#" style={{ color: '#FF6B35', fontWeight: 700, textDecoration: 'none' }}>Terms & Conditions</a>
              </label>
            </div>

            {/* Create Account button */}
            <button type="submit" disabled={loading} id="register-submit" style={{
              width: '100%', height: '50px',
              background: '#FF6B35', color: '#fff',
              border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s, transform 0.1s',
              opacity: loading ? 0.7 : 1, marginBottom: '16px',
              fontFamily: 'inherit',
            }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#E05320'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FF6B35'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {loading && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
            </div>

            {/* Social */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {[{ icon: <GoogleIcon />, label: 'Google' }, { icon: <FacebookIcon />, label: 'Facebook' }].map(({ icon, label }) => (
                <button key={label} type="button" style={{
                  flex: 1, height: '46px', border: '1.5px solid #E5E7EB', borderRadius: '12px',
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

            {/* Sign in link */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#6B7280', fontWeight: 500, margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#FF6B35', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
