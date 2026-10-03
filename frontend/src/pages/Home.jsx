import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CollegeCard from '../components/CollegeCard';
import CollegeCardSkeleton from '../components/CollegeCardSkeleton';
import { getColleges } from '../services/collegeApi';
import {
  Search,
  Scale,
  Coins,
  TrendingUp,
  Code,
  Briefcase,
  Stethoscope,
  BookOpen,
  MapPin,
  Sparkles,
  ArrowRight,
  Landmark,
  Building,
  Award
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        setLoadingFeatured(true);
        // Fetch top 4 rated colleges from real backend API
        const res = await getColleges({ sort_by: 'rating', sort_order: 'desc', per_page: 4 });
        if (isMounted && res.status === 'success') {
          setFeaturedColleges(res.data || []);
        }
      } catch (err) {
        console.error("Failed to load featured colleges:", err);
      } finally {
        if (isMounted) setLoadingFeatured(false);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryClick = (categoryQuery) => {
    navigate(`/colleges?q=${encodeURIComponent(categoryQuery)}`);
  };

  const handleTypeClick = (typeName) => {
    navigate(`/colleges?college_type=${encodeURIComponent(typeName)}`);
  };

  const handleTopRatedClick = () => {
    navigate(`/colleges?min_rating=4.5&sort_by=rating&sort_order=desc`);
  };

  const handleStateClick = (stateName) => {
    navigate(`/colleges?state=${encodeURIComponent(stateName)}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Find the Right College for Your Future
          </h1>
          <p className="hero-subtitle">
            Search, compare and discover top Indian colleges based on courses, fees, location and placements.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* 2. POPULAR DISCOVERY CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Discovery Categories</h2>
            <p className="section-desc">Browse institutions by stream, type, or academic ratings</p>
          </div>

          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div className="card category-card" onClick={() => handleCategoryClick('Engineering')}>
              <div className="category-icon">
                <Code size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Engineering Colleges</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>B.Tech, M.Tech & Diploma</p>
            </div>

            <div className="card category-card" onClick={() => handleCategoryClick('Computer Science')}>
              <div className="category-icon">
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Computer Science</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>AI, ML, Data Science & IT</p>
            </div>

            <div className="card category-card" onClick={() => handleTypeClick('Government')}>
              <div className="category-icon">
                <Landmark size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Government Colleges</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>IITs, NITs & Central Universities</p>
            </div>

            <div className="card category-card" onClick={() => handleTypeClick('Private')}>
              <div className="category-icon">
                <Building size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Private Colleges</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Top Autonomous & Private Inst.</p>
            </div>
          </div>

          {/* Banner link for Top Rated Colleges */}
          <div
            onClick={handleTopRatedClick}
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              color: '#ffffff',
              padding: '1.25rem 2rem',
              borderRadius: '0.75rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Award size={32} style={{ color: '#f59e0b' }} />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Top Rated Colleges (4.5+ ⭐)</h3>
                <p style={{ fontSize: '0.875rem', color: '#dbeafe', margin: 0 }}>Explore highest rated institutions with outstanding placement records</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
              <span>View Top Rated</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLEGES SECTION */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="section-title">Featured Colleges</h2>
              <p className="section-desc">Top rated institutions recommended for students</p>
            </div>
            <button onClick={() => navigate('/colleges')} className="btn btn-outline btn-sm flex items-center gap-1">
              <span>View All Colleges</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {loadingFeatured ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1, 2].map((i) => (
                <CollegeCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredColleges.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {featuredColleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b' }}>No featured colleges available right now.</p>
          )}
        </div>
      </section>

      {/* 4. WHY CHOOSE COLLEGEFINDER */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose CollegeFinder?</h2>
            <p className="section-desc">Everything you need to make an informed decision for your education</p>
          </div>

          <div className="grid-4">
            <div className="card feature-card">
              <div className="feature-icon">
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>🔍 Easy Search</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                Search colleges using multiple filters like location, rating, fees, and stream.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">
                <Scale size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>⚖️ Compare Colleges</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                Compare colleges side-by-side based on key factors, ratings, and course details.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">
                <Coins size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>💰 Compare Fees</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                Understand course tuition fees and breakdown before applying to any college.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon">
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>📊 Placement Insights</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                View highest, average packages, placement percentage, and top recruiter statistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FIND COLLEGES ACROSS INDIA */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Find Colleges Across India</h2>
            <p className="section-desc">Browse institutions in major education hubs</p>
          </div>

          <div className="grid-6">
            {[
              'Andhra Pradesh',
              'Telangana',
              'Tamil Nadu',
              'Karnataka',
              'Maharashtra',
              'Delhi'
            ].map((stateName) => (
              <div key={stateName} className="state-card" onClick={() => handleStateClick(stateName)}>
                <MapPin size={18} className="text-blue-600" />
                <span>{stateName}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
