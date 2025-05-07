import apiClient from "../../../configs/axiosConfig";

const ProgressUpdateApi = {
  // Create a new progress update
  async createProgressUpdate(progressUpdateData) {
    try {
      const response = await apiClient.post("/progress-updates", progressUpdateData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create progress update";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get all progress updates
  async getAllProgressUpdates() {
    try {
      const response = await apiClient.get("/progress-updates");
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch progress updates";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get a progress update by ID
  async getProgressUpdateById(id) {
    try {
      const response = await apiClient.get(`/progress-updates/${id}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch progress update";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get progress updates by user ID
  async getProgressUpdatesByUserId(userId) {
    try {
      const response = await apiClient.get(`/progress-updates/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch progress updates for the user";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get progress updates by learning plan ID
  async getProgressUpdatesByPlanId(planId) {
    try {
      const response = await apiClient.get(`/progress-updates/plan/${planId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch progress updates for the plan";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get progress updates by learning unit ID
  async getProgressUpdatesByUnitId(unitId) {
    try {
      const response = await apiClient.get(`/progress-updates/unit/${unitId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch progress updates for the unit";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get all public progress updates
  async getPublicProgressUpdates() {
    try {
      const response = await apiClient.get("/progress-updates/public");
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch public progress updates";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Update a progress update
  async updateProgressUpdate(id, updatedData) {
    try {
      const response = await apiClient.put(`/progress-updates/${id}`, updatedData);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to update progress update";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Delete a progress update
  async deleteProgressUpdate(id) {
    try {
      await apiClient.delete(`/progress-updates/${id}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete progress update";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Like a progress update
  async likeProgressUpdate(id) {
    try {
      const response = await apiClient.post(`/progress-updates/${id}/like`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to like progress update";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Unlike a progress update
  async unlikeProgressUpdate(id) {
    try {
      const response = await apiClient.post(`/progress-updates/${id}/unlike`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to unlike progress update";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Mark a progress update as viewed by a user
  async markAsViewed(id, userId) {
    try {
      const response = await apiClient.post(`/progress-updates/${id}/view`, { userId });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to mark progress update as viewed";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Create a progress update from a template
  async createFromTemplate(userId, planId, templateType) {
    try {
      const response = await apiClient.post("/progress-updates/template", null, {
        params: { userId, planId, templateType },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create progress update from template";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },
};

export default ProgressUpdateApi;