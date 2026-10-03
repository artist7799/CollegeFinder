import React, { useEffect, useState } from 'react';
import { getFilterOptions } from '../services/collegeApi';
import { Filter, RotateCcw } from 'lucide-react';

export default function FilterPanel({ filters = {}, onFilterChange, onClearFilters }) {
  const [options, setOptions] = useState({
    states: [],
    cities: [],
    college_types: [],
    universities: []
  });

  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const res = await getFilterOptions();
        if (res.status === 'success' && res.data) {
          setOptions(res.data);
        }
      } catch (err) {
        console.error('Failed to load filter options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  // Count active filter parameters excluding page, per_page, sort_by, sort_order
  const filterKeys = ['state', 'city', 'college_type', 'university', 'min_rating', 'max_fees'];
  const activeCount = filterKeys.reduce((count, key) => {
    const val = filters[key];
    return (val !== undefined && val !== null && val !== '') ? count + 1 : count;
  }, 0);

  return (
    <aside className="filter-sidebar" aria-label="College Filters">
      <div className="filter-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 700 }}>
          <Filter size={18} className="text-blue-600" />
          <span>Filters {activeCount > 0 && <span style={{ color: '#2563eb', fontWeight: 800 }}>({activeCount})</span>}</span>
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onClearFilters}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
            aria-label="Clear all active filters"
          >
            <RotateCcw size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* State Filter */}
      <div className="filter-group">
        <label htmlFor="filter-state" className="filter-label">State</label>
        <select
          id="filter-state"
          className="form-select"
          value={filters.state || ''}
          onChange={(e) => handleChange('state', e.target.value)}
          disabled={loadingOptions}
          aria-label="Filter by state"
        >
          <option value="">All States</option>
          {options.states.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div className="filter-group">
        <label htmlFor="filter-city" className="filter-label">City</label>
        <select
          id="filter-city"
          className="form-select"
          value={filters.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          disabled={loadingOptions}
          aria-label="Filter by city"
        >
          <option value="">All Cities</option>
          {options.cities.map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </select>
      </div>

      {/* College Type Filter */}
      <div className="filter-group">
        <label htmlFor="filter-type" className="filter-label">College Type</label>
        <select
          id="filter-type"
          className="form-select"
          value={filters.college_type || ''}
          onChange={(e) => handleChange('college_type', e.target.value)}
          disabled={loadingOptions}
          aria-label="Filter by college type"
        >
          <option value="">All Types</option>
          {options.college_types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* University Filter */}
      <div className="filter-group">
        <label htmlFor="filter-university" className="filter-label">University</label>
        <select
          id="filter-university"
          className="form-select"
          value={filters.university || ''}
          onChange={(e) => handleChange('university', e.target.value)}
          disabled={loadingOptions}
          aria-label="Filter by university"
        >
          <option value="">All Universities</option>
          {options.universities.map((uni) => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="filter-group">
        <label htmlFor="filter-rating" className="filter-label">Minimum Rating</label>
        <select
          id="filter-rating"
          className="form-select"
          value={filters.min_rating || ''}
          onChange={(e) => handleChange('min_rating', e.target.value)}
          aria-label="Filter by minimum rating"
        >
          <option value="">Any Rating</option>
          <option value="4.5">⭐ 4.5 & Above</option>
          <option value="4.0">⭐ 4.0 & Above</option>
          <option value="3.5">⭐ 3.5 & Above</option>
          <option value="3.0">⭐ 3.0 & Above</option>
        </select>
      </div>

      {/* Max Annual Fees Filter */}
      <div className="filter-group">
        <label htmlFor="filter-max-fees" className="filter-label">Max Course Fees (₹/year)</label>
        <input
          id="filter-max-fees"
          type="number"
          className="form-input"
          placeholder="e.g. 150000"
          value={filters.max_fees || ''}
          onChange={(e) => handleChange('max_fees', e.target.value)}
          step="10000"
          min="0"
          aria-label="Filter by maximum annual course fees"
        />
      </div>
    </aside>
  );
}
