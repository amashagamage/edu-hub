package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByConversationId(String conversationId);
    List<Message> findBySenderIdAndRecipientId(String senderId, String recipientId);
    List<Message> findByRecipientIdAndReadAtIsNull(String recipientId);
}