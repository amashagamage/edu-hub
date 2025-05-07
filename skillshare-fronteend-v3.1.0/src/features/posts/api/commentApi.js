import apiClient from "../../../configs/axiosConfig";

export default {
  // Create a new comment
  async createComment(userId, commentData) {
    try {
      const response = await apiClient.post('/comments', commentData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create comment";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Update an existing comment
  async updateComment(commentId, userId, commentData) {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update comment";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  