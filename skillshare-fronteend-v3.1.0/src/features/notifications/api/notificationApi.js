import apiClient from "../../../configs/axiosConfig";

export default {
  // Get all notifications for a user
  async getNotificationsForUser(userId) {
    try {
      const response = await apiClient.get(`/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch notifications";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get paginated notifications for a user
  async getPaginatedNotificationsForUser(userId, page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/notifications/user/${userId}/paginated`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch paginated notifications";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get unread notifications for a user
  async getUnreadNotificationsForUser(userId) {
    try {
      const response = await apiClient.get(`/notifications/user/${userId}/unread`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch unread notifications";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Count unread notifications for a user
  async countUnreadNotificationsForUser(userId) {
    try {
      const response = await apiClient.get(`/notifications/user/${userId}/unread/count`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to count unread notifications";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Mark a notification as read
  async markNotificationAsRead(notificationId, userId) {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/mark-as-read`, null, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to mark notification as read";
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "You are not authorized to mark this notification as read";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  // Mark all notifications as read for a user
  async markAllNotificationsAsRead(userId) {
    try {
      await apiClient.put(`/notifications/user/${userId}/mark-all-as-read`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to mark all notifications as read";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Delete a notification
  async deleteNotification(notificationId, userId) {
    try {
      await apiClient.delete(`/notifications/${notificationId}`, {
        params: { userId },
      });
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete notification";
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "You are not authorized to delete this notification";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      throw new Error(errorMessage);
    }
  },

  // Delete all notifications for a user
  async deleteAllNotificationsForUser(userId) {
    try {
      await apiClient.delete(`/notifications/user/${userId}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to delete all notifications";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },
};