import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "./GameContext";
import GameApi from "../apiCalls/GameService";
import "../../css/GamePlay.css";

const gameService = new GameApi();

function GamePlay() {
  const {
    lives,
    setLives,
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
  
    if (gameId) {
      const endGameRequest = {
        gameId,
        correctGuesses,
        incorrectGuesses,
        time,
        status: message === "You won the game!" ? "COMPLETED" : "FAILED",
      };
  
      try {
        await gameService.endGame(endGameRequest);
      } catch (error) {
        console.error("Error saving game results:", error);
      }
    }
  };  

  useEffect(() => {
    if (lives <= 0) {
      handleGameEnd("You lost the game!");
    } else if (wordList?.length > 0 && currentWordIndex >= wordList.length) {
      handleGameEnd("You won the game!");
    }
  }, [lives, currentWordIndex, wordList]);

  return (
    <div className="game-container" data-cy="game-container">
      <div className="top-stats">
        <h1 data-cy="lives">Lives: {lives}</h1>
      </div>
      <div className="top-right-stats">
        <h1 data-cy="correct-guesses">Correct Guesses: {correctGuesses}</h1>
        <h1 data-cy="incorrect-guesses">Incorrect Guesses: {incorrectGuesses}</h1>
      </div>
      <div className="time-container">
        <h3 data-cy="time">Time: {time} seconds</h3>
      </div>
      <div className="game-image-container">
        {wordList?.length > 0 && currentWordIndex < wordList.length ? (
          <img
            src={wordList[currentWordIndex]?.imageUrl}
            alt={`Hint for ${wordList[currentWordIndex]?.word}`}
            className="game-hint-image"
            data-cy="hint-image"
          />
        ) : (
          <p data-cy="loading-message">Loading words...</p>
        )}
      </div>
      <input
        type="text"
        value={currentGuess}
        onChange={(e) => setCurrentGuess(e.target.value)}
        placeholder="Enter your guess"
        data-cy="guess-input"
      />
      <div className="game-controls">
        <button onClick={handleGuess} data-cy="guess-button">Guess</button>
        <button
          onClick={() => handleGameEnd("Game ended by the user.")}
          data-cy="end-game-button"
        >
          End Game
        </button>
      </div>
    </div>
  );
}

export default GamePlay;
