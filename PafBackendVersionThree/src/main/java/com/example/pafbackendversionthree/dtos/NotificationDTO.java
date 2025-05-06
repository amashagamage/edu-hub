package com.example.pafbackendversionthree.dtos;

import com.example.pafbackendversionthree.models.Notification;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationDTO {

    // Base class for notification responses
    public static class NotificationResponseDTO {
        private String id;
        private UserDTO sender;
        private String type;
        private String message;
        private String targetType;
        private String targetId;
        private boolean read;
        private Date createdAt;
        private Date readAt;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public UserDTO getSender() {
            return sender;
        }

        public void setSender(UserDTO sender) {
            this.sender = sender;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getTargetType() {
            return targetType;
        }

        public void setTargetType(String targetType) {
            this.targetType = targetType;
        }

        public String getTargetId() {
            return targetId;
        }

        public void setTargetId(String targetId) {
            this.targetId = targetId;
        }

        public boolean isRead() {
            return read;
        }

        public void setRead(boolean read) {
            this.read = read;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }

        public Date getReadAt() {
            return readAt;
        }

        public void setReadAt(Date readAt) {
            this.readAt = readAt;
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

        // Factory method to convert Notification entity to NotificationResponseDTO
        public static NotificationResponseDTO fromNotification(Notification notification) {
            if (notification == null) return null;

            NotificationResponseDTO dto = new NotificationResponseDTO();
            dto.setId(notification.getId());
            dto.setType(notification.getType());
            dto.setMessage(notification.getMessage());
            dto.setTargetType(notification.getTargetType());
            dto.setTargetId(notification.getTargetId());
            dto.setRead(notification.isRead());
            dto.setCreatedAt(notification.getCreatedAt());
            dto.setReadAt(notification.getReadAt());
            dto.setSender(UserDTO.fromAppUser(notification.getSender()));

            return dto;
        }
    }

    // DTO for notification count (unread)
    public static class NotificationCountDTO {
        private long count;

        public NotificationCountDTO(long count) {
            this.count = count;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    // DTO for marking notifications as read
    public static class MarkReadRequestDTO {
        private String notificationId; // Optional, if not provided, mark all as read

        public String getNotificationId() {
            return notificationId;
        }

        public void setNotificationId(String notificationId) {
            this.notificationId = notificationId;
        }
    }
}