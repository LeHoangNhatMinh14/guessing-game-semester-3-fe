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
      searchQuery: "",
      notification: "",
      isLoading: false, // New state for loading
    };
  }

  componentDidMount() {
    this.fetchThemes(); // Initial fetch to load all themes
  }

  fetchThemes = async (searchQuery = "") => {
    this.setState({ isLoading: true }); // Set loading state
    try {
      let themes;
      if (searchQuery.trim() === "") {
        themes = await ThemeService.fetchThemes(); // Fetch all themes if no query
      } else {
        const response = await ThemeService.searchThemes(searchQuery);
        themes = response.themes; // Access themes from the response
      }
      this.setState({ themes });
    } catch (error) {
      this.setNotification("Failed to fetch themes.");
    } finally {
      this.setState({ isLoading: false }); // Reset loading state
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
      this.setNotification(data); // Display notification only for theme creation
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

  handleSearch = () => {
    const { searchQuery } = this.state;
    if (!searchQuery.trim()) {
      this.setNotification("Search query cannot be empty.");
      return;
    }
    this.fetchThemes(searchQuery); // Trigger fetch with search query
  };

  resetSearch = () => {
    this.setState({ searchQuery: "" });
    this.fetchThemes(); // Fetch all themes
  };

  render() {
    const { themeName, themes, searchQuery, notification, isLoading } = this.state;
    return (
      <div className="theme-manager-container" data-cy="theme-manager-container">
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
            data-cy="create-theme-input"
          />
          <button
            className="CreateThemeButton"
            onClick={this.createTheme}
            data-cy="create-theme-button"
          >
            Create Theme
          </button>
        </div>

        {/* Search Theme Section */}
        <div style={{ marginTop: "20px" }}>
          <h2>Search Themes</h2>
          <input
            type="text"
            placeholder="Search by theme name"
            name="searchQuery"
            value={searchQuery}
            onChange={this.handleInputChange}
            data-cy="search-theme-input"
          />
          <button
            className="SearchThemeButton"
            onClick={this.handleSearch}
            data-cy="search-theme-button"
          >
            Search
          </button>
          <button
            className="ResetSearchButton"
            onClick={this.resetSearch}
            data-cy="reset-search-button"
            style={{ marginLeft: "10px" }}
          >
            Reset
          </button>
        </div>

        {/* Display Themes as Cards */}
        <div>
          <h2>Themes</h2>
          {isLoading ? (
            <p>Loading themes...</p>
          ) : (
            <div className="theme-cards-container" data-cy="theme-cards-container">
              {themes.length > 0 ? (
                themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    fetchThemes={this.fetchThemes}
                    setNotification={this.setNotification}
                  />
                ))
              ) : (
                <p>No themes found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ThemeManagerPage;
