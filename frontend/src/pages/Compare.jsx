import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { getCollege, getColleges } from '../services/collegeApi';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  Scale,
  X,
  Plus,
  ArrowRight,
  Star,
  MapPin,
  GraduationCap,
  Building2,
  Briefcase,
  IndianRupee,
  Award,
  BookOpen,
  Calendar,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function Compare() {
  const { selectedColleges, removeCompare, clearCompare, toggleCompare, MAX_COMPARE_LIMIT } = useCompare();
  const [searchParams, setSearchParams] = useSearchParams();
  const [detailedColleges, setDetailedColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For "Add College" selector
  const [availableColleges, setAvailableColleges] = useState([]);
  const [selectedAddId, setSelectedAddId] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Fetch details for all currently selected colleges
  useEffect(() => {
    let isMounted = true;

    async function fetchComparisonDetails() {
      if (selectedColleges.length === 0) {
        setDetailedColleges([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const promises = selectedColleges.map((c) => getCollege(c.id));
        const results = await Promise.all(promises);

        if (isMounted) {
          const loadedData = results.map((res) => res.data);
          setDetailedColleges(loadedData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load college comparison data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchComparisonDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedColleges]);

  // Load dropdown list of colleges for Quick Add feature
  useEffect(() => {
    async function loadDropdownColleges() {
      try {
        const res = await getColleges({ per_page: 50 });
        if (res.data) {
          setAvailableColleges(res.data);
        }
      } catch (err) {
        console.error('Failed to load colleges for add dropdown:', err);
      }
    }
    loadDropdownColleges();
  }, []);

  const handleAddCollegeSelect = async (e) => {
    const val = e.target.value;
    if (!val) return;
    const targetId = Number(val);
    const colToAdd = availableColleges.find((c) => c.id === targetId);

    if (colToAdd) {
      toggleCompare(colToAdd);
      setSelectedAddId('');
    }
  };

  // Compute best performing metrics for highlight badges
  const getHighestAvgPackageId = () => {
    let max = -1;
    let maxId = null;
    detailedColleges.forEach((c) => {
      const avg = c.placement?.average_package || 0;
      if (avg > max) {
        max = avg;
        maxId = c.id;
      }
    });
    return max > 0 ? maxId : null;
  };

  const getHighestPlacementPercentId = () => {
    let max = -1;
    let maxId = null;
    detailedColleges.forEach((c) => {
      const pct = c.placement?.placement_percentage || 0;
      if (pct > max) {
        max = pct;
        maxId = c.id;
      }
    });
    return max > 0 ? maxId : null;
  };

  const getTopRatingId = () => {
    let max = -1;
    let maxId = null;
    detailedColleges.forEach((c) => {
      const r = c.rating || 0;
      if (r > max) {
        max = r;
        maxId = c.id;
      }
    });
    return max > 0 ? maxId : null;
  };

  const highestAvgId = getHighestAvgPackageId();
  const highestPctId = getHighestPlacementPercentId();
  const topRatingId = getTopRatingId();

  if (loading) {
    return (
      <div className="container section-padding">
        <LoadingSpinner message="Fetching comparison metrics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container section-padding text-center">
        <div className="error-card">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (selectedColleges.length === 0) {
    return (
      <div className="container section-padding">
        <div className="compare-header text-center mb-8">
          <div className="compare-icon-circle mx-auto mb-4">
            <Scale size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">College Comparison</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Compare fees, placement statistics, ratings, and course offerings side-by-side to make the right choice for your career.
          </p>
        </div>

        <EmptyState
          title="No Colleges Selected for Comparison"
          message="Select up to 4 colleges from our discovery catalog to generate a side-by-side comparison matrix."
          actionText="Explore Colleges"
          onAction={() => (window.location.href = '/colleges')}
        />
      </div>
    );
  }

  return (
    <div className="container section-padding">
      {/* Page Header */}
      <div className="compare-page-header mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Scale className="text-blue-600" size={32} />
            College Comparison Matrix
          </h1>
          <p className="text-gray-600 mt-1">
            Comparing {detailedColleges.length} of {MAX_COMPARE_LIMIT} colleges.
          </p>
        </div>

        <div className="compare-header-actions">
          {/* Quick Add Selector */}
          {detailedColleges.length < MAX_COMPARE_LIMIT && (
            <div className="quick-add-container">
              <select
                value={selectedAddId}
                onChange={handleAddCollegeSelect}
                className="form-select text-sm"
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
              >
                <option value="">+ Add College to Compare</option>
                {availableColleges
                  .filter((c) => !selectedColleges.some((s) => s.id === c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city})
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button onClick={clearCompare} className="btn btn-outline btn-sm">
            Clear All
          </button>

          <Link to="/colleges" className="btn btn-primary btn-sm">
            + Browse More
          </Link>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="compare-col-header param-col">Parameters</th>
              {detailedColleges.map((college) => (
                <th key={college.id} className="compare-col-header college-col">
                  <div className="compare-card-head">
                    <button
                      onClick={() => removeCompare(college.id)}
                      className="compare-remove-btn"
                      title="Remove from comparison"
                    >
                      <X size={16} />
                    </button>

                    <div className="compare-logo-box">
                      {college.logo ? (
                        <img
                          src={college.logo}
                          alt={college.name}
                          className="compare-logo-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <Building2
                        size={32}
                        className="text-blue-600 opacity-80"
                        style={{ display: college.logo ? 'none' : 'block' }}
                      />
                    </div>

                    <h3 className="compare-college-title">{college.name}</h3>

                    <p className="compare-college-sub">
                      <MapPin size={13} />
                      {college.city}, {college.state}
                    </p>

                    <Link
                      to={`/colleges/${college.id}`}
                      className="btn btn-outline btn-sm w-full mt-3 flex items-center justify-center gap-1 text-xs"
                    >
                      <span>View Profile</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* ROW: Location */}
            <tr>
              <td className="param-label">
                <div className="param-title">
                  <MapPin size={16} className="text-blue-600" />
                  <span>Location</span>
                </div>
              </td>
              {detailedColleges.map((college) => (
                <td key={college.id} className="compare-cell">
                  <span className="font-medium text-gray-900">{college.city}</span>, {college.state}
                  {college.address && (
                    <p className="text-xs text-gray-500 mt-1">{college.address}</p>
                  )}
                </td>
              ))}
            </tr>

            {/* ROW: University */}
            <tr>
              <td className="param-label">
                <div className="param-title">
                  <GraduationCap size={16} className="text-blue-600" />
                  <span>University / Affiliation</span>
                </div>
              </td>
              {detailedColleges.map((college) => (
                <td key={college.id} className="compare-cell font-medium">
                  {college.university || 'N/A'}
                </td>
              ))}
            </tr>

            {/* ROW: College Type */}
            <tr>
              <td className="param-label">
                <div className="param-title">
                  <Building2 size={16} className="text-blue-600" />
                  <span>College Type</span>
                </div>
              </td>
              {detailedColleges.map((college) => (
                <td key={college.id} className="compare-cell">
                  <span className="badge badge-purple">
                    {college.college_type || 'N/A'}
                  </span>
                </td>
              ))}
            </tr>

            {/* ROW: Rating */}
            <tr>
              <td className="param-label">
                <div className="param-title">
                  <Star size={16} className="text-amber-500" />
                  <span>Rating</span>
                </div>
              </td>
              {detailedColleges.map((college) => {
                const isTop = college.id === topRatingId;
                return (
                  <td key={college.id} className="compare-cell">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-gold text-sm font-semibold">
                        ⭐ {college.rating ? college.rating.toFixed(1) : 'N/A'} / 5.0
                      </span>
                      {isTop && (
                        <span className="top-performer-tag">
                          Top Rated
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* ROW: Established Year */}
            <tr>
              <td className="param-label">
                <div className="param-title">
                  <Calendar size={16} className="text-blue-600" />
                  <span>Established Year</span>
                </div>
              </td>
              {detailedColleges.map((college) => (
                <td key={college.id} className="compare-cell font-medium">
                  {college.established_year || 'N/A'}
                </td>
              ))}
            </tr>

            {/* ROW: Courses Offered */}
            <tr>
              <td className="param-label">
                <div className="param-title">
                  <BookOpen size={16} className="text-blue-600" />
                  <span>Offered Courses</span>
                </div>
              </td>
              {detailedColleges.map((college) => {
                const courses = college.courses || [];
                return (
                  <td key={college.id} className="compare-cell">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-2">
                      {courses.length} Program{courses.length !== 1 ? 's' : ''} Available
                    </span>
                    <ul className="compare-courses-list">
                      {courses.slice(0, 4).map((cr) => (
                        <li key={cr.id} className="compare-course-item">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span>
                            <strong>{cr.degree}</strong> in {cr.course_name}
                          </span>
                        </li>
                      ))}
                      {courses.length > 4 && (
                        <li className="text-xs text-gray-500 italic mt-1">
                          + {courses.length - 4} more courses
                        </li>
                      )}
                    </ul>
                  </td>
                );
              })}
            </tr>

            {/* ROW: Tuition Fees */}
            <tr>
              <td className="param-label">
                <div className="param-title">
                  <IndianRupee size={16} className="text-emerald-600" />
                  <span>Tuition Fees Range</span>
                </div>
              </td>
              {detailedColleges.map((college) => {
                const courses = college.courses || [];
                if (courses.length === 0) {
                  return (
                    <td key={college.id} className="compare-cell text-gray-400">
                      N/A
                    </td>
                  );
                }
                const feeVals = courses.map((c) => c.fees).filter((f) => f > 0);
                const minFee = feeVals.length > 0 ? Math.min(...feeVals) : 0;
                const maxFee = feeVals.length > 0 ? Math.max(...feeVals) : 0;

                return (
                  <td key={college.id} className="compare-cell font-semibold text-gray-900">
                    {minFee === maxFee ? (
                      <span>₹{minFee.toLocaleString('en-IN')} / yr</span>
                    ) : (
                      <span>
                        ₹{minFee.toLocaleString('en-IN')} - ₹{maxFee.toLocaleString('en-IN')} / yr
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* ROW: Average Package */}
            <tr className="highlight-row">
              <td className="param-label">
                <div className="param-title">
                  <Briefcase size={16} className="text-blue-600" />
                  <span>Average Package</span>
                </div>
              </td>
              {detailedColleges.map((college) => {
                const avg = college.placement?.average_package;
                const isHighestAvg = college.id === highestAvgId;
                return (
                  <td key={college.id} className="compare-cell">
                    {avg ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{avg} LPA
                        </span>
                        {isHighestAvg && (
                          <span className="top-performer-tag">
                            Highest Avg
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Data Pending</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* ROW: Highest Package */}
            <tr className="highlight-row">
              <td className="param-label">
                <div className="param-title">
                  <Award size={16} className="text-emerald-600" />
                  <span>Highest Package</span>
                </div>
              </td>
              {detailedColleges.map((college) => {
                const highest = college.placement?.highest_package;
                return (
                  <td key={college.id} className="compare-cell">
                    {highest ? (
                      <span className="text-lg font-bold text-emerald-600">
                        ₹{highest} LPA
                      </span>
                    ) : (
                      <span className="text-gray-400">Data Pending</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* ROW: Placement Percentage */}
            <tr>
              <td className="param-label">
                <div className="param-title">
                  <Award size={16} className="text-blue-600" />
                  <span>Placement Rate</span>
                </div>
              </td>
              {detailedColleges.map((college) => {
                const pct = college.placement?.placement_percentage;
                const isHighestPct = college.id === highestPctId;
                return (
                  <td key={college.id} className="compare-cell">
                    {pct ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{pct}%</span>
                        {isHighestPct && (
                          <span className="top-performer-tag">
                            Top Placement Rate
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Data Pending</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* ROW: Recruiting Companies */}
            <tr>
              <td className="param-label">
                <div className="param-title">
                  <Briefcase size={16} className="text-gray-600" />
                  <span>Top Recruiters</span>
                </div>
              </td>
              {detailedColleges.map((college) => {
                const recruiters = college.placement?.recruiting_companies;
                if (!recruiters) {
                  return (
                    <td key={college.id} className="compare-cell text-gray-400">
                      N/A
                    </td>
                  );
                }
                const compList = recruiters.split(',').map((s) => s.trim());
                return (
                  <td key={college.id} className="compare-cell">
                    <div className="flex flex-wrap gap-1">
                      {compList.map((comp, idx) => (
                        <span key={idx} className="recruiter-badge text-xs">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
