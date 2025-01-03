import React, { useState, useEffect } from "react";
import GameApi from "../apiCalls/GameService";
import "../../css/ProfilePage.css";

const PlayerGameHistory = ({ playerId }) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gameApi = new GameApi();

  useEffect(() => {
    if (playerId) {
      fetchGameHistory(playerId);
    }
  }, [playerId]);

  const fetchGameHistory = async (id) => {
    try {
      const history = await gameApi.getPlayerGameHistory(id);
      setGameHistory(Array.isArray(history) ? history.slice(0, 20) : history.games || []);
    } catch (err) {
      console.error("Error fetching game history:", err);
      setError("Failed to fetch game history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading game history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="game-history-container">
      <h2>Past 20 Games</h2>
      <div className="game-history-scrollable">
        {gameHistory.map((game, index) => {
          const totalGuesses = (game.correctGuesses || 0) + (game.wrongGuesses || 0);
          const guessPercentage = totalGuesses > 0 ? ((game.correctGuesses / totalGuesses) * 100).toFixed(2) : "N/A";

          return (
            <div key={game.id || index} className="game-history-item">
              <div className="game-row">
                <p><strong>GAME {index + 1}</strong></p>
                <p><strong>SCORE:</strong> {game.score}</p>
                <p><strong>TIME:</strong> {game.time} minutes</p>
                <p><strong>STATUS:</strong> {game.status}</p>
              </div>
              <div className="game-row">
                <p><strong>CORRECT GUESSES:</strong> {game.correctGuesses || 0}</p>
                <p><strong>INCORRECT GUESSES:</strong> {game.wrongGuesses || 0}</p>
                <p><strong>GUESS PERCENTAGE:</strong> {guessPercentage}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerGameHistory;
