package com.example.pafbackendversionthree.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    @DBRef
    private AppUser participant1;

    @DBRef
    private AppUser participant2;

    private Date createdAt;
    private Date updatedAt;
    private List<Message> messages;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public AppUser getParticipant1() {
        return participant1;
    }

    public void setParticipant1(AppUser participant1) {
        this.participant1 = participant1;
    }

    public AppUser getParticipant2() {
        return participant2;
    }

    public void setParticipant2(AppUser participant2) {
        this.participant2 = participant2;
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

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}