import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./GameContext";

function GameEnd() {
  const navigate = useNavigate();
  const {
    gameOverMessage,
    setGameOver,
    setScore,
    setLives,
    setCorrectGuesses,
    setIncorrectGuesses,
    setCurrentWordIndex,
    setWordList,
  } = useContext(GameContext);

  const handleReturnToStart = () => {
    setGameOver(false);
    setScore(0);
    setLives(5);
    setCorrectGuesses(0);
    setIncorrectGuesses(0);
    setCurrentWordIndex(0);
    setWordList([]);
    navigate("/");
  };

  return (
    <div>
      <h1>{gameOverMessage}</h1>
      <button onClick={handleReturnToStart}>Return to Start</button>
    </div>
  );
}

export default GameEnd;
