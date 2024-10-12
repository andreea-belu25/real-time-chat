package chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ChatController {

    private final List<Message> previousMessages = new ArrayList<>();
    private final List<String> onlineUsers = new ArrayList<>();
    private final SimpMessageSendingOperations messagingTemplate;

    public ChatController(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public Message sendMessage(Message message) {
        previousMessages.add(message); // Save the message to history
        return message; // Broadcast the message
    }

    @GetMapping("/previous-messages")
    public List<Message> getPreviousMessages() {
        return previousMessages; // Returns previous messages to the user
    }

    @MessageMapping("/user-join")
    public void userJoin(String username) {
        if (!onlineUsers.contains(username)) {
            onlineUsers.add(username);
            messagingTemplate.convertAndSend("/topic/users", onlineUsers); // Notify all users
        }
    }

    @MessageMapping("/user-leave")
    public void userLeave(String username) {
        onlineUsers.remove(username);
        messagingTemplate.convertAndSend("/topic/users", onlineUsers);  // Notify all users
    }
}
