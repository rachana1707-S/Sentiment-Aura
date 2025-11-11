import React from 'react';
import '../component_css/ThemeToggle.css';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
      <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
        <div className="toggle-thumb">
          <span className="toggle-icon">{isDark ? '🌙' : '☀️'}</span>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;