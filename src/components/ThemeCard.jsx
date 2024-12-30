import React, { useState, useEffect } from "react";
import ThemeService from "./apiCalls/ThemeService";

const ThemeCard = ({ theme, fetchThemes, setNotification }) => {
  const [word, setWord] = useState("");
  const [image, setImage] = useState(null);
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

  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Get the uploaded file
  };

  const addWordToTheme = async () => {
    if (!word.trim()) {
      setNotification("Word cannot be empty.");
      return;
    }
    try {
      await ThemeService.addWordToTheme(theme.id, word, image); // Include image in the API call
      setNotification(`Word "${word}" added to theme "${theme.name}"!`);
      setWord("");
      setImage(null); // Reset the image
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

  // Function to delete the theme
  const deleteTheme = async () => {
    if (window.confirm(`Are you sure you want to delete the theme "${theme.name}"?`)) {
      try {
        await ThemeService.deleteTheme(theme.id);
        setNotification(`Theme "${theme.name}" deleted successfully.`);
        fetchThemes(); // Refresh the list of themes after deletion
      } catch (error) {
        setNotification("An error occurred while deleting the theme.");
      }
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
      <div className="button-group">
        {/* Delete Theme Button */}
        <button onClick={deleteTheme} className="delete-theme-button">
          Delete Theme
        </button>
    
        {/* View Words Button */}
        <button onClick={fetchWords} className="view-words-button">
          View Words
        </button>
      </div>
  
      {/* Add Word Section */}
      <div className="add-word-section">
        <input
          type="text"
          placeholder="Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="add-word-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="add-word-file-input"
        />
        <button onClick={addWordToTheme} className="add-word-button">
          Add Word
        </button>
      </div>
  
      {/* Display Words */}
      <ul className="words-list">
        {words.map((w, index) => (
          <li key={index} className="word-item">
            <span>{w.word}</span>
            <button
              onClick={() => deleteWordFromTheme(w.word)}
              className="delete-word-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeCard;
