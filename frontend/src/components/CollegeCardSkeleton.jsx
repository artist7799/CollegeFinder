import React from 'react';

export default function CollegeCardSkeleton() {
  return (
    <div className="college-card skeleton-card">
      <div className="college-card-select-header flex justify-between items-center mb-3">
        <div className="skeleton-box" style={{ width: '80px', height: '24px', borderRadius: '4px' }}></div>
        <div className="skeleton-box" style={{ width: '90px', height: '24px', borderRadius: '4px' }}></div>
      </div>

      <div className="college-logo-container">
        <div className="skeleton-box" style={{ width: '56px', height: '56px', borderRadius: '50%' }}></div>
      </div>

      <div className="college-details" style={{ flex: 1 }}>
        <div className="skeleton-box" style={{ width: '65%', height: '22px', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
        <div className="skeleton-box" style={{ width: '40%', height: '16px', borderRadius: '4px', marginBottom: '0.75rem' }}></div>

        <div className="badges-row flex gap-2 mb-3">
          <div className="skeleton-box" style={{ width: '90px', height: '20px', borderRadius: '12px' }}></div>
          <div className="skeleton-box" style={{ width: '80px', height: '20px', borderRadius: '12px' }}></div>
          <div className="skeleton-box" style={{ width: '60px', height: '20px', borderRadius: '12px' }}></div>
        </div>

        <div className="college-card-actions flex gap-2 mt-3">
          <div className="skeleton-box" style={{ width: '120px', height: '36px', borderRadius: '6px' }}></div>
          <div className="skeleton-box" style={{ width: '100px', height: '36px', borderRadius: '6px' }}></div>
        </div>
      </div>
    </div>
  );
}
