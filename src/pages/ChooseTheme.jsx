import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../components/GameContext";

function ChooseTheme() {
  const navigate = useNavigate();
  const { setTheme, theme, lives } = useContext(GameContext);

  useEffect(() => {
    console.log("ChooseTheme mounted");
    console.log("Lives from context in ChooseTheme: ", lives);
  }, []);

  const handleTheme = (theme) => {
    setTheme(theme);
    console.log("Theme set in ChooseTheme: ", theme);
    navigate("/game");
  };

  useEffect(() => {
    console.log("Theme from context in ChooseTheme after setting: ", theme);
  }, [theme]);

  return (
    <div>
      <h1>Choose Theme</h1>
      <button onClick={() => handleTheme("Animals")}>Animals</button>
      <button onClick={() => handleTheme("Cities")}>Cities</button>
      <button onClick={() => handleTheme("Nature")}>Nature</button>
    </div>
  );
}

export default ChooseTheme;
