import React, { useState, useEffect } from "react";
import ThemeService from "./ThemeService";

const ThemeCard = ({ theme, fetchThemes, setNotification }) => {
  const [word, setWord] = useState("");
  const [words, setWords] = useState([]);

  // Function to fetch words for the current theme
  const fetchWords = async () => {
    try {
      const fetchedWords = await ThemeService.fetchWords(theme.id);
      setWords(fetchedWords);
    } catch (error) {
      setNotification("No words found for this theme.");
      setWords([]);
    }
  };

  // Function to add a new word to the theme
  const addWordToTheme = async () => {
    if (!word.trim()) {
      setNotification("Word cannot be empty.");
      return;
    }
    try {
      await ThemeService.addWordToTheme(theme.id, word);
      setNotification(`Word "${word}" added to theme "${theme.name}"!`);
      setWord("");
      fetchWords(); // Refresh the word list after adding
    } catch (error) {
      setNotification("An error occurred while adding the word.");
    }
  };

  // Function to delete a word from the theme
  const deleteWordFromTheme = async (wordToDelete) => {
    try {
      await ThemeService.deleteWordFromTheme(theme.id, wordToDelete);
      setNotification(`Word "${wordToDelete}" deleted from theme "${theme.name}".`);
      fetchWords(); // Refresh the word list after deletion
    } catch (error) {
      setNotification("An error occurred while deleting the word.");
    }
  };

  // useEffect to fetch words when the page is loaded if there are no words
  useEffect(() => {
    if (words.length === 0) {
      fetchWords(); // Call fetchWords on initial load if words are empty
    }
  }, []); // Empty dependency array to run only once on page load

  return (
    <div className="theme-card">
      <h3>{theme.name}</h3>

      {/* Automatically fetch words when this button is pressed */}
      <button onClick={fetchWords}>View Words</button>

      {/* Add Word Section */}
      <div>
        <input
          type="text"
          placeholder="Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button onClick={addWordToTheme}>Add Word</button>
      </div>

      {/* Display Words */}
      <ul>
        {words.map((w, index) => (
          <li key={index}>
            {w}{" "}
            <button onClick={() => deleteWordFromTheme(w)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeCard;
