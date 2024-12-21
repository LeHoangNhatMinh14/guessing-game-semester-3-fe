import React, { useState, useEffect, useContext } from "react";
import PlayerApi from "../components/apiCalls/PlayerService";
import { AuthContext } from "../components/AuthContext";
import "../css/ProfilePage.css";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
  });

  const playerApi = new PlayerApi();

  useEffect(() => {
    if (user && user.id) {
      console.log("Auth User Details:", user); // Log user details from AuthContext
      fetchPlayerDetails(user.id);
    }
  }, [user]);

  const fetchPlayerDetails = async (id) => {
    try {
      const details = await playerApi.getPlayerById(id);
      console.log("Fetched Player Details from API:", details); // Log player details from API
  
      // Use `details.name` directly for username
      const username = details.name || "Unknown Player";
      console.log("Resolved Username:", username); // Log resolved username
  
      setPlayerDetails({ ...details, username });
      setFormData({ username });
    } catch (error) {
      console.error("Error fetching player details:", error);
  
      // Fallback in case of an error
      setPlayerDetails({ username: "Unknown Player" });
      setFormData({ username: "Unknown Player" });
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    if (user && user.id) {
      try {
        await playerApi.updatePlayer(user.id, formData);
        setEditMode(false);
        fetchPlayerDetails(user.id);
      } catch (error) {
        console.error("Error updating player details:", error);
      }
    }
  };

  if (!playerDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      {editMode ? (
        <div className="profile-form">
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className="profile-details">
          <p><strong>Username:</strong> {playerDetails.username}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;