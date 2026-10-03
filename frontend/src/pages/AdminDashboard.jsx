import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminDashboard } from '../services/adminApi';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import AdminUsers from '../components/admin/AdminUsers';
import AdminColleges from '../components/admin/AdminColleges';
import AdminReviews from '../components/admin/AdminReviews';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldCheck, LogOut, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await getAdminDashboard(token);
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setStatsError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  return (
    <div className="admin-dashboard-page">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="container admin-header-inner flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-blue-600" />
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              CollegeFinder Admin Console
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
              Welcome, {user?.name || 'Administrator'}
            </span>

            <a href="/" target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 font-medium">
              <span>View Portal</span>
              <ExternalLink size={14} />
            </a>

            <button onClick={logout} className="btn btn-outline btn-sm flex items-center gap-1.5">
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content Layout */}
      <div className="container py-8">
        <div className="admin-layout">
          {/* Left Sidebar */}
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Right Main Content */}
          <main className="admin-main-content">
            {activeTab === 'dashboard' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
                  <p className="text-sm text-gray-600">Key performance metrics and repository data summary.</p>
                </div>

                {statsLoading ? (
                  <LoadingSpinner message="Calculating summary metrics..." />
                ) : statsError ? (
                  <div className="error-banner mb-6">
                    <span>{statsError}</span>
                  </div>
                ) : (
                  <>
                    <AdminStats stats={stats} />

                    {/* Quick Access Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="card p-6 border border-gray-200 hover:border-blue-300 transition-colors">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">User Management</h3>
                        <p className="text-sm text-gray-600 mb-4">View student accounts, promote users to admins, or filter accounts.</p>
                        <button onClick={() => setActiveTab('users')} className="btn btn-primary btn-sm w-full">
                          Manage Users
                        </button>
                      </div>

                      <div className="card p-6 border border-gray-200 hover:border-purple-300 transition-colors">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">College Catalog</h3>
                        <p className="text-sm text-gray-600 mb-4">Add new institutions, edit details, or update established information.</p>
                        <button onClick={() => setActiveTab('colleges')} className="btn btn-primary btn-sm w-full">
                          Manage Colleges
                        </button>
                      </div>

                      <div className="card p-6 border border-gray-200 hover:border-amber-300 transition-colors">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Review Moderation</h3>
                        <p className="text-sm text-gray-600 mb-4">Monitor student review submissions and delete inappropriate comments.</p>
                        <button onClick={() => setActiveTab('reviews')} className="btn btn-primary btn-sm w-full">
                          Moderate Reviews
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'colleges' && <AdminColleges />}
            {activeTab === 'reviews' && <AdminReviews />}
          </main>
        </div>
      </div>
    </div>
  );
}
