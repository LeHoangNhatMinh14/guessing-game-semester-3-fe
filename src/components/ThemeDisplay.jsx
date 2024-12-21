import React from "react";
import "../css/ThemeDisplay.css";

function ThemeDisplay({ theme, onSelectTheme }) {
  return (
    <div className="theme-card">
      <h2 className="theme-name">{theme.name}</h2>
      <button className="select-theme-button" onClick={() => onSelectTheme(theme)}>
        Select Theme
      </button>
    </div>
  );
}

export default ThemeDisplay;
