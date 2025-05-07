import apiClient from "../../../configs/axiosConfig";

export default {
  // Toggle like status (like or unlike)
  async toggleLike(userId, likeData) {
    if (!userId) {
      throw new Error("User ID is required to like a post");
    }
    
    try {
      console.log("Toggling like with data:", { userId, postId: likeData.postId, reactionType: likeData.reactionType });
      
      // No need to set User-ID header manually since axiosConfig handles it
      const response = await apiClient.post('/likes/toggle', likeData);
      
      console.log("Like toggle response:", response.status, response.data);
      
      // Return the response data if status is 201 (Created - post was liked)
      // Return null if status is 204 (No Content - post was unliked)
      return response.status === 204 ? null : response.data;
    } catch (error) {
      console.error("Like toggle error:", error);
      let errorMessage = "Failed to toggle like";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        console.error("Error response:", error.response.status, error.response.data);
      }
      throw new Error(errorMessage);
    }
  },

  // Unlike a post directly
  async unlikePost(userId, postId) {
    try {
      // No need to set User-ID header manually
      await apiClient.delete(`/likes/${postId}`);
      return true;
    } catch (error) {
      let errorMessage = "Failed to unlike post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  