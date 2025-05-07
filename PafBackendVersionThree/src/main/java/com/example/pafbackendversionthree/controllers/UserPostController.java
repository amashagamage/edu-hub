package com.example.pafbackendversionthree.controllers;

import com.example.pafbackendversionthree.dtos.CreateUpdatePostDto;
import com.example.pafbackendversionthree.dtos.UserPostDto;
import com.example.pafbackendversionthree.services.UserPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class UserPostController {

    @Autowired
    private UserPostService userPostService;

    // Create a new post
    @PostMapping
    public ResponseEntity<UserPostDto> createPost(@RequestParam String userId, @RequestBody CreateUpdatePostDto createUpdatePostDto) {
        UserPostDto createdPost = userPostService.createPost(userId, createUpdatePostDto);
        return ResponseEntity.ok(createdPost);
    }

    // Update an existing post


    // Delete a post by ID
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId) {
        userPostService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // Get a single post by ID
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        try {
            UserPostDto post = userPostService.getPostById(postId);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            // Log the exception at controller level
            System.err.println("Controller error when fetching post with ID " + postId + ": " + e.getMessage());
            
            // Create a simplified error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to fetch post due to a server error");
            errorResponse.put("status", "500");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Get all posts
    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            List<UserPostDto> posts = userPostService.getAllPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            // Log the exception at controller level
            System.err.println("Controller error when fetching all posts: " + e.getMessage());
            
            // Create a simplified error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to fetch posts due to a server error");
            errorResponse.put("status", "500");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Get posts by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUser(@PathVariable String userId) {
        try {
            List<UserPostDto> posts = userPostService.getPostsByUser(userId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            // Log the exception at controller level
            System.err.println("Controller error when fetching posts for user " + userId + ": " + e.getMessage());
            
            // Create a simplified error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to fetch user's posts due to a server error");
            errorResponse.put("status", "500");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}