import React, { Component } from "react";
import ThemeService from "../components/ThemeService";
import "../css/ThemeManagerPage.css";

class ThemeManagerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      themeName: "",
      word: "",
      selectedThemeId: "",
      themes: [],
      words: [],
      notification: ""
    };
  }

  componentDidMount() {
    this.fetchThemes();
  }

  fetchThemes = async () => {
    try {
      const themes = await ThemeService.fetchThemes();
      this.setState({ themes });
    } catch (error) {
      this.setNotification("Failed to fetch themes.");
    }
  };

  createTheme = async () => {
    const { themeName } = this.state;
    if (!themeName.trim()) {
      this.setNotification("Theme name cannot be empty.");
      return;
    }
    try {
      const data = await ThemeService.createTheme(themeName);
      this.setNotification(data);
      this.setState({ themeName: "" });
      this.fetchThemes(); // Refresh themes list after creation
    } catch (error) {
      this.setNotification("An error occurred while creating the theme.");
    }
  };

  addWordToTheme = async () => {
    const { word, selectedThemeId } = this.state;
    if (!word.trim() || !selectedThemeId) {
      this.setNotification("Both word and theme must be selected.");
      return;
    }

    try {
      const data = await ThemeService.addWordToTheme(selectedThemeId, word);
      this.setNotification(`Word "${word}" added to theme!`);
      this.setState({ word: "" });
      this.fetchWords(); // Refresh words list after adding a word
    } catch (error) {
      this.setNotification("An error occurred while adding the word.");
    }
  };

  fetchWords = async () => {
    const { selectedThemeId } = this.state;
    if (!selectedThemeId) {
      this.setNotification("Please select a theme.");
      return;
    }

    try {
      const words = await ThemeService.fetchWords(selectedThemeId);
      this.setState({ words });
      this.setNotification(`Fetched words for theme ID ${selectedThemeId}`);
    } catch (error) {
      this.setNotification("No words found for this theme.");
      this.setState({ words: [] });
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  setNotification = (message) => {
    this.setState({ notification: message });
    setTimeout(() => this.setState({ notification: "" }), 5000); // Clears notification after 5 seconds
  };

  render() {
    const { themeName, word, selectedThemeId, themes, words, notification } = this.state;
    return (
      <div>
        <h1>Admin Page</h1>
        {notification && <div className="notification">{notification}</div>}

        <div>
          <h2>Create Theme</h2>
          <input
            type="text"
            placeholder="Theme Name"
            name="themeName"
            value={themeName}
            onChange={this.handleInputChange}
          />
          <button className="CreateThemeButton" onClick={this.createTheme}>Create Theme</button>
        </div>

        <div>
          <h2>Add Word to Theme</h2>
          <input
            type="text"
            placeholder="Word"
            name="word"
            value={word}
            onChange={this.handleInputChange}
          />

          <select
            name="selectedThemeId"
            value={selectedThemeId}
            onChange={this.handleInputChange}
          >
            <option value="">Select a theme</option>
            {themes.map(theme => (
              <option key={theme.id} value={theme.id}>{theme.name}</option>
            ))}
          </select>
          <button onClick={this.addWordToTheme}>Add Word</button>
        </div>

        <div>
          <h2>Words in Selected Theme</h2>
          <button onClick={this.fetchWords}>Fetch Words</button>
          <ul>
            {words.map((w, index) => (
              <li key={index}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default ThemeManagerPage;