import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import LoginRegister from "../components/LoginRegister"; 
import '../css/StartingPage.css';

function StartingPage() {
  const { user } = useContext(AuthContext); // Get user data from AuthContext

  return (
    <div className="starting-page">
      <LoginRegister />
      <h1>PicGuessr</h1>
      <NavLink to="/choose-difficulty">
        <button>Play</button>
      </NavLink>
      <NavLink to="/Profile">
        <button className="profile-button">
          Profile
        </button>
      </NavLink>
      {/* Conditionally render the Admin button if the user has the ADMIN role */}
      {user && user.role === 'admin' && (
        <NavLink to="/admin">
          <button>Admin</button>
        </NavLink>
      )}
    </div>
  );
}

export default StartingPage;
