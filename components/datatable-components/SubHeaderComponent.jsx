import React from 'react'
import FilterComponent from './FilterComponent';

const SubHeaderComponent = ({ filterText, setFilterText }) => {
    const handleClear = () => {
      if (filterText) {
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  };

export default SubHeaderComponent