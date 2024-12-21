import React, { useContext, useState, useEffect } from "react";
import  { GameContext } from "./GameContext";

function GamePlay() {
  const {
    lives,
    setLives,
    score,
    setScore,
    wordList,
    currentWordIndex,
    setCurrentWordIndex,
    setGameOver,
    setGameOverMessage,
    correctGuesses,
    setCorrectGuesses,
    incorrectGuesses,
    setIncorrectGuesses,
  } = useContext(GameContext);

  const [currentGuess, setCurrentGuess] = useState("");

  useEffect(() => {
    if (lives <= 0) {
      handleGameEnd("You lost the game!");
    } else if (wordList?.length > 0 && currentWordIndex >= wordList.length) {
      handleGameEnd("You won the game!");
    }
  }, [lives, currentWordIndex, wordList]);

  const handleGuess = () => {
    if (currentGuess.toLowerCase() === wordList[currentWordIndex]?.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      setCorrectGuesses((prev) => prev + 1);
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setCurrentGuess("");
    } else {
      setLives((prevLives) => prevLives - 1);
      setIncorrectGuesses((prev) => prev + 1);
    }
  };

  const handleGameEnd = (message) => {
    setGameOver(true);
    setGameOverMessage(message);
  };

  return (
    <div>
      <h1>Lives: {lives}</h1>
      <h2>Score: {score}</h2>
      <h3>Correct Guesses: {correctGuesses}</h3>
      <h3>Incorrect Guesses: {incorrectGuesses}</h3>
      {wordList?.length > 0 && currentWordIndex < wordList.length ? (
        <>
          <h3>Current Word: {wordList[currentWordIndex]}</h3>
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
          />
          <button onClick={handleGuess}>Guess</button>
        </>
      ) : (
        <p>Loading words...</p>
      )}
    </div>
  );
}

export default GamePlay;
