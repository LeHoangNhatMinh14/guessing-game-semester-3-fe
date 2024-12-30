import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../components/game/GameContext";
import { AuthContext } from "../components/AuthContext";
import GamePlay from "../components/game/GamePlay";
import GameEnd from "../components/game/GameEnd";
import GameService from "../components/apiCalls/GameService";
import ThemeService from "../components/apiCalls/ThemeService";

function Game() {
  const navigate = useNavigate();
  const gameService = new GameService();

  const {
    lives,
    setLives,
    theme,
    score,
    setScore,
    gameOver,
    setGameOver,
    setGameOverMessage,
    wordList,
    setWordList,
    setGameId, // Added context for gameId
  } = useContext(GameContext);

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (!theme || !theme.id) {
      navigate("/choose-theme");
      return;
    }

    const startNewGame = async () => {
      try {
        if (!wordList || wordList.length === 0) {
          const fetchedWords = await ThemeService.fetchWords(theme.id);
          setWordList(fetchedWords);
        }

        if (user?.id) {
          const response = await gameService.startGame(user.id);
          setGameId(response.gameId);
        }

        setLives(3); // Initialize lives for the game
        setLoading(false); // Set loading to false once initialization is complete
      } catch (error) {
        console.error("Error starting game: ", error);
        setLoading(false); // Ensure loading is false even on error
      }
    };

    startNewGame();
  }, [theme, navigate, setLives, setWordList, user, wordList]);

  // Render loading indicator if loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render GameEnd or GamePlay based on game state
  if (gameOver) {
    return <GameEnd />;
  }

  return <GamePlay />;
}

export default Game;
