import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SiteProvider } from './contexts/SiteContext';
import { DateRangeProvider } from './contexts/DateRangeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CrowdEntries from './pages/CrowdEntries';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/auth.service';

function App() {
  return (
    <SiteProvider>
      <DateRangeProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                authService.isAuthenticated()
                  ? <Navigate to="/dashboard" replace />
                  : <Login />
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/crowd-entries"
              element={
                <ProtectedRoute>
                  <CrowdEntries />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DateRangeProvider>
    </SiteProvider>
  );
}

export default App;
