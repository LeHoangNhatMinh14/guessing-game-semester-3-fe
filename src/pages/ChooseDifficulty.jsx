import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../components/game/GameContext";

function ChooseDifficulty() {
  const navigate = useNavigate();
  const { setLives } = useContext(GameContext);

  const handleDifficulty = (difficulty) => {
    let lives;
    switch (difficulty) {
      case "Easy":
        lives = 10;
        break;
      case "Medium":
        lives = 5;
        break;
      case "Hard":
        lives = 2;
        break;
      default:
        lives = 5;
    }
    setLives(lives);
    navigate("/choose-theme");
  };

  return (
    <div>
      <h1 data-cy="difficulty-title">Choose Difficulty</h1>
      <button data-cy="difficulty-easy" onClick={() => handleDifficulty("Easy")}>Easy</button>
      <button data-cy="difficulty-medium" onClick={() => handleDifficulty("Medium")}>Medium</button>
      <button data-cy="difficulty-hard" onClick={() => handleDifficulty("Hard")}>Hard</button>
    </div>
  );
}

export default ChooseDifficulty;
