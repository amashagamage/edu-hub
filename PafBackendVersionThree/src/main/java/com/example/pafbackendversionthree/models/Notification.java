package com.example.pafbackendversionthree.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @DBRef
    private AppUser recipient; // User who receives the notification

    @DBRef
    private AppUser sender; // User who triggered the notification

    @DBRef
    private Object targetObject; // Can be a UserPost, Comment, or Like

    private String type; // "LIKE", "COMMENT", etc.
    private String message; // Notification message
    private String targetType; // "POST", "COMMENT", etc.
    private String targetId; // ID of the target object

    private boolean read;
    private Date createdAt;
    private Date readAt;

    public Notification() {
        this.createdAt = new Date();
        this.read = false;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public AppUser getRecipient() {
        return recipient;
    }

    public void setRecipient(AppUser recipient) {
        this.recipient = recipient;
    }

    public AppUser getSender() {
        return sender;
    }

    public void setSender(AppUser sender) {
        this.sender = sender;
    }

    public Object getTargetObject() {
        return targetObject;
    }

    public void setTargetObject(Object targetObject) {
        this.targetObject = targetObject;
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

    // Helper enum for notification types
    public static class NotificationType {
        public static final String LIKE = "LIKE";
        public static final String COMMENT = "COMMENT";
        public static final String FOLLOW = "FOLLOW";
    }

    // Helper enum for target types
    public static class TargetType {
        public static final String POST = "POST";
        public static final String COMMENT = "COMMENT";
        public static final String USER = "USER";
    }
}