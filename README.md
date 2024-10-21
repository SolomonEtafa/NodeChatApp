NodeChatApp Documentation
Overview
NodeChatApp is a simple real-time chat application built using Node.js, Express, and Socket.IO. It includes basic user authentication features using JWT (JSON Web Tokens) for secure login and bcrypt for password hashing. Users can register, log in, and chat with other authenticated users in real-time.

Features
User Authentication:

User registration with hashed passwords.
Login system with JWT tokens for session management.
Secure routes protected by JWT.
Real-time Chat:

Instant messaging between authenticated users using Socket.IO.
Broadcast messages to all connected users.
Users can see messages from other users in real-time.
Prerequisites
Before running the application, ensure you have the following installed:

Node.js (version 14 or higher)
npm (Node Package Manager)
Installation
Clone the repository or download the project files.

bash
Copy code
git clone https://github.com/yourusername/NodeChatApp.git
Navigate to the project directory.

bash
Copy code
cd NodeChatApp
Install dependencies.

bash
Copy code
npm install
Running the Application
Start the server:

bash
Copy code
node server.js
Open a web browser and navigate to:

arduino
Copy code
http://localhost:3000
You can now use the chat application by registering, logging in, and chatting with other users.

API Endpoints
1. /register (POST)
Description: Register a new user.
Request Body:
json
Copy code
{
  "username": "your-username",
  "password": "your-password"
}
Response:
201 (Created): User registration successful.
400 (Bad Request): User already exists.
2. /login (POST)
Description: Authenticate a user and return a JWT token.
Request Body:
json
Copy code
{
  "username": "your-username",
  "password": "your-password"
}
Response:
200 (OK): Returns a JWT token.
400 (Bad Request): Invalid credentials.
3. /chat (GET)
Description: Serve the chat interface for authenticated users.
Headers:
bash
Copy code
Authorization: Bearer <your-jwt-token>
Response:
200 (OK): Chat page is returned.
401 (Unauthorized): No token provided or invalid token.
Authentication Flow
Registration:

Users register by sending a POST request to /register with a username and password.
The password is hashed using bcrypt and stored in memory (in a real-world app, this would be a database).
Login:

Users log in by sending a POST request to /login.
The password is verified using bcrypt, and if correct, a JWT token is generated and sent back to the user.
Protected Routes:

The chat page is only accessible to authenticated users. The server checks for a valid JWT token in the Authorization header before allowing access to the chat functionality.
Real-time Chat
After successful authentication, the user is redirected to the chat interface.
The client-side connects to the Socket.IO server and sends/receives messages in real-time.
All messages are broadcast to every connected user.
Socket Events
chat message (client -> server):

Sends a message from the client to the server.
Example:
javascript
Copy code
socket.emit('chat message', 'Hello, World!');
chat message (server -> client):

Broadcasts a message from one user to all connected users.
Example:
javascript
Copy code
socket.on('chat message', function(msg) {
    console.log('Received message:', msg);
});
Frontend Structure
Login Form: Allows users to log in and retrieve a JWT token.
Register Form: Allows users to create an account.
Chat Form: Becomes visible after login and allows authenticated users to send and receive messages.
Security Considerations
Password Hashing: Passwords are hashed using bcrypt before being stored.
JWT Authentication: JWT tokens are used to secure routes and manage user sessions.
Protected Routes: The /chat endpoint and Socket.IO connections are protected with JWT tokens.
Future Improvements
Persistent Storage: Currently, user data is stored in memory. This can be extended by using a database like MongoDB or PostgreSQL.
Private Messaging: Implementing one-to-one private chats between users.
Chat Rooms: Add support for multiple chat rooms.
User Profiles: Allow users to have customizable profiles with avatars.
