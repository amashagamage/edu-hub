package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.UserRelationship;
import com.example.pafbackendversionthree.models.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRelationshipRepository extends MongoRepository<UserRelationship, String> {

    // Check if a follow relationship exists
    boolean existsByFollowerAndFollowing(AppUser follower, AppUser following);

    // Find a specific follow relationship
    UserRelationship findByFollowerAndFollowing(AppUser follower, AppUser following);

    // Get all users that a specific user is following
    List<UserRelationship> findByFollower(AppUser follower);

    // Get all followers of a specific user
    List<UserRelationship> findByFollowing(AppUser following);

    // Count how many users a specific user is following
    long countByFollower(AppUser follower);

    // Count how many followers a specific user has
    long countByFollowing(AppUser following);
}