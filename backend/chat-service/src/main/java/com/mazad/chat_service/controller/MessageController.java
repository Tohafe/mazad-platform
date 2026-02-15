package src.main.java.com.mazad.chat_service.controller;

import com.mazad.chat_service.repository.MessageRepository;

@RestController
@RequestMapping("api/chat")
public class MessageController {
    
    @Autouwired
    MessageRepository Repo;

    @RequestMapping("/send")
    public Message sendMessage(@RequestBody Message message) {
        // save this in repo by the save function ig 


        Repo.save(message);
    }

    @RequetMapping("/receive/{userId}")
    public List<Message> receiveMessage(@PathVariable long userId)
    {
        return Repo.FindByreceiverId(userId);
    }


    
}
