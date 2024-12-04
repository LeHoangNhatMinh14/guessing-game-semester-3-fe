import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameService from "../components/apiCalls/GameService";
import ThemeService from "../components/apiCalls/ThemeService";
import { GameContext } from "../components/GameContext";
import { AuthContext } from "../components/AuthContext"; 

function Game() {
  const navigate = useNavigate();
  const gameService = new GameService(); 

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

  const { user } = useContext(AuthContext); // Get user data (e.g., playerId) from AuthContext

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordList, setWordList] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    console.log("Game component mounted");
    console.log("Game context values on mount: ", { lives, theme, score });
    console.log("Current User:", user);

    if (!theme || !theme.id) {
      console.warn("No theme set, redirecting to ChooseTheme");
      navigate("/choose-theme");
      return;
    }

    // Fetch theme words from backend
    const startNewGame = async () => {
      try {
        console.log("Starting a new game...");
        
        if (!theme?.id) {
          console.error("Theme is missing. Redirecting to choose theme.");
          navigate("/choose-theme");
          return;
        }
    
        // Fetch theme words
        const fetchedWords = await ThemeService.fetchWords(theme.id);
        console.log("Fetched words for theme:", fetchedWords);
        setWordList(fetchedWords);
    
        setLives(3); // Set initial lives
    
        // Start a new game if user is logged in
        if (user?.id) {
          const startGameRequest = { playerId: user.id };
          console.log("Start Game Request:", startGameRequest);
    
          const response = await gameService.startGame(startGameRequest.playerId);
          console.log("Game started successfully:", response);
    
          setGameId(response.gameId); // Save game ID
        } else {
          console.warn("User not logged in. Skipping game start.");
        }
    
        setStartTime(Date.now());
      } catch (error) {
        console.error("Error starting game or fetching words:", error.response?.data || error.message);
      }
    };

    startNewGame();
  }, [theme, navigate, setLives, user]);

  useEffect(() => {
    console.log("Updated word list: ", wordList);
  }, [wordList]);

  useEffect(() => {
    if (lives <= 0 && !gameOver) {
      handleGameEnd("You lost the game!", "COMPLETED");
    } else if (currentWordIndex >= wordList.length && wordList.length > 0 && !gameOver) {
      handleGameEnd("You won the game!", "COMPLETED");
    }
  }, [lives, currentWordIndex, gameOver, wordList]);

  const handleGuess = () => {
    if (currentGuess.toLowerCase() === wordList[currentWordIndex].toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      setCorrectGuesses((prev) => prev + 1);
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setCurrentGuess("");
      console.log("Correct guess! Score updated: ", score + 1);
    } else {
      setLives((prevLives) => prevLives - 1);
      setIncorrectGuesses((prev) => prev + 1);
      console.log("Incorrect guess. Lives left: ", lives - 1);
    }
  };

  const handleGameEnd = (message, status) => {
    const endTime = Date.now();
    const totalTime = Math.round((endTime - startTime) / 1000);

    if (user && gameId) {
      // Only save the game if the user is logged in and gameId is available
      const endGameRequest = {
        gameId: gameId,
        score: score,
        time: totalTime,
        status: status, // Status of the game (e.g., "COMPLETED")
        correctGuesses: correctGuesses,
        incorrectGuesses: incorrectGuesses,
      };

      // End the game using the API
      gameService.endGame(endGameRequest)
        .then(response => {
          console.log("Game saved: ", response);
        })
        .catch(error => {
          console.error("Error ending game: ", error);
        });
    } else {
      console.log("Game not saved as the user is not logged in.");
    }

    setGameOver(true);
    setGameOverMessage(message);
    console.log("Game ended: ", message);
  };

  const handleReturnToStart = () => {
    setGameOver(false);
    setScore(0);
    setLives(0);
    setCorrectGuesses(0);
    setIncorrectGuesses(0);
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
      <h1>Theme: {theme.name}</h1>
      <h2>Lives: {lives}</h2>
      <h2>Score: {score}</h2>
      <h3>Correct Guesses: {correctGuesses}</h3>
      <h3>Incorrect Guesses: {incorrectGuesses}</h3>
      {wordList.length > 0 && currentWordIndex < wordList.length ? (
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

export default Game;
