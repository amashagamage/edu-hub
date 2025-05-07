package com.example.pafbackendversionthree.dtos;
import java.util.List;
public class CreateUpdatePostDto {

    private String title;
    private String description;
    private List<Media> medias;

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

    // Constructors
    public CreateUpdatePostDto() {}

    public CreateUpdatePostDto(String title, String description, List<Media> medias) {
        this.title = title;
        this.description = description;
        this.medias = medias;
    }

    // Getters and Setters
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
}