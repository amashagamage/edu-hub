package com.example.pafbackendversionthree.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "progress_updates")
public class ProgressUpdate {

    @Id
    private String id;

    private String title;
    private String content;
    private boolean isPublic;        // Controls visibility
    private Date createdAt;
    private Date updatedAt;
    private int hoursSpent;          // Hours spent on this learning session
    private ProgressType type;       // Type of progress update
    private Integer rating;          // Self-assessment rating (1-5)
    private String templateType;     // If using a predefined template, which one

    // Sentiment tracking - how the user feels about their progress
    private Sentiment sentiment;

    // List of challenges/obstacles faced
    private List<String> challenges = new ArrayList<>();

    // Learning achievements in this update
    private List<String> achievements = new ArrayList<>();

    // References
    @DBRef
    private AppUser user;            // One-to-many relation with AppUser

    @DBRef
    private LearningPlan relatedPlan; // Optional - can be null if not linked to a plan

    // For specific unit progress within a plan
    private String learningUnitId;    // Reference to a specific unit in the plan

    // For attaching evidence of learning
    private List<Media> attachedMedia = new ArrayList<>();

    // Engagement metrics
    private int likeCount;
    private int commentCount;

    // Social features - tracks who has viewed this update
    @DBRef
    private List<AppUser> viewedBy = new ArrayList<>();

    // Enums
    public enum ProgressType {
        MILESTONE,      // Significant achievement
        DAILY_UPDATE,   // Regular update
        CHALLENGE,      // Overcoming a difficult problem
        REFLECTION,     // Thoughts about learning process
        STUCK,          // Requesting help with a problem
        COMPLETED       // Completed a learning unit or entire plan
    }

    public enum Sentiment {
        EXCITED,
        SATISFIED,
        NEUTRAL,
        FRUSTRATED,
        OVERWHELMED
    }

    // Inner classes
    public static class Media {
        private String mediaId;
        private String url;
        private String caption;
        private MediaType type;

        public Media() {
            this.mediaId = java.util.UUID.randomUUID().toString();
        }

        public enum MediaType {
            IMAGE,
            VIDEO,
            DOCUMENT,
            CODE_SNIPPET,
            EXTERNAL_LINK
        }

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

        public MediaType getType() {
            return type;
        }

        public void setType(MediaType type) {
            this.type = type;
        }
    }

    // Constructors
    public ProgressUpdate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isPublic = false;
        this.likeCount = 0;
        this.commentCount = 0;
    }

    // Template creator methods
    public static ProgressUpdate createMilestoneTemplate(AppUser user, LearningPlan plan) {
        ProgressUpdate update = new ProgressUpdate();
        update.setUser(user);
        update.setRelatedPlan(plan);
        update.setType(ProgressType.MILESTONE);
        update.setTemplateType("milestone");
        update.setTitle("I reached a milestone in my learning journey!");
        update.setContent("I've achieved...\n\nThis is important because...\n\nNext steps include...");
        return update;
    }

    public static ProgressUpdate createDailyUpdateTemplate(AppUser user, LearningPlan plan) {
        ProgressUpdate update = new ProgressUpdate();
        update.setUser(user);
        update.setRelatedPlan(plan);
        update.setType(ProgressType.DAILY_UPDATE);
        update.setTemplateType("daily");
        update.setTitle("My learning progress today");
        update.setContent("Today I focused on...\n\nWhat went well...\n\nWhat I struggled with...\n\nTomorrow I plan to...");
        return update;
    }

    public static ProgressUpdate createChallengeTemplate(AppUser user, LearningPlan plan) {
        ProgressUpdate update = new ProgressUpdate();
        update.setUser(user);
        update.setRelatedPlan(plan);
        update.setType(ProgressType.CHALLENGE);
        update.setTemplateType("challenge");
        update.setTitle("I overcame a learning challenge!");
        update.setContent("The challenge was...\n\nHow I solved it...\n\nWhat I learned from this experience...");
        return update;
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

    public ProgressType getType() {
        return type;
    }

    public void setType(ProgressType type) {
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

    public Sentiment getSentiment() {
        return sentiment;
    }

    public void setSentiment(Sentiment sentiment) {
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

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public LearningPlan getRelatedPlan() {
        return relatedPlan;
    }

    public void setRelatedPlan(LearningPlan relatedPlan) {
        this.relatedPlan = relatedPlan;
    }

    public String getLearningUnitId() {
        return learningUnitId;
    }

    public void setLearningUnitId(String learningUnitId) {
        this.learningUnitId = learningUnitId;
    }

    public List<Media> getAttachedMedia() {
        return attachedMedia;
    }

    public void setAttachedMedia(List<Media> attachedMedia) {
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

    public List<AppUser> getViewedBy() {
        return viewedBy;
    }

    public void setViewedBy(List<AppUser> viewedBy) {
        this.viewedBy = viewedBy;
    }

    // Helper methods
    public void addMedia(Media media) {
        this.attachedMedia.add(media);
        this.updatedAt = new Date();
    }

    public void addChallenge(String challenge) {
        this.challenges.add(challenge);
        this.updatedAt = new Date();
    }

    public void addAchievement(String achievement) {
        this.achievements.add(achievement);
        this.updatedAt = new Date();
    }

    public void incrementLikes() {
        this.likeCount++;
    }

    public void decrementLikes() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }

    public void incrementComments() {
        this.commentCount++;
    }

    public void decrementComments() {
        if (this.commentCount > 0) {
            this.commentCount--;
        }
    }

    public void markAsViewed(AppUser viewer) {
        if (!this.viewedBy.contains(viewer)) {
            this.viewedBy.add(viewer);
        }
    }
}