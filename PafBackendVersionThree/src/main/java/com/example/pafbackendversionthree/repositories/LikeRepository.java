package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    List<Like> findByUserId(String userId);

    @Query("{'user.$id': ?0, 'post.$id': ?1}")
    Optional<Like> findByUserIdAndPostId(String userId, String postId);

    boolean existsByUserIdAndPostId(String userId, String postId);

    long countByPostId(String postId);

    void deleteByUserIdAndPostId(String userId, String postId);
}