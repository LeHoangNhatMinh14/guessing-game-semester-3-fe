import React, { createContext, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [lives, setLives] = useState(0);
  const [theme, setTheme] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [wordList, setWordList] = useState([]); // Add wordList and setWordList here
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);

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
        wordList,
        setWordList, // Ensure these are provided
        currentWordIndex,
        setCurrentWordIndex,
        correctGuesses,
        setCorrectGuesses,
        incorrectGuesses,
        setIncorrectGuesses,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
