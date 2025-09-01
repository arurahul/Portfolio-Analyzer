  import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
  import Login from './pages/Login';
  import Register from './pages/Registration';
  import Dashboard from './pages/Dashboard';
  import PortfolioAnalytics from './pages/PortfolioAnalytics';
  import ProtectedRoute from './components/ProctedRoute'
  import SystemSettings from './pages/SystemSettings';
  import PortfolioDashboard from './pages/PortfolioDashboard';
  import UserManagement from './pages/UserManagement';
  export default function App() {
    return (
      <BrowserRouter>
        <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/portfolio/analytics" element={
        <ProtectedRoute clearance="Tier3">
          <PortfolioAnalytics />
        </ProtectedRoute>
      } />

      <Route path="/portfolio/dashboard" element={
        <ProtectedRoute>
          <PortfolioDashboard />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute clearance="Tier1">
          <SystemSettings />
        </ProtectedRoute>
      } />

      <Route path="/admin/users" element={
        <ProtectedRoute clearance="Tier2">
          <UserManagement />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
      </BrowserRouter>
    );
  }