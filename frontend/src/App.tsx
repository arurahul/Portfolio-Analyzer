import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Registration';
import Dashboard from './pages/Dashboard';
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import ProtectedRoute from './components/ProctedRoute';
import SystemSettings from './pages/SystemSettings';
import PortfolioDashboard from './pages/PortfolioDashboard';
import UserManagement from './pages/UserManagement';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PortfolioAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SystemSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <PortfolioDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}