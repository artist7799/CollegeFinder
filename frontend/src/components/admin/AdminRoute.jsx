import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container section-padding text-center">
        <LoadingSpinner message="Verifying admin credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="container section-padding flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <div className="card text-center p-8 max-w-lg mx-auto border border-red-200 bg-red-50">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={36} />
          </div>
          <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
          <p className="text-red-700 mb-6 text-sm">
            Administrator privileges are required to view this page. You are currently logged in as a <strong>{user?.role || 'student'}</strong>.
          </p>
          <Link to="/" className="btn btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
