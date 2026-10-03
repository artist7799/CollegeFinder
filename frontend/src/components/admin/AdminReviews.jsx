import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminReviews, deleteAdminReview } from '../../services/adminApi';
import LoadingSpinner from '../LoadingSpinner';
import { Star, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminReviews() {
  const { token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getAdminReviews({ page, per_page: 10 }, token);
      if (res.data) {
        setReviews(res.data);
        setTotalPages(res.total_pages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this student review? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteAdminReview(reviewId, token);
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  return (
    <div className="admin-section-card">
      <div className="admin-card-header mb-6">
        <h2 className="text-xl font-bold text-gray-900">Student Review Moderation</h2>
        <p className="text-sm text-gray-600">Total Submitted Reviews: {totalCount}</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading review submissions..." />
      ) : (
        <>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>College</th>
                  <th>Student Name</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Submitted Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                      No student reviews submitted yet.
                    </td>
                  </tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r.id}>
                      <td className="font-mono text-xs">#{r.id}</td>
                      <td className="font-semibold text-gray-900">{r.college_name}</td>
                      <td>
                        <div>
                          <p className="font-medium text-gray-900">{r.user_name}</p>
                          <p className="text-xs text-gray-500">{r.user_email}</p>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-gold text-xs">
                          <Star size={12} fill="#f59e0b" color="#f59e0b" />
                          {r.rating} / 5
                        </span>
                      </td>
                      <td className="text-xs text-gray-700 max-w-xs" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {r.comment}
                      </td>
                      <td className="text-xs text-gray-500">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Inappropriate Review"
                        >
                          <Trash2 size={16} />
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
