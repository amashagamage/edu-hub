package com.example.pafbackendversionthree.controllers;

import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.services.UserRelationshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relationships")
public class UserRelationshipController {

    private final UserRelationshipService relationshipService;

    @Autowired
    public UserRelationshipController(UserRelationshipService relationshipService) {
        this.relationshipService = relationshipService;
    }

    @PostMapping("/follow/{followerId}/{followingId}")
    public ResponseEntity<?> followUser(
            @PathVariable String followerId,
            @PathVariable String followingId) {
        try {
            return ResponseEntity.ok(relationshipService.followUser(followerId, followingId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/unfollow/{followerId}/{followingId}")
    public ResponseEntity<?> unfollowUser(
            @PathVariable String followerId,
            @PathVariable String followingId) {
        try {
            relationshipService.unfollowUser(followerId, followingId);
            return ResponseEntity.ok("Successfully unfollowed user");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<AppUser>> getFollowing(@PathVariable String userId) {
        return ResponseEntity.ok(relationshipService.getFollowing(userId));
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<AppUser>> getFollowers(@PathVariable String userId) {
        return ResponseEntity.ok(relationshipService.getFollowers(userId));
    }

    @GetMapping("/isFollowing/{followerId}/{followingId}")
    public ResponseEntity<Boolean> isFollowing(
            @PathVariable String followerId,
            @PathVariable String followingId) {
        return ResponseEntity.ok(relationshipService.isFollowing(followerId, followingId));
    }

    @GetMapping("/following/count/{userId}")
    public ResponseEntity<Long> getFollowingCount(@PathVariable String userId) {
        return ResponseEntity.ok(relationshipService.getFollowingCount(userId));
    }

    @GetMapping("/followers/count/{userId}")
    public ResponseEntity<Long> getFollowersCount(@PathVariable String userId) {
        return ResponseEntity.ok(relationshipService.getFollowersCount(userId));
    }
}