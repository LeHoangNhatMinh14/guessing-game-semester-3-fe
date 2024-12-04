import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeService from "../components/apiCalls/ThemeService";
import ThemeDisplay from "../components/ThemeDisplay";
import { GameContext } from "../components/GameContext";

function ChooseTheme() {
  const navigate = useNavigate();
  const { setTheme } = useContext(GameContext);
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    console.log("ChooseTheme mounted");

    // Fetch themes from the backend using ThemeService
    const fetchThemes = async () => {
      try {
        const fetchedThemes = await ThemeService.fetchThemes();
        setThemes(fetchedThemes);
        console.log("Fetched themes: ", fetchedThemes);
      } catch (error) {
        console.error("Error fetching themes: ", error);
      }
    };

    fetchThemes();
  }, []);

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme); // Store the entire theme object
    console.log("Theme set in ChooseTheme: ", selectedTheme.id);
    navigate("/game");
  };

  return (
    <div>
      <h1>Choose Theme</h1>
      <div className="theme-cards-container">
        {themes.length > 0 ? (
          themes.map((theme) => (
            <ThemeDisplay
              key={theme.id}
              theme={theme}
              onSelectTheme={handleThemeSelect}
            />
          ))
        ) : (
          <p>Loading themes...</p>
        )}
      </div>
    </div>
  );
}

export default ChooseTheme;
