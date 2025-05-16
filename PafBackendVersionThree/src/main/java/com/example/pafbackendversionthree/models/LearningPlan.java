package com.example.pafbackendversionthree.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "learning_plans")
public class LearningPlan {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;        // e.g., "Programming", "Cooking", "Photography"
    private String skillLevel;      // e.g., "Beginner", "Intermediate", "Advanced"
    private boolean isPublic;       // Controls visibility
    private boolean isCompleted;
    private Date targetCompletionDate;
    private Date actualCompletionDate;
    private Date createdAt;
    private Date updatedAt;
    private int estimatedHours;     // Estimated time to complete the plan
    private int completedHours;     // Actual hours spent so far

    // References
    @DBRef
    private AppUser owner;          // One-to-many relation with AppUser

    // Plan components
    private List<LearningUnit> learningUnits = new ArrayList<>();
    private List<String> resources = new ArrayList<>();  // URLs, book titles, etc.
    private List<String> tags = new ArrayList<>();       // Keywords for searchability

    // Stats and metrics
    private int viewCount;
    private int forkCount;          // How many users have copied this plan

    public LearningPlan() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isPublic = false;
        this.isCompleted = false;
        this.viewCount = 0;
        this.forkCount = 0;
        this.completedHours = 0;
    }

    // Inner class to represent units within a learning plan
    public static class LearningUnit {
        private String unitId;
        private String title;
        private String description;
        private int orderIndex;     // Sequence in the plan
        private boolean isCompleted;
        private Date completedAt;
        private int estimatedHours;
        private List<String> objectives = new ArrayList<>();

        public LearningUnit() {
            this.unitId = java.util.UUID.randomUUID().toString();
            this.isCompleted = false;
        }

        // Getters and Setters
        public String getUnitId() {
            return unitId;
        }

        public void setUnitId(String unitId) {
            this.unitId = unitId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public int getOrderIndex() {
            return orderIndex;
        }

        public void setOrderIndex(int orderIndex) {
            this.orderIndex = orderIndex;
        }

        public boolean isCompleted() {
            return isCompleted;
        }

        public void setCompleted(boolean completed) {
            isCompleted = completed;
        }

        public Date getCompletedAt() {
            return completedAt;
        }

        public void setCompletedAt(Date completedAt) {
            this.completedAt = completedAt;
        }

        public int getEstimatedHours() {
            return estimatedHours;
        }

        public void setEstimatedHours(int estimatedHours) {
            this.estimatedHours = estimatedHours;
        }

        public List<String> getObjectives() {
            return objectives;
        }

        public void setObjectives(List<String> objectives) {
            this.objectives = objectives;
        }
    }

    // Helper methods
    public void addLearningUnit(LearningUnit unit) {
        this.learningUnits.add(unit);
        this.updatedAt = new Date();
    }

    public void completeLearningUnit(String unitId) {
        for (LearningUnit unit : this.learningUnits) {
            if (unit.getUnitId().equals(unitId)) {
                unit.setCompleted(true);
                unit.setCompletedAt(new Date());
                this.updatedAt = new Date();

                // Update completed hours
                this.completedHours += unit.getEstimatedHours();

                // Check if all units are completed
                boolean allCompleted = true;
                for (LearningUnit u : this.learningUnits) {
                    if (!u.isCompleted()) {
                        allCompleted = false;
                        break;
                    }
                }

                if (allCompleted) {
                    this.isCompleted = true;
                    this.actualCompletionDate = new Date();
                }

                break;
            }
        }
    }

    public double calculateCompletionPercentage() {
        if (learningUnits.isEmpty()) {
            return 0.0;
        }

        int completed = 0;
        for (LearningUnit unit : learningUnits) {
            if (unit.isCompleted()) {
                completed++;
            }
        }

        return (double) completed / learningUnits.size() * 100;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public Date getTargetCompletionDate() {
        return targetCompletionDate;
    }

    public void setTargetCompletionDate(Date targetCompletionDate) {
        this.targetCompletionDate = targetCompletionDate;
    }

    public Date getActualCompletionDate() {
        return actualCompletionDate;
    }

    public void setActualCompletionDate(Date actualCompletionDate) {
        this.actualCompletionDate = actualCompletionDate;
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

    public int getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(int estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public int getCompletedHours() {
        return completedHours;
    }

    public void setCompletedHours(int completedHours) {
        this.completedHours = completedHours;
    }

    public AppUser getOwner() {
        return owner;
    }

    public void setOwner(AppUser owner) {
        this.owner = owner;
    }

    public List<LearningUnit> getLearningUnits() {
        return learningUnits;
    }

    public void setLearningUnits(List<LearningUnit> learningUnits) {
        this.learningUnits = learningUnits;
    }

    public List<String> getResources() {
        return resources;
    }

    public void setResources(List<String> resources) {
        this.resources = resources;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    public int getForkCount() {
        return forkCount;
    }

    public void setForkCount(int forkCount) {
        this.forkCount = forkCount;
    }
}