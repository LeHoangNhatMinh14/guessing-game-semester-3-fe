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

    console.log(name)
    console.log(themeId)
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

}
