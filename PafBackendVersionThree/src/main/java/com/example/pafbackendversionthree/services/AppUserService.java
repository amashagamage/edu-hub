package com.example.pafbackendversionthree.services;


import com.example.pafbackendversionthree.dtos.AppUserDTO;
import com.example.pafbackendversionthree.dtos.UserProfileDTO;
import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public AppUserService(AppUserRepository appUserRepository,
                          PasswordEncoder passwordEncoder
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;

    }


    public AppUser createUser(AppUserDTO appUserDTO) {
        // Check if username or email already exists
        if (appUserRepository.existsByUsername(appUserDTO.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (appUserRepository.existsByEmail(appUserDTO.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        // Create new user
        AppUser user = new AppUser();
        user.setFirstName(appUserDTO.getFirstName());
        user.setLastName(appUserDTO.getLastName());
        user.setBio(appUserDTO.getBio());
        user.setProfileImageUrl(appUserDTO.getProfileImageUrl());
        user.setUsername(appUserDTO.getUsername());
        user.setEmail(appUserDTO.getEmail());
        user.setContactNumber(appUserDTO.getContactNumber());
        user.setPassword(passwordEncoder.encode(appUserDTO.getPassword()));
        user.setPublicStatus(appUserDTO.isPublicStatus());
        user.setGender(appUserDTO.getGender());
        user.setAddress(appUserDTO.getAddress());
        user.setBirthday(appUserDTO.getBirthday());
        return appUserRepository.save(user);
    }

    public List<UserProfileDTO> getAllUsers() {
        return appUserRepository.findAll().stream()
                .filter(user -> !user.isDeleteStatus())
                .map(this::convertToUserProfileDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserProfileDTO> getUserById(String id) {
        return appUserRepository.findById(id)
                .filter(user -> !user.isDeleteStatus())
                .map(this::convertToUserProfileDTO);
    }

    public Optional<UserProfileDTO> updateUser(String id, AppUserDTO appUserDTO) {
        return appUserRepository.findById(id)
                .map(existingUser -> {

                    if (!existingUser.isDeleteStatus()) {
                        System.out.println("======= Before setting: " + appUserDTO.getProfileImageUrl());
                        existingUser.setFirstName(appUserDTO.getFirstName());
                        existingUser.setLastName(appUserDTO.getLastName());
                        existingUser.setBio(appUserDTO.getBio());
                        existingUser.setProfileImageUrl(appUserDTO.getProfileImageUrl());
                        System.out.println("======= After setting: " + existingUser.getProfileImageUrl());
                        existingUser.setContactNumber(appUserDTO.getContactNumber());
                        existingUser.setPublicStatus(appUserDTO.isPublicStatus());
                        existingUser.setUpdatedAt(new Date());
                        existingUser.setGender(appUserDTO.getGender());
                        existingUser.setAddress(appUserDTO.getAddress());
                        existingUser.setBirthday(appUserDTO.getBirthday());
                        // Only update password if it's provided
                        if (appUserDTO.getPassword() != null && !appUserDTO.getPassword().isEmpty()) {
                            existingUser.setPassword(passwordEncoder.encode(appUserDTO.getPassword()));
                        }

                        AppUser updatedUser = appUserRepository.save(existingUser);
                        System.out.println("======= After save: " + updatedUser.getProfileImageUrl());
                        return convertToUserProfileDTO(updatedUser);
                    }
                    return null;
                });
    }

    public boolean deleteUser(String id) {
        return appUserRepository.findById(id)
                .map(user -> {
                    if (!user.isDeleteStatus()) {
                        user.setDeleteStatus(true);
                        user.setUpdatedAt(new Date());
                        appUserRepository.save(user);
                        return true;
                    }
                    return false;
                }).orElse(false);
    }

    private UserProfileDTO convertToUserProfileDTO(AppUser user) {
        System.out.println("======= "+user.getProfileImageUrl());
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setBio(user.getBio());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setContactNumber(user.getContactNumber());
        dto.setPublicStatus(user.isPublicStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setAddress(user.getAddress());
        dto.setBirthday(user.getBirthday());
        dto.setGender(user.getGender());
        return dto;
    }

    public static class UserPostService {
    }
}