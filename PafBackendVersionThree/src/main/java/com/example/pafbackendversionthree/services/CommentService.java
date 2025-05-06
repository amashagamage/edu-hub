package com.example.pafbackendversionthree.services;

import com.example.pafbackendversionthree.dtos.CommentDTO;
import com.example.pafbackendversionthree.exceptions.ResourceNotFoundException;
import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.models.Comment;
import com.example.pafbackendversionthree.models.UserPost;
import com.example.pafbackendversionthree.repositories.CommentRepository;
import com.example.pafbackendversionthree.repositories.UserPostRepository;
import com.example.pafbackendversionthree.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserPostRepository userPostRepository;
    private final AppUserRepository appUserRepository;

    private final NotificationService notificationService;

    @Autowired
    public CommentService(
            CommentRepository commentRepository,
            UserPostRepository userPostRepository,
            AppUserRepository appUserRepository,
            NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.userPostRepository = userPostRepository;
        this.appUserRepository = appUserRepository;
        this.notificationService =notificationService;
    }

    public CommentDTO.CommentResponseDTO createComment(String userId, CommentDTO.CommentRequestDTO commentRequestDTO) {
        // Get the user
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Get the post
        UserPost post = userPostRepository.findById(commentRequestDTO.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + commentRequestDTO.getPostId()));

        // Create new comment
        Comment comment = new Comment();
        comment.setContent(commentRequestDTO.getContent());
        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(new Date());
        comment.setUpdatedAt(new Date());
        notificationService.createCommentNotification(comment);
        // Save comment
        Comment savedComment = commentRepository.save(comment);

        // Return response DTO
        return CommentDTO.CommentResponseDTO.fromComment(savedComment);
    }

    public CommentDTO.CommentResponseDTO updateComment(String commentId, String userId, CommentDTO.CommentRequestDTO commentRequestDTO) {
        // Get the comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Check if user is the owner of the comment
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("User is not authorized to update this comment");
        }

        // Update comment
        comment.setContent(commentRequestDTO.getContent());
        comment.setUpdatedAt(new Date());

        // Save updated comment
        Comment updatedComment = commentRepository.save(comment);

        // Return response DTO
        return CommentDTO.CommentResponseDTO.fromComment(updatedComment);
    }

    public void deleteComment(String commentId, String userId) {
        // Get the comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Check if user is the owner of the comment
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("User is not authorized to delete this comment");
        }

        // Delete comment
        commentRepository.delete(comment);
    }

    public List<CommentDTO.CommentResponseDTO> getCommentsByPostId(String postId) {
        // Check if post exists
        if (!userPostRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }

        // Get comments for the post, ordered by creation date (newest first)
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);

        // Convert to response DTOs
        return comments.stream()
                .map(CommentDTO.CommentResponseDTO::fromComment)
                .collect(Collectors.toList());
    }

    public List<CommentDTO.CommentResponseDTO> getCommentsByUserId(String userId) {
        // Check if user exists
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        // Get comments by the user
        List<Comment> comments = commentRepository.findByUserId(userId);

        // Convert to response DTOs
        return comments.stream()
                .map(CommentDTO.CommentResponseDTO::fromComment)
                .collect(Collectors.toList());
    }

    public CommentDTO.CommentResponseDTO getCommentById(String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        return CommentDTO.CommentResponseDTO.fromComment(comment);
    }

    public long getCommentCountForPost(String postId) {
        return commentRepository.countByPostId(postId);
    }
}