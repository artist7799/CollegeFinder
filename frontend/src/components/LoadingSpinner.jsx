import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="loading-state">
      <div
        style={{
          width: '3rem',
          height: '3rem',
          border: '4px solid #e2e8f0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem'
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: '#64748b', fontWeight: 500 }}>Loading colleges...</p>
    </div>
  );
}
