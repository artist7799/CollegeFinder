import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

const STORAGE_KEY = 'collegefinder_compare_list';
const MAX_COMPARE_LIMIT = 4;

export function CompareProvider({ children }) {
  const [selectedColleges, setSelectedColleges] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading compare list from localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedColleges));
    } catch (e) {
      console.error('Error saving compare list to localStorage:', e);
    }
  }, [selectedColleges]);

  const isSelected = (id) => {
    return selectedColleges.some((c) => c.id === Number(id));
  };

  const toggleCompare = (college) => {
    const numericId = Number(college.id);
    if (isSelected(numericId)) {
      setSelectedColleges((prev) => prev.filter((c) => c.id !== numericId));
    } else {
      if (selectedColleges.length >= MAX_COMPARE_LIMIT) {
        alert(`You can compare up to ${MAX_COMPARE_LIMIT} colleges at a time.`);
        return;
      }
      setSelectedColleges((prev) => [...prev, {
        id: numericId,
        name: college.name,
        city: college.city,
        state: college.state,
        logo: college.logo,
        college_type: college.college_type,
        university: college.university,
        rating: college.rating
      }]);
    }
  };

  const removeCompare = (id) => {
    const numericId = Number(id);
    setSelectedColleges((prev) => prev.filter((c) => c.id !== numericId));
  };

  const addCompareByIds = (collegesList) => {
    setSelectedColleges((prev) => {
      const existingIds = new Set(prev.map(c => c.id));
      const newItems = collegesList.filter(c => !existingIds.has(Number(c.id)));
      const combined = [...prev, ...newItems];
      return combined.slice(0, MAX_COMPARE_LIMIT);
    });
  };

  const clearCompare = () => {
    setSelectedColleges([]);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedColleges,
        compareCount: selectedColleges.length,
        isSelected,
        toggleCompare,
        removeCompare,
        addCompareByIds,
        clearCompare,
        MAX_COMPARE_LIMIT
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
