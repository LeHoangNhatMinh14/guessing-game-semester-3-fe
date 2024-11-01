import axios from "../axiosConfig";

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
}
