import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UnauthorizedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect the user to the profile page after the component mounts
    navigate("/");
  }, [navigate]);

  return null; // Return null since we are redirecting immediately
}

export default UnauthorizedPage;
