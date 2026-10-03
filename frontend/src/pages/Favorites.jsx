import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFavorites, removeFavorite } from '../services/favoriteApi';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Heart, MapPin, Star, GraduationCap, Building2, Trash2, ArrowRight } from 'lucide-react';

export default function Favorites() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    async function loadFavorites() {
      setLoading(true);
      setError(null);
      try {
        const res = await getFavorites(token);
        setFavorites(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load favorite colleges.');
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [token, isAuthenticated, navigate]);

  const handleRemoveFavorite = async (collegeId) => {
    try {
      await removeFavorite(collegeId, token);
      setFavorites((prev) => prev.filter((item) => item.college.id !== collegeId));
    } catch (err) {
      alert(err.message || 'Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="container section-padding">
        <LoadingSpinner message="Fetching your favorite colleges..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container section-padding text-center">
        <div className="error-card">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart size={32} className="text-red-500 fill-red-500" />
            My Favorite Colleges
          </h1>
          <p className="text-gray-600 mt-1">
            {favorites.length} college{favorites.length !== 1 ? 's' : ''} saved to your shortlist.
          </p>
        </div>

        <Link to="/colleges" className="btn btn-outline btn-sm">
          + Explore More Colleges
        </Link>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="You haven't saved any colleges yet."
          message="Browse our college search directory and click the heart icon on any college card to save it to your favorites."
          actionText="Explore Colleges"
          onAction={() => navigate('/colleges')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const college = fav.college;
            return (
              <div key={fav.id} className="college-card flex-col justify-between" style={{ minHeight: '280px' }}>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="college-logo-container" style={{ width: '4rem', height: '4rem' }}>
                      {college.logo ? (
                        <img
                          src={college.logo}
                          alt={college.name}
                          className="college-logo-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <Building2
                        size={28}
                        className="text-blue-600 opacity-80"
                        style={{ display: college.logo ? 'none' : 'block' }}
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveFavorite(college.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h3 className="college-name text-lg font-bold text-gray-900 mb-1">{college.name}</h3>

                  <div className="college-location text-sm text-gray-600 mb-3 flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{college.city}, {college.state}</span>
                  </div>

                  <div className="badges-row mb-4">
                    {college.university && (
                      <span className="badge badge-blue">
                        <GraduationCap size={12} />
                        {college.university}
                      </span>
                    )}
                    <span className="badge badge-gold">
                      <Star size={12} fill="#f59e0b" color="#f59e0b" />
                      {college.rating ? college.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <Link to={`/colleges/${college.id}`} className="btn btn-primary btn-sm w-full flex items-center justify-center gap-1">
                    <span>View Profile</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
