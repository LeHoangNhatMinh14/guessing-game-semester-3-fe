import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "./GameContext";
import GameApi from "../apiCalls/GameService"; // Adjust the path if needed

const gameService = new GameApi(); // Ensure instance creation

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
    gameId,
  } = useContext(GameContext);

  const [currentGuess, setCurrentGuess] = useState("");

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

    const endGameRequest = {
      gameId,
      correctGuesses,
      incorrectGuesses,
      time,
      status: message === "You won the game!" ? "COMPLETED" : "FAILED",
    };

    try {
      await gameService.endGame(endGameRequest);
      console.log("Game results saved successfully.");
    } catch (error) {
      console.error("Error saving game results:", error);
    }
  };

  useEffect(() => {
    if (lives <= 0) {
      handleGameEnd("You lost the game!");
    } else if (wordList?.length > 0 && currentWordIndex >= wordList.length) {
      handleGameEnd("You won the game!");
    }
  }, [lives, currentWordIndex, wordList]);

  // Calculate blur level based on the number of guesses
  const blurLevel = Math.floor(correctGuesses / 10) * 2; // Increment blur every 10 guesses by 2px

  const endGameManually = () => {
    handleGameEnd("Game ended by the user.");
  };

  return (
    <div>
      <h1>Lives: {lives}</h1>
      <h2>Score: {score}</h2>
      <h3>Time: {time} seconds</h3>
      <h3>Correct Guesses: {correctGuesses}</h3>
      <h3>Incorrect Guesses: {incorrectGuesses}</h3>
      {wordList?.length > 0 && currentWordIndex < wordList.length ? (
        <>
          <img
            src={wordList[currentWordIndex]?.imageUrl}
            alt={`Hint for ${wordList[currentWordIndex]?.word}`}
            style={{
              width: "100px",
              height: "100px",
              filter: `blur(${blurLevel}px)`, // Apply dynamic blur
            }}
          />
          <h3>Current Word: {wordList[currentWordIndex]?.word}</h3>
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
          />
          <button onClick={handleGuess}>Guess</button>
          <button onClick={endGameManually} style={{ marginLeft: "10px" }}>
            End Game
          </button>
        </>
      ) : (
        <p>Loading words...</p>
      )}
    </div>
  );
}

export default GamePlay;
