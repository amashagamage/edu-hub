package com.example.pafbackendversionthree.dtos;

import com.example.pafbackendversionthree.models.Comment;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentDTO {

    // Base class for common DTO fields
    public static class BaseCommentDTO {
        private String id;
        private String content;
        private Date createdAt;
        private Date updatedAt;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }

        public Date getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(Date updatedAt) {
            this.updatedAt = updatedAt;
        }
    }

    // Request DTO for creating or updating comments
    public static class CommentRequestDTO {
        private String content;
        private String postId;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getPostId() {
            return postId;
        }

        public void setPostId(String postId) {
            this.postId = postId;
        }
    }

    // Response DTO for returning comment with user details
    public static class CommentResponseDTO extends BaseCommentDTO {
        private UserDTO user;
        private String postId;

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

        // Factory method to convert Comment entity to CommentResponseDTO
        public static CommentResponseDTO fromComment(Comment comment) {
            if (comment == null) return null;

            CommentResponseDTO dto = new CommentResponseDTO();
            dto.setId(comment.getId());
            dto.setContent(comment.getContent());
            dto.setCreatedAt(comment.getCreatedAt());
            dto.setUpdatedAt(comment.getUpdatedAt());
            dto.setUser(UserDTO.fromAppUser(comment.getUser()));

            if (comment.getPost() != null) {
                dto.setPostId(comment.getPost().getId());
            }

            return dto;
        }
    }
}