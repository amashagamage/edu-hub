import apiClient from "../../../configs/axiosConfig";

export default {
  // Create a new post
  async createPost(userId, postData) {
    try {
      const response = await apiClient.post(`/posts?userId=${userId}`, postData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Update an existing post
  async updatePost(postId, postData) {
    try {
      const response = await apiClient.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Delete a post
  async deletePost(postId) {
    try {
      await apiClient.delete(`/posts/${postId}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get a post by ID
  async getPostById(postId) {
    try {
      const response = await apiClient.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch post";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Post not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  // Get all posts
  async getAllPosts() {
    try {
      const response = await apiClient.get("/posts");
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch posts";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get posts by user ID
  async getPostsByUser(userId) {
    try {
      const response = await apiClient.get(`/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch user's posts";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  }
};