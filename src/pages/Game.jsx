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
    setGameId,
    time,
    setTime,
  } = useContext(GameContext);

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (!theme || !theme.id) {
      navigate("/choose-theme");
      return;
    }

    const startNewGame = async () => {
      try {
        if (!user?.id) {
          console.error("User ID is required to start the game.");
          setLoading(false);
          return;
        }

        if (!wordList || wordList.length === 0) {
          const fetchedWords = await ThemeService.fetchWords(theme.id);
          setWordList(fetchedWords);
        }

        const response = await gameService.startGame(user.id);
        setGameId(response.gameId); // Update context with the game ID

        setScore(0); // Reset score
        setTime(0); // Reset time
        startTimer();
        setLoading(false);
      } catch (error) {
        console.error("Error starting game: ", error);
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
      if (timer) clearInterval(timer); // Clear timer on unmount
    };
  }, [theme, navigate, setLives, setWordList, user, wordList]);

  useEffect(() => {
    if (gameOver && timer) {
      clearInterval(timer); // Stop timer when the game ends
      setTimer(null); // Reset timer reference
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
