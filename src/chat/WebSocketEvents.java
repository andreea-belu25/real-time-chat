package chat;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class WebSocketEvents {
    private final List<String> onlineUsers = new CopyOnWriteArrayList<>();

    private final SimpMessageSendingOperations messagingTemplate;

    public WebSocketEvents(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Handle user connected event
    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        String username = event.getUser().getName();  // Assuming you have Principal with username
        if (username != null && !onlineUsers.contains(username) && !onlineUsers.isEmpty()) {
            onlineUsers.add(username);
            broadcastOnlineUsers();
            System.out.println(username + " connected.");
        }
    }

    // Handle user disconnected event
    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        String username = event.getUser().getName();
        if (username != null) {
            onlineUsers.remove(username);
            broadcastOnlineUsers();
            System.out.println(username + " disconnected.");
        }
    }

    // Send updated user list to all clients
    private void broadcastOnlineUsers() {
        messagingTemplate.convertAndSend("/topic/users", onlineUsers);
    }
}
