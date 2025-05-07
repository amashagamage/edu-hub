package com.example.pafbackendversionthree.services;

import com.example.pafbackendversionthree.dtos.LikeDTO;
import com.example.pafbackendversionthree.exceptions.ResourceNotFoundException;
import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.models.Like;
import com.example.pafbackendversionthree.models.UserPost;
import com.example.pafbackendversionthree.repositories.AppUserRepository;
import com.example.pafbackendversionthree.repositories.LikeRepository;
import com.example.pafbackendversionthree.repositories.UserPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserPostRepository userPostRepository;
    private final AppUserRepository appUserRepository;

    private final NotificationService notificationService;

    @Autowired
    public LikeService(
            LikeRepository likeRepository,
            UserPostRepository userPostRepository,
            AppUserRepository appUserRepository,NotificationService notificationService) {
        this.likeRepository = likeRepository;
        this.userPostRepository = userPostRepository;
        this.appUserRepository = appUserRepository;
        this.notificationService= notificationService;
    }

    public LikeDTO.LikeResponseDTO toggleLike(String userId, LikeDTO.LikeRequestDTO likeRequestDTO) {
        // Get the user
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Get the post
        UserPost post = userPostRepository.findById(likeRequestDTO.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + likeRequestDTO.getPostId()));

        // Check if like already exists
        Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(userId, likeRequestDTO.getPostId());

        if (existingLike.isPresent()) {
            // If like exists, remove it (unlike)
            likeRepository.delete(existingLike.get());
            return null; // Returning null indicates post was unliked
        } else {
            try {
                // If like doesn't exist, create it
                Like like = new Like();
                like.setUser(user);
                like.setPost(post);
                notificationService.createLikeNotification(like);
                // Save like
                Like savedLike = likeRepository.save(like);


                // Return response DTO
                return LikeDTO.LikeResponseDTO.fromLike(savedLike);
            } catch (Exception e) {
                // Check if this is a duplicate key error
                if (e.getMessage() != null && e.getMessage().contains("duplicate key error")) {

                    Optional<Like> concurrentLike = likeRepository.findByUserIdAndPostId(userId, likeRequestDTO.getPostId());
                    if (concurrentLike.isPresent()) {
                        likeRepository.delete(concurrentLike.get());
                    }
                    return null;
                }
                // For other errors, rethrow
                throw e;
            }
        }
    }

    public void unlikePost(String userId, String postId) {
        // Check if user exists
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        // Check if post exists
        if (!userPostRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }

        // Delete the like
        likeRepository.deleteByUserIdAndPostId(userId, postId);
    }

    public List<LikeDTO.LikeResponseDTO> getLikesByPostId(String postId) {
        // Check if post exists
        if (!userPostRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }

        // Get likes for the post
        List<Like> likes = likeRepository.findByPostId(postId);

        // Convert to response DTOs
        return likes.stream()
                .map(LikeDTO.LikeResponseDTO::fromLike)
                .collect(Collectors.toList());
    }

    public List<LikeDTO.LikeResponseDTO> getLikesByUserId(String userId) {
        // Check if user exists
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        // Get likes by the user
        List<Like> likes = likeRepository.findByUserId(userId);

        // Convert to response DTOs
        return likes.stream()
                .map(LikeDTO.LikeResponseDTO::fromLike)
                .collect(Collectors.toList());
    }

    public LikeDTO.LikeSummaryDTO getLikeSummaryForPost(String postId, String userId) {
        // Get like count for post
        long count = likeRepository.countByPostId(postId);

        // Check if user has liked the post
        boolean liked = false;
        if (userId != null) {
            liked = likeRepository.existsByUserIdAndPostId(userId, postId);
        }

        return new LikeDTO.LikeSummaryDTO(count, liked);
    }

    public boolean hasUserLikedPost(String userId, String postId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }

    public long getLikeCountForPost(String postId) {
        return likeRepository.countByPostId(postId);
    }
}