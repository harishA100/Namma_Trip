import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main className="pt-16 pb-20 md:pb-4 max-w-7xl mx-auto px-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
