import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "./GameContext";
import GameApi from "../apiCalls/GameService";

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
    time,
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
    const currentWord = wordList[currentWordIndex]?.word;

    if (currentGuess.trim().toLowerCase() === currentWord?.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      setCorrectGuesses((prev) => prev + 1);
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setCurrentGuess("");
    } else {
      setLives((prevLives) => prevLives - 1);
      setIncorrectGuesses((prev) => prev + 1);
    }
  };

  const handleGameEnd = async (message) => {
    setGameOver(true);
    setGameOverMessage(message);

    const storedGameId = localStorage.getItem("gameId"); // Retrieve gameId
    if (!storedGameId) {
      console.error("No gameId found in localStorage");
      return;
    }

    const endGameRequest = {
      gameId: storedGameId,
      correctGuesses,
      incorrectGuesses,
      time,
      status: message === "You won the game!" ? "COMPLETED" : "FAILED",
    };

    try {
      await new GameApi().endGame(endGameRequest); // Use GameApi instance
      console.log("Game results saved successfully.");
      localStorage.removeItem("gameId"); // Clean up after ending the game
    } catch (error) {
      console.error("Error saving game results:", error);
    }
  };

  return (
    <div>
      <h1>Lives: {lives}</h1>
      <h2>Score: {score}</h2>
      <h3>Time: {time} seconds</h3> {/* Display elapsed time */}
      <h3>Correct Guesses: {correctGuesses}</h3>
      <h3>Incorrect Guesses: {incorrectGuesses}</h3>
      {wordList?.length > 0 && currentWordIndex < wordList.length ? (
        <>
          {wordList[currentWordIndex]?.imageUrl && (
            <img
              src={wordList[currentWordIndex].imageUrl}
              alt={`Hint for ${wordList[currentWordIndex].word}`}
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <h3>Current Word: {wordList[currentWordIndex]?.word}</h3>
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
