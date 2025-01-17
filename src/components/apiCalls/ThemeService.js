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

  static async addWordToTheme(themeId, word, image) {
    const formData = new FormData();
    formData.append("themeId", themeId);
    formData.append("word", word);
    if (image) {
      formData.append("image", image); // Add image if provided
    }

    try {
      const response = await axios.post("/themes/words", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding word to theme:", error);
      throw error;
    }
  }

  static async fetchWords(themeId, name = null) {
    try {
      // Construct the URL with optional query parameter
      const url = name
        ? `/themes/${themeId}/words?name=${encodeURIComponent(name)}`
        : `/themes/${themeId}/words`;

      console.log(name);
      console.log(themeId);
      const response = await axios.get(url);

      // Assuming the response contains a list of WordImage objects
      return response.data.words || [];
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
      const response = await axios.put(
        `/themes/${themeId}/words`,
        { word }, // Adjust payload if needed
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting word from theme:", error);
      throw error;
    }
  }

  static async fetchStatistics(filters = {}) {
    try {
      // Log the raw filters object before processing
      console.log("Input filters for fetching statistics:", filters);

      // Build the query parameters dynamically based on the provided filters
      const params = new URLSearchParams();

      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.year) params.append("year", filters.year);
      if (filters.month) params.append("month", filters.month);
      if (filters.week) params.append("week", filters.week);

      const queryString = params.toString();
      console.log("Fetching theme statistics with query:", queryString);

      const response = await axios.get(`/themes/statistics?${queryString}`);

      console.log("Fetched theme statistics successfully:", response.data);
      return response.data; // Assuming response contains an array of statistics
    } catch (error) {
      console.error("Error fetching theme statistics:", error);
      throw error;
    }
  }

  static async searchThemes(term) {
    try {
      const response = await axios.get(`/search`, {
        params: { term },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach the token
        },
      });
  
      // Log the Authorization header for debugging
      console.log("Authorization Header:", response.config.headers.Authorization);
  
      return response.data || {}; // Ensure you return the full response object
    } catch (error) {
      console.error("Error searching themes:", error);
      throw error;
    }
  }
  
} // Ensure this closing brace exists
