// Axios class to interact with the Player API
import axios from '../../axiosConfig';

export default class PlayerApi {
  constructor() {
    // You no longer need to create a new instance here since axiosConfig already has everything configured
    this.apiClient = axios;
  }

  // Register a new player
  async registerPlayer(createPlayerRequest) {
    try {
      const response = await this.apiClient.post('/players/register', createPlayerRequest);
      return response.data;
    } catch (error) {
      console.error('Error registering player:', error);
      throw error;
    }
  }

  // Update player details
  async updatePlayer(id, editPlayerRequest) {
    try {
      await this.apiClient.put(`/players/${id}`, editPlayerRequest);
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  }

  // Delete a player
  async deletePlayer(id) {
    try {
      await this.apiClient.delete(`/players/${id}`);
    } catch (error) {
      console.error('Error deleting player:', error);
      throw error;
    }
  }

  // Get player details by ID
  async getPlayerById(id) {
    try {
      const response = await this.apiClient.get(`/players/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player details:', error);
      throw error;
    }
  }

  // Login player
  async login(loginRequest) {
    try {
      const response = await this.apiClient.post('/players/login', loginRequest);
      return response.data;
    } catch (error) {
      console.error('Error logging in player:', error);
      throw error;
    }
  }
}
