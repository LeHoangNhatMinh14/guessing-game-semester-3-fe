import axios from "../../axiosConfig";

export default class ThemeService {
  static async fetchThemes() {
    try {
      const response = await axios.get("/themes");
      return response.data.themes;
    } catch (error) {
      console.error("Error fetching themes:", error);
      throw error;
    }
  }

  static async createTheme(themeName) {
    try {
      const response = await axios.post("/themes", { themeName });
      return response.data;
    } catch (error) {
      console.error("Error creating theme:", error);
      throw error;
    }
  }

  static async addWordToTheme(themeId, word) {
    try {
      const response = await axios.post("/themes/words", { themeId, word });
      return response.data;
    } catch (error) {
      console.error("Error adding word to theme:", error);
      throw error;
    }
  }

  static async fetchWords(themeId) {
    try {
      const response = await axios.get(`/themes/${themeId}/words`);
      return response.data.words;
    } catch (error) {
      console.error("Error fetching words:", error);
      throw error;
    }
  }

  static async deleteTheme(themeId) {
    try {
      const response = await axios.delete(`/themes/${themeId}`);
      return response.status; // Returns the status (204 for successful deletion)
    } catch (error) {
      console.error("Error deleting theme:", error);
      throw error;
    }
  }

  static async deleteWordFromTheme(themeId, word) {
    try {
      const response = await axios.put(`/themes/${themeId}/words`, word, {
        headers: { "Content-Type": "text/plain" },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting word from theme:", error);
      throw error;
    }
  }
}
