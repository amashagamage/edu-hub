package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.ProgressUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {

    // Find progress updates by user ID
    List<ProgressUpdate> findByUserId(String userId);

    // Find progress updates by related learning plan ID
    List<ProgressUpdate> findByRelatedPlanId(String planId);

    // Find progress updates by user ID and related plan ID
    List<ProgressUpdate> findByUserIdAndRelatedPlanId(String userId, String planId);

    // Find progress updates by learning unit ID
    List<ProgressUpdate> findByLearningUnitId(String unitId);

    // Find public progress updates
    List<ProgressUpdate> findByIsPublicTrue();

    // Find progress updates by type
    List<ProgressUpdate> findByType(ProgressUpdate.ProgressType type);

    // Find progress updates by user ID and type
    List<ProgressUpdate> findByUserIdAndType(String userId, ProgressUpdate.ProgressType type);
}