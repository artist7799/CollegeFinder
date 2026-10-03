import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (val) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    setSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password);
      // Navigate to login with success state message
      navigate('/login', {
        state: { message: 'Registration successful! Please sign in with your account credentials.' }
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h1 className="text-xl font-bold text-gray-900 mt-2">Create Student Account</h1>
          <p className="text-sm text-gray-600">Join CollegeFinder to explore & compare top colleges</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner mb-4">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="name"
                type="text"
                className="form-input text-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

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
            <label className="form-label" htmlFor="password">Password (Min 8 characters)</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-input text-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                className="form-input text-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        {/* Footer link to Login */}
        <div className="auth-footer mt-6 text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
