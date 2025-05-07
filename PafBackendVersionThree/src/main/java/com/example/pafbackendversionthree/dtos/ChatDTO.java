package com.example.pafbackendversionthree.dtos;

import java.util.Date;

public class ChatDTO {

    // For creating/updating conversations
    public static class ConversationRequest {
        private String participant1Id;
        private String participant2Id;

        public String getParticipant1Id() {
            return participant1Id;
        }

        public void setParticipant1Id(String participant1Id) {
            this.participant1Id = participant1Id;
        }

        public String getParticipant2Id() {
            return participant2Id;
        }

        public void setParticipant2Id(String participant2Id) {
            this.participant2Id = participant2Id;
        }
    }

    // For conversation responses
    public static class ConversationResponse {
        private String id;
        private String participant1Id;
        private String participant2Id;
        private Date createdAt;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getParticipant1Id() {
            return participant1Id;
        }

        public void setParticipant1Id(String participant1Id) {
            this.participant1Id = participant1Id;
        }

        public String getParticipant2Id() {
            return participant2Id;
        }

        public void setParticipant2Id(String participant2Id) {
            this.participant2Id = participant2Id;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }
    }

    // For sending messages
    public static class MessageRequest {
        private String senderId;
        private String recipientId;
        private String content;
        private String conversationId;

        public String getSenderId() {
            return senderId;
        }

        public void setSenderId(String senderId) {
            this.senderId = senderId;
        }

        public String getRecipientId() {
            return recipientId;
        }

        public void setRecipientId(String recipientId) {
            this.recipientId = recipientId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getConversationId() {
            return conversationId;
        }

        public void setConversationId(String conversationId) {
            this.conversationId = conversationId;
        }
    }

    // For message responses
    public static class MessageResponse {
        private String id;
        private String senderId;
        private String recipientId;
        private String content;
        private Date sentAt;
        private Date deliveredAt;
        private Date readAt;
        private boolean isEdited;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getSenderId() {
            return senderId;
        }

        public void setSenderId(String senderId) {
            this.senderId = senderId;
        }

        public String getRecipientId() {
            return recipientId;
        }

        public void setRecipientId(String recipientId) {
            this.recipientId = recipientId;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public Date getSentAt() {
            return sentAt;
        }

        public void setSentAt(Date sentAt) {
            this.sentAt = sentAt;
        }

        public Date getDeliveredAt() {
            return deliveredAt;
        }

        public void setDeliveredAt(Date deliveredAt) {
            this.deliveredAt = deliveredAt;
        }

        public Date getReadAt() {
            return readAt;
        }

        public void setReadAt(Date readAt) {
            this.readAt = readAt;
        }

        public boolean isEdited() {
            return isEdited;
        }

        public void setEdited(boolean edited) {
            isEdited = edited;
        }
    }

    // For updating messages
    public static class MessageUpdateRequest {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}