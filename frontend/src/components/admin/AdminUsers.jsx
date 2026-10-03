import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminUsers, updateUserRole } from '../../services/adminApi';
import LoadingSpinner from '../LoadingSpinner';
import { Search, Shield, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminUsers() {
  const { token, user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ page, per_page: 10, search: search.trim() }, token);
      if (res.data) {
        setUsers(res.data);
        setTotalPages(res.total_pages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleRoleToggle = async (userId, currentRole) => {
    if (userId === currentUser?.id) {
      alert("You cannot change your own administrator role.");
      return;
    }

    const targetRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to '${targetRole.toUpperCase()}'?`)) {
      return;
    }

    setUpdatingId(userId);
    try {
      await updateUserRole(userId, targetRole, token);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-section-card">
      <div className="admin-card-header flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Account Management</h2>
          <p className="text-sm text-gray-600">Total Registered Users: {totalCount}</p>
        </div>

        {/* Search input */}
        <div className="search-input-wrapper max-w-xs border border-gray-300 rounded-md px-3 py-1.5 bg-white flex items-center gap-2">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            className="w-full text-sm outline-none bg-transparent"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading user accounts..." />
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                      No user accounts found matching your search.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="font-mono text-xs">#{u.id}</td>
                      <td className="font-semibold text-gray-900">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>
                          {u.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-xs text-gray-600">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <button
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          disabled={updatingId === u.id || u.id === currentUser?.id}
                          className={`btn btn-sm ${u.role === 'admin' ? 'btn-outline' : 'btn-primary'}`}
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.775rem' }}
                        >
                          {updatingId === u.id ? 'Updating...' : u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination flex items-center justify-center gap-2 mt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="page-btn flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>
              <span className="text-sm font-semibold text-gray-700 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="page-btn flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
