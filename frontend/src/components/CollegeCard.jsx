import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Building2, GraduationCap, ArrowRight, CheckSquare, Square, Heart, Calendar, BookOpen } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { checkFavorite, addFavorite, removeFavorite } from '../services/favoriteApi';

export default function CollegeCard({ college }) {
  const [imgError, setImgError] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const { isSelected, toggleCompare } = useCompare();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    id,
    name,
    city,
    state,
    college_type,
    university,
    rating,
    logo,
    established_year,
    courses
  } = college;

  const selected = isSelected(id);

  // Check if this college is in authenticated user's favorites on backend
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated && token) {
      checkFavorite(id, token)
        .then((res) => {
          if (isMounted) {
            setIsFav(res.is_favorite);
          }
        })
        .catch(() => {});
    } else {
      setIsFav(false);
    }
    return () => {
      isMounted = false;
    };
  }, [id, isAuthenticated, token]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(id, token);
        setIsFav(false);
      } else {
        await addFavorite(id, token);
        setIsFav(true);
      }
    } catch (err) {
      alert(err.message || 'Failed to update favorite');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <article className={`college-card ${selected ? 'college-card-selected' : ''}`} aria-label={`College card for ${name}`}>
      {/* Top Header: Checkbox & Favorite Heart */}
      <div className="college-card-select-header justify-between">
        <button
          onClick={handleFavoriteClick}
          disabled={favLoading}
          className={`favorite-btn flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors ${
            isFav
              ? 'text-red-600 bg-red-50 border border-red-200'
              : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
          }`}
          title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
          aria-label={isFav ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        >
          <Heart size={15} className={isFav ? 'fill-red-600' : ''} />
          <span>{isFav ? 'Favorited' : 'Favorite'}</span>
        </button>

        <label className="college-card-checkbox-label" aria-label={`Select ${name} for comparison`}>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => toggleCompare(college)}
            className="sr-only"
            aria-label={`Compare ${name}`}
          />
          {selected ? (
            <CheckSquare size={18} className="text-blue-600" />
          ) : (
            <Square size={18} className="text-gray-400 hover:text-gray-600" />
          )}
          <span className={`text-xs font-medium ${selected ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
            {selected ? 'Selected for Compare' : 'Compare'}
          </span>
        </label>
      </div>

      {/* College Logo / Image */}
      <div className="college-logo-container">
        {logo && !imgError ? (
          <img
            src={logo}
            alt={`${name} logo`}
            className="college-logo-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <Building2 size={36} className="text-blue-600 opacity-80" />
        )}
      </div>

      {/* College Details Info */}
      <div className="college-details">
        <h3 className="college-name">{name}</h3>

        <div className="college-location">
          <MapPin size={15} className="text-gray-500" />
          <span>{city}, {state}</span>
        </div>

        {/* Badges Row */}
        <div className="badges-row">
          {university && (
            <span className="badge badge-blue">
              <GraduationCap size={13} />
              {university}
            </span>
          )}

          {college_type && (
            <span className="badge badge-purple">
              {college_type}
            </span>
          )}

          {established_year && (
            <span className="badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
              <Calendar size={13} />
              Estd. {established_year}
            </span>
          )}

          <span className="badge badge-gold">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            {rating ? rating.toFixed(1) : 'N/A'}
          </span>
        </div>

        {/* Course Info Preview if available */}
        {courses && courses.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <BookOpen size={14} className="text-blue-600" />
            <span>
              <strong>Popular Courses:</strong> {courses.slice(0, 2).map(c => c.course_name).join(', ')}
              {courses.length > 2 ? ` +${courses.length - 2} more` : ''}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="college-card-actions">
          <Link to={`/colleges/${id}`} className="btn btn-primary btn-sm" aria-label={`View details for ${name}`}>
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>

          <button
            className={`btn btn-sm ${selected ? 'btn-success' : 'btn-outline'}`}
            onClick={() => toggleCompare(college)}
            type="button"
            aria-label={selected ? `Remove ${name} from comparison list` : `Add ${name} to comparison list`}
          >
            {selected ? '✓ Selected' : '+ Compare'}
          </button>
        </div>
      </div>
    </article>
  );
}
