import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

function AdminPage() {
  return (
    <div>
      <h1>Admin page</h1>
      <title>Theme Manager</title>
      <NavLink to="/themeManagement">
        <button>Theme Manager</button>
      </NavLink>
      <NavLink to="/stats">
        <button>Player stats</button>
      </NavLink>
    </div>
  )
}

export default AdminPage;
