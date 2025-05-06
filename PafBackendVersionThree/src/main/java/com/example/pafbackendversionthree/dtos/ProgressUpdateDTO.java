package com.example.pafbackendversionthree.dtos;

import com.example.pafbackendversionthree.models.ProgressUpdate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ProgressUpdateDTO {

    // Request DTO for creating a progress update
    public static class CreateProgressUpdateRequest {
        private String title;
        private String content;
        private boolean isPublic;
        private int hoursSpent;
        private ProgressUpdate.ProgressType type;
        private Integer rating;
        private String templateType;
        private ProgressUpdate.Sentiment sentiment;
        private List<String> challenges = new ArrayList<>();
        private List<String> achievements = new ArrayList<>();
        private String userId;
        private String relatedPlanId;
        private String learningUnitId;
        private List<MediaDTO> attachedMedia = new ArrayList<>();

        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public boolean isPublic() {
            return isPublic;
        }

        public void setPublic(boolean isPublic) {
            this.isPublic = isPublic;
        }

        public int getHoursSpent() {
            return hoursSpent;
        }

        public void setHoursSpent(int hoursSpent) {
            this.hoursSpent = hoursSpent;
        }

        public ProgressUpdate.ProgressType getType() {
            return type;
        }

        public void setType(ProgressUpdate.ProgressType type) {
            this.type = type;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getTemplateType() {
            return templateType;
        }

        public void setTemplateType(String templateType) {
            this.templateType = templateType;
        }

        public ProgressUpdate.Sentiment getSentiment() {
            return sentiment;
        }

        public void setSentiment(ProgressUpdate.Sentiment sentiment) {
            this.sentiment = sentiment;
        }

        public List<String> getChallenges() {
            return challenges;
        }

        public void setChallenges(List<String> challenges) {
            this.challenges = challenges;
        }

        public List<String> getAchievements() {
            return achievements;
        }

        public void setAchievements(List<String> achievements) {
            this.achievements = achievements;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getRelatedPlanId() {
            return relatedPlanId;
        }

        public void setRelatedPlanId(String relatedPlanId) {
            this.relatedPlanId = relatedPlanId;
        }

        public String getLearningUnitId() {
            return learningUnitId;
        }

        public void setLearningUnitId(String learningUnitId) {
            this.learningUnitId = learningUnitId;
        }

        public List<MediaDTO> getAttachedMedia() {
            return attachedMedia;
        }

        public void setAttachedMedia(List<MediaDTO> attachedMedia) {
            this.attachedMedia = attachedMedia;
        }
    }

    // Request DTO for updating a progress update
    public static class UpdateProgressUpdateRequest {
        private String title;
        private String content;
        private Boolean isPublic;
        private Integer hoursSpent;
        private ProgressUpdate.ProgressType type;
        private Integer rating;
        private ProgressUpdate.Sentiment sentiment;
        private List<String> challenges;
        private List<String> achievements;
        private String learningUnitId;
        private List<MediaDTO> attachedMedia;

        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public Boolean getIsPublic() {
            return isPublic;
        }

        public void setIsPublic(Boolean isPublic) {
            this.isPublic = isPublic;
        }

        public Integer getHoursSpent() {
            return hoursSpent;
        }

        public void setHoursSpent(Integer hoursSpent) {
            this.hoursSpent = hoursSpent;
        }

        public ProgressUpdate.ProgressType getType() {
            return type;
        }

        public void setType(ProgressUpdate.ProgressType type) {
            this.type = type;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public ProgressUpdate.Sentiment getSentiment() {
            return sentiment;
        }

        public void setSentiment(ProgressUpdate.Sentiment sentiment) {
            this.sentiment = sentiment;
        }

        public List<String> getChallenges() {
            return challenges;
        }

        public void setChallenges(List<String> challenges) {
            this.challenges = challenges;
        }

        public List<String> getAchievements() {
            return achievements;
        }

        public void setAchievements(List<String> achievements) {
            this.achievements = achievements;
        }

        public String getLearningUnitId() {
            return learningUnitId;
        }

        public void setLearningUnitId(String learningUnitId) {
            this.learningUnitId = learningUnitId;
        }

        public List<MediaDTO> getAttachedMedia() {
            return attachedMedia;
        }

        public void setAttachedMedia(List<MediaDTO> attachedMedia) {
            this.attachedMedia = attachedMedia;
        }
    }

    // Response DTO for returning progress update data
    public static class ProgressUpdateResponse {
        private String id;
        private String title;
        private String content;
        private boolean isPublic;
        private Date createdAt;
        private Date updatedAt;
        private int hoursSpent;
        private ProgressUpdate.ProgressType type;
        private Integer rating;
        private String templateType;
        private ProgressUpdate.Sentiment sentiment;
        private List<String> challenges;
        private List<String> achievements;
        private UserDTO user;
        private String relatedPlanId;
        private String learningUnitId;
        private List<MediaDTO> attachedMedia;
        private int likeCount;
        private int commentCount;
        private int viewCount;

        // Constructor to map from entity to DTO
        public ProgressUpdateResponse(ProgressUpdate update) {
            this.id = update.getId();
            this.title = update.getTitle();
            this.content = update.getContent();
            this.isPublic = update.isPublic();
            this.createdAt = update.getCreatedAt();
            this.updatedAt = update.getUpdatedAt();
            this.hoursSpent = update.getHoursSpent();
            this.type = update.getType();
            this.rating = update.getRating();
            this.templateType = update.getTemplateType();
            this.sentiment = update.getSentiment();
            this.challenges = update.getChallenges();
            this.achievements = update.getAchievements();

            if (update.getUser() != null) {
                this.user = new UserDTO(update.getUser());
            }

            if (update.getRelatedPlan() != null) {
                this.relatedPlanId = update.getRelatedPlan().getId();
            }

            this.learningUnitId = update.getLearningUnitId();

            // Convert Media entities to DTOs
            this.attachedMedia = new ArrayList<>();
            if (update.getAttachedMedia() != null) {
                update.getAttachedMedia().forEach(media -> {
                    MediaDTO mediaDTO = new MediaDTO();
                    mediaDTO.setMediaId(media.getMediaId());
                    mediaDTO.setUrl(media.getUrl());
                    mediaDTO.setCaption(media.getCaption());
                    mediaDTO.setType(media.getType());
                    this.attachedMedia.add(mediaDTO);
                });
            }

            this.likeCount = update.getLikeCount();
            this.commentCount = update.getCommentCount();
            this.viewCount = update.getViewedBy() != null ? update.getViewedBy().size() : 0;
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public boolean isPublic() {
            return isPublic;
        }

        public void setPublic(boolean isPublic) {
            this.isPublic = isPublic;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }

        public Date getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(Date updatedAt) {
            this.updatedAt = updatedAt;
        }

        public int getHoursSpent() {
            return hoursSpent;
        }

        public void setHoursSpent(int hoursSpent) {
            this.hoursSpent = hoursSpent;
        }

        public ProgressUpdate.ProgressType getType() {
            return type;
        }

        public void setType(ProgressUpdate.ProgressType type) {
            this.type = type;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getTemplateType() {
            return templateType;
        }

        public void setTemplateType(String templateType) {
            this.templateType = templateType;
        }

        public ProgressUpdate.Sentiment getSentiment() {
            return sentiment;
        }

        public void setSentiment(ProgressUpdate.Sentiment sentiment) {
            this.sentiment = sentiment;
        }

        public List<String> getChallenges() {
            return challenges;
        }

        public void setChallenges(List<String> challenges) {
            this.challenges = challenges;
        }

        public List<String> getAchievements() {
            return achievements;
        }

        public void setAchievements(List<String> achievements) {
            this.achievements = achievements;
        }

        public UserDTO getUser() {
            return user;
        }

        public void setUser(UserDTO user) {
            this.user = user;
        }

        public String getRelatedPlanId() {
            return relatedPlanId;
        }

        public void setRelatedPlanId(String relatedPlanId) {
            this.relatedPlanId = relatedPlanId;
        }

        public String getLearningUnitId() {
            return learningUnitId;
        }

        public void setLearningUnitId(String learningUnitId) {
            this.learningUnitId = learningUnitId;
        }

        public List<MediaDTO> getAttachedMedia() {
            return attachedMedia;
        }

        public void setAttachedMedia(List<MediaDTO> attachedMedia) {
            this.attachedMedia = attachedMedia;
        }

        public int getLikeCount() {
            return likeCount;
        }

        public void setLikeCount(int likeCount) {
            this.likeCount = likeCount;
        }

        public int getCommentCount() {
            return commentCount;
        }

        public void setCommentCount(int commentCount) {
            this.commentCount = commentCount;
        }

        public int getViewCount() {
            return viewCount;
        }

        public void setViewCount(int viewCount) {
            this.viewCount = viewCount;
        }
    }

    // Media DTO
    public static class MediaDTO {
        private String mediaId;
        private String url;
        private String caption;
        private ProgressUpdate.Media.MediaType type;

        // Getters and Setters
        public String getMediaId() {
            return mediaId;
        }

        public void setMediaId(String mediaId) {
            this.mediaId = mediaId;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getCaption() {
            return caption;
        }

        public void setCaption(String caption) {
            this.caption = caption;
        }

        public ProgressUpdate.Media.MediaType getType() {
            return type;
        }

        public void setType(ProgressUpdate.Media.MediaType type) {
            this.type = type;
        }
    }

    // Simple User DTO for embeddable reference
    public static class UserDTO {
        private String id;
        private String username;
        private String profileImageUrl;

        public UserDTO(com.example.pafbackendversionthree.models.AppUser user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.profileImageUrl = user.getProfileImageUrl();
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getProfileImageUrl() {
            return profileImageUrl;
        }

        public void setProfileImageUrl(String profileImageUrl) {
            this.profileImageUrl = profileImageUrl;
        }
    }
}