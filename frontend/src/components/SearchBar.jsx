// src/components/SearchBar.jsx

import React, { useState, useRef, useEffect } from "react";

const SearchBar = ({
  onSearch,
  onLocationClick,
  onInputChange,
  suggestions = [],
  suggestionsLoading = false,
  onSuggestionSelect,
  onClearSuggestions,
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    onInputChange?.(v);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSearch({ city: trimmed });
      onClearSuggestions?.();
    }
  };

  const handleSuggestionClick = (sug) => {
    const label = sug.state ? `${sug.name}, ${sug.state}, ${sug.country}` : `${sug.name}, ${sug.country}`;
    setValue(label);
    onSuggestionSelect?.(sug);
    onClearSuggestions?.();
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClearSuggestions?.();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClearSuggestions]);

  return (
    <div ref={containerRef} className="search-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Search city…"
            className="search-input"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" className="search-btn">
            Fetch
          </button>
          <button
            type="button"
            onClick={onLocationClick}
            className="location-btn"
            title="Use my location"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="8" />
            </svg>
          </button>
        </div>
      </form>

      {(suggestions.length > 0 || suggestionsLoading) && (
        <ul className="suggestions-list">
          {suggestionsLoading && (
            <li className="suggestion-loading">Searching…</li>
          )}
          {suggestions.map((sug, i) => (
            <li key={i} className="suggestion-item" onClick={() => handleSuggestionClick(sug)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="suggestion-pin">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="suggestion-name">{sug.name}</span>
              {sug.state && <span className="suggestion-state">{sug.state}</span>}
              <span className="suggestion-country">{sug.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
