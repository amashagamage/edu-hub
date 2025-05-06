import apiClient from "../../../configs/axiosConfig";

export default {
  // Follow a user
  async followUser(followerId, followingId) {
    try {
      const response = await apiClient.post(`/relationships/follow/${followerId}/${followingId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to follow user";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Unfollow a user
  async unfollowUser(followerId, followingId) {
    try {
      const response = await apiClient.delete(`/relationships/unfollow/${followerId}/${followingId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to unfollow user";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get all users that a specific user is following
  async getFollowing(userId) {
    try {
      const response = await apiClient.get(`/relationships/following/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch following list";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get all followers of a specific user
  async getFollowers(userId) {
    try {
      const response = await apiClient.get(`/relationships/followers/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch followers list";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Check if a user is following another user
  async isFollowing(followerId, followingId) {
    try {
      const response = await apiClient.get(`/relationships/isFollowing/${followerId}/${followingId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to check follow status";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get count of users a specific user is following
  async getFollowingCount(userId) {
    try {
      const response = await apiClient.get(`/relationships/following/count/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch following count";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get count of followers for a specific user
  async getFollowersCount(userId) {
    try {
      const response = await apiClient.get(`/relationships/followers/count/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch followers count";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get suggested users to follow (optional)
  async getSuggestedUsers(userId) {
    try {
      const response = await apiClient.get(`/relationships/suggestions/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch suggested users";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  }
};