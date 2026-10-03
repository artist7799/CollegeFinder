import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, User, Scale, LogOut, UserPlus, Heart, Shield } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { compareCount } = useCompare();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span>CollegeFinder</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/colleges" className={`nav-item ${isActive('/colleges') ? 'active' : ''}`}>
            Find Colleges
          </Link>
          <Link to="/compare" className={`nav-item ${isActive('/compare') ? 'active' : ''}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={16} />
              Compare
              {compareCount > 0 && (
                <span className="navbar-badge">
                  {compareCount}
                </span>
              )}
            </span>
          </Link>
          {isAuthenticated && (
            <Link to="/favorites" className={`nav-item ${isActive('/favorites') ? 'active' : ''}`}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={16} className="text-red-500 fill-red-500" />
                Favorites
              </span>
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7c3aed', fontWeight: 600 }}>
                <Shield size={16} />
                Admin Dashboard
              </span>
            </Link>
          )}
        </nav>

        {/* Action Button */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu flex items-center gap-3">
              <span className="user-welcome-badge flex items-center gap-1.5 font-medium text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <User size={15} className="text-blue-600" />
                <span>Welcome, <strong>{user?.name || 'Student'}</strong></span>
              </span>

              <button
                className="btn btn-outline btn-sm flex items-center gap-1.5"
                onClick={logout}
                title="Logout"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons flex items-center gap-2">
              <Link to="/login" className="btn btn-outline btn-sm">
                <User size={15} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              to="/"
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/colleges"
              className={`nav-item ${isActive('/colleges') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Colleges
            </Link>
            <Link
              to="/compare"
              className={`nav-item ${isActive('/compare') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare {compareCount > 0 ? `(${compareCount})` : ''}
            </Link>
            {isAuthenticated && (
              <Link
                to="/favorites"
                className={`nav-item ${isActive('/favorites') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Favorites
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#7c3aed', fontWeight: 600 }}
              >
                Admin Dashboard
              </Link>
            )}
            <hr style={{ borderColor: '#f1f5f9', margin: '0.25rem 0' }} />
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                  Logged in as <strong>{user?.name}</strong> ({user?.role})
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  style={{ width: 'fit-content' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
