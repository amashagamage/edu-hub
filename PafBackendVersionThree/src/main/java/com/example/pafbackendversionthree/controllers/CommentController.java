package com.example.pafbackendversionthree.controllers;

import com.example.pafbackendversionthree.dtos.CommentDTO;
import com.example.pafbackendversionthree.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<CommentDTO.CommentResponseDTO> createComment(
            @RequestHeader("User-ID") String userId,
            @RequestBody CommentDTO.CommentRequestDTO commentRequestDTO) {

        CommentDTO.CommentResponseDTO createdComment = commentService.createComment(userId, commentRequestDTO);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO.CommentResponseDTO> updateComment(
            @PathVariable String commentId,
            @RequestHeader("User-ID") String userId,
            @RequestBody CommentDTO.CommentRequestDTO commentRequestDTO) {

        CommentDTO.CommentResponseDTO updatedComment = commentService.updateComment(commentId, userId, commentRequestDTO);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            @RequestHeader("User-ID") String userId) {

        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO.CommentResponseDTO>> getCommentsByPostId(
            @PathVariable String postId) {

        List<CommentDTO.CommentResponseDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CommentDTO.CommentResponseDTO>> getCommentsByUserId(
            @PathVariable String userId) {

        List<CommentDTO.CommentResponseDTO> comments = commentService.getCommentsByUserId(userId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentDTO.CommentResponseDTO> getCommentById(
            @PathVariable String commentId) {

        CommentDTO.CommentResponseDTO comment = commentService.getCommentById(commentId);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Map<String, Long>> getCommentCountForPost(
            @PathVariable String postId) {

        long count = commentService.getCommentCountForPost(postId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}