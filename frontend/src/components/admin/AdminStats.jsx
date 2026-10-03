import React from 'react';
import { Users, Building2, BookOpen, MessageSquare, Heart } from 'lucide-react';

export default function AdminStats({ stats }) {
  if (!stats) return null;

  const statCards = [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { label: 'Total Colleges', value: stats.total_colleges, icon: Building2, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { label: 'Total Courses', value: stats.total_courses, icon: BookOpen, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    { label: 'Total Reviews', value: stats.total_reviews, icon: MessageSquare, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { label: 'Total Favorites', value: stats.total_favorites, icon: Heart, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  ];

  return (
    <div className="admin-stats-grid">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="admin-stat-card"
            style={{ backgroundColor: card.bg, borderColor: card.border }}
          >
            <div className="admin-stat-icon" style={{ color: card.color }}>
              <Icon size={24} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-label" style={{ color: card.color }}>{card.label}</span>
              <p className="admin-stat-value" style={{ color: '#0f172a' }}>
                {card.value !== undefined ? card.value.toLocaleString('en-IN') : 0}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
