import React from "react";
import { NavLink } from "react-router-dom";
import '../css/StartingPage.css';

function StartingPage() {
  return (
    <div className="starting-page">
      <h1>PicGuessr</h1>
      <NavLink to="/choose-difficulty"><button>Play</button></NavLink>
      <NavLink to="/admin"><button>Admin</button></NavLink>
    </div>
  );
}

export default StartingPage;
