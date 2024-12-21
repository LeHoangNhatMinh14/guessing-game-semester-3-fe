import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../components/game/GameContext";

function ChooseDifficulty() {
  const navigate = useNavigate();
  const { setLives, lives } = useContext(GameContext);

  useEffect(() => {
    console.log("ChooseDifficulty mounted");
  }, []);

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
    console.log("Lives set in ChooseDifficulty: ", lives);
    navigate("/choose-theme");
  };

  useEffect(() => {
    console.log("Lives from context in ChooseDifficulty after setting: ", lives);
  }, [lives]);

  return (
    <div>
      <h1>Choose Difficulty</h1>
      <button onClick={() => handleDifficulty("Easy")}>Easy</button>
      <button onClick={() => handleDifficulty("Medium")}>Medium</button>
      <button onClick={() => handleDifficulty("Hard")}>Hard</button>
    </div>
  );
}

export default ChooseDifficulty;