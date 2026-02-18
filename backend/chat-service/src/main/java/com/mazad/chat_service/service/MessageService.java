figpackage com.mazad.chat_service.service;
import  com.mazad.chat_service.repository.MessageRepository;
import  com.mazad.chat_service.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Value;







@Service 
public class MessageService {

    @Autowired
    MessageRepository repository;


    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${chat.kafka.topic}")
    private String topicName;


    public Message sendMessage(Message message)
    {
        long minId = Math.min(message.getSenderId(), message.getReceiverId());
        long maxId = Math.max(message.getSenderId(), message.getReceiverId());
        String roomId = minId + "_" + maxId;
        
        message.setRoomId(roomId);

        Message savedMessage = repository.save(message);

        try {
            kafkaTemplate.send(topicName, roomId, savedMessage);
            System.out.println("============ kafka event sendt succefully !! ============");
        }
        catch (Exception e)
        {
            System.err.println("XXXXXXXX kafka error ! XXXXXXXXX\n" + e.getMessage());
            e.printStackTrace();
        }
        return savedMessage;
    }

    public List<Message> fetchChatHistory(long userId1, long userId2){
        
        long minId = Math.min(userId1, userId2);
        long maxId = Math.max(userId1, userId2);

        String roomId   = minId + "_" + maxId;
        return repository.findByRoomIdOrderByTimestampAsc(roomId);
    }

    
}
