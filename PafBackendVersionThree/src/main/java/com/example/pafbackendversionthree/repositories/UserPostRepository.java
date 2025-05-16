package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.UserPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPostRepository extends MongoRepository<UserPost, String> {

    // Find all posts by a specific user
    List<UserPost> findByPostedById(String userId);
}