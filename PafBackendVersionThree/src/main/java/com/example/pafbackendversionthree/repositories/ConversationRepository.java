package com.example.pafbackendversionthree.repositories;

import com.example.pafbackendversionthree.models.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByParticipant1IdOrParticipant2Id(String participant1Id, String participant2Id);
    Conversation findByParticipant1IdAndParticipant2Id(String participant1Id, String participant2Id);

    @Query("{ $or: [ " +
            "{ participant1Id: ?0, participant2Id: ?1 }, " +
            "{ participant1Id: ?1, participant2Id: ?0 } " +
            "] }")
    Conversation findConversationBetweenUsers(String user1Id, String user2Id);
}
