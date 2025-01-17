import React, { useState, useEffect, useRef } from "react";
import ThemeService from "./apiCalls/ThemeService";

const ThemeCard = ({ theme, fetchThemes, setNotification }) => {
  const [word, setWord] = useState("");
  const [image, setImage] = useState(null);
  const [words, setWords] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef(null);

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
    setImage(event.target.files[0]);
  };

  const addWordToTheme = async () => {
    if (!word.trim()) {
      setNotification("Word cannot be empty.");
      return;
    }
    try {
      await ThemeService.addWordToTheme(theme.id, word, image);
      setNotification(`Word "${word}" added to theme "${theme.name}"!`);
      setWord("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchWords();
    } catch (error) {
      setNotification("An error occurred while adding the word.");
    }
  };

  const deleteWordFromTheme = async (wordToDelete) => {
    try {
      await ThemeService.deleteWordFromTheme(theme.id, wordToDelete);
      setNotification(`Word "${wordToDelete}" deleted from theme "${theme.name}".`);
      fetchWords();
    } catch (error) {
      setNotification("An error occurred while deleting the word.");
    }
  };

  const deleteTheme = async () => {
    if (window.confirm(`Are you sure you want to delete the theme "${theme.name}"?`)) {
      try {
        await ThemeService.deleteTheme(theme.id);
        setNotification(`Theme "${theme.name}" deleted successfully.`);
        fetchThemes();
      } catch (error) {
        setNotification("An error occurred while deleting the theme.");
      }
    }
  };

  useEffect(() => {
    if (!loaded) {
      fetchWords();
      setLoaded(true);
    }
  }, [loaded]);

  return (
    <div className="theme-card" data-cy={`theme-card-${theme.name}`}>
      <h3>{theme.name}</h3>
      <div className="button-group">
        <button
          onClick={deleteTheme}
          className="delete-theme-button"
          data-cy={`delete-theme-${theme.name}`}
        >
          Delete Theme
        </button>
        <button
          onClick={fetchWords}
          className="view-words-button"
          data-cy={`view-words-${theme.name}`}
        >
          View Words
        </button>
      </div>
      <div className="add-word-section">
        <input
          type="text"
          placeholder="Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="add-word-input"
          aria-label="Enter word"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="add-word-file-input"
        />
        <button
          onClick={addWordToTheme}
          className="add-word-button"
          data-cy={`add-word-${theme.name}`}
        >
          Add Word
        </button>
      </div>
      <ul className="words-list">
        {words.map((w) => (
          <li key={w.word} className="word-item" data-cy={`word-item-${w.word}`}>
            <span>{w.word}</span>
            <button
              onClick={() => deleteWordFromTheme(w.word)}
              className="delete-word-button"
              data-cy={`delete-word-${w.word}`}
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