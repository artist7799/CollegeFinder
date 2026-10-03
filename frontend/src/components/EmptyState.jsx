import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function EmptyState({ title = "No colleges found", message = "Try changing your search or filters.", onClearFilters }) {
  return (
    <div className="empty-state">
      <SearchX className="empty-icon" />
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
        {title}
      </h3>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        {message}
      </p>
      {onClearFilters && (
        <button onClick={onClearFilters} className="btn btn-primary btn-sm">
          <RotateCcw size={16} />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}
