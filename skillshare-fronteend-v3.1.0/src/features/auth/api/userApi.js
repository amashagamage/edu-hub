import apiClient from "../../../configs/axiosConfig";


export default {
  // Register a new user
  async register(userData) {
    try {
      const response = await apiClient.post("/users/register", userData);
      // Assuming your backend returns the user ID and token
      if (response.data) {
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      let errorMessage = "Registration failed";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch users";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch user";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "User not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update user";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "User not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  // Delete user
  async deleteUser(userId) {
    try {
      await apiClient.delete(`/users/${userId}`);
      // Clear local storage if the deleted user is the current user
      const currentUserId = localStorage.getItem("userId");
      if (currentUserId === userId) {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
      }
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete user";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "User not found";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },
  async login(credentials) {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem("userId", response.data.userId);
      }
      return response.data;
    } catch (error) {
      let errorMessage = "Login failed";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async getUserProfile() {
    try {
      const response = await apiClient.get("/users/me");
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch user profile");
    }
  },

  // Google OAuth2 login
  initiateGoogleLogin() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  },
  async followUser(userId) {
    try {
      const response = await apiClient.post(`/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to follow user";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  async unfollowUser(userId) {
    try {
      const response = await apiClient.post(`/users/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to unfollow user";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },
};
