package src.main.java.com.mazad.chat_service.repository;

import src.main.java.com.mazad.chat_service.model.Massage;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.steriotupe.repository;
import java.util.List;



@Repository
public interface MessageRepository extends JpaRepository<Message, UUID>
{

    List<Massage> FindByChatId(long chatId);
    List<Massage> FindBySenderId(long senderId);
    List<Massage> FindByreceiverId(long receiverId);
    
}
