import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/ui/Spinner';

/**
 * Protects routes that require authentication.
 * If requireOnboarding=true, also redirects to /onboarding when not completed.
 */
const ProtectedRoute = ({ requireOnboarding = false }) => {
  const { user, loading, token } = useSelector((s) => s.auth);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface"><Spinner size="lg" /></div>;
  if (!token)  return <Navigate to="/login" replace />;
  if (!user)   return <div className="min-h-screen flex items-center justify-center bg-surface"><Spinner size="lg" /></div>;

  if (requireOnboarding && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
