import React, { useState, useEffect } from 'react';
import { X, Building2, Save } from 'lucide-react';

export default function CollegeFormModal({ isOpen, onClose, onSubmit, collegeToEdit, submitting }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    state: '',
    address: '',
    college_type: 'Private',
    university: '',
    established_year: '',
    website: '',
    rating: 4.0
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (collegeToEdit) {
      setFormData({
        name: collegeToEdit.name || '',
        description: collegeToEdit.description || '',
        city: collegeToEdit.city || '',
        state: collegeToEdit.state || '',
        address: collegeToEdit.address || '',
        college_type: collegeToEdit.college_type || 'Private',
        university: collegeToEdit.university || '',
        established_year: collegeToEdit.established_year || '',
        website: collegeToEdit.website || '',
        rating: collegeToEdit.rating || 4.0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        city: '',
        state: '',
        address: '',
        college_type: 'Private',
        university: '',
        established_year: '',
        website: '',
        rating: 4.0
      });
    }
    setError(null);
  }, [collegeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('College name is required.');
      return;
    }
    if (!formData.city.trim()) {
      setError('City is required.');
      return;
    }
    if (!formData.state.trim()) {
      setError('State is required.');
      return;
    }

    const payload = {
      ...formData,
      established_year: formData.established_year ? Number(formData.established_year) : None,
      rating: Number(formData.rating)
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container max-w-2xl">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Building2 className="text-blue-600" size={20} />
            <h3 className="modal-title font-bold text-lg text-gray-900">
              {collegeToEdit ? 'Edit College Details' : 'Add New College'}
            </h3>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="error-banner m-4 mb-0">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-body p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group col-span-2">
              <label className="form-label">College Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. IIT Madras"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                className="form-input"
                placeholder="e.g. Chennai"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                name="state"
                className="form-input"
                placeholder="e.g. Tamil Nadu"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College Type</label>
              <select
                name="college_type"
                className="form-select"
                value={formData.college_type}
                onChange={handleChange}
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Autonomous">Autonomous</option>
                <option value="Deemed">Deemed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">University / Board</label>
              <input
                type="text"
                name="university"
                className="form-input"
                placeholder="e.g. Anna University"
                value={formData.university}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Established Year</label>
              <input
                type="number"
                name="established_year"
                className="form-input"
                placeholder="e.g. 1959"
                value={formData.established_year}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rating (0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                className="form-input"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>

            <div className="form-group col-span-2">
              <label className="form-label">Website URL</label>
              <input
                type="url"
                name="website"
                className="form-input"
                placeholder="https://www.college.edu.in"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-group col-span-2">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="Campus address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group col-span-2">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                rows={3}
                className="form-input"
                placeholder="Overview description..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm flex items-center gap-1" disabled={submitting}>
              <Save size={15} />
              <span>{submitting ? 'Saving...' : collegeToEdit ? 'Save Changes' : 'Create College'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
