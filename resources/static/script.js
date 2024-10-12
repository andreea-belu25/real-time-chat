let stompClient = null;
let username = null;

// Connect to WebSocket server
function connect() {
    const socket = new SockJS('http://localhost:28852/chat');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log(`Connected: ${frame}`);
        subscribeToMessages();
        loadPreviousMessages(); // Load previous messages when connected
        sendUserJoin(); // Notify that a user has joined
    }, function (error) {
        console.error('Error connecting to WebSocket:', error);
    });
}

// Subscribe to receive messages and user events
function subscribeToMessages() {
    stompClient.subscribe('/topic/messages', function (message) {
        showMessage(JSON.parse(message.body));
    });

    stompClient.subscribe('/topic/users', function (usersUpdate) {
        updateOnlineUsers(JSON.parse(usersUpdate.body));
    });
}

// Notify the server that a user has joined
function sendUserJoin() {
    stompClient.send("/app/user-join", {}, JSON.stringify(username));
}

// Notify the server that a user has left (disconnect)
window.addEventListener('beforeunload', function() {
    stompClient.send("/app/user-leave", {}, JSON.stringify( username));
});

// Send the message to the server
function sendMessage() {
    const inputMsg = document.getElementById("input-msg").value;
    if (inputMsg && username) {
        const message = {
            sender: username,
            message: inputMsg,
            date: new Date().toLocaleTimeString()
        };
        stompClient.send("/app/send", {}, JSON.stringify(message));
        document.getElementById("input-msg").value = "";
    }
}

// Display the message in the message container
function showMessage(message) {
    const messagesContainer = document.getElementById("messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = "message-container";

    const senderDiv = document.createElement("div");
    senderDiv.className = "sender";
    senderDiv.textContent = message.sender;

    const dateDiv = document.createElement("div");
    dateDiv.className = "date";
    dateDiv.textContent = message.date;

    const messageTextDiv = document.createElement("div");
    messageTextDiv.className = "message";
    messageTextDiv.textContent = message.message;

    messageDiv.appendChild(senderDiv);
    messageDiv.appendChild(dateDiv);
    messageDiv.appendChild(messageTextDiv);

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Load previous messages using fetch
function loadPreviousMessages() {
    fetch('/previous-messages')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(previousMessages => {
            previousMessages.forEach(showMessage); // Display each message
        })
        .catch(error => {
            console.error('Error fetching previous messages:', error);
        });
}

// Update online users list
function updateOnlineUsers(usersList) {
    const usersContainer = document.getElementById("users");
    usersContainer.innerHTML = ''; // Clear the container

    usersList.forEach(function(user) {
        if (user !== `"${username}"`) { // Don't display the current user
            const userDiv = document.createElement("div");
            userDiv.className = "user";
            userDiv.textContent = user;
            usersContainer.appendChild(userDiv);
        }
    });
}

// Attach event listeners
document.getElementById("send-msg-btn").addEventListener("click", sendMessage);
document.getElementById("input-msg").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Username submission and connection initialization
document.getElementById("send-username-btn").addEventListener("click", function() {
    const inputUsername = document.getElementById("input-username").value;
    if (inputUsername) {
        username = inputUsername;
        document.getElementById("username-container").style.display = "none";
        document.getElementById("chat-input").style.display = "block";
        connect();
    }
});
