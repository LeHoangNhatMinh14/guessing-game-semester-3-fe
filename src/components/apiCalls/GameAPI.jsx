// Axios class to interact with the Game API
import axios from '../../axiosConfig';

class GameApi {
  constructor() {
    this.apiClient = axios.create({
      baseURL: axios.defaults.baseURL + '/games',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Start a new game
  async startGame(startGameRequest) {
    try {
      const response = await this.apiClient.post('/start', startGameRequest);
      return response.data;
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  }

  // End a game
  async endGame(endGameRequest) {
    try {
      const response = await this.apiClient.post('/end', endGameRequest);
      return response.data;
    } catch (error) {
      console.error('Error ending game:', error);
      throw error;
    }
  }

  // Get game details by game ID
  async getGameById(gameId) {
    try {
      const response = await this.apiClient.get(`/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      throw error;
    }
  }

  // Get player's game history
  async getPlayerGameHistory(playerId) {
    try {
      const response = await this.apiClient.get(`/player/${playerId}/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player game history:', error);
      throw error;
    }
  }
}

export default new GameApi();
