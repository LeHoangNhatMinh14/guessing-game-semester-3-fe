import axios from "../../axiosConfig";

export default class GameApi {
  constructor() {
    this.apiClient = axios.create({
      baseURL: axios.defaults.baseURL + "/games",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Apply global interceptors to this instance
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Start a new game
  async startGame(playerID, themeID) {
    try {
      const startGameRequest = { playerID, themeID };
      console.log("startGameRequest:", startGameRequest); // Log request object
      const response = await this.apiClient.post("/startNew", startGameRequest);
      const { gameId } = response.data;
  
      // Store the gameId in localStorage
      localStorage.setItem("gameId", gameId);
  
      console.log("Game started successfully with gameId:", gameId);
      return response.data;
    } catch (error) {
      console.error("Error starting game:", error.response?.data || error.message);
      throw error;
    }
  }
  

  // End a game
  async endGame(endGameRequest) {
    try {
      console.log("Sending endGameRequest:", endGameRequest); // Log the request
      const response = await this.apiClient.post("/end", endGameRequest);
      return response.data;
    } catch (error) {
      console.error("Error ending game:", error.response?.data || error.message);
      throw error;
    }
  }

  // Get game details by game ID
  async getGameById(gameId) {
    try {
      const response = await this.apiClient.get(`/${gameId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching game details:", error);
      throw error;
    }
  }

  // Get player's game history
  async getPlayerGameHistory(playerId) {
    try {
      const response = await this.apiClient.get(`/player/${playerId}/history`);
      return response.data;
    } catch (error) {
      console.error("Error fetching player game history:", error);
      throw error;
    }
  }
}
