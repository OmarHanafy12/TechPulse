import React, { useRef } from 'react';
import { IconSearch } from '@tabler/icons-react';

const SearchBar = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handleTriggerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`tn-search-bar-wrap ${value ? 'has-value' : ''}`}>
      <button
        className="tn-search-bar-trigger"
        onClick={handleTriggerClick}
        aria-label="Search"
        type="button"
      >
        <IconSearch size={16} />
      </button>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search articles..."
        className="tn-search-bar-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="tn-search-bar-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
