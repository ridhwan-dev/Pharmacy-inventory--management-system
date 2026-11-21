
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  loginUser,
  loginWithGoogle,
} from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Login using email and password
  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate('/');
    } catch (error) {
      setError('Login failed. Please check your email and password.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Login using Google
  async function handleGoogleLogin() {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-container">
        <h1>PIMS</h1>
        <h2>Welcome Back</h2>
        <p>Sign in to manage your pharmacy inventory.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p>Or</p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
