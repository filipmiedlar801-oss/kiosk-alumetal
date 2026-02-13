import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider } from 'react-i18next';
import theme from './theme/theme';
import i18n from './i18n/config';
import { NotificationProvider } from './context/NotificationContext';
import SessionManager from './components/SessionManager/SessionManager';

// Pages
import LanguageScreen from './pages/LanguageScreen/LanguageScreen';
import NotificationListScreen from './pages/NotificationListScreen/NotificationListScreen';
import SearchNotificationScreen from './pages/SearchNotificationScreen/SearchNotificationScreen';
import NotificationDetailsScreen from './pages/NotificationDetailsScreen/NotificationDetailsScreen';
import SummaryScreen from './pages/SummaryScreen/SummaryScreen';
import ErrorScreen from './pages/ErrorScreen/ErrorScreen';
import InconsistenciesScreen from './pages/InconsistenciesScreen/InconsistenciesScreen';
import SafetyRulesScreen from './pages/SafetyRulesScreen/SafetyRulesScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotificationProvider>
            <Router>
              <SessionManager />
              <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/language" replace />} />
                  <Route path="/language" element={<LanguageScreen />} />
                  <Route path="/safety-rules" element={<SafetyRulesScreen />} />
                  <Route path="/notifications" element={<NotificationListScreen />} />
                  <Route path="/search" element={<SearchNotificationScreen />} />
                  <Route path="/notification/:id" element={<NotificationDetailsScreen />} />
                  <Route path="/summary" element={<SummaryScreen />} />
                  <Route path="/error" element={<ErrorScreen />} />
                  <Route path="/inconsistencies" element={<InconsistenciesScreen />} />
                  <Route path="*" element={<Navigate to="/language" replace />} />
                </Routes>
              </div>
            </Router>
          </NotificationProvider>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;
