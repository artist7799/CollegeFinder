import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getColleges } from '../services/collegeApi';
import FilterPanel from '../components/FilterPanel';
import CollegeCard from '../components/CollegeCard';
import CollegeCardSkeleton from '../components/CollegeCardSkeleton';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { Filter, SlidersHorizontal, X, AlertTriangle, RefreshCw } from 'lucide-react';

export default function Colleges() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    per_page: 10,
    total_pages: 0,
    total: 0
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract query parameters from URL
  const query = searchParams.get('q') || '';
  const state = searchParams.get('state') || '';
  const city = searchParams.get('city') || '';
  const college_type = searchParams.get('college_type') || '';
  const university = searchParams.get('university') || '';
  const min_rating = searchParams.get('min_rating') || '';
  const max_fees = searchParams.get('max_fees') || '';
  const sort_by = searchParams.get('sort_by') || 'name';
  const sort_order = searchParams.get('sort_order') || 'asc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        q: query,
        state,
        city,
        college_type,
        university,
        min_rating,
        max_fees,
        sort_by,
        sort_order,
        page,
        per_page: 10
      };

      const res = await getColleges(params);
      if (res.status === 'success') {
        setColleges(res.data || []);
        setPagination({
          count: res.count || 0,
          page: res.page || 1,
          per_page: res.per_page || 10,
          total_pages: res.total_pages || 0,
          total: res.total || 0
        });
      }
    } catch (err) {
      setError(err.message || 'Unable to load colleges. Please check your internet connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  // Update specific query parameter in URL
  const updateParam = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach((key) => {
      const val = newParams[key];
      if (val !== undefined && val !== null && val !== '') {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });

    // Reset to page 1 on filter/search changes unless page is explicitly given
    if (!('page' in newParams)) {
      updated.set('page', '1');
    }

    setSearchParams(updated);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const removeSingleFilter = (key) => {
    updateParam({ [key]: '' });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === 'name_asc') updateParam({ sort_by: 'name', sort_order: 'asc' });
    if (val === 'name_desc') updateParam({ sort_by: 'name', sort_order: 'desc' });
    if (val === 'rating_desc') updateParam({ sort_by: 'rating', sort_order: 'desc' });
    if (val === 'rating_asc') updateParam({ sort_by: 'rating', sort_order: 'asc' });
    if (val === 'established_desc') updateParam({ sort_by: 'established_year', sort_order: 'desc' });
    if (val === 'established_asc') updateParam({ sort_by: 'established_year', sort_order: 'asc' });
  };

  const currentSortValue = `${sort_by}_${sort_order}`;

  // Check if any filters are currently active
  const hasActiveFilters = Boolean(query || state || city || college_type || university || min_rating || max_fees);

  // Calculate active filter count for mobile button badge
  const activeFilterCount = [state, city, college_type, university, min_rating, max_fees].filter(Boolean).length;

  return (
    <div className="section">
      <div className="container">
        {/* Advanced Search Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <SearchBar
            initialValue={query}
            onSearch={(searchTerm) => updateParam({ q: searchTerm })}
            loading={loading}
            showPopularTags={false}
          />
        </div>

        {/* Control Bar: Sorting & Mobile Filter Toggle */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Active Filter Chips Preview */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            {hasActiveFilters ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Active Filters:</span>
                {query && (
                  <span className="badge badge-blue flex items-center gap-1" style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}>
                    Search: "{query}"
                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeSingleFilter('q')} />
                  </span>
                )}
                {state && (
                  <span className="badge badge-blue flex items-center gap-1" style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}>
                    State: {state}
                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeSingleFilter('state')} />
                  </span>
                )}
                {city && (
                  <span className="badge badge-blue flex items-center gap-1" style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}>
                    City: {city}
                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeSingleFilter('city')} />
                  </span>
                )}
                {college_type && (
                  <span className="badge badge-purple flex items-center gap-1" style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}>
                    Type: {college_type}
                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeSingleFilter('college_type')} />
                  </span>
                )}
                {university && (
                  <span className="badge badge-purple flex items-center gap-1" style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}>
                    Uni: {university}
                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeSingleFilter('university')} />
                  </span>
                )}
                {min_rating && (
                  <span className="badge badge-gold flex items-center gap-1" style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}>
                    Rating: {min_rating}+ ⭐
                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeSingleFilter('min_rating')} />
                  </span>
                )}
                {max_fees && (
                  <span className="badge flex items-center gap-1" style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                    Max Fees: ₹{Number(max_fees).toLocaleString('en-IN')}
                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeSingleFilter('max_fees')} />
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  style={{ fontSize: '0.78rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                  aria-label="Clear all active filters"
                >
                  Clear All
                </button>
              </div>
            ) : (
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Showing all registered institutions</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={16} className="text-gray-500" />
              <label htmlFor="sort-select" className="sr-only">Sort Colleges</label>
              <select
                id="sort-select"
                className="form-select"
                style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.875rem' }}
                value={currentSortValue}
                onChange={handleSortChange}
                aria-label="Sort options"
              >
                <option value="name_asc">Name: A → Z</option>
                <option value="name_desc">Name: Z → A</option>
                <option value="rating_desc">Rating: High → Low</option>
                <option value="rating_asc">Rating: Low → High</option>
                <option value="established_desc">Established: Newest</option>
                <option value="established_asc">Established: Oldest</option>
              </select>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              className="btn btn-outline lg:hidden"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
              aria-label="Toggle filter panel on mobile"
            >
              <Filter size={16} />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="colleges-layout">
          {/* Desktop & Toggleable Mobile Filter Panel */}
          <div className={mobileFilterOpen ? 'block mb-6 lg:mb-0' : 'hidden lg:block'}>
            <FilterPanel
              filters={{ state, city, college_type, university, min_rating, max_fees }}
              onFilterChange={(newFilter) => updateParam(newFilter)}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* College Results View */}
          <div>
            {/* Error Banner */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <AlertTriangle size={36} className="mx-auto mb-2 text-red-600" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Unable to load colleges</h3>
                <p style={{ fontSize: '0.925rem', color: '#7f1d1d', marginBottom: '1rem' }}>{error}</p>
                <button onClick={fetchColleges} className="btn btn-primary btn-sm flex items-center gap-1 mx-auto" aria-label="Try loading colleges again">
                  <RefreshCw size={14} />
                  <span>Try Again</span>
                </button>
              </div>
            )}

            {/* Skeleton Loading State */}
            {loading && !error && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CollegeCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && colleges.length === 0 && (
              <EmptyState
                title="No colleges found"
                message="Try changing your search terms or removing some active filters."
                onClearFilters={handleClearFilters}
              />
            )}

            {/* Colleges List & Results Header */}
            {!loading && !error && colleges.length > 0 && (
              <div>
                <p style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                  {hasActiveFilters
                    ? `Showing ${colleges.length} of ${pagination.total} colleges matching your filters`
                    : `Showing ${colleges.length} of ${pagination.total} total colleges`}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {colleges.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>

                {/* Server-Side Pagination Controls */}
                {pagination.total_pages > 1 && (
                  <div className="pagination" style={{ marginTop: '2rem' }}>
                    <button
                      className="page-btn"
                      disabled={page <= 1}
                      onClick={() => updateParam({ page: page - 1 })}
                      aria-label="Go to previous page"
                    >
                      Previous
                    </button>

                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`page-btn ${p === page ? 'active' : ''}`}
                        onClick={() => updateParam({ page: p })}
                        aria-label={`Go to page ${p}`}
                        aria-current={p === page ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      className="page-btn"
                      disabled={page >= pagination.total_pages}
                      onClick={() => updateParam({ page: page + 1 })}
                      aria-label="Go to next page"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
