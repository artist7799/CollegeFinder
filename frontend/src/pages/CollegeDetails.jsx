import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCollege } from '../services/collegeApi';
import { getCollegeReviews, createReview, updateReview, deleteReview } from '../services/reviewApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ArrowLeft,
  MapPin,
  Star,
  GraduationCap,
  Building2,
  Calendar,
  Globe,
  Mail,
  Phone,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Edit2,
  Trash2,
  Send,
  LogIn,
  AlertCircle
} from 'lucide-react';

export default function CollegeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Reviews state
  const [reviewsData, setReviewsData] = useState({ count: 0, review_summary: { average_rating: 0, total_reviews: 0 }, data: [] });
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Edit Review state
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editError, setEditError] = useState(null);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await getCollegeReviews(id);
      if (res.data) {
        setReviewsData(res);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCollege(id);
        if (res.status === 'success' && res.data) {
          setCollege(res.data);
        } else {
          setError('College not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load college details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const handleCreateReview = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (comment.trim().length < 10) {
      setFormError('Comment must be at least 10 characters long.');
      return;
    }

    setFormSubmitting(true);
    try {
      await createReview(id, { rating: Number(rating), comment: comment.trim() }, token);
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      setFormError(err.message || 'Failed to submit review.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const startEditing = (rev) => {
    setEditingReviewId(rev.id);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
    setEditError(null);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    setEditError(null);

    if (editComment.trim().length < 10) {
      setEditError('Comment must be at least 10 characters long.');
      return;
    }

    try {
      await updateReview(editingReviewId, { rating: Number(editRating), comment: editComment.trim() }, token);
      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      setEditError(err.message || 'Failed to update review.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await deleteReview(reviewId, token);
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="section">
        <div className="container text-center py-16">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {error || 'College details unavailable'}
          </h2>
          <Link to="/colleges" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to Colleges</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    description,
    city,
    state,
    address,
    college_type,
    university,
    established_year,
    website,
    email,
    phone,
    logo,
    rating: collegeRating,
    courses = [],
    placement
  } = college;

  const reviewsList = reviewsData.data || [];
  const reviewSummary = reviewsData.review_summary || { average_rating: 0, total_reviews: 0 };
  const userExistingReview = isAuthenticated ? reviewsList.find((r) => r.user.id === user?.id) : null;

  return (
    <div className="section" style={{ background: '#f8fafc', padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/colleges" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Colleges</span>
        </Link>

        {/* 1. HEADER HERO BANNER CARD */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Logo */}
            <div className="college-logo-container" style={{ width: '7rem', height: '7rem' }}>
              {logo && !imgError ? (
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="college-logo-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Building2 size={48} className="text-blue-600 opacity-80" />
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  {name}
                </h1>
                <span className="badge badge-gold" style={{ fontSize: '0.9rem', padding: '0.35rem 0.75rem' }}>
                  <Star size={15} fill="#f59e0b" color="#f59e0b" />
                  {collegeRating ? collegeRating.toFixed(1) : 'N/A'} / 5.0
                </span>
              </div>

              <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569', fontSize: '1rem', marginBottom: '1rem' }}>
                <MapPin size={18} className="text-blue-600" />
                <span>{city}, {state}</span>
              </p>

              {/* Badges */}
              <div className="badges-row" style={{ marginBottom: '1.25rem' }}>
                {university && (
                  <span className="badge badge-blue" style={{ fontSize: '0.85rem' }}>
                    <GraduationCap size={14} />
                    {university}
                  </span>
                )}
                {college_type && (
                  <span className="badge badge-purple" style={{ fontSize: '0.85rem' }}>
                    {college_type}
                  </span>
                )}
                {established_year && (
                  <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.85rem' }}>
                    <Calendar size={14} />
                    Estd. {established_year}
                  </span>
                )}
              </div>

              {/* Contact Info Pills */}
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#64748b' }}>
                {website && (
                  <a href={website} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb' }}>
                    <Globe size={15} />
                    <span>Website</span>
                  </a>
                )}
                {email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={15} />
                    <span>{email}</span>
                  </span>
                )}
                {phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={15} />
                    <span>{phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. OVERVIEW & DESCRIPTION */}
        {(description || address) && (
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>
              About {name}
            </h2>
            {description && (
              <p style={{ color: '#334155', lineHeight: '1.6', fontSize: '0.975rem', marginBottom: '1rem' }}>
                {description}
              </p>
            )}
            {address && (
              <p style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <strong>Address:</strong> {address}
              </p>
            )}
          </div>
        )}

        {/* 3. COURSES & FEES SECTION */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen className="text-blue-600" size={22} />
            <span>Courses & Tuition Fees</span>
          </h2>

          {courses.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic', padding: '1rem 0' }}>
              No course information available for this college.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Course Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Degree</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Fees (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                        {course.course_name}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge badge-purple">{course.degree}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                        {course.duration}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#047857' }}>
                        ₹{course.fees ? course.fees.toLocaleString('en-IN') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. PLACEMENT STATISTICS SECTION */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp className="text-blue-600" size={22} />
            <span>Placement Statistics</span>
          </h2>

          {!placement ? (
            <p style={{ color: '#64748b', fontStyle: 'italic', padding: '1rem 0' }}>
              No placement statistics available for this college.
            </p>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.25rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>Average Package</span>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e3a8a', marginTop: '0.25rem' }}>
                    {placement.average_package} LPA
                  </p>
                </div>

                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1.25rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>Highest Package</span>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '0.25rem' }}>
                    {placement.highest_package} LPA
                  </p>
                </div>

                <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', padding: '1.25rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#6b21a8', fontWeight: 600 }}>Placement Percentage</span>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7e22ce', marginTop: '0.25rem' }}>
                    {placement.placement_percentage}%
                  </p>
                </div>
              </div>

              {placement.recruiting_companies && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                    Top Recruiting Companies
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {placement.recruiting_companies.split(',').map((company, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#f1f5f9',
                          color: '#334155',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        {company.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. STUDENT REVIEWS SECTION */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare className="text-blue-600" size={22} />
              <span>Student Reviews ({reviewSummary.total_reviews})</span>
            </h2>

            {reviewSummary.total_reviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef3c7', padding: '0.4rem 0.85rem', borderRadius: '9999px', border: '1px solid #fde68a' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontWeight: 700, color: '#b45309', fontSize: '0.925rem' }}>
                  {reviewSummary.average_rating.toFixed(1)} / 5.0 Average Student Score
                </span>
              </div>
            )}
          </div>

          {/* Logged Out Banner */}
          {!isAuthenticated && (
            <div className="info-banner mb-6" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1rem 1.25rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <span style={{ color: '#1e40af', fontSize: '0.9rem', fontWeight: 500 }}>
                Login to write a student review for {name}.
              </span>
              <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm flex items-center gap-1">
                <LogIn size={15} />
                <span>Login</span>
              </button>
            </div>
          )}

          {/* Write a Review Form (If logged in & hasn't reviewed yet) */}
          {isAuthenticated && !userExistingReview && (
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                Write a Review
              </h3>

              {formError && (
                <div className="error-banner mb-3">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateReview}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Your Rating (1 to 5 Stars)
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                      >
                        <Star
                          size={24}
                          fill={starVal <= rating ? '#f59e0b' : 'none'}
                          color={starVal <= rating ? '#f59e0b' : '#94a3b8'}
                        />
                      </button>
                    ))}
                    <span style={{ marginLeft: '0.5rem', fontWeight: 700, color: '#0f172a', alignSelf: 'center' }}>
                      {rating} / 5
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Your Experience & Comments (Min 10 characters)
                  </label>
                  <textarea
                    rows={4}
                    className="form-input text-input"
                    style={{ paddingLeft: '0.75rem' }}
                    placeholder="Share your experience about academics, faculty, campus life, and placement opportunities..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={formSubmitting}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm" disabled={formSubmitting}>
                  <Send size={15} />
                  <span>{formSubmitting ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </form>
            </div>
          )}

          {/* List of Student Reviews */}
          {reviewsLoading ? (
            <LoadingSpinner message="Loading student reviews..." />
          ) : reviewsList.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic', padding: '1rem 0', textAlign: 'center' }}>
              No student reviews submitted yet. Be the first to share your feedback!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {reviewsList.map((rev) => {
                const isOwner = user && rev.user.id === user.id;
                const isEditingThis = editingReviewId === rev.id;

                if (isEditingThis) {
                  return (
                    <div key={rev.id} style={{ background: '#f8fafc', border: '2px solid #2563eb', padding: '1.25rem', borderRadius: '0.75rem' }}>
                      <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>Edit Your Review</h4>
                      {editError && (
                        <div className="error-banner mb-3">
                          <AlertCircle size={16} />
                          <span>{editError}</span>
                        </div>
                      )}
                      <form onSubmit={handleUpdateReview}>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Rating</label>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button key={val} type="button" onClick={() => setEditRating(val)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <Star size={20} fill={val <= editRating ? '#f59e0b' : 'none'} color={val <= editRating ? '#f59e0b' : '#94a3b8'} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Comment</label>
                          <textarea
                            rows={3}
                            className="form-input"
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
                          <button type="button" onClick={() => setEditingReviewId(null)} className="btn btn-outline btn-sm">Cancel</button>
                        </div>
                      </form>
                    </div>
                  );
                }

                return (
                  <div
                    key={rev.id}
                    style={{
                      background: isOwner ? '#eff6ff' : '#ffffff',
                      border: `1px solid ${isOwner ? '#bfdbfe' : '#e2e8f0'}`,
                      padding: '1.25rem',
                      borderRadius: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                          {rev.user.name}
                        </span>
                        {isOwner && (
                          <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
                            YOUR REVIEW
                          </span>
                        )}
                      </div>

                      {/* Action buttons if owner */}
                      {isOwner && (
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => startEditing(rev)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            title="Edit Review"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: '#fecaca', color: '#dc2626' }}
                            title="Delete Review"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Rating stars & date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', gap: '0.15rem' }}>
                        {[1, 2, 3, 4, 5].map((sVal) => (
                          <Star
                            key={sVal}
                            size={15}
                            fill={sVal <= rev.rating ? '#f59e0b' : 'none'}
                            color={sVal <= rev.rating ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>

                    <p style={{ color: '#334155', fontSize: '0.925rem', lineHeight: '1.5' }}>
                      {rev.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
