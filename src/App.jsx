import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import {
  StartingPage,
  ChooseDifficulty,
  ChooseTheme,
  Game,
  AdminPage,
  ThemeManagerPage,
  LoginPage,
  RegisterPage,
  ProfilePage,
} from "./pages";
import { GameProvider } from "./components/game/GameContext";
import { AuthProvider } from "./components/AuthContext";
 
function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
            <GameProvider>
            <Routes>
              <Route path="/" element={<StartingPage />} />
              <Route path="/choose-difficulty" element={<ChooseDifficulty />} />
              <Route path="/choose-theme" element={<ChooseTheme />} />
              <Route path="/game" element={<Game />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/ThemeManagement" element={<ThemeManagerPage />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/Register" element={<RegisterPage />} />
              <Route path="/Profile" element={<ProfilePage/>} />
            </Routes>
          </GameProvider>
        </AuthProvider>
        
      </Router>
    </div>
  );
}

export default App;