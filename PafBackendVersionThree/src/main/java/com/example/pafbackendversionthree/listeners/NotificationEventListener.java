package com.example.pafbackendversionthree.listeners;

import com.example.pafbackendversionthree.models.Comment;
import com.example.pafbackendversionthree.models.Like;
import com.example.pafbackendversionthree.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;


@Component
public class NotificationEventListener {

    private final NotificationService notificationService;

    @Autowired
    public NotificationEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }


    @TransactionalEventListener
    public void handleLikeCreated(Like like) {
        notificationService.createLikeNotification(like);
    }


    @TransactionalEventListener
    public void handleCommentCreated(Comment comment) {
        notificationService.createCommentNotification(comment);
    }
}