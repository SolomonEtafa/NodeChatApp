const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Constants
const SECRET_KEY = "your-secret-key";
const PORT = process.env.PORT || 3000;

// Initialize the app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock database for users (in a real-world app, use a database like MongoDB)
const users = [];

// Serve the chat page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// User registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if the user already exists
    const user = users.find(u => u.username === username);
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password and store user
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
});

// User login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to verify the JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Protected route to verify the user before chatting
app.get('/chat', authenticateToken, (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

// Handle socket connection
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.user = user;
        next();
    });
});

io.on('connection', (socket) => {
    console.log(`${socket.user.username} connected`);

    // Broadcast message to all clients
    socket.on('chat message', (msg) => {
        io.emit('chat message', { user: socket.user.username, message: msg });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`${socket.user.username} disconnected`);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});