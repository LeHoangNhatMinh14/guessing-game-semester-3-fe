import React, { createContext, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [lives, setLives] = useState(0);
  const [theme, setTheme] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");

  return (
    <GameContext.Provider
      value={{
        lives,
        setLives,
        theme,
        setTheme,
        score,
        setScore,
        gameOver,
        setGameOver,
        gameOverMessage,
        setGameOverMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
