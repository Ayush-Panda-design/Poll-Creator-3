import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Auth
import LoginPage    from '../features/auth/pages/LoginPage';
import SignupPage   from '../features/auth/pages/SignupPage';

// Onboarding
import OnboardingPage from '../features/onboarding/pages/OnboardingPage';

// Dashboard / Polls
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage   from '../features/polls/pages/DashboardPage';
import CreatePollPage  from '../features/polls/pages/CreatePollPage';
import EditPollPage    from '../features/polls/pages/EditPollPage';
import PollDetailPage  from '../features/polls/pages/PollDetailPage';

// Analytics
import AnalyticsPage from '../features/analytics/pages/AnalyticsPage';

// Presentation
import PresentationPage from '../features/presentation/pages/PresentationPage';

// Public
import PublicPollPage    from '../features/publicPoll/pages/PublicPollPage';
import PublicResultsPage from '../features/publicPoll/pages/PublicResultsPage';

// Landing
import LandingPage from '../features/auth/pages/LandingPage';

const AppRoutes = () => (
  <Routes>
    {/* Landing */}
    <Route path="/" element={<LandingPage />} />

    {/* Auth (only for unauthenticated) */}
    <Route element={<PublicRoute />}>
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Route>

    {/* Onboarding (authenticated but onboarding not done) */}
    <Route element={<ProtectedRoute />}>
      <Route path="/onboarding" element={<OnboardingPage />} />
    </Route>

    {/* Dashboard (fully authenticated) */}
    <Route element={<ProtectedRoute requireOnboarding />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard"              element={<DashboardPage />} />
        <Route path="/polls/create"           element={<CreatePollPage />} />
        <Route path="/polls/:id/edit"         element={<EditPollPage />} />
        <Route path="/polls/:id"              element={<PollDetailPage />} />
        <Route path="/polls/:id/analytics"   element={<AnalyticsPage />} />
        <Route path="/polls/:id/present"     element={<PresentationPage />} />
      </Route>
    </Route>

    {/* Public poll routes */}
    <Route path="/poll/:pollCode"         element={<PublicPollPage />} />
    <Route path="/poll/:pollCode/results" element={<PublicResultsPage />} />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
