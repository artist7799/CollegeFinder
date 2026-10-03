import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirected from Registration with success message
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section-padding flex justify-center items-center" style={{ minHeight: 'calc(100vh - 15rem)' }}>
      <div className="auth-card">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="brand-logo justify-center mb-2">
            <GraduationCap className="w-9 h-9 text-blue-600" />
            <span className="text-2xl font-bold">CollegeFinder</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-2">Welcome Back</h1>
          <p className="text-sm text-gray-600">Sign in to access your college discovery portal</p>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="success-banner mb-4">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="error-banner mb-4">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input text-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-input text-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full mt-2"
            disabled={submitting}
          >
            {submitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer link to Register */}
        <div className="auth-footer mt-6 text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
