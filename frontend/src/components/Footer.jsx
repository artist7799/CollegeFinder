import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <Link to="/" className="brand-logo" style={{ color: '#ffffff', marginBottom: '1rem', display: 'inline-flex' }}>
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <span>CollegeFinder</span>
            </Link>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6', maxWidth: '300px' }}>
              Your trusted college search and comparison portal. Helping students discover courses, fees, placements, and top universities across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/colleges">Explore Colleges</Link></li>
              <li><Link to="/colleges?college_type=Private">Private Colleges</Link></li>
              <li><Link to="/colleges?college_type=Government">Government Colleges</Link></li>
            </ul>
          </div>

          {/* Top States */}
          <div>
            <h4 className="footer-title">Top States</h4>
            <ul className="footer-links">
              <li><Link to="/colleges?state=Andhra Pradesh">Andhra Pradesh</Link></li>
              <li><Link to="/colleges?state=Telangana">Telangana</Link></li>
              <li><Link to="/colleges?state=Tamil Nadu">Tamil Nadu</Link></li>
              <li><Link to="/colleges?state=Karnataka">Karnataka</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="footer-title">Contact & Support</h4>
            <ul className="footer-links" style={{ fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} /> Ongole, Andhra Pradesh, India
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} /> support@collegefinder.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} /> +91 (800) 123-4567
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CollegeFinder. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
