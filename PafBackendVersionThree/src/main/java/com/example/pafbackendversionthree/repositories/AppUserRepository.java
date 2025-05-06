package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findAppUserById(String id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}