import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, MessageSquare, ArrowLeft } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Accounts', icon: Users },
    { id: 'colleges', label: 'Colleges', icon: Building2 },
    { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-menu">
        <h3 className="admin-sidebar-title">Admin Management</h3>
        <nav className="admin-nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="admin-sidebar-footer pt-6 border-t border-gray-200 mt-6">
        <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-2">
          <ArrowLeft size={16} />
          <span>Back to Portal</span>
        </Link>
      </div>
    </aside>
  );
}
