import React, { useContext, useEffect, useState } from "react";
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
    score,
    setScore,
    gameOver,
    setGameOver,
    setGameOverMessage,
    wordList,
    setWordList,
    setGameId,
    time,
    setTime,
  } = useContext(GameContext);

  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (!user) {
      console.error("User not authenticated. Redirecting to login.");
      navigate("/login");
      return;
    }

    if (!theme || (!theme.id && !theme.name)) {
      console.error("Theme is not properly set. Redirecting to choose theme.");
      navigate("/choose-theme");
      return;
    }

    const startNewGame = async () => {
      try {
        // Fetch words for the selected theme
        const fetchedWords = await ThemeService.fetchWords(theme.id, theme.name);
        setWordList(fetchedWords);

        // Start the game by sending playerID and themeID
        const response = await gameService.startGame(user.id, theme.id);
        setGameId(response.gameId);

        setScore(0);
        setTime(0);
        startTimer();
        setLoading(false);
      } catch (error) {
        console.error("Error starting game:", error);
        setLoading(false);
      }
    };

    const startTimer = () => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setTime(elapsedTime);
      }, 1000);
      setTimer(interval);
    };

    startNewGame();

    return () => {
      if (timer) clearInterval(timer); // Cleanup timer
    };
  }, [user, theme, navigate, setWordList, setGameId]);

  useEffect(() => {
    if (gameOver && timer) {
      clearInterval(timer); // Stop the timer when the game ends
      setTimer(null);
    }
  }, [gameOver, timer]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (gameOver) {
    return <GameEnd />;
  }

  return <GamePlay />;
}

export default Game;
