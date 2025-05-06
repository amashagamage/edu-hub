package com.example.pafbackendversionthree.services;

import com.example.pafbackendversionthree.dtos.ChatDTO;
import com.example.pafbackendversionthree.models.AppUser;
import com.example.pafbackendversionthree.models.Conversation;
import com.example.pafbackendversionthree.models.Message;
import com.example.pafbackendversionthree.repositories.AppUserRepository;
import com.example.pafbackendversionthree.repositories.ConversationRepository;
import com.example.pafbackendversionthree.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    private final AppUserRepository userRepository;

    @Autowired
    public ChatService(ConversationRepository conversationRepository, MessageRepository messageRepository,AppUserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    // Conversation methods
    public Conversation createConversation(ChatDTO.ConversationRequest request) {
        Conversation conversation = new Conversation();
        Optional<AppUser> user1 = userRepository.findAppUserById(request.getParticipant1Id());
        Optional<AppUser> user2 = userRepository.findAppUserById(request.getParticipant2Id());
        if(user1.isPresent() && user2.isPresent()){
            conversation.setParticipant1(user1.get());
            conversation.setParticipant2(user2.get());
        }
        conversation.setCreatedAt(new Date());
        return conversationRepository.save(conversation);
    }

    public List<Conversation> getUserConversations(String userId) {
        return conversationRepository.findByParticipant1IdOrParticipant2Id(userId, userId);
    }

    public Conversation getConversationBetweenUsers(String user1Id, String user2Id) {
        return conversationRepository.findConversationBetweenUsers(user1Id, user2Id);
    }

    // Message methods
    public Message sendMessage(ChatDTO.MessageRequest request) {
        Message message = new Message();
        Optional<AppUser> user1 = userRepository.findAppUserById(request.getSenderId());
        Optional<AppUser> user2 = userRepository.findAppUserById(request.getRecipientId());
        if(user1.isPresent() && user2.isPresent()){
            message.setSender(user1.get());
            message.setRecipient(user2.get());
        }
        message.setContent(request.getContent());
        message.setConversationId(request.getConversationId());
        message.setSentAt(new Date());
        message.setEdited(false);
        return messageRepository.save(message);
    }

    public Message updateMessage(String messageId, ChatDTO.MessageUpdateRequest request) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setContent(request.getContent());
        message.setEdited(true);
        message.setUpdatedAt(new Date());

        return messageRepository.save(message);
    }

    public void deleteMessage(String messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setDeleted(true);
        messageRepository.save(message);
    }

    public List<Message> getConversationMessages(String conversationId) {
        return messageRepository.findByConversationId(conversationId);
    }

    public void markMessagesAsRead(List<String> messageIds) {
        List<Message> messages = messageRepository.findAllById(messageIds);
        Date now = new Date();

        for (Message message : messages) {
            if (message.getReadAt() == null) {
                message.setReadAt(now);
            }
        }

        messageRepository.saveAll(messages);
    }

    public List<Message> getUnreadMessages(String userId) {
        return messageRepository.findByRecipientIdAndReadAtIsNull(userId);
    }
}