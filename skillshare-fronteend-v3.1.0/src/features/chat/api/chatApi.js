import apiClient from "../../../configs/axiosConfig";

export default {
  // Create a new conversation
  async createConversation(participant1Id, participant2Id) {
    try {
      const response = await apiClient.post("/chat/conversations", {
        participant1Id,
        participant2Id
      });
      return response;
    } catch (error) {
      let errorMessage = "Failed to create conversation";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get conversation between two users
  async getConversationBetweenUsers(user1Id, user2Id) {
    try {
      const response = await apiClient.get("/chat/conversations", {
        params: { user1Id, user2Id }
      });
      return response;
    } catch (error) {
      let errorMessage = "Failed to fetch conversation between users";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Send a message
  async sendMessage(senderId, recipientId, content, conversationId) {
    try {
      const response = await apiClient.post("/chat/messages", {
        senderId,
        recipientId,
        content,
        conversationId
      });
      return response;
    } catch (error) {
      let errorMessage = "Failed to send message";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Update a message
  async updateMessage(messageId, content) {
    try {
      const response = await apiClient.put(`/chat/messages/${messageId}`, {
        content
      });
      return response;
    } catch (error) {
      let errorMessage = "Failed to update message";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const response = await apiClient.delete(`/chat/messages/${messageId}`);
      return response;
    } catch (error) {
      let errorMessage = "Failed to delete message";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get conversation messages
  async getConversationMessages(conversationId) {
    try {
      const response = await apiClient.get(`/chat/messages/conversation/${conversationId}`);
      return response;
    } catch (error) {
      let errorMessage = "Failed to fetch conversation messages";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  }
};