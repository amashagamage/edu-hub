package com.example.pafbackendversionthree.dtos;

import com.example.pafbackendversionthree.models.Like;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LikeDTO {

    // Request DTO for liking or unliking posts
    public static class LikeRequestDTO {
        private String postId;

        public String getPostId() {
            return postId;
        }

        public void setPostId(String postId) {
            this.postId = postId;
        }
    }

    // Response DTO for returning like with user details
    public static class LikeResponseDTO {
        private String id;
        private UserDTO user;
        private String postId;
        private Date createdAt;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public UserDTO getUser() {
            return user;
        }

        public void setUser(UserDTO user) {
            this.user = user;
        }

        public String getPostId() {
            return postId;
        }

        public void setPostId(String postId) {
            this.postId = postId;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }

        // Embedded UserDTO to include minimal user info
        public static class UserDTO {
            private String id;
            private String username;
            private String profileImageUrl;

            public String getId() {
                return id;
            }

            public void setId(String id) {
                this.id = id;
            }

            public String getUsername() {
                return username;
            }

            public void setUsername(String username) {
                this.username = username;
            }

            public String getProfileImageUrl() {
                return profileImageUrl;
            }

            public void setProfileImageUrl(String profileImageUrl) {
                this.profileImageUrl = profileImageUrl;
            }

            // Factory method to create UserDTO from AppUser
            public static UserDTO fromAppUser(com.example.pafbackendversionthree.models.AppUser user) {
                if (user == null) return null;

                UserDTO dto = new UserDTO();
                dto.setId(user.getId());
                dto.setUsername(user.getUsername());
                dto.setProfileImageUrl(user.getProfileImageUrl());
                return dto;
            }
        }

        // Factory method to convert Like entity to LikeResponseDTO
        public static LikeResponseDTO fromLike(Like like) {
            if (like == null) return null;

            LikeResponseDTO dto = new LikeResponseDTO();
            dto.setId(like.getId());
            dto.setCreatedAt(like.getCreatedAt());
            dto.setUser(UserDTO.fromAppUser(like.getUser()));

            if (like.getPost() != null) {
                dto.setPostId(like.getPost().getId());
            }

            return dto;
        }
    }

    // Summary DTO for like counts and status
    public static class LikeSummaryDTO {
        private long count;
        private boolean liked;

        public LikeSummaryDTO(long count, boolean liked) {
            this.count = count;
            this.liked = liked;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }

        public boolean isLiked() {
            return liked;
        }

        public void setLiked(boolean liked) {
            this.liked = liked;
        }
    }
}