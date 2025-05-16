package com.example.pafbackendversionthree.services;

import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.models.UserRelationship;
import com.example.pafbackendversionthree.repositories.AppUserRepository;
import com.example.pafbackendversionthree.repositories.UserRelationshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserRelationshipService {

    private final UserRelationshipRepository relationshipRepository;
    private final AppUserRepository userRepository;

    @Autowired
    public UserRelationshipService(UserRelationshipRepository relationshipRepository,
                                   AppUserRepository userRepository) {
        this.relationshipRepository = relationshipRepository;
        this.userRepository = userRepository;
    }

    // Follow a user
    public UserRelationship followUser(String followerId, String followingId) {
        AppUser follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower user not found"));

        AppUser following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        // Check if already following
        if (relationshipRepository.existsByFollowerAndFollowing(follower, following)) {
            throw new RuntimeException("You are already following this user");
        }

        // Prevent self-follow
        if (followerId.equals(followingId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        UserRelationship relationship = new UserRelationship();
        relationship.setFollower(follower);
        relationship.setFollowing(following);

        return relationshipRepository.save(relationship);
    }

    // Unfollow a user
    public void unfollowUser(String followerId, String followingId) {
        AppUser follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower user not found"));

        AppUser following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

        UserRelationship relationship = relationshipRepository.findByFollowerAndFollowing(follower, following)
               ;

        relationshipRepository.delete(relationship);
    }

    // Get all users that a specific user is following
    public List<AppUser> getFollowing(String userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return relationshipRepository.findByFollower(user).stream()
                .map(UserRelationship::getFollowing)
                .collect(Collectors.toList());
    }

    // Get all followers of a specific user
    public List<AppUser> getFollowers(String userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return relationshipRepository.findByFollowing(user).stream()
                .map(UserRelationship::getFollower)
                .collect(Collectors.toList());
    }

    // Check if a user is following another user
    public boolean isFollowing(String followerId, String followingId) {
        AppUser follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower user not found"));

        AppUser following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to check not found"));

        return relationshipRepository.existsByFollowerAndFollowing(follower, following);
    }

    // Get count of users a specific user is following
    public long getFollowingCount(String userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return relationshipRepository.countByFollower(user);
    }

    // Get count of followers for a specific user
    public long getFollowersCount(String userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return relationshipRepository.countByFollowing(user);
    }
}