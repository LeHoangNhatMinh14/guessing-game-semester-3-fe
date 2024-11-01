import React from "react";
import { NavLink } from "react-router-dom";

function ChooseTheme() {
  return (
    <div>
      <h1>Choose Theme</h1>
      <button><NavLink to="/game">Animals</NavLink></button>
      <button><NavLink to="/game">Cities</NavLink></button>
      <button><NavLink to="/game">Nature</NavLink></button>
    </div>
  );
}

export default ChooseTheme;
