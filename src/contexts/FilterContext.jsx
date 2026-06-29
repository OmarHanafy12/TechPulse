import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const initialFilters = {
    topics: {},
    startDate: null,
    endDate: null,
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, handleClearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
