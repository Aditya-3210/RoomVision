import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import { Login, Signup } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Catalog from './pages/Catalog';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ARPage from './ar/ARPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/planner" element={
          <ProtectedRoute>
            <Planner />
          </ProtectedRoute>
        } />
        <Route path="/planner/:id" element={
          <ProtectedRoute>
            <Planner />
          </ProtectedRoute>
        } />
        <Route path="/catalog" element={
          <ProtectedRoute>
            <Catalog />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/ar" element={
          <ProtectedRoute>
            <ARPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
