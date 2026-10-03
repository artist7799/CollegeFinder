import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { ArrowRight, X, Scale } from 'lucide-react';

export default function CompareBar() {
  const { selectedColleges, compareCount, removeCompare, clearCompare } = useCompare();
  const location = useLocation();

  // Hide on compare page or if no colleges selected
  if (compareCount === 0 || location.pathname === '/compare') {
    return null;
  }

  return (
    <div className="compare-bar-container">
      <div className="container compare-bar-inner">
        {/* Left Section: Info & Pills */}
        <div className="compare-bar-left">
          <div className="compare-bar-header">
            <Scale size={20} className="text-blue-600" />
            <span className="compare-bar-title">
              Compare Colleges ({compareCount})
            </span>
          </div>

          <div className="compare-pills">
            {selectedColleges.map((college) => (
              <span key={college.id} className="compare-pill">
                <span className="compare-pill-name">{college.name}</span>
                <button
                  onClick={() => removeCompare(college.id)}
                  className="compare-pill-remove"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="compare-bar-actions">
          <button
            onClick={clearCompare}
            className="btn btn-outline btn-sm"
            style={{ borderColor: '#cbd5e1', color: '#64748b' }}
          >
            Clear All
          </button>

          <Link to="/compare" className="btn btn-primary btn-sm">
            <span>Compare Selected</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
