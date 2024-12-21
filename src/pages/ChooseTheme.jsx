import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeService from "../components/apiCalls/ThemeService";
import ThemeDisplay from "../components/ThemeDisplay";
import { GameContext } from "../components/game/GameContext";
import "../css/ChooseTheme.css";

function ChooseTheme() {
  const navigate = useNavigate();
  const { setTheme } = useContext(GameContext);
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const fetchedThemes = await ThemeService.fetchThemes();
        setThemes(fetchedThemes);
      } catch (error) {
        console.error("Error fetching themes: ", error);
      }
    };

    fetchThemes();
  }, []);

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    navigate("/game");
  };

  return (
    <div className="choose-theme-container">
      <h1 className="choose-theme-title">Choose Theme</h1>
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