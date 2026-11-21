
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

import './App.css';

import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Login from './pages/Login';
import Register from './pages/Register';

import ProtectedRoute from './components/ProtectedRoute';

import { useAuth } from './context/AuthContext';
import { logoutUser } from './services/authService';

// Main pharmacy application layout
function AppLayout({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 className="brand">PIMS</h2>

        <nav className="navigation">
          <Link to="/" className="nav-link">
            Dashboard
          </Link>

          <Link to="/medicines" className="nav-link">
            Medicines
          </Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div>
            <h1>Pharmacy Dashboard</h1>
            <p>Manage your pharmacy inventory</p>
          </div>

          <div className="user-profile">
            <span>{currentUser?.email}</span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

// Main application routes
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/medicines"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Medicines />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
