package com.example.pafbackendversionthree.controllers;

import com.example.pafbackendversionthree.dtos.ProgressUpdateDTO;
import com.example.pafbackendversionthree.services.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
public class ProgressUpdateController {

    private final ProgressUpdateService progressUpdateService;

    @Autowired
    public ProgressUpdateController(ProgressUpdateService progressUpdateService) {
        this.progressUpdateService = progressUpdateService;
    }

    /**
     * Create a new progress update
     */
    @PostMapping
    public ResponseEntity<ProgressUpdateDTO.ProgressUpdateResponse> createProgressUpdate(
            @RequestBody ProgressUpdateDTO.CreateProgressUpdateRequest request) {
        ProgressUpdateDTO.ProgressUpdateResponse response = progressUpdateService.createProgressUpdate(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all progress updates
     */
    @GetMapping
    public ResponseEntity<List<ProgressUpdateDTO.ProgressUpdateResponse>> getAllProgressUpdates() {
        List<ProgressUpdateDTO.ProgressUpdateResponse> updates = progressUpdateService.getAllProgressUpdates();
        return ResponseEntity.ok(updates);
    }

    /**
     * Get a progress update by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdateDTO.ProgressUpdateResponse> getProgressUpdateById(@PathVariable String id) {
        ProgressUpdateDTO.ProgressUpdateResponse update = progressUpdateService.getProgressUpdateById(id);
        return ResponseEntity.ok(update);
    }

    /**
     * Get progress updates by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdateDTO.ProgressUpdateResponse>> getProgressUpdatesByUserId(
            @PathVariable String userId) {
        List<ProgressUpdateDTO.ProgressUpdateResponse> updates = progressUpdateService.getProgressUpdatesByUserId(userId);
        return ResponseEntity.ok(updates);
    }

    /**
     * Get progress updates by learning plan ID
     */
    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<ProgressUpdateDTO.ProgressUpdateResponse>> getProgressUpdatesByPlanId(
            @PathVariable String planId) {
        List<ProgressUpdateDTO.ProgressUpdateResponse> updates = progressUpdateService.getProgressUpdatesByPlanId(planId);
        return ResponseEntity.ok(updates);
    }

    /**
     * Get progress updates by learning unit ID
     */
    @GetMapping("/unit/{unitId}")
    public ResponseEntity<List<ProgressUpdateDTO.ProgressUpdateResponse>> getProgressUpdatesByUnitId(
            @PathVariable String unitId) {
        List<ProgressUpdateDTO.ProgressUpdateResponse> updates = progressUpdateService.getProgressUpdatesByUnitId(unitId);
        return ResponseEntity.ok(updates);
    }

    /**
     * Get all public progress updates
     */
    @GetMapping("/public")
    public ResponseEntity<List<ProgressUpdateDTO.ProgressUpdateResponse>> getPublicProgressUpdates() {
        List<ProgressUpdateDTO.ProgressUpdateResponse> updates = progressUpdateService.getPublicProgressUpdates();
        return ResponseEntity.ok(updates);
    }

    /**
     * Update a progress update
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProgressUpdateDTO.ProgressUpdateResponse> updateProgressUpdate(
            @PathVariable String id,
            @RequestBody ProgressUpdateDTO.UpdateProgressUpdateRequest request) {
        ProgressUpdateDTO.ProgressUpdateResponse update = progressUpdateService.updateProgressUpdate(id, request);
        return ResponseEntity.ok(update);
    }

    /**
     * Delete a progress update
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressUpdate(@PathVariable String id) {
        progressUpdateService.deleteProgressUpdate(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Like a progress update
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<ProgressUpdateDTO.ProgressUpdateResponse> likeProgressUpdate(@PathVariable String id) {
        ProgressUpdateDTO.ProgressUpdateResponse update = progressUpdateService.likeProgressUpdate(id);
        return ResponseEntity.ok(update);
    }

    /**
     * Unlike a progress update
     */
    @PostMapping("/{id}/unlike")
    public ResponseEntity<ProgressUpdateDTO.ProgressUpdateResponse> unlikeProgressUpdate(@PathVariable String id) {
        ProgressUpdateDTO.ProgressUpdateResponse update = progressUpdateService.unlikeProgressUpdate(id);
        return ResponseEntity.ok(update);
    }

    /**
     * Mark a progress update as viewed by a user
     */
    @PostMapping("/{id}/view")
    public ResponseEntity<ProgressUpdateDTO.ProgressUpdateResponse> markAsViewed(
            @PathVariable String id,
            @RequestBody String userId) {
        ProgressUpdateDTO.ProgressUpdateResponse update = progressUpdateService.markAsViewed(id, userId);
        return ResponseEntity.ok(update);
    }

    /**
     * Create a progress update from template
     */
    @PostMapping("/template")
    public ResponseEntity<ProgressUpdateDTO.ProgressUpdateResponse> createFromTemplate(
            @RequestParam String userId,
            @RequestParam(required = false) String planId,
            @RequestParam String templateType) {
        ProgressUpdateDTO.ProgressUpdateResponse update = progressUpdateService.createFromTemplate(userId, planId, templateType);
        return new ResponseEntity<>(update, HttpStatus.CREATED);
    }
}