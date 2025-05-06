package com.example.pafbackendversionthree.services;

import com.example.pafbackendversionthree.dtos.LearningPlanDTO;
import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.models.LearningPlan;
import com.example.pafbackendversionthree.repositories.AppUserRepository;
import com.example.pafbackendversionthree.repositories.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;
    private final AppUserRepository userRepository;

    @Autowired
    public LearningPlanService(LearningPlanRepository learningPlanRepository, AppUserRepository userRepository) {
        this.learningPlanRepository = learningPlanRepository;
        this.userRepository = userRepository;
    }

    public LearningPlanDTO.LearningPlanResponse createLearningPlan(LearningPlanDTO.CreateLearningPlanRequest request) {
        // Find the owner
        AppUser owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getOwnerId()));

        // Create a new learning plan
        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setTitle(request.getTitle());
        learningPlan.setDescription(request.getDescription());
        learningPlan.setCategory(request.getCategory());
        learningPlan.setSkillLevel(request.getSkillLevel());
        learningPlan.setPublic(request.isPublic());
        learningPlan.setTargetCompletionDate(request.getTargetCompletionDate());
        learningPlan.setEstimatedHours(request.getEstimatedHours());
        learningPlan.setOwner(owner);

        // Set resources and tags if provided
        if (request.getResources() != null) {
            learningPlan.setResources(request.getResources());
        }

        if (request.getTags() != null) {
            learningPlan.setTags(request.getTags());
        }

        // Convert and add learning units if provided
        if (request.getLearningUnits() != null && !request.getLearningUnits().isEmpty()) {
            for (LearningPlanDTO.LearningUnitDTO unitDTO : request.getLearningUnits()) {
                LearningPlan.LearningUnit unit = new LearningPlan.LearningUnit();
                unit.setTitle(unitDTO.getTitle());
                unit.setDescription(unitDTO.getDescription());
                unit.setOrderIndex(unitDTO.getOrderIndex());
                unit.setEstimatedHours(unitDTO.getEstimatedHours());

                if (unitDTO.getObjectives() != null) {
                    unit.setObjectives(unitDTO.getObjectives());
                }

                learningPlan.addLearningUnit(unit);
            }
        }

        // Save the learning plan
        LearningPlan savedPlan = learningPlanRepository.save(learningPlan);

        // Return the response DTO
        return new LearningPlanDTO.LearningPlanResponse(savedPlan);
    }

    public LearningPlanDTO.LearningPlanResponse getLearningPlanById(String id) {
        LearningPlan learningPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with id: " + id));

        // Increment view count
        learningPlan.setViewCount(learningPlan.getViewCount() + 1);
        learningPlanRepository.save(learningPlan);

        return new LearningPlanDTO.LearningPlanResponse(learningPlan);
    }

    public List<LearningPlanDTO.LearningPlanResponse> getLearningPlansByOwnerId(String ownerId) {
        List<LearningPlan> plans = learningPlanRepository.findByOwnerId(ownerId);
        return plans.stream()
                .map(LearningPlanDTO.LearningPlanResponse::new)
                .collect(Collectors.toList());
    }

    public Page<LearningPlanDTO.LearningPlanResponse> getPublicLearningPlans(Pageable pageable) {
        Page<LearningPlan> plans = learningPlanRepository.findAll(pageable);
        return plans.map(LearningPlanDTO.LearningPlanResponse::new);
    }

    public Page<LearningPlanDTO.LearningPlanResponse> searchLearningPlans(String query, String category, String skillLevel, Pageable pageable) {
        Page<LearningPlan> plans;

        if (category != null && skillLevel != null) {
            plans = learningPlanRepository.findByIsPublicTrueAndTitleContainingIgnoreCaseAndCategoryAndSkillLevel(query, category, skillLevel, pageable);
        } else if (category != null) {
            plans = learningPlanRepository.findByIsPublicTrueAndTitleContainingIgnoreCaseAndCategory(query, category, pageable);
        } else if (skillLevel != null) {
            plans = learningPlanRepository.findByIsPublicTrueAndTitleContainingIgnoreCaseAndSkillLevel(query, skillLevel, pageable);
        } else {
            plans = learningPlanRepository.findByIsPublicTrueAndTitleContainingIgnoreCase(query, pageable);
        }

        return plans.map(LearningPlanDTO.LearningPlanResponse::new);
    }

    public LearningPlanDTO.LearningPlanResponse updateLearningPlan(String id, LearningPlanDTO.UpdateLearningPlanRequest request) {
        LearningPlan existingPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with id: " + id));

        // Update basic fields if provided
        if (request.getTitle() != null) {
            existingPlan.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            existingPlan.setDescription(request.getDescription());
        }

        if (request.getCategory() != null) {
            existingPlan.setCategory(request.getCategory());
        }

        if (request.getSkillLevel() != null) {
            existingPlan.setSkillLevel(request.getSkillLevel());
        }

        if (request.getIsPublic() != null) {
            existingPlan.setPublic(request.getIsPublic());
        }

        if (request.getTargetCompletionDate() != null) {
            existingPlan.setTargetCompletionDate(request.getTargetCompletionDate());
        }

        if (request.getEstimatedHours() != null) {
            existingPlan.setEstimatedHours(request.getEstimatedHours());
        }

        // Update resources if provided
        if (request.getResources() != null) {
            existingPlan.setResources(request.getResources());
        }

        // Update tags if provided
        if (request.getTags() != null) {
            existingPlan.setTags(request.getTags());
        }

        // Update learning units if provided
        if (request.getLearningUnits() != null) {
            // Clear existing units and add new ones
            existingPlan.getLearningUnits().clear();

            for (LearningPlanDTO.LearningUnitDTO unitDTO : request.getLearningUnits()) {
                LearningPlan.LearningUnit unit = new LearningPlan.LearningUnit();

                // Preserve unit ID if it exists
                if (unitDTO.getUnitId() != null) {
                    unit.setUnitId(unitDTO.getUnitId());
                }

                unit.setTitle(unitDTO.getTitle());
                unit.setDescription(unitDTO.getDescription());
                unit.setOrderIndex(unitDTO.getOrderIndex());
                unit.setCompleted(unitDTO.isCompleted());
                unit.setCompletedAt(unitDTO.getCompletedAt());
                unit.setEstimatedHours(unitDTO.getEstimatedHours());

                if (unitDTO.getObjectives() != null) {
                    unit.setObjectives(unitDTO.getObjectives());
                }

                existingPlan.addLearningUnit(unit);
            }
        }

        // Update timestamp
        existingPlan.setUpdatedAt(new Date());

        // Save the updated plan
        LearningPlan updatedPlan = learningPlanRepository.save(existingPlan);

        return new LearningPlanDTO.LearningPlanResponse(updatedPlan);
    }

    public void deleteLearningPlan(String id) {
        if (!learningPlanRepository.existsById(id)) {
            throw new RuntimeException("Learning plan not found with id: " + id);
        }

        learningPlanRepository.deleteById(id);
    }

    public LearningPlanDTO.LearningPlanResponse completeLearningUnit(String planId, String unitId) {
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with id: " + planId));

        plan.completeLearningUnit(unitId);
        LearningPlan updatedPlan = learningPlanRepository.save(plan);

        return new LearningPlanDTO.LearningPlanResponse(updatedPlan);
    }

    public LearningPlanDTO.LearningPlanResponse forkLearningPlan(String planId, String userId) {
        // Get the original plan
        LearningPlan originalPlan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with id: " + planId));

        // Find the new owner
        AppUser newOwner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Create a copy of the plan
        LearningPlan forkedPlan = new LearningPlan();
        forkedPlan.setTitle("Fork of: " + originalPlan.getTitle());
        forkedPlan.setDescription(originalPlan.getDescription());
        forkedPlan.setCategory(originalPlan.getCategory());
        forkedPlan.setSkillLevel(originalPlan.getSkillLevel());
        forkedPlan.setPublic(false);  // Default to private for forked plans
        forkedPlan.setTargetCompletionDate(originalPlan.getTargetCompletionDate());
        forkedPlan.setEstimatedHours(originalPlan.getEstimatedHours());
        forkedPlan.setOwner(newOwner);
        forkedPlan.setResources(originalPlan.getResources());
        forkedPlan.setTags(originalPlan.getTags());

        // Copy learning units
        for (LearningPlan.LearningUnit originalUnit : originalPlan.getLearningUnits()) {
            LearningPlan.LearningUnit newUnit = new LearningPlan.LearningUnit();
            newUnit.setTitle(originalUnit.getTitle());
            newUnit.setDescription(originalUnit.getDescription());
            newUnit.setOrderIndex(originalUnit.getOrderIndex());
            newUnit.setEstimatedHours(originalUnit.getEstimatedHours());
            newUnit.setObjectives(originalUnit.getObjectives());

            forkedPlan.addLearningUnit(newUnit);
        }

        // Save the forked plan
        LearningPlan savedPlan = learningPlanRepository.save(forkedPlan);

        // Increment the fork count on the original plan
        originalPlan.setForkCount(originalPlan.getForkCount() + 1);
        learningPlanRepository.save(originalPlan);

        return new LearningPlanDTO.LearningPlanResponse(savedPlan);
    }

    public List<LearningPlanDTO.LearningPlanResponse> getLearningPlansByTags(List<String> tags) {
        List<LearningPlan> plans = learningPlanRepository.findByTagsInAndIsPublicTrue(tags);
        return plans.stream()
                .map(LearningPlanDTO.LearningPlanResponse::new)
                .collect(Collectors.toList());
    }

    public Page<LearningPlanDTO.LearningPlanResponse> getMostPopularLearningPlans(Pageable pageable) {
        Page<LearningPlan> plans = learningPlanRepository.findByIsPublicTrueOrderByViewCountDesc(pageable);
        return plans.map(LearningPlanDTO.LearningPlanResponse::new);
    }

    public Page<LearningPlanDTO.LearningPlanResponse> getMostForkedLearningPlans(Pageable pageable) {
        Page<LearningPlan> plans = learningPlanRepository.findByIsPublicTrueOrderByForkCountDesc(pageable);
        return plans.map(LearningPlanDTO.LearningPlanResponse::new);
    }

    public long countLearningPlansByOwner(String ownerId) {
        return learningPlanRepository.countByOwnerId(ownerId);
    }
}