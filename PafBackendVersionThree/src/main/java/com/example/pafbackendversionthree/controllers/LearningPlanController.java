package com.example.pafbackendversionthree.controllers;

import com.example.pafbackendversionthree.dtos.LearningPlanDTO;
import com.example.pafbackendversionthree.services.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    @PostMapping
    public ResponseEntity<LearningPlanDTO.LearningPlanResponse> createLearningPlan(
            @RequestBody LearningPlanDTO.CreateLearningPlanRequest request) {
        LearningPlanDTO.LearningPlanResponse response = learningPlanService.createLearningPlan(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlanDTO.LearningPlanResponse> getLearningPlanById(@PathVariable String id) {
        LearningPlanDTO.LearningPlanResponse response = learningPlanService.getLearningPlanById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<LearningPlanDTO.LearningPlanResponse>> getLearningPlansByOwnerId(
            @PathVariable String ownerId) {
        List<LearningPlanDTO.LearningPlanResponse> responses = learningPlanService.getLearningPlansByOwnerId(ownerId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/public")
    public ResponseEntity<Page<LearningPlanDTO.LearningPlanResponse>> getPublicLearningPlans(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<LearningPlanDTO.LearningPlanResponse> responses = learningPlanService.getPublicLearningPlans(pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<LearningPlanDTO.LearningPlanResponse>> searchLearningPlans(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String skillLevel,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<LearningPlanDTO.LearningPlanResponse> responses = learningPlanService.searchLearningPlans(
                query, category, skillLevel, pageable);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlanDTO.LearningPlanResponse> updateLearningPlan(
            @PathVariable String id,
            @RequestBody LearningPlanDTO.UpdateLearningPlanRequest request) {
        LearningPlanDTO.LearningPlanResponse response = learningPlanService.updateLearningPlan(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        learningPlanService.deleteLearningPlan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{planId}/complete-unit/{unitId}")
    public ResponseEntity<LearningPlanDTO.LearningPlanResponse> completeLearningUnit(
            @PathVariable String planId,
            @PathVariable String unitId) {
        LearningPlanDTO.LearningPlanResponse response = learningPlanService.completeLearningUnit(planId, unitId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{planId}/fork")
    public ResponseEntity<LearningPlanDTO.LearningPlanResponse> forkLearningPlan(
            @PathVariable String planId,
            @RequestParam String userId) {
        LearningPlanDTO.LearningPlanResponse response = learningPlanService.forkLearningPlan(planId, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/by-tags")
    public ResponseEntity<List<LearningPlanDTO.LearningPlanResponse>> getLearningPlansByTags(
            @RequestParam List<String> tags) {
        List<LearningPlanDTO.LearningPlanResponse> responses = learningPlanService.getLearningPlansByTags(tags);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/popular")
    public ResponseEntity<Page<LearningPlanDTO.LearningPlanResponse>> getMostPopularLearningPlans(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<LearningPlanDTO.LearningPlanResponse> responses = learningPlanService.getMostPopularLearningPlans(pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/most-forked")
    public ResponseEntity<Page<LearningPlanDTO.LearningPlanResponse>> getMostForkedLearningPlans(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<LearningPlanDTO.LearningPlanResponse> responses = learningPlanService.getMostForkedLearningPlans(pageable);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countLearningPlansByOwner(@RequestParam String ownerId) {
        long count = learningPlanService.countLearningPlansByOwner(ownerId);
        return ResponseEntity.ok(count);
    }
}