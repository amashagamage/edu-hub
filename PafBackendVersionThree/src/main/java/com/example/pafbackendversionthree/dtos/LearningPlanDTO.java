package com.example.pafbackendversionthree.dtos;

import com.example.pafbackendversionthree.models.LearningPlan;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class LearningPlanDTO {

    public static class CreateLearningPlanRequest {
        private String title;
        private String description;
        private String category;
        private String skillLevel;
        private boolean isPublic;
        private Date targetCompletionDate;
        private int estimatedHours;
        private String ownerId;
        private List<LearningUnitDTO> learningUnits;
        private List<String> resources;
        private List<String> tags;

        // Getters and Setters
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

        public Date getTargetCompletionDate() {
            return targetCompletionDate;
        }

        public void setTargetCompletionDate(Date targetCompletionDate) {
            this.targetCompletionDate = targetCompletionDate;
        }

        public int getEstimatedHours() {
            return estimatedHours;
        }

        public void setEstimatedHours(int estimatedHours) {
            this.estimatedHours = estimatedHours;
        }

        public String getOwnerId() {
            return ownerId;
        }

        public void setOwnerId(String ownerId) {
            this.ownerId = ownerId;
        }

        public List<LearningUnitDTO> getLearningUnits() {
            return learningUnits;
        }

        public void setLearningUnits(List<LearningUnitDTO> learningUnits) {
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
    }

    public static class UpdateLearningPlanRequest {
        private String title;
        private String description;
        private String category;
        private String skillLevel;
        private Boolean isPublic;
        private Date targetCompletionDate;
        private Integer estimatedHours;
        private List<LearningUnitDTO> learningUnits;
        private List<String> resources;
        private List<String> tags;

        // Getters and Setters
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

        public Boolean getIsPublic() {
            return isPublic;
        }

        public void setIsPublic(Boolean isPublic) {
            this.isPublic = isPublic;
        }

        public Date getTargetCompletionDate() {
            return targetCompletionDate;
        }

        public void setTargetCompletionDate(Date targetCompletionDate) {
            this.targetCompletionDate = targetCompletionDate;
        }

        public Integer getEstimatedHours() {
            return estimatedHours;
        }

        public void setEstimatedHours(Integer estimatedHours) {
            this.estimatedHours = estimatedHours;
        }

        public List<LearningUnitDTO> getLearningUnits() {
            return learningUnits;
        }

        public void setLearningUnits(List<LearningUnitDTO> learningUnits) {
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
    }

    public static class LearningUnitDTO {
        private String unitId;
        private String title;
        private String description;
        private int orderIndex;
        private boolean isCompleted;
        private Date completedAt;
        private int estimatedHours;
        private List<String> objectives;

        public LearningUnitDTO() {
            this.objectives = new ArrayList<>();
        }

        public LearningUnitDTO(LearningPlan.LearningUnit unit) {
            this.unitId = unit.getUnitId();
            this.title = unit.getTitle();
            this.description = unit.getDescription();
            this.orderIndex = unit.getOrderIndex();
            this.isCompleted = unit.isCompleted();
            this.completedAt = unit.getCompletedAt();
            this.estimatedHours = unit.getEstimatedHours();
            this.objectives = new ArrayList<>(unit.getObjectives());
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

    public static class LearningPlanResponse {
        private String id;
        private String title;
        private String description;
        private String category;
        private String skillLevel;
        private boolean isPublic;
        private boolean isCompleted;
        private Date targetCompletionDate;
        private Date actualCompletionDate;
        private Date createdAt;
        private Date updatedAt;
        private int estimatedHours;
        private int completedHours;
        private AppUserDTO.AppUserBasicInfo owner;
        private List<LearningUnitDTO> learningUnits;
        private List<String> resources;
        private List<String> tags;
        private int viewCount;
        private int forkCount;
        private double completionPercentage;

        public LearningPlanResponse(LearningPlan learningPlan) {
            this.id = learningPlan.getId();
            this.title = learningPlan.getTitle();
            this.description = learningPlan.getDescription();
            this.category = learningPlan.getCategory();
            this.skillLevel = learningPlan.getSkillLevel();
            this.isPublic = learningPlan.isPublic();
            this.isCompleted = learningPlan.isCompleted();
            this.targetCompletionDate = learningPlan.getTargetCompletionDate();
            this.actualCompletionDate = learningPlan.getActualCompletionDate();
            this.createdAt = learningPlan.getCreatedAt();
            this.updatedAt = learningPlan.getUpdatedAt();
            this.estimatedHours = learningPlan.getEstimatedHours();
            this.completedHours = learningPlan.getCompletedHours();

            if (learningPlan.getOwner() != null) {
                this.owner = new AppUserDTO.AppUserBasicInfo(learningPlan.getOwner());
            }

            this.learningUnits = learningPlan.getLearningUnits().stream()
                    .map(LearningUnitDTO::new)
                    .collect(Collectors.toList());

            this.resources = new ArrayList<>(learningPlan.getResources());
            this.tags = new ArrayList<>(learningPlan.getTags());
            this.viewCount = learningPlan.getViewCount();
            this.forkCount = learningPlan.getForkCount();
            this.completionPercentage = learningPlan.calculateCompletionPercentage();
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

        public AppUserDTO.AppUserBasicInfo getOwner() {
            return owner;
        }

        public void setOwner(AppUserDTO.AppUserBasicInfo owner) {
            this.owner = owner;
        }

        public List<LearningUnitDTO> getLearningUnits() {
            return learningUnits;
        }

        public void setLearningUnits(List<LearningUnitDTO> learningUnits) {
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

        public double getCompletionPercentage() {
            return completionPercentage;
        }

        public void setCompletionPercentage(double completionPercentage) {
            this.completionPercentage = completionPercentage;
        }
    }
}