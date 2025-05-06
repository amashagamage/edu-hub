package com.example.pafbackendversionthree.services;

import com.example.pafbackendversionthree.dtos.NotificationDTO;
import com.example.pafbackendversionthree.exceptions.ResourceNotFoundException;
import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.models.Comment;
import com.example.pafbackendversionthree.models.Like;
import com.example.pafbackendversionthree.models.Notification;
import com.example.pafbackendversionthree.models.UserPost;
import com.example.pafbackendversionthree.repositories.AppUserRepository;
import com.example.pafbackendversionthree.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AppUserRepository appUserRepository;

    @Autowired
    public NotificationService(
            NotificationRepository notificationRepository,
            AppUserRepository appUserRepository) {
        this.notificationRepository = notificationRepository;
        this.appUserRepository = appUserRepository;
    }

    // Create notification for a new like
    public void createLikeNotification(Like like) {
        System.out.println("Create Notification called");
        // Skip if user is liking their own post
        if (like.getUser().getId().equals(like.getPost().getPostedBy().getId())) {
            return;
        }

        // Create new notification
        Notification notification = new Notification();
        notification.setRecipient(like.getPost().getPostedBy());
        notification.setSender(like.getUser());
        notification.setType(Notification.NotificationType.LIKE);
        notification.setTargetType(Notification.TargetType.POST);
        notification.setTargetId(like.getPost().getId());
        notification.setTargetObject(like.getPost());
        notification.setMessage(like.getUser().getUsername() + " liked your post");

        notificationRepository.save(notification);
        System.out.println("New notifications created");
    }

    // Create notification for a new comment
    public void createCommentNotification(Comment comment) {
        // Skip if user is commenting on their own post
        if (comment.getUser().getId().equals(comment.getPost().getPostedBy().getId())) {
            return;
        }

        // Create notification
        Notification notification = new Notification();
        notification.setRecipient(comment.getPost().getPostedBy());
        notification.setSender(comment.getUser());
        notification.setType(Notification.NotificationType.COMMENT);
        notification.setTargetType(Notification.TargetType.POST);
        notification.setTargetId(comment.getPost().getId());
        notification.setTargetObject(comment.getPost());
        notification.setMessage(comment.getUser().getUsername() + " commented on your post");

        notificationRepository.save(notification);
    }

    // Create follow notification
    public void createFollowNotification(AppUser follower, AppUser followed) {
        // Create notification
        Notification notification = new Notification();
        notification.setRecipient(followed);
        notification.setSender(follower);
        notification.setType(Notification.NotificationType.FOLLOW);
        notification.setTargetType(Notification.TargetType.USER);
        notification.setTargetId(follower.getId());
        notification.setTargetObject(follower);
        notification.setMessage(follower.getUsername() + " started following you");

        notificationRepository.save(notification);
    }

    // Get all notifications for a user
    public List<NotificationDTO.NotificationResponseDTO> getNotificationsForUser(String userId) {
        // Check if user exists
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);

        return notifications.stream()
                .map(NotificationDTO.NotificationResponseDTO::fromNotification)
                .collect(Collectors.toList());
    }

    // Get paginated notifications for a user
    public Page<NotificationDTO.NotificationResponseDTO> getPaginatedNotificationsForUser(
            String userId, int page, int size) {

        // Check if user exists
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notifications = notificationRepository.findByRecipientId(userId, pageable);

        return notifications.map(NotificationDTO.NotificationResponseDTO::fromNotification);
    }

    // Get unread notifications for a user
    public List<NotificationDTO.NotificationResponseDTO> getUnreadNotificationsForUser(String userId) {
        // Check if user exists
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        List<Notification> notifications = notificationRepository.findByRecipientIdAndReadOrderByCreatedAtDesc(userId, false);

        return notifications.stream()
                .map(NotificationDTO.NotificationResponseDTO::fromNotification)
                .collect(Collectors.toList());
    }

    // Count unread notifications for a user
    public long countUnreadNotificationsForUser(String userId) {
        // Check if user exists
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        return notificationRepository.countByRecipientIdAndRead(userId, false);
    }

    // Mark a notification as read
    public NotificationDTO.NotificationResponseDTO markNotificationAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        // Check if user is the recipient
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new IllegalStateException("User is not authorized to mark this notification as read");
        }

        // Mark as read
        notification.setRead(true);
        notification.setReadAt(new Date());

        Notification updatedNotification = notificationRepository.save(notification);

        return NotificationDTO.NotificationResponseDTO.fromNotification(updatedNotification);
    }

    // Mark all notifications as read for a user
    public void markAllNotificationsAsRead(String userId) {
        // Check if user exists
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        List<Notification> unreadNotifications = notificationRepository.findByRecipientIdAndReadOrderByCreatedAtDesc(userId, false);

        Date now = new Date();
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notification.setReadAt(now);
        }

        notificationRepository.saveAll(unreadNotifications);
    }

    // Delete a notification
    public void deleteNotification(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        // Check if user is the recipient
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new IllegalStateException("User is not authorized to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    // Delete all notifications for a user
    public void deleteAllNotificationsForUser(String userId) {
        // Check if user exists
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        notificationRepository.deleteByRecipientId(userId);
    }
}