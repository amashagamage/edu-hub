package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Find all notifications for a recipient
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);

    // Find paginated notifications for a recipient
    Page<Notification> findByRecipientId(String recipientId, Pageable pageable);

    // Find unread notifications for a recipient
    List<Notification> findByRecipientIdAndReadOrderByCreatedAtDesc(String recipientId, boolean read);

    // Count unread notifications for a recipient
    long countByRecipientIdAndRead(String recipientId, boolean read);

    // Find notifications by type for a recipient
    List<Notification> findByRecipientIdAndTypeOrderByCreatedAtDesc(String recipientId, String type);

    // Delete all notifications for a recipient
    void deleteByRecipientId(String recipientId);

    // Find existing notification for the same action (to prevent duplicates)
    Notification findByRecipientIdAndSenderIdAndTypeAndTargetId(
            String recipientId, String senderId, String type, String targetId);
}