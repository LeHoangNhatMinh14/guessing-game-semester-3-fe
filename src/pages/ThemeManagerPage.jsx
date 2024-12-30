import React, { Component } from "react";
import ThemeService from "../components/apiCalls/ThemeService";
import ThemeCard from "../components/ThemeCard";
import "../css/ThemeManagerPage.css";

class ThemeManagerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      themeName: "",
      themes: [],
      notification: "" // Keep notification only for theme creation
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
      this.setNotification(data);  // Display notification only for theme creation
      this.setState({ themeName: "" });
      this.fetchThemes(); // Refresh themes list after creation
    } catch (error) {
      this.setNotification("An error occurred while creating the theme.");
    }
  };

  setNotification = (message) => {
    this.setState({ notification: message });
    setTimeout(() => this.setState({ notification: "" }), 5000); // Clears notification after 5 seconds
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { themeName, themes, notification } = this.state;
    return (
      <div className="theme-manager-container">
        <h1>Admin Page</h1>
        {notification && <div className="notification">{notification}</div>}

        {/* Create Theme Section */}
        <div>
          <h2>Create Theme</h2>
          <input
            type="text"
            placeholder="Theme Name"
            name="themeName"
            value={themeName}
            onChange={this.handleInputChange}
          />
          <button className="CreateThemeButton" onClick={this.createTheme}>
            Create Theme
          </button>
        </div>

        {/* Display Themes as Cards */}
        <div>
          <h2>Themes</h2>
          <div className="theme-cards-container">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                fetchThemes={this.fetchThemes}
                setNotification={this.setNotification}  // Notifications inside ThemeCard
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ThemeManagerPage;