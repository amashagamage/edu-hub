package com.example.pafbackendversionthree.controllers;

import com.example.pafbackendversionthree.dtos.NotificationDTO;
import com.example.pafbackendversionthree.exceptions.ResourceNotFoundException;
import com.example.pafbackendversionthree.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Get all notifications for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO.NotificationResponseDTO>> getNotificationsForUser(@PathVariable String userId) {
        try {
            List<NotificationDTO.NotificationResponseDTO> notifications = notificationService.getNotificationsForUser(userId);
            return ResponseEntity.ok(notifications);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get paginated notifications for a user
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<Page<NotificationDTO.NotificationResponseDTO>> getPaginatedNotificationsForUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Page<NotificationDTO.NotificationResponseDTO> notifications = notificationService.getPaginatedNotificationsForUser(userId, page, size);
            return ResponseEntity.ok(notifications);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get unread notifications for a user
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDTO.NotificationResponseDTO>> getUnreadNotificationsForUser(@PathVariable String userId) {
        try {
            List<NotificationDTO.NotificationResponseDTO> unreadNotifications = notificationService.getUnreadNotificationsForUser(userId);
            return ResponseEntity.ok(unreadNotifications);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Count unread notifications for a user
    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Long> countUnreadNotificationsForUser(@PathVariable String userId) {
        try {
            long unreadCount = notificationService.countUnreadNotificationsForUser(userId);
            return ResponseEntity.ok(unreadCount);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Mark a notification as read
    @PutMapping("/{notificationId}/mark-as-read")
    public ResponseEntity<NotificationDTO.NotificationResponseDTO> markNotificationAsRead(
            @PathVariable String notificationId,
            @RequestParam String userId) {

        try {
            NotificationDTO.NotificationResponseDTO updatedNotification = notificationService.markNotificationAsRead(notificationId, userId);
            return ResponseEntity.ok(updatedNotification);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }
    }

    // Mark all notifications as read for a user
    @PutMapping("/user/{userId}/mark-all-as-read")
    public ResponseEntity<Void> markAllNotificationsAsRead(@PathVariable String userId) {
        try {
            notificationService.markAllNotificationsAsRead(userId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable String notificationId,
            @RequestParam String userId) {

        try {
            notificationService.deleteNotification(notificationId, userId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).build(); // Forbidden
        }
    }

    // Delete all notifications for a user
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAllNotificationsForUser(@PathVariable String userId) {
        try {
            notificationService.deleteAllNotificationsForUser(userId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}