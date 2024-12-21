import React, { useContext, useEffect } from "react";
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
  } = useContext(GameContext);

  const { user } = useContext(AuthContext);

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
          // Assuming `setGameId` is implemented correctly in GameContext
          setGameId(response.gameId);
        }

        setStartTime(Date.now());
      } catch (error) {
        console.error("Error starting game: ", error);
      }
    };

    startNewGame();
  }, [theme, navigate, setLives, setWordList, user, wordList]);

  if (gameOver) {
    return <GameEnd />;
  }

  return <GamePlay />;
}

export default Game;
