package com.example.pafbackendversionthree.dtos;

import java.util.Date;
import java.util.List;

public class UserPostDto {

    private String id;
    private PostedBy postedBy;
    private Date postedAt;
    private String title;
    private String description;
    private List<Media> medias;

    // Constructors
    public UserPostDto() {}

    public UserPostDto(String id, PostedBy postedBy, Date postedAt, String title, String description, List<Media> medias) {
        this.id = id;
        this.postedBy = postedBy;
        this.postedAt = postedAt;
        this.title = title;
        this.description = description;
        this.medias = medias;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public PostedBy getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(PostedBy postedBy) {
        this.postedBy = postedBy;
    }

    public Date getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(Date postedAt) {
        this.postedAt = postedAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Media> getMedias() {
        return medias;
    }

    public void setMedias(List<Media> medias) {
        this.medias = medias;
    }

    // Inner class for PostedBy
    public static class PostedBy {
        private String id;
        private String firstName;
        private String lastName;
        private String profileImageUrl;

        public PostedBy() {}

        public PostedBy(String id, String firstName, String lastName, String profileImageUrl) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.profileImageUrl = profileImageUrl;
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getProfileImageUrl() {
            return profileImageUrl;
        }

        public void setProfileImageUrl(String profileImageUrl) {
            this.profileImageUrl = profileImageUrl;
        }
    }

    // Inner class for Media
    public static class Media {
        private String url;
        private String type;

        public Media() {}

        public Media(String url, String type) {
            this.url = url;
            this.type = type;
        }

        // Getters and Setters
        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}
