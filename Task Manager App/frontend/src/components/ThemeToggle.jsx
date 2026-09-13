import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      <div className="toggle-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </div>
      <span className="toggle-label">
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
    </div>
  );
};

export default ThemeToggle;