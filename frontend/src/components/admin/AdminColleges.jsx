import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminColleges, createAdminCollege, updateAdminCollege, deleteAdminCollege } from '../../services/adminApi';
import LoadingSpinner from '../LoadingSpinner';
import CollegeFormModal from './CollegeFormModal';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';

export default function AdminColleges() {
  const { token } = useAuth();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await getAdminColleges({ page, per_page: 10, q: search.trim() }, token);
      if (res.data) {
        setColleges(res.data);
        setTotalPages(res.total_pages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [page, search]);

  const handleOpenAddModal = () => {
    setEditingCollege(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (college) => {
    setEditingCollege(college);
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingCollege) {
        await updateAdminCollege(editingCollege.id, formData, token);
      } else {
        await createAdminCollege(formData, token);
      }
      setModalOpen(false);
      fetchColleges();
    } catch (err) {
      alert(err.message || 'Failed to save college details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (collegeId, collegeName) => {
    if (!window.confirm(`Are you sure you want to delete '${collegeName}'? All associated courses, placement stats, and reviews will be removed.`)) {
      return;
    }

    try {
      await deleteAdminCollege(collegeId, token);
      fetchColleges();
    } catch (err) {
      alert(err.message || 'Failed to delete college');
    }
  };

  return (
    <div className="admin-section-card">
      <div className="admin-card-header flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">College Catalog Management</h2>
          <p className="text-sm text-gray-600">Total Institutions: {totalCount}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search input */}
          <div className="search-input-wrapper border border-gray-300 rounded-md px-3 py-1.5 bg-white flex items-center gap-2" style={{ width: '220px' }}>
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              className="w-full text-sm outline-none bg-transparent"
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm flex items-center gap-1">
            <Plus size={16} />
            <span>Add College</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading college catalog..." />
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>College Name</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>University</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {colleges.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                      No colleges found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  colleges.map((c) => (
                    <tr key={c.id}>
                      <td className="font-mono text-xs">#{c.id}</td>
                      <td className="font-semibold text-gray-900">{c.name}</td>
                      <td className="text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-blue-600" />
                          {c.city}, {c.state}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-purple text-xs">
                          {c.college_type || 'N/A'}
                        </span>
                      </td>
                      <td className="text-xs font-medium text-gray-700">{c.university || 'N/A'}</td>
                      <td>
                        <span className="badge badge-gold text-xs">
                          <Star size={11} fill="#f59e0b" color="#f59e0b" />
                          {c.rating ? c.rating.toFixed(1) : 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(c)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit College"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete College"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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

      {/* College Add / Edit Modal */}
      <CollegeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        collegeToEdit={editingCollege}
        submitting={submitting}
      />
    </div>
  );
}
