package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.Comment;
import com.example.pafbackendversionthree.models.UserPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    List<Comment> findByUserId(String userId);
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);
    long countByPostId(String postId);
}