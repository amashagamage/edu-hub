package com.example.pafbackendversionthree.services;

import com.example.pafbackendversionthree.dtos.LearningPlanDTO;
import com.example.pafbackendversionthree.dtos.ProgressUpdateDTO;
import com.example.pafbackendversionthree.exceptions.ResourceNotFoundException;
import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.models.LearningPlan;
import com.example.pafbackendversionthree.models.ProgressUpdate;
import com.example.pafbackendversionthree.repositories.AppUserRepository;
import com.example.pafbackendversionthree.repositories.ProgressUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressUpdateService {

    private final ProgressUpdateRepository progressUpdateRepository;
    private final AppUserRepository userService;
    private final LearningPlanService learningPlanService;

    @Autowired
    public ProgressUpdateService(
            ProgressUpdateRepository progressUpdateRepository,
            AppUserRepository userService,
            LearningPlanService learningPlanService) {
        this.progressUpdateRepository = progressUpdateRepository;
        this.userService = userService;
        this.learningPlanService = learningPlanService;
    }
    public LearningPlan convertResponseToModel(LearningPlanDTO.LearningPlanResponse response) {
        LearningPlan learningPlan = new LearningPlan();

        // Set basic properties
        learningPlan.setId(response.getId());
        learningPlan.setTitle(response.getTitle());
        learningPlan.setDescription(response.getDescription());
        learningPlan.setCategory(response.getCategory());
        learningPlan.setSkillLevel(response.getSkillLevel());
        learningPlan.setPublic(response.isPublic());
        learningPlan.setCompleted(response.isCompleted());
        learningPlan.setTargetCompletionDate(response.getTargetCompletionDate());
        learningPlan.setActualCompletionDate(response.getActualCompletionDate());
        learningPlan.setCreatedAt(response.getCreatedAt());
        learningPlan.setUpdatedAt(response.getUpdatedAt());
        learningPlan.setEstimatedHours(response.getEstimatedHours());
        learningPlan.setCompletedHours(response.getCompletedHours());
        learningPlan.setViewCount(response.getViewCount());
        learningPlan.setForkCount(response.getForkCount());

        // Convert owner if exists
        if (response.getOwner() != null) {
            Optional<AppUser> ownerOptional = userService.findById(response.getOwner().getId());
            ownerOptional.ifPresent(learningPlan::setOwner);
        }

        // Convert learning units
        List<LearningPlan.LearningUnit> learningUnits = new ArrayList<>();
        if (response.getLearningUnits() != null) {
            for (LearningPlanDTO.LearningUnitDTO unitDTO : response.getLearningUnits()) {
                LearningPlan.LearningUnit unit = new LearningPlan.LearningUnit();
                unit.setUnitId(unitDTO.getUnitId());
                unit.setTitle(unitDTO.getTitle());
                unit.setDescription(unitDTO.getDescription());
                unit.setOrderIndex(unitDTO.getOrderIndex());
                unit.setCompleted(unitDTO.isCompleted());
                unit.setCompletedAt(unitDTO.getCompletedAt());
                unit.setEstimatedHours(unitDTO.getEstimatedHours());
                unit.setObjectives(new ArrayList<>(unitDTO.getObjectives()));
                learningUnits.add(unit);
            }
        }
        learningPlan.setLearningUnits(learningUnits);

        // Set resources and tags
        if (response.getResources() != null) {
            learningPlan.setResources(new ArrayList<>(response.getResources()));
        }

        if (response.getTags() != null) {
            learningPlan.setTags(new ArrayList<>(response.getTags()));
        }

        return learningPlan;
    }
    /**
     * Create a new progress update
     */
    @Transactional
    public ProgressUpdateDTO.ProgressUpdateResponse createProgressUpdate(
            ProgressUpdateDTO.CreateProgressUpdateRequest request) {

        // Fetch the user and learning plan
        Optional<AppUser> user = userService.findAppUserById(request.getUserId());
        LearningPlanDTO.LearningPlanResponse relatedPlan = null;
        if (request.getRelatedPlanId() != null && !request.getRelatedPlanId().isEmpty()) {
            relatedPlan = learningPlanService.getLearningPlanById(request.getRelatedPlanId());
        }
        assert relatedPlan != null;
        LearningPlan plan = convertResponseToModel(relatedPlan);
        // Create the progress update
        ProgressUpdate progressUpdate = new ProgressUpdate();
        progressUpdate.setTitle(request.getTitle());
        progressUpdate.setContent(request.getContent());
        progressUpdate.setPublic(request.isPublic());
        progressUpdate.setHoursSpent(request.getHoursSpent());
        progressUpdate.setType(request.getType());
        progressUpdate.setRating(request.getRating());
        progressUpdate.setTemplateType(request.getTemplateType());
        progressUpdate.setSentiment(request.getSentiment());
        progressUpdate.setChallenges(request.getChallenges());
        progressUpdate.setAchievements(request.getAchievements());
        progressUpdate.setUser(user.get());
        progressUpdate.setRelatedPlan(plan);
        progressUpdate.setLearningUnitId(request.getLearningUnitId());

        // Set attached media if exists
        if (request.getAttachedMedia() != null && !request.getAttachedMedia().isEmpty()) {
            List<ProgressUpdate.Media> mediaList = new ArrayList<>();

            for (ProgressUpdateDTO.MediaDTO mediaDTO : request.getAttachedMedia()) {
                ProgressUpdate.Media media = new ProgressUpdate.Media();
                media.setUrl(mediaDTO.getUrl());
                media.setCaption(mediaDTO.getCaption());
                media.setType(mediaDTO.getType());
                mediaList.add(media);
            }

            progressUpdate.setAttachedMedia(mediaList);
        }

        // Save the progress update
        ProgressUpdate savedUpdate = progressUpdateRepository.save(progressUpdate);

        // Return response DTO
        return new ProgressUpdateDTO.ProgressUpdateResponse(savedUpdate);
    }

    /**
     * Get all progress updates
     */
    public List<ProgressUpdateDTO.ProgressUpdateResponse> getAllProgressUpdates() {
        List<ProgressUpdate> updates = progressUpdateRepository.findAll();
        return updates.stream()
                .map(ProgressUpdateDTO.ProgressUpdateResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get progress update by ID
     */
    public ProgressUpdateDTO.ProgressUpdateResponse getProgressUpdateById(String id) {
        ProgressUpdate update = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress update not found with id: " + id));
        return new ProgressUpdateDTO.ProgressUpdateResponse(update);
    }

    /**
     * Get progress updates by user ID
     */
    public List<ProgressUpdateDTO.ProgressUpdateResponse> getProgressUpdatesByUserId(String userId) {
        List<ProgressUpdate> updates = progressUpdateRepository.findByUserId(userId);
        return updates.stream()
                .map(ProgressUpdateDTO.ProgressUpdateResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get progress updates by learning plan ID
     */
    public List<ProgressUpdateDTO.ProgressUpdateResponse> getProgressUpdatesByPlanId(String planId) {
        List<ProgressUpdate> updates = progressUpdateRepository.findByRelatedPlanId(planId);
        return updates.stream()
                .map(ProgressUpdateDTO.ProgressUpdateResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get progress updates by learning unit ID
     */
    public List<ProgressUpdateDTO.ProgressUpdateResponse> getProgressUpdatesByUnitId(String unitId) {
        List<ProgressUpdate> updates = progressUpdateRepository.findByLearningUnitId(unitId);
        return updates.stream()
                .map(ProgressUpdateDTO.ProgressUpdateResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get all public progress updates
     */
    public List<ProgressUpdateDTO.ProgressUpdateResponse> getPublicProgressUpdates() {
        List<ProgressUpdate> updates = progressUpdateRepository.findByIsPublicTrue();
        return updates.stream()
                .map(ProgressUpdateDTO.ProgressUpdateResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Update a progress update
     */
    @Transactional
    public ProgressUpdateDTO.ProgressUpdateResponse updateProgressUpdate(
            String id, ProgressUpdateDTO.UpdateProgressUpdateRequest request) {

        ProgressUpdate update = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress update not found with id: " + id));

        // Update the fields that are provided
        if (request.getTitle() != null) {
            update.setTitle(request.getTitle());
        }

        if (request.getContent() != null) {
            update.setContent(request.getContent());
        }

        if (request.getIsPublic() != null) {
            update.setPublic(request.getIsPublic());
        }

        if (request.getHoursSpent() != null) {
            update.setHoursSpent(request.getHoursSpent());
        }

        if (request.getType() != null) {
            update.setType(request.getType());
        }

        if (request.getRating() != null) {
            update.setRating(request.getRating());
        }

        if (request.getSentiment() != null) {
            update.setSentiment(request.getSentiment());
        }

        if (request.getChallenges() != null) {
            update.setChallenges(request.getChallenges());
        }

        if (request.getAchievements() != null) {
            update.setAchievements(request.getAchievements());
        }

        if (request.getLearningUnitId() != null) {
            update.setLearningUnitId(request.getLearningUnitId());
        }

        if (request.getAttachedMedia() != null) {
            List<ProgressUpdate.Media> mediaList = new ArrayList<>();

            for (ProgressUpdateDTO.MediaDTO mediaDTO : request.getAttachedMedia()) {
                ProgressUpdate.Media media = new ProgressUpdate.Media();
                // If mediaId is provided, use it, otherwise generate new one
                if (mediaDTO.getMediaId() != null) {
                    media.setMediaId(mediaDTO.getMediaId());
                }
                media.setUrl(mediaDTO.getUrl());
                media.setCaption(mediaDTO.getCaption());
                media.setType(mediaDTO.getType());
                mediaList.add(media);
            }

            update.setAttachedMedia(mediaList);
        }

        // Set the updated timestamp
        update.setUpdatedAt(new Date());

        // Save the updated progress update
        ProgressUpdate savedUpdate = progressUpdateRepository.save(update);

        // Return response DTO
        return new ProgressUpdateDTO.ProgressUpdateResponse(savedUpdate);
    }

    /**
     * Delete a progress update
     */
    @Transactional
    public void deleteProgressUpdate(String id) {
        if (!progressUpdateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Progress update not found with id: " + id);
        }
        progressUpdateRepository.deleteById(id);
    }

    /**
     * Mark a progress update as viewed by a user
     */
    @Transactional
    public ProgressUpdateDTO.ProgressUpdateResponse markAsViewed(String updateId, String userId) {
        ProgressUpdate update = progressUpdateRepository.findById(updateId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress update not found with id: " + updateId));

        Optional<AppUser> viewer = userService.findAppUserById(userId);
        viewer.ifPresent(update::markAsViewed);

        ProgressUpdate savedUpdate = progressUpdateRepository.save(update);
        return new ProgressUpdateDTO.ProgressUpdateResponse(savedUpdate);
    }

    /**
     * Like a progress update
     */
    @Transactional
    public ProgressUpdateDTO.ProgressUpdateResponse likeProgressUpdate(String id) {
        ProgressUpdate update = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress update not found with id: " + id));

        update.incrementLikes();
        ProgressUpdate savedUpdate = progressUpdateRepository.save(update);

        return new ProgressUpdateDTO.ProgressUpdateResponse(savedUpdate);
    }

    /**
     * Unlike a progress update
     */
    @Transactional
    public ProgressUpdateDTO.ProgressUpdateResponse unlikeProgressUpdate(String id) {
        ProgressUpdate update = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Progress update not found with id: " + id));

        update.decrementLikes();
        ProgressUpdate savedUpdate = progressUpdateRepository.save(update);

        return new ProgressUpdateDTO.ProgressUpdateResponse(savedUpdate);
    }

    /**
     * Create a progress update with template
     */
    @Transactional
    public ProgressUpdateDTO.ProgressUpdateResponse createFromTemplate(
            String userId, String planId, String templateType) {

        Optional<AppUser> user = userService.findAppUserById(userId);
        LearningPlanDTO.LearningPlanResponse plan = null;

        if (planId != null && !planId.isEmpty()) {
            plan = learningPlanService.getLearningPlanById(planId);
        }

        if(user.isPresent()){
            ProgressUpdate template;
            assert plan != null;
            LearningPlan planR = convertResponseToModel(plan);
            template = switch (templateType.toLowerCase()) {
                case "milestone" -> ProgressUpdate.createMilestoneTemplate(user.get(), planR);
                case "daily" -> ProgressUpdate.createDailyUpdateTemplate(user.get(), planR);
                case "challenge" -> ProgressUpdate.createChallengeTemplate(user.get(), planR);
                default -> throw new IllegalArgumentException("Unknown template type: " + templateType);
            };

            ProgressUpdate savedUpdate = progressUpdateRepository.save(template);
            return new ProgressUpdateDTO.ProgressUpdateResponse(savedUpdate);
        }else{
            throw new Error("Error create from template");
        }
    }
}