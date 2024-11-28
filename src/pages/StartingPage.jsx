import React from "react";
import { NavLink } from "react-router-dom";
import '../css/StartingPage.css';
import LoginRegister from "../components/LoginRegister"; 

function StartingPage() {
  return (
    <div className="starting-page">
      <LoginRegister />
        <NavLink to="/Profile">
          <button className="profile-button">
            Profile
          </button>
        </NavLink>
      <h1>PicGuessr</h1>
      <NavLink to="/choose-difficulty"><button>Play</button></NavLink>
      <NavLink to="/admin"><button>Admin</button></NavLink>
    </div>
  );
}

export default StartingPage;
