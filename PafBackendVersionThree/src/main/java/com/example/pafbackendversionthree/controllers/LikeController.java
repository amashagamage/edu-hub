package com.example.pafbackendversionthree.controllers;



import com.example.pafbackendversionthree.dtos.LikeDTO;
import com.example.pafbackendversionthree.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(
            @RequestHeader("User-ID") String userId,
            @RequestBody LikeDTO.LikeRequestDTO likeRequestDTO) {

        LikeDTO.LikeResponseDTO result = likeService.toggleLike(userId, likeRequestDTO);

        if (result == null) {
            // If null is returned, post was unliked
            return ResponseEntity.noContent().build();
        } else {
            // If DTO is returned, post was liked
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> unlikePost(
            @PathVariable String postId,
            @RequestHeader("User-ID") String userId) {

        likeService.unlikePost(userId, postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<LikeDTO.LikeResponseDTO>> getLikesByPostId(
            @PathVariable String postId) {

        List<LikeDTO.LikeResponseDTO> likes = likeService.getLikesByPostId(postId);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LikeDTO.LikeResponseDTO>> getLikesByUserId(
            @PathVariable String userId) {

        List<LikeDTO.LikeResponseDTO> likes = likeService.getLikesByUserId(userId);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/summary/{postId}")
    public ResponseEntity<LikeDTO.LikeSummaryDTO> getLikeSummaryForPost(
            @PathVariable String postId,
            @RequestHeader(value = "User-ID", required = false) String userId) {

        LikeDTO.LikeSummaryDTO summary = likeService.getLikeSummaryForPost(postId, userId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/check/{postId}")
    public ResponseEntity<Map<String, Boolean>> checkIfUserLikedPost(
            @PathVariable String postId,
            @RequestHeader("User-ID") String userId) {

        boolean hasLiked = likeService.hasUserLikedPost(userId, postId);
        return ResponseEntity.ok(Map.of("liked", hasLiked));
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Map<String, Long>> getLikeCountForPost(
            @PathVariable String postId) {

        long count = likeService.getLikeCountForPost(postId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}