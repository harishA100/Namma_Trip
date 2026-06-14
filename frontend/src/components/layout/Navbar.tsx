import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, MapPin, LogOut, User, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed/explore?q=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={user ? "/feed" : "/"} className="flex items-center gap-2 group">
          <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:block">Namma Trips</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 py-2.5 text-sm"
            />
          </div>
        </form>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors" id="nav-notifications">
            <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-danger)] rounded-full" />
          </button>

          {/* Avatar menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
              id="nav-user-menu"
            >
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium hidden lg:block">{user?.name}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-12 w-56 glass rounded-xl py-2 shadow-xl animate-fade-in-up">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{user?.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="badge badge-primary text-xs">{user?.travelLevel}</span>
                    <span className="text-xs text-[var(--color-secondary)]">⚡ {user?.xpPoints} XP</span>
                  </div>
                </div>
                <Link to="/feed/profile" onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">
                  <User className="w-4 h-4" /> Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/feed/admin" onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">
                    <Shield className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <button onClick={() => { logout(); setShowMenu(false); navigate('/login'); }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors w-full text-[var(--color-danger)]">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
