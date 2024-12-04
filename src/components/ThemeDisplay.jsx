import React from 'react';

const ThemeDisplay = ({ theme, onSelectTheme }) => {
  return (
    <div className="theme-card">
      <h3>{theme.name}</h3>
      <button onClick={() => onSelectTheme(theme)}>Select Theme</button>
    </div>
  );
};

export default ThemeDisplay;
