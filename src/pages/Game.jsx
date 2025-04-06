import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../components/game/GameContext";
import GamePlay from "../components/game/GamePlay";
import GameEnd from "../components/game/GameEnd";
import GameService from "../components/apiCalls/GameService";
import ThemeService from "../components/apiCalls/ThemeService";
import { AuthContext } from "../components/AuthContext";

function Game() {
  const navigate = useNavigate();
  const gameService = new GameService();
  const { user } = useContext(AuthContext);

  const {
    theme,
    setScore,
    setGameOver,
    setGameOverMessage,
    setWordList,
    setGameId,
    setTime,
    gameOver,
  } = useContext(GameContext);

  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null); // Store the active timer reference

  /**
   * Safely clears the active timer.
   */
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null; // Reset the reference
    }
  };

  /**
   * Starts a fresh game timer.
   */
  const startTimer = () => {
    clearTimer(); // Ensure any previous timer is stopped
    setTime(0); // Reset the timer state
    const startTime = Date.now(); // Record when the timer started
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time
      setTime(elapsed);
    }, 1000);
  };

  useEffect(() => {
    // Redirect if no theme is selected
    if (!theme || (!theme.id && !theme.name)) {
      console.error("Theme is not properly set. Redirecting to choose theme.");
      navigate("/choose-theme");
      return;
    }

    const startNewGame = async () => {
      try {
        // Fetch the words for the selected theme
        const fetchedWords = await ThemeService.fetchWords(theme.id, theme.name);
        setWordList(fetchedWords);

        if (user) {
          // For authenticated users, start a new game session
          const response = await gameService.startGame(user.id, theme.id);
          setGameId(response.gameId);
        }

        // Initialize the game state
        setScore(0);
        startTimer(); // Start the game timer
        setLoading(false);
      } catch (error) {
        console.error("Error starting game:", error);
        setLoading(false);
      }
    };

    startNewGame();

    return () => {
      clearTimer(); // Clean up the timer when the component unmounts
    };
  }, [user, theme, navigate, setWordList, setGameId]);

  useEffect(() => {
    // Stop the timer when the game ends
    if (gameOver) {
      clearTimer();
    }
  }, [gameOver]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (gameOver) {
    return <GameEnd />;
  }

  return <GamePlay />;
}

export default Game;
