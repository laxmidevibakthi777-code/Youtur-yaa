import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import ChannelSearch from '@/pages/ChannelSearch';
import ChannelSelection from '@/pages/ChannelSelection';
import ChannelDashboard from '@/pages/ChannelDashboard';
import AiStudio from '@/pages/AiStudio';
import History from '@/pages/History';
import SavedReports from '@/pages/SavedReports';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/onboarding" component={Onboarding} />

      {/* App routes - wrapped in Layout */}
      <Route path="/dashboard"><Layout><Dashboard /></Layout></Route>
      <Route path="/channel-search"><Layout><ChannelSearch /></Layout></Route>
      <Route path="/channel-selection"><Layout><ChannelSelection /></Layout></Route>
      <Route path="/channel/:id"><Layout><ChannelDashboard /></Layout></Route>
      <Route path="/ai-studio"><Layout><AiStudio /></Layout></Route>
      <Route path="/history"><Layout><History /></Layout></Route>
      <Route path="/saved-reports"><Layout><SavedReports /></Layout></Route>
      <Route path="/profile"><Layout><Profile /></Layout></Route>
      <Route path="/settings"><Layout><Settings /></Layout></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
            <AppRoutes />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
