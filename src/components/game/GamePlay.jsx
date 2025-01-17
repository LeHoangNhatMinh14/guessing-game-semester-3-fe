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
    gameId, // gameId will be `null` for guest users
  } = useContext(GameContext);

  const [currentGuess, setCurrentGuess] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleGuess = () => {
    const currentWord = wordList[currentWordIndex]?.word;

    if (currentGuess.trim().toLowerCase() === currentWord?.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      setCorrectGuesses((prev) => prev + 1);
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setFeedback("Correct!");
      setCurrentGuess("");
    } else {
      setLives((prevLives) => prevLives - 1);
      setIncorrectGuesses((prev) => prev + 1);
      setFeedback("Wrong!");
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
        console.log("Game results saved successfully.");
      } catch (error) {
        console.error("Error saving game results:", error);
      }
    } else {
      console.log("Guest user: Game results are not saved.");
    }
  };

  useEffect(() => {
    if (lives <= 0) {
      handleGameEnd("You lost the game!");
    } else if (wordList?.length > 0 && currentWordIndex >= wordList.length) {
      handleGameEnd("You won the game!");
    }
  }, [lives, currentWordIndex, wordList]);

  const endGameManually = () => {
    handleGameEnd("Game ended by the user.");
  };

  return (
    <div data-cy="game-container">
      <h1 data-cy="lives">Lives: {lives}</h1>
      <h2 data-cy="score">Score: {score}</h2>
      <h3 data-cy="time">Time: {time} seconds</h3>
      <h3 data-cy="correct-guesses">Correct Guesses: {correctGuesses}</h3>
      <h3 data-cy="incorrect-guesses">Incorrect Guesses: {incorrectGuesses}</h3>
      {feedback && <p data-cy="feedback">{feedback}</p>}
      {wordList?.length > 0 && currentWordIndex < wordList.length ? (
        <>
          <img
            data-cy="hint-image"
            src={wordList[currentWordIndex]?.imageUrl}
            alt={`Hint for ${wordList[currentWordIndex]?.word}`}
            style={{
              width: "100px",
              height: "100px",
            }}
          />
          <input
            data-cy="guess-input"
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
          />
          <button data-cy="guess-button" onClick={handleGuess}>
            Guess
          </button>
          <button
            data-cy="end-game-button"
            onClick={endGameManually}
            style={{ marginLeft: "10px" }}
          >
            End Game
          </button>
        </>
      ) : (
        <p data-cy="loading">Loading words...</p>
      )}
    </div>
  );
}

export default GamePlay;
