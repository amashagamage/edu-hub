package com.example.pafbackendversionthree.controllers;

import com.example.pafbackendversionthree.dtos.ChatDTO;
import com.example.pafbackendversionthree.models.Conversation;
import com.example.pafbackendversionthree.models.Message;
import com.example.pafbackendversionthree.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/conversations")
    public ResponseEntity<Conversation> createConversation(@RequestBody ChatDTO.ConversationRequest request) {
        Conversation conversation = chatService.createConversation(request);
        return ResponseEntity.ok(conversation);
    }

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<Conversation>> getUserConversations(@PathVariable String userId) {
        List<Conversation> conversations = chatService.getUserConversations(userId);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/conversations")
    public ResponseEntity<Conversation> getConversationBetweenUsers(
            @RequestParam String user1Id,
            @RequestParam String user2Id) {
        Conversation conversation = chatService.getConversationBetweenUsers(user1Id, user2Id);
        return ResponseEntity.ok(conversation);
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> sendMessage(@RequestBody ChatDTO.MessageRequest request) {
        Message message = chatService.sendMessage(request);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/messages/{messageId}")
    public ResponseEntity<Message> updateMessage(
            @PathVariable String messageId,
            @RequestBody ChatDTO.MessageUpdateRequest request) {
        Message message = chatService.updateMessage(messageId, request);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String messageId) {
        chatService.deleteMessage(messageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/messages/conversation/{conversationId}")
    public ResponseEntity<List<Message>> getConversationMessages(@PathVariable String conversationId) {
        List<Message> messages = chatService.getConversationMessages(conversationId);
        return ResponseEntity.ok(messages);
    }

    @PutMapping("/messages/mark-read")
    public ResponseEntity<Void> markMessagesAsRead(@RequestBody List<String> messageIds) {
        chatService.markMessagesAsRead(messageIds);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/messages/unread/{userId}")
    public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable String userId) {
        List<Message> messages = chatService.getUnreadMessages(userId);
        return ResponseEntity.ok(messages);
    }
}