import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, Compass, User } from 'lucide-react';

const navItems = [
  { path: '/feed', icon: Home, label: 'Home' },
  { path: '/feed/planner', icon: Sparkles, label: 'AI Planner' },
  { path: '/feed/explore', icon: Compass, label: 'Explore' },
  { path: '/feed/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/5">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = path === '/feed' ? pathname === '/feed' : pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-300 ${
                active
                  ? 'text-[var(--color-primary)] scale-110'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
              id={`bottomnav-${label.toLowerCase().replace(' ', '-')}`}
            >
              <Icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
