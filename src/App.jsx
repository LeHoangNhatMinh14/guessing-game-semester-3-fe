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
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import UnauthorizedPage from "./pages/UnautherizedPage";
import StatisticsPage from "./pages/StatisticsPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <GameProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<StartingPage />} />
              <Route path="/choose-difficulty" element={<ChooseDifficulty />} />
              <Route path="/choose-theme" element={<ChooseTheme />} />
              <Route path="/game" element={<Game />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage/>}/>

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="" element={<AdminPage />} />
              </Route>
              <Route path="/themeManagement" element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="" element={<ThemeManagerPage />} />
              </Route>
              <Route path="/stats" element={<ProtectedRoute requiredRole="admin"/>}>
                <Route path="" element={<StatisticsPage/>}/>
              </Route>
            </Routes>
          </GameProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
