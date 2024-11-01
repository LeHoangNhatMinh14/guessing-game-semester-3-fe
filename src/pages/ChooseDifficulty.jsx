import React from "react";
import { NavLink } from "react-router-dom";

function ChooseDifficulty() {
  return (
    <div>
      <h1>Choose Difficulty</h1>
      <button><NavLink to="/choose-theme">Easy</NavLink></button>
      <button><NavLink to="/choose-theme">Medium</NavLink></button>
      <button><NavLink to="/choose-theme">Hard</NavLink></button>
    </div>
  );
}

export default ChooseDifficulty;
