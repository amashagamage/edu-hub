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

  // Delete a comment
  async deleteComment(commentId, userId) {
    try {
      await apiClient.delete(`/comments/${commentId}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete comment";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get comments by post ID
  async getCommentsByPostId(postId) {
    try {
      const response = await apiClient.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch comments for this post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get comments by post ID
  async getCommentsByPostId(postId) {
    try {
      const response = await apiClient.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch comments for this post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get comments by user ID
  async getCommentsByUserId(userId) {
    try {
      const response = await apiClient.get(`/comments/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch user's comments";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get a comment by ID
  async getCommentById(commentId) {
    try {
      const response = await apiClient.get(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch comment";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Comment not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

 