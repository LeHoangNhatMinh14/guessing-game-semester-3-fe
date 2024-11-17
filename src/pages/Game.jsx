import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GameContext } from "../components/GameContext";

function Game() {
  const navigate = useNavigate();
  const {
    lives,
    setLives,
    theme,
    score,
    setScore,
    gameOver,
    setGameOver,
    gameOverMessage,
    setGameOverMessage,
  } = useContext(GameContext);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordList, setWordList] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    console.log("Game component mounted");
    console.log("Game context values on mount: ", { lives, theme, score });

    if (!theme) {
      console.warn("No theme set, redirecting to ChooseTheme");
      navigate("/choose-theme");
      return;
    }

    const themeWords = {
      Animals: ["Cat", "Dog", "Elephant"],
      Cities: ["London", "Paris", "New York"],
      Nature: ["Mountain", "River", "Forest"],
    };
    setWordList(themeWords[theme]);
    setStartTime(Date.now());
  }, [theme, navigate]);

  useEffect(() => {
    console.log("Updated word list: ", wordList);
  }, [wordList]);

  useEffect(() => {
    if (lives <= 0 && !gameOver) {
      handleGameEnd("You lost the game!");
    } else if (currentWordIndex >= wordList.length && wordList.length > 0 && !gameOver) {
      handleGameEnd("You won the game!");
    }
  }, [lives, currentWordIndex, gameOver, wordList]);

  const handleGuess = () => {
    if (currentGuess.toLowerCase() === wordList[currentWordIndex].toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setCurrentGuess("");
      console.log("Correct guess! Score updated: ", score + 1);
    } else {
      setLives((prevLives) => prevLives - 1);
      console.log("Incorrect guess. Lives left: ", lives - 1);
    }
  };

  const handleGameEnd = (message) => {
    const endTime = Date.now();
    const totalTime = Math.round((endTime - startTime) / 1000);

    const endGameRequest = {
      playerId: 1, // Replace with actual player ID
      score: score,
      timeTaken: totalTime,
      theme: theme,
    };

    // axios.post("/games/end", endGameRequest).then((response) => {
    //   console.log("Game saved: ", response.data);
    // });

    setGameOver(true);
    setGameOverMessage(message);
    console.log("Game ended: ", message);
  };

  const handleReturnToStart = () => {
    setGameOver(false);
    setScore(0);
    setLives(0); // Reset lives for a new game flow
    navigate("/");
  };

  if (gameOver) {
    return (
      <div>
        <h1>{gameOverMessage}</h1>
        <button onClick={handleReturnToStart}>Return to Start</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Theme: {theme}</h1>
      <h2>Lives: {lives}</h2>
      <h2>Score: {score}</h2>
      <h3>Current Word: {wordList[currentWordIndex]}</h3>
      <input
        type="text"
        value={currentGuess}
        onChange={(e) => setCurrentGuess(e.target.value)}
      />
      <button onClick={handleGuess}>Guess</button>
    </div>
  );
}

export default Game;
