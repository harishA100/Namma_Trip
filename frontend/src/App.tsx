import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import TripPlannerPage from './pages/TripPlannerPage';
import ActiveTripPage from './pages/ActiveTripPage';
import ExplorePage from './pages/ExplorePage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="skeleton w-8 h-8 rounded-full" /></div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/feed" /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/feed" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/feed" /> : <RegisterPage />} />
      
      {/* Authenticated Application Shell */}
      <Route path="/feed" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="planner" element={<TripPlannerPage />} />
        <Route path="trip/:id" element={<ActiveTripPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="destination/:id" element={<DestinationDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
