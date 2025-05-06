package com.example.pafbackendversionthree.services;

import com.example.pafbackendversionthree.dtos.CreateUpdatePostDto;
import com.example.pafbackendversionthree.dtos.UserPostDto;
import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.models.UserPost;
import com.example.pafbackendversionthree.repositories.UserPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserPostService {

    @Autowired
    private UserPostRepository userPostRepository;

    // Create a new post
    public UserPostDto createPost(String userId, CreateUpdatePostDto createUpdatePostDto) {
        AppUser appUser = new AppUser();
        appUser.setId(userId);

        UserPost post = new UserPost();
        post.setPostedBy(appUser);
        post.setTitle(createUpdatePostDto.getTitle());
        post.setDescription(createUpdatePostDto.getDescription());
        post.setMedias(
                createUpdatePostDto.getMedias().stream()
                        .map(media -> new UserPost.Media(media.getUrl(), media.getType()))
                        .collect(Collectors.toList())
        );

        UserPost savedPost = userPostRepository.save(post);
        return mapToDto(savedPost);
    }

    // Update an existing post
    public UserPostDto updatePost(String postId, CreateUpdatePostDto createUpdatePostDto) {
        Optional<UserPost> optionalPost = userPostRepository.findById(postId);
        if (optionalPost.isEmpty()) {
            throw new RuntimeException("Post not found with ID: " + postId);
        }

        UserPost post = optionalPost.get();
        post.setTitle(createUpdatePostDto.getTitle());
        post.setDescription(createUpdatePostDto.getDescription());
        post.setMedias(
                createUpdatePostDto.getMedias().stream()
                        .map(media -> new UserPost.Media(media.getUrl(), media.getType()))
                        .collect(Collectors.toList())
        );

        UserPost updatedPost = userPostRepository.save(post);
        return mapToDto(updatedPost);
    }

    // Delete a post by ID
    public void deletePost(String postId) {
        userPostRepository.deleteById(postId);
    }

    // Get a single post by ID
    public UserPostDto getPostById(String postId) {
        Optional<UserPost> optionalPost = userPostRepository.findById(postId);
        if (optionalPost.isEmpty()) {
            throw new RuntimeException("Post not found with ID: " + postId);
        }
        return mapToDto(optionalPost.get());
    }

    // Get all posts
    public List<UserPostDto> getAllPosts() {
        try {
            return userPostRepository.findAll().stream()
                .map(this::mapToDto)
                .filter(dto -> dto != null) // Filter out any null DTOs
                .collect(Collectors.toList());
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error fetching all posts: " + e.getMessage());
            e.printStackTrace();
            // Re-throw to be handled by global exception handler
            throw e;
        }
    }

    // Get posts by a specific user
    public List<UserPostDto> getPostsByUser(String userId) {
        try {
            return userPostRepository.findByPostedById(userId).stream()
                .map(this::mapToDto)
                .filter(dto -> dto != null) // Filter out any null DTOs
                .collect(Collectors.toList());
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error fetching posts for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            // Re-throw to be handled by global exception handler
            throw e;
        }
    }

    // Map Entity to DTO
    private UserPostDto mapToDto(UserPost post) {
        try {
            if (post == null) {
                return null;
            }

            // Check if postedBy is not null
            UserPostDto.PostedBy postedBy = null;
            if (post.getPostedBy() != null) {
                postedBy = new UserPostDto.PostedBy(
                    post.getPostedBy().getId(),
                    post.getPostedBy().getFirstName() != null ? post.getPostedBy().getFirstName() : "",
                    post.getPostedBy().getLastName() != null ? post.getPostedBy().getLastName() : "",
                    post.getPostedBy().getProfileImageUrl() != null ? post.getPostedBy().getProfileImageUrl() : ""
                );
            } else {
                // Create a default PostedBy with empty values if the user is null
                postedBy = new UserPostDto.PostedBy("", "", "", "");
            }

            // Check if medias is not null
            List<UserPostDto.Media> medias = new ArrayList<>();
            if (post.getMedias() != null) {
                medias = post.getMedias().stream()
                    .filter(media -> media != null)
                    .map(media -> new UserPostDto.Media(
                        media.getUrl() != null ? media.getUrl() : "",
                        media.getType() != null ? media.getType() : ""
                    ))
                    .collect(Collectors.toList());
            }

            return new UserPostDto(
                post.getId() != null ? post.getId() : "",
                postedBy,
                post.getPostedAt() != null ? post.getPostedAt() : new Date(),
                post.getTitle() != null ? post.getTitle() : "",
                post.getDescription() != null ? post.getDescription() : "",
                medias
            );
        } catch (Exception e) {
            System.err.println("Error mapping post to DTO: " + e.getMessage());
            e.printStackTrace();
            return null; // Return null to be filtered out in the stream
        }
    }
}