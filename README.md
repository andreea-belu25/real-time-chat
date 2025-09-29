Tools: 
---
Java, JavaScript, CSS, HTML

Motivation: 
---
After completing my first project using Spring Boot, I was eager to learn even more about this framework and how it could be used to create more complex applications.

Utility:
---
- Developed a real-time chat application featuring an input field, send button and message display area
- Built group chat functionality using WebSockets and the STOMP protocol
- Implemented a basic login system
- Enhanced message format to include sender's name and timestamp
- Introduced a section that displays currently active users

Development:
---
static:
  index.html:
    - HTML structure representing the front-end for the real-time chat application
    - Users can enter their username to join the chat
    - Displays list of all online users
    - Enables communication through chat box

  script.js:
    - Enables real-time messaging through WebSockets, managed by a STOMP client
    - Dynamically updates messages and user lists with every event

  style.css:
    - Provides functional layout with different sections for online users and messages
    - Includes scrolling bars for easy navigation between messages and online users
    - Features dynamic layout that adapts to different screen sizes

src/chat:
  ChatController.java:
    - Notifies all users via /topic/messages WebSocket topic when a user sends a message
    - Notifies all users via /topic/users WebSocket topic when a user logs in or logs out
    - Updates online user lists accordingly
    - Allows users to retrieve previously sent messages via /previous-messages HTTP endpoint when they join

  Main.java:
    - Entry point of the application

  Message.java:
    - Class designed to handle messages between users

  WebSocketConfig.java:
    - Enables WebSocket communication with STOMP protocol through configuration
    - Message transmission:
      - Messages sent to server start with /app and are routed to methods annotated with @MessageMapping
      - Server broadcasts messages to topics prefixed with /topic
      - Clients subscribed to those topics receive the messages
      - SockJS Fallback: If WebSocket is not supported, SockJS is used as fallback

  WebSocketEvents.java - Connection handling:
    - handleConnect() method adds users to online list and broadcasts updated list when user connects
    - handleDisconnect() method removes users from list and broadcasts updated list when user disconnects
    - broadcastOnlineUsers() method ensures all clients receive real-time updates about online users via /topic/users topic
