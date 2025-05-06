package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.LearningPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {

    // Find plans by owner ID
    @Query("{'owner.$id': ?0}")
    List<LearningPlan> findByOwnerId(String ownerId);

    // Count plans by owner ID
    @Query(value = "{'owner.$id': ?0}", count = true)
    long countByOwnerId(String ownerId);

    // Find public plans
    Page<LearningPlan> findByIsPublicTrue(Pageable pageable);

    // Find public plans by title (search functionality)
    Page<LearningPlan> findByIsPublicTrueAndTitleContainingIgnoreCase(String title, Pageable pageable);

    // Find public plans by title and category
    Page<LearningPlan> findByIsPublicTrueAndTitleContainingIgnoreCaseAndCategory(String title, String category, Pageable pageable);

    // Find public plans by title and skill level
    Page<LearningPlan> findByIsPublicTrueAndTitleContainingIgnoreCaseAndSkillLevel(String title, String skillLevel, Pageable pageable);

    // Find public plans by title, category and skill level
    Page<LearningPlan> findByIsPublicTrueAndTitleContainingIgnoreCaseAndCategoryAndSkillLevel(
            String title, String category, String skillLevel, Pageable pageable);

    // Find public plans by tag(s)
    @Query("{'tags': {$in: ?0}, 'isPublic': true}")
    List<LearningPlan> findByTagsInAndIsPublicTrue(List<String> tags);

    // Get most viewed public plans
    Page<LearningPlan> findByIsPublicTrueOrderByViewCountDesc(Pageable pageable);

    // Get most forked public plans
    Page<LearningPlan> findByIsPublicTrueOrderByForkCountDesc(Pageable pageable);

    // Find recently updated public plans
    Page<LearningPlan> findByIsPublicTrueOrderByUpdatedAtDesc(Pageable pageable);

    // Find plans by category and public visibility
    Page<LearningPlan> findByCategoryAndIsPublicTrue(String category, Pageable pageable);

    // Find plans by skill level and public visibility
    Page<LearningPlan> findBySkillLevelAndIsPublicTrue(String skillLevel, Pageable pageable);

    // Find completed plans by owner ID
    @Query("{'owner.$id': ?0, 'isCompleted': true}")
    List<LearningPlan> findByOwnerIdAndIsCompletedTrue(String ownerId);

    // Find plans by multiple categories
    @Query("{'category': {$in: ?0}, 'isPublic': true}")
    Page<LearningPlan> findByCategoryInAndIsPublicTrue(List<String> categories, Pageable pageable);

    // Find plans with completion percentage calculation
    @Query(value = "{'isPublic': true}", sort = "{'estimatedHours': -1}")
    Page<LearningPlan> findLargestPlans(Pageable pageable);
}