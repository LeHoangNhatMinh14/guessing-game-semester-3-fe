import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import './App.css'
import { useState } from 'react';
import StartingPage from "./pages/StartingPage";
import ChooseDifficulty from "./pages/ChooseDifficulty";
import ChooseTheme from "./pages/ChooseTheme";
import Game from "./pages/Game";
import AdminPage from "./pages/AdminPage";
import ThemeManagerPage from "./pages/ThemeManagerPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/choose-difficulty" element={<ChooseDifficulty />} />
          <Route path="/choose-theme" element={<ChooseTheme />} />
          <Route path="/game" element={<Game />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/ThemeManagement" element={<ThemeManagerPage/>} />
        </Routes>
      </Router>
  </div>
  );
}

export default App
