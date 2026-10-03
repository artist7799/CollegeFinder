import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, History, Trash2, Loader2 } from 'lucide-react';

const RECENT_SEARCHES_KEY = 'cf_recent_searches';

export default function SearchBar({
  initialValue = '',
  placeholder = "Search colleges, cities, states, universities or courses...",
  onSearch,
  loading = false,
  showPopularTags = true
}) {
  const [query, setQuery] = useState(initialValue);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  // Sync internal query if initialValue changes from URL
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  // Handle click outside to close recent search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    try {
      const filtered = recentSearches.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save recent search", e);
    }
  };

  const handleClearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const executeSearch = (searchTerm) => {
    const val = searchTerm !== undefined ? searchTerm : query;
    saveRecentSearch(val);
    setShowRecent(false);

    if (onSearch) {
      onSearch(val.trim());
    } else {
      if (val.trim()) {
        navigate(`/colleges?q=${encodeURIComponent(val.trim())}`);
      } else {
        navigate('/colleges');
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleClearInput = () => {
    setQuery('');
    executeSearch('');
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    executeSearch(tag);
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    executeSearch(term);
  };

  return (
    <div ref={searchContainerRef} style={{ width: '100%', position: 'relative' }}>
      <div className="search-box-card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper" style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            {loading ? (
              <Loader2 className="search-icon animate-spin" size={20} style={{ color: '#2563eb' }} />
            ) : (
              <Search className="search-icon" size={20} />
            )}
            <input
              type="text"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowRecent(true)}
              placeholder={placeholder}
              aria-label="Search colleges"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearInput}
                className="search-clear-btn"
                aria-label="Clear search input"
                style={{
                  position: 'absolute',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.25rem'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary" aria-label="Search">
            Search Colleges
          </button>
        </form>
      </div>

      {/* Recent Searches Dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div
          className="recent-searches-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            background: '#ffffff',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            zIndex: 50,
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <History size={14} /> Recent Searches
            </span>
            <button
              type="button"
              onClick={handleClearRecentSearches}
              style={{ fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {recentSearches.map((term, idx) => (
              <div
                key={idx}
                onClick={() => handleRecentClick(term)}
                style={{
                  padding: '0.6rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.15s ease'
                }}
                className="hover:bg-blue-50"
              >
                <History size={14} style={{ color: '#94a3b8' }} />
                <span>{term}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPopularTags && (
        <div className="popular-tags">
          <span style={{ fontWeight: 600 }}>Popular:</span>
          {['Engineering', 'MBA', 'Computer Science', 'Medical', 'Government'].map((tag) => (
            <span key={tag} className="tag-pill" onClick={() => handleTagClick(tag)}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
