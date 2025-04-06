import React, { useState, useEffect, useContext } from "react";
import PlayerApi from "../components/apiCalls/PlayerService";
import GameApi from "../components/apiCalls/GameService";
import { AuthContext } from "../components/AuthContext";
import "../css/ProfilePage.css";
import PlayerGameHistory from "../components/profilePage/PlayerGameHistory";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [gameStats, setGameStats] = useState({
    totalCorrectGuesses: 0,
    totalWrongGuesses: 0,
    accuracy: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "" });

  const playerApi = new PlayerApi();
  const gameApi = new GameApi();

  useEffect(() => {
    if (user && user.id) {
      fetchPlayerDetails(user.id);
      fetchGameStats(user.id);
    }
  }, [user]);

  const fetchPlayerDetails = async (id) => {
    try {
      const details = await playerApi.getPlayerById(id);
      setPlayerDetails({ ...details, username: details.name || "Unknown Player" });
      setFormData({ username: details.name || "Unknown Player" });
    } catch (error) {
      console.error("Error fetching player details:", error);
    }
  };

  const fetchGameStats = async (playerId) => {
    try {
      const gameHistory = await gameApi.getPlayerGameHistory(playerId);
      const totalCorrectGuesses = gameHistory.games.reduce(
        (total, game) => total + (game.correctGuesses || 0),
        0
      );
      const totalWrongGuesses = gameHistory.games.reduce(
        (total, game) => total + (game.wrongGuesses || 0),
        0
      );
      const totalGuesses = totalCorrectGuesses + totalWrongGuesses;
      const accuracy = totalGuesses > 0 ? ((totalCorrectGuesses / totalGuesses) * 100).toFixed(2) : 0;

      setGameStats({
        totalCorrectGuesses,
        totalWrongGuesses,
        accuracy,
      });
    } catch (error) {
      console.error("Error fetching game stats:", error);
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
          <p>
            <strong>Username:</strong> <span className="bright-username">{playerDetails.username}</span>
          </p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}

      {/* Game Stats Section */}
      <div className="game-stats">
        <h2>Game Stats</h2>
        <div className="stats-row">
          <p><strong>Total Correct Guesses:</strong> {gameStats.totalCorrectGuesses}</p>
          <p><strong>Total Wrong Guesses:</strong> {gameStats.totalWrongGuesses}</p>
        </div>
        <p className="accuracy"><strong>Accuracy:</strong> {gameStats.accuracy}%</p>
      </div>
      {/* Game History Section */}
      <PlayerGameHistory playerId={user.id} />
    </div>
  );
};

export default ProfilePage;
