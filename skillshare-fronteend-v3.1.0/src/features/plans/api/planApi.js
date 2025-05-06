import apiClient from "../../../configs/axiosConfig";

export default {
  // Create a new learning plan
  async createLearningPlan(learningPlanData) {
    try {
      const response = await apiClient.post("/learning-plans", learningPlanData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create learning plan";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get a learning plan by ID
  async getLearningPlanById(planId) {
    try {
      const response = await apiClient.get(`/learning-plans/${planId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch learning plan";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get learning plans by owner ID
  async getLearningPlansByOwnerId(ownerId) {
    try {
      const response = await apiClient.get(`/learning-plans/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch learning plans for the owner";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get public learning plans (paginated)
  async getPublicLearningPlans(page = 0, size = 10) {
    try {
      const response = await apiClient.get("/learning-plans/public", {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch public learning plans";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Search learning plans
  async searchLearningPlans(query, category, skillLevel, page = 0, size = 10) {
    try {
      const response = await apiClient.get("/learning-plans/search", {
        params: { query, category, skillLevel, page, size },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to search learning plans";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Update a learning plan
  async updateLearningPlan(planId, updatedData) {
    try {
      const response = await apiClient.put(`/learning-plans/${planId}`, updatedData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update learning plan";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Delete a learning plan
  async deleteLearningPlan(planId) {
    try {
      await apiClient.delete(`/learning-plans/${planId}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete learning plan";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Complete a learning unit in a learning plan
  async completeLearningUnit(planId, unitId) {
    try {
      const response = await apiClient.post(`/learning-plans/${planId}/complete-unit/${unitId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to mark learning unit as completed";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Fork a learning plan
  async forkLearningPlan(planId, userId) {
    try {
      const response = await apiClient.post(`/learning-plans/${planId}/fork`, null, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fork learning plan";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get learning plans by tags
  async getLearningPlansByTags(tags) {
    try {
      const response = await apiClient.get("/learning-plans/by-tags", {
        params: { tags },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch learning plans by tags";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get most popular learning plans (paginated)
  async getMostPopularLearningPlans(page = 0, size = 10) {
    try {
      const response = await apiClient.get("/learning-plans/popular", {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch most popular learning plans";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get most forked learning plans (paginated)
  async getMostForkedLearningPlans(page = 0, size = 10) {
    try {
      const response = await apiClient.get("/learning-plans/most-forked", {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch most forked learning plans";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Count learning plans by owner
  async countLearningPlansByOwner(ownerId) {
    try {
      const response = await apiClient.get("/learning-plans/count", {
        params: { ownerId },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to count learning plans";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },
};