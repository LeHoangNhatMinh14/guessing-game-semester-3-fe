import React from "react";
import "../css/ThemeDisplay.css";

function ThemeDisplay({ theme, onSelectTheme, 'data-cy': dataCy }) {
  return (
    <div className="theme-card" data-cy={dataCy}>
      <h2 className="theme-name" data-cy={`theme-name-${theme.name}`}>{theme.name}</h2>
      <button
        className="select-theme-button"
        data-cy={`select-theme-button-${theme.name}`}
        onClick={() => onSelectTheme(theme)}
      >
        Select Theme
      </button>
    </div>
  );
}

export default ThemeDisplay;
